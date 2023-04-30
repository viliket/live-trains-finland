import { useEffect, useState } from 'react';

import { useTheme } from '@mui/material';
import {
  differenceInMinutes,
  format,
  formatDistanceToNowStrict,
} from 'date-fns';
import { fi } from 'date-fns/locale';
import { MapLibreZoomEvent, MapStyleImageMissingEvent } from 'maplibre-gl';
import { useTranslation } from 'react-i18next';
import { Layer, Source, useMap } from 'react-map-gl';

import { gqlClients } from '../../graphql/client';
import {
  TrainByStationFragment,
  useTrainQuery,
} from '../../graphql/generated/digitraffic';
import { isDefined } from '../../utils/common';
import { StationTimeTableRowGroup } from '../../utils/getTimeTableRowsGroupedByStation';
import getTimeTableRowsGroupedByStation from '../../utils/getTimeTableRowsGroupedByStation';
import {
  getTimeTableRowRealTime,
  getTrainStationName,
} from '../../utils/train';
import stopSignSvgPath from './stop-sign.svg';

type StopsLayerProps = {
  train?: TrainByStationFragment | null;
};

const StopsLayer = ({ train }: StopsLayerProps) => {
  const { current: map } = useMap();
  const theme = useTheme();
  const [currentZoom, setCurrentZoom] = useState<number>();
  const { i18n, t } = useTranslation();

  const { data: realTimeData } = useTrainQuery(
    train
      ? {
          variables: {
            trainNumber: train.trainNumber,
            departureDate: train.departureDate,
          },
          context: { clientName: gqlClients.digitraffic },
          pollInterval: 10000,
          // Fetch only from cache as this data is already polled every 10 seconds in TrainInfoContainer
          fetchPolicy: 'cache-only',
          // To trigger re-render on every poll interval even when the data has not changed
          notifyOnNetworkStatusChange: true,
        }
      : { skip: true }
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
        img.src = stopSignSvgPath;
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

  const getPropertyValueByStationName = <T,>(
    stationNames: string[],
    valueMatch: T,
    valueUnmatch: T
  ): mapboxgl.Expression => {
    return [
      'match',
      // Get station name
      ['get', 'name'],
      // When station name matches any of the given station names use valueMatch as the property value
      ...(stationNames.flatMap((n) => [n, valueMatch]) ?? []),
      /* Otherwise use valueUnmatch as the property value */
      valueUnmatch,
    ];
  };

  const routeStationNames = train?.timeTableRows
    ? Array.from(
        new Set(
          train.timeTableRows
            .map((r) => (r ? getTrainStationName(r.station) : undefined))
            .filter(isDefined)
        )
      )
    : undefined;

  const trainWithRealTimeData = realTimeData?.train?.[0] ?? train;

  const trainTimeTableRows = trainWithRealTimeData
    ? getTimeTableRowsGroupedByStation(trainWithRealTimeData)
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
        locale: i18n.resolvedLanguage === 'fi' ? fi : undefined,
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

  const getStationNameForTimeTableGroup = (group: StationTimeTableRowGroup) => {
    const r = group.departure ?? group.arrival;
    if (!r) return '';
    return getTrainStationName(r.station);
  };

  return (
    <Source
      type="vector"
      tiles={[
        'https://digitransit-prod-cdn-origin.azureedge.net/map/v2/finland-stop-map/{z}/{x}/{y}.pbf',
      ]}
    >
      <Layer
        {...{
          id: 'railway_stations_circle',
          beforeId: 'z9',
          type: 'circle',
          source: 'stops',
          'source-layer': 'stops',
          filter: ['all', ['==', 'type', 'RAIL'], ['==', 'platform', 'null']],
          paint: {
            'circle-color': routeStationNames
              ? getPropertyValueByStationName(
                  routeStationNames,
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
          beforeId: 'z9',
          type: 'symbol',
          source: 'stops',
          'source-layer': 'stops',
          filter: ['all', ['==', 'type', 'RAIL'], ['==', 'platform', 'null']],
          layout: {
            'text-optional': true,
            'text-allow-overlap': currentZoom != null && currentZoom > 10,
            'text-size': 10,
            'text-field': trainTimeTableRows
              ? [
                  'format',
                  // 1st field: Station name
                  ['get', 'name'],
                  {},
                  // 2nd field: Line break
                  '\n',
                  {},
                  // 3rd field: Station time table row time
                  [
                    'match',
                    // Get station name
                    ['get', 'name'],
                    // When station name matches one of time table rows,
                    // display extra info about the station time table row
                    ...trainTimeTableRows.flatMap((g) => [
                      getStationNameForTimeTableGroup(g),
                      getTimeTableRowGroupDescription(g),
                    ]),
                    // Otherwise display nothing (when station is not on trainTimeTableRows)
                    '',
                  ],
                  {
                    'text-color': [
                      'match',
                      // Get station name
                      ['get', 'name'],
                      // When station name matches one of time table rows,
                      // choose text color based on the time table row data
                      ...trainTimeTableRows.flatMap((g) => [
                        getStationNameForTimeTableGroup(g),
                        getTimeTableRowGroupColor(g),
                      ]),
                      // Otherwise use fallback text color (when station is not on trainTimeTableRows)
                      theme.palette.text.secondary,
                    ],
                  },
                ]
              : '{name}',
            'text-font': ['Gotham Rounded Medium'],
            'text-variable-anchor': ['left', 'right'],
            'text-max-width': 8,
            'text-offset': [0.75, 0.25],
            'symbol-sort-key': routeStationNames
              ? getPropertyValueByStationName(routeStationNames, 0, 1)
              : 0,
          },
          paint: {
            'text-color': routeStationNames
              ? getPropertyValueByStationName(
                  routeStationNames,
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
          beforeId: 'z8',
          type: 'symbol',
          source: 'stops',
          'source-layer': 'stops',
          filter: ['all', ['==', 'type', 'RAIL'], ['!=', 'platform', 'null']],
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
