import { useEffect, useState } from 'react';

import { useTheme } from '@mui/material';
import {
  differenceInMinutes,
  format,
  formatDistanceToNowStrict,
  Locale,
} from 'date-fns';
import { MapLibreZoomEvent, MapStyleImageMissingEvent } from 'maplibre-gl';
import { useTranslation } from 'react-i18next';
import { Layer, Source, useMap } from 'react-map-gl/maplibre';

import { TrainByStationFragment } from '../../graphql/generated/digitraffic/graphql';
import useTrainQuery from '../../hooks/useTrainQuery';
import { isDefined } from '../../utils/common';
import { StationTimeTableRowGroup } from '../../utils/getTimeTableRowsGroupedByStation';
import getTimeTableRowsGroupedByStationUniqueStations from '../../utils/getTimeTableRowsGroupedByStationUniqueStations';
import {
  getTimeTableRowRealTime,
  getTrainStationGtfsId,
} from '../../utils/train';

import stopSignSvgPath from './stop-sign.svg?url';

type StopsLayerProps = {
  train?: TrainByStationFragment | null;
};

const StopsLayer = ({ train }: StopsLayerProps) => {
  const { current: map } = useMap();
  const theme = useTheme();
  const [currentZoom, setCurrentZoom] = useState<number>();
  const [locale, setLocale] = useState<Locale>();
  const { i18n, t } = useTranslation();

  const { data: realTimeTrain } = useTrainQuery(
    train?.trainNumber,
    train?.departureDate
  );

  useEffect(() => {
    const callback = (e: MapStyleImageMissingEvent) => {
      if (e.id === 'stop-marker') {
        const img = new Image(64, 64);
        img.onload = () => {
          if (map && !map.hasImage('stop-marker')) {
            map.addImage('stop-marker', img);
          }
        };
        img.onerror = (e) => console.error(e);
        img.src = stopSignSvgPath.src;
      }
    };

    if (map) {
      map.on('styleimagemissing', callback);
    }

    return () => {
      if (map) {
        map.off('styleimagemissing', callback);
      }
    };
  }, [map]);

  useEffect(() => {
    const callback = (e: MapLibreZoomEvent) => {
      const zoom = Math.round(e.target.getZoom());
      setCurrentZoom(zoom);
    };

    if (map) {
      map.on('zoom', callback);
    }

    return () => {
      if (map) {
        map.off('zoom', callback);
      }
    };
  }, [map]);

  useEffect(() => {
    const fetchAndSetLocale = async (languageCode?: string) => {
      let locale: Locale | undefined;
      if (languageCode === 'fi') {
        locale = (await import(`date-fns/locale/fi`)).fi;
      } else if (languageCode === 'sv') {
        locale = (await import(`date-fns/locale/sv`)).sv;
      }
      setLocale(locale);
    };

    fetchAndSetLocale(i18n.resolvedLanguage);
  }, [i18n.resolvedLanguage]);

  const getPropertyValueByStationGtfsId = <T extends string | number>(
    stationGtfsIds: string[],
    valueMatch: T,
    valueUnmatch: T
  ): maplibregl.ExpressionSpecification => {
    return [
      'match',
      ['get', 'gtfsId'],
      stationGtfsIds,
      valueMatch,
      valueUnmatch,
    ];
  };

  const routeStationGtfsIds = train?.timeTableRows
    ? Array.from(
        new Set(
          train.timeTableRows
            .map((r) => (r ? getTrainStationGtfsId(r.station) : undefined))
            .filter(isDefined)
        )
      )
    : undefined;

  const trainWithRealTimeData = realTimeTrain ?? train;

  const trainTimeTableRows = trainWithRealTimeData
    ? getTimeTableRowsGroupedByStationUniqueStations(trainWithRealTimeData)
    : undefined;

  const getTimeTableRowGroupDescription = (group: StationTimeTableRowGroup) => {
    const r = group.departure ?? group.arrival;
    if (!r) return '';

    const timeTableRowTime = getTimeTableRowRealTime(r);
    const diffInMinsToNow = differenceInMinutes(timeTableRowTime, new Date());

    let stationTime: string;
    if (r.cancelled) {
      stationTime = t('canceled');
    } else if (diffInMinsToNow <= 5 && diffInMinsToNow > 0) {
      stationTime = formatDistanceToNowStrict(timeTableRowTime, {
        locale,
      });
    } else {
      stationTime = format(timeTableRowTime, 'HH:mm');
    }
    return stationTime;
  };

  const getTimeTableRowGroupColor = (group: StationTimeTableRowGroup) => {
    const r = group.departure ?? group.arrival;
    if (!r) return theme.palette.text.primary;
    const delayInMinutes = r.differenceInMinutes ?? 0;
    const color =
      r.cancelled || delayInMinutes > 0
        ? theme.palette.error.main
        : theme.palette.text.primary;
    return color;
  };

  const getStationGtfsIdForTimeTableGroup = (
    group: StationTimeTableRowGroup
  ) => {
    const r = group.departure ?? group.arrival;
    if (!r) return '';
    return getTrainStationGtfsId(r.station);
  };

  const trainStationEntries = trainTimeTableRows?.map((row) => ({
    gtfsId: getStationGtfsIdForTimeTableGroup(row),
    description: getTimeTableRowGroupDescription(row),
    color: getTimeTableRowGroupColor(row),
  }));

  const getMatchExpression = (
    input: maplibregl.ExpressionInputType | maplibregl.ExpressionSpecification,
    labelOutputPairs: [string, string][],
    fallback: string
  ): maplibregl.ExpressionSpecification | string => {
    if (!labelOutputPairs.length) return fallback;

    return [
      'match',
      input,
      ...labelOutputPairs.flat(),
      fallback,
    ] as maplibregl.ExpressionSpecification;
  };

  return (
    <Source
      type="vector"
      tiles={[
        `https://cdn.digitransit.fi/map/v3/finland/${i18n.resolvedLanguage}/stations,stops/{z}/{x}/{y}.pbf`,
      ]}
    >
      <Layer
        {...{
          id: 'railway_stations_circle',
          beforeId: 'z9',
          type: 'circle',
          source: 'stops',
          'source-layer': 'stations',
          filter: [
            'all',
            ['==', ['get', 'type'], 'RAIL'],
            ['==', ['index-of', 'digitraffic', ['get', 'gtfsId']], 0],
          ],
          paint: {
            'circle-color': routeStationGtfsIds
              ? getPropertyValueByStationGtfsId(
                  routeStationGtfsIds,
                  theme.palette.secondary.main,
                  theme.palette.mode === 'light' ? '#ccc' : '#555'
                )
              : '#ccc',
            'circle-stroke-color':
              theme.palette.mode === 'light' ? '#fff' : '#000',
            'circle-stroke-width': 2,
            'circle-radius': 4,
          },
        }}
      />
      <Layer
        {...{
          id: 'railway_stations_text',
          beforeId: 'z8',
          type: 'symbol',
          source: 'stops',
          'source-layer': 'stations',
          filter: [
            'all',
            ['==', ['get', 'type'], 'RAIL'],
            ['==', ['index-of', 'digitraffic', ['get', 'gtfsId']], 0],
          ],
          layout: {
            'text-optional': true,
            'text-allow-overlap': currentZoom != null && currentZoom > 10,
            'text-size': 10,
            'text-field': trainStationEntries
              ? [
                  'format',
                  // 1st field: Station name
                  ['get', 'name'],
                  {},
                  // 2nd field: Line break
                  '\n',
                  {},
                  // 3rd field: Station time table row time
                  getMatchExpression(
                    ['get', 'gtfsId'],
                    trainStationEntries.map((e) => [e.gtfsId, e.description]),
                    ''
                  ),
                  {
                    'text-color': getMatchExpression(
                      ['get', 'gtfsId'],
                      trainStationEntries.map((e) => [e.gtfsId, e.color]),
                      theme.palette.text.secondary
                    ),
                  },
                ]
              : '{name}',
            'text-font': ['Gotham Rounded Medium'],
            'text-variable-anchor': ['left', 'right'],
            'text-max-width': 8,
            'text-offset': [0.75, 0.25],
            'symbol-sort-key': routeStationGtfsIds
              ? getPropertyValueByStationGtfsId(routeStationGtfsIds, 0, 1)
              : 0,
          },
          paint: {
            'text-color': routeStationGtfsIds
              ? getPropertyValueByStationGtfsId(
                  routeStationGtfsIds,
                  theme.palette.text.primary,
                  theme.palette.text.secondary
                )
              : theme.palette.text.primary,
            'text-halo-width': 2,
            'text-halo-color': theme.palette.getContrastText(
              theme.palette.text.primary
            ),
          },
        }}
      />
      <Layer
        {...{
          id: 'railway_platform_numbers',
          beforeId: 'z7',
          type: 'symbol',
          source: 'stops',
          'source-layer': 'stops',
          filter: [
            'all',
            ['==', ['get', 'type'], 'RAIL'],
            ['has', 'platform'],
            ['==', ['index-of', 'digitraffic', ['get', 'gtfsId']], 0],
          ],
          minzoom: 14,
          layout: {
            'icon-image': 'stop-marker',
            'icon-size': 0.5,
            'icon-offset': [0, 0],
            'icon-anchor': 'bottom',
            'icon-allow-overlap': true,
            'text-allow-overlap': true,
            'text-size': 10,
            'text-anchor': 'top',
            'text-offset': [0, -2.5],
            'text-field': '{platform}',
            'text-font': ['Gotham Rounded Medium'],
          },
          paint: {
            'text-color': '#fff',
          },
        }}
      />
    </Source>
  );
};

export default StopsLayer;
