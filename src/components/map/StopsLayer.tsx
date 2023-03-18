import { useEffect, useState } from 'react';

import { useTheme } from '@mui/material';
import { MapLibreZoomEvent } from 'maplibre-gl';
import { Layer, Source, useMap } from 'react-map-gl';

import { isDefined } from '../../utils/common';
import { trainStations } from '../../utils/stations';
import stopSignSvgPath from './stop-sign.svg';

type StopsLayerProps = {
  routeStationCodes?: string[];
};

const StopsLayer = ({ routeStationCodes }: StopsLayerProps) => {
  const { current: map } = useMap();
  const theme = useTheme();
  const [currentZoom, setCurrentZoom] = useState<number>();

  const routeStationNames = routeStationCodes
    ?.map(
      (c) => trainStations.find((s) => s.stationShortCode === c)?.stationName
    )
    .filter(isDefined);

  useEffect(() => {
    const img = new Image(64, 64);
    img.onload = () => {
      if (map && !map.hasImage('stop-marker')) {
        map.addImage('stop-marker', img);
      }
    };
    img.onerror = (e) => console.error(e);
    img.src = stopSignSvgPath;
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
            'text-field': '{name}',
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
          minzoom: 15,
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
