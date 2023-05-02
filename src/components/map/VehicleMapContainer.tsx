import { useEffect, useRef } from 'react';

import { Box, useTheme } from '@mui/material';
import { generateStyle, Options } from 'hsl-map-style';
import { VectorSource } from 'mapbox-gl';
import mapboxgl from 'mapbox-gl';
import maplibregl from 'maplibre-gl';
import { QualityHigh, QualityLow } from 'mdi-material-ui';
import Map, {
  FullscreenControl,
  Layer,
  MapRef,
  NavigationControl,
  ScaleControl,
} from 'react-map-gl';
import useLocalStorageState from 'use-local-storage-state';

import { TrainByStationFragment } from '../../graphql/generated/digitraffic';
import { RouteForRailFragment } from '../../graphql/generated/digitransit';
import { TrainStation, trainStations } from '../../utils/stations';
import CustomOverlay from './CustomOverlay';
import RailwayPlatformsLayer from './RailwayPlatformsLayer';
import RailwayTracksLayer from './RailwayTracksLayer';
import StopsLayer from './StopsLayer';
import VehicleMarkerLayer from './VehicleMarkerLayer';
import VehicleRouteLayer from './VehicleRouteLayer';

const baseAttribution =
  '<a href="https://digitransit.fi/" target="_blank">&copy; Digitransit</a> ' +
  '<a href="https://www.openmaptiles.org/" target="_blank">&copy; OpenMapTiles</a> ' +
  '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap</a>';

const generateMapStyle = (options?: Options) => {
  const mapStyle = generateStyle({
    ...options,
    sourcesUrl: 'https://cdn.digitransit.fi/',
    queryParams: [
      {
        url: 'https://cdn.digitransit.fi/',
        name: 'digitransit-subscription-key',
        value: process.env.REACT_APP_DIGITRANSIT_SUBSCRIPTION_KEY ?? '',
      },
    ],
  });
  (mapStyle.sources['vector'] as VectorSource).attribution = baseAttribution;
  return mapStyle;
};

const mapStyle = generateMapStyle();

const mapStyleDark = generateMapStyle({
  components: {
    greyscale: {
      enabled: true,
    },
  },
});

const getRasterMapStyle = (isDarkMode: boolean): mapboxgl.Style => ({
  version: 8,
  sources: {
    'raster-tiles': {
      type: 'raster',
      tiles: [
        isDarkMode
          ? 'https://cdn.digitransit.fi/map/v2/hsl-map-greyscale/{z}/{x}/{y}.png'
          : 'https://cdn.digitransit.fi/map/v2/hsl-map/{z}/{x}/{y}.png',
      ],
      tileSize: 512,
      attribution: baseAttribution,
    },
  },
  glyphs:
    'https://hslstoragestatic.azureedge.net/mapfonts/{fontstack}/{range}.pbf',
  layers: [
    {
      id: 'simple-tiles',
      type: 'raster',
      source: 'raster-tiles',
      minzoom: 0,
      maxzoom: 23,
    },
  ],
});

const rasterMapStyle = getRasterMapStyle(false);
const rasterMapStyleDark = getRasterMapStyle(true);

/**
 * Temporary fix for https://github.com/visgl/react-map-gl/issues/2166 until it gets fixed.
 * When react-map-gl Map gets reused (reuseMaps is true) it does not properly tell the
 * _resizeObserver of the reused instance to observe the new container.
 */
const fixMapResizeObserver = (
  map: mapboxgl.Map & {
    _resizeObserver?: ResizeObserver;
  }
) => {
  if (map._resizeObserver) {
    map._resizeObserver.disconnect();
    map._resizeObserver.observe(map.getContainer());
  }
};

type VehicleMapContainerProps = {
  selectedVehicleId: number | null;
  station?: TrainStation;
  route?: RouteForRailFragment | null;
  train?: TrainByStationFragment | null;
  onVehicleSelected: (vehicleId: number) => void;
};

const fallbackStation = trainStations.find((s) => s.stationShortCode === 'HKI');
const initialZoom = 15;

const VehicleMapContainer = ({
  selectedVehicleId,
  station,
  route,
  train,
  onVehicleSelected,
}: VehicleMapContainerProps) => {
  const mapRef = useRef<MapRef>(null);
  const theme = useTheme();
  const [useVectorBaseTiles, setUseVectorBaseTiles] = useLocalStorageState(
    'useVectorBaseTiles',
    {
      defaultValue: false,
    }
  );
  const map = mapRef.current;

  useEffect(() => {
    // Set map initial view state
    // Note: We need to do this when "reuseMaps" flag is set
    if (map) {
      const stationToCenter = station ?? fallbackStation;
      if (stationToCenter) {
        map.setCenter({
          lng: stationToCenter.longitude,
          lat: stationToCenter.latitude,
        });
      }
      map.setZoom(initialZoom);
    }
  }, [map, station]);

  useEffect(() => {
    if (map) {
      fixMapResizeObserver(map.getMap());
    }
  }, [map]);

  const getMapStyle = () => {
    if (useVectorBaseTiles) {
      return theme.palette.mode === 'light' ? mapStyle : mapStyleDark;
    } else {
      return theme.palette.mode === 'light'
        ? rasterMapStyle
        : rasterMapStyleDark;
    }
  };

  return (
    <Map
      mapLib={maplibregl}
      ref={mapRef}
      reuseMaps
      // Disable unneeded RTLTextPlugin that is set by react-map-gl by default
      RTLTextPlugin=""
      initialViewState={{
        longitude: station?.longitude ?? fallbackStation?.longitude,
        latitude: station?.latitude ?? fallbackStation?.latitude,
        zoom: initialZoom,
      }}
      mapStyle={getMapStyle()}
      transformRequest={(url) => {
        if (
          url.includes('api.digitransit.fi') ||
          url.includes('cdn.digitransit.fi') ||
          url.includes('digitransit-prod-cdn-origin.azureedge.net')
        ) {
          return {
            url: url.replace('api.digitransit.fi', 'cdn.digitransit.fi'),
            headers: {
              'digitransit-subscription-key':
                process.env.REACT_APP_DIGITRANSIT_SUBSCRIPTION_KEY,
            },
          };
        }
        return {
          url: url,
        };
      }}
    >
      <NavigationControl position="top-left" />
      <ScaleControl />
      <FullscreenControl />
      <CustomOverlay
        children={
          <Box
            component="button"
            onClick={() => setUseVectorBaseTiles((b) => !b)}
            sx={{
              svg: {
                verticalAlign: 'middle',
                padding: '4px',
                color: 'text.primary',
              },
            }}
          >
            {useVectorBaseTiles ? (
              <QualityHigh className="maplibregl-ctrl-icon" />
            ) : (
              <QualityLow className="maplibregl-ctrl-icon" />
            )}
          </Box>
        }
      />
      {
        /**
         * Create empty base layers for dynamically changing the layer order
         * https://github.com/visgl/react-map-gl/issues/939#issuecomment-625290200
         */
        Array.from(Array(11).keys()).map((i) => {
          return (
            <Layer
              key={i}
              id={'z' + i}
              type="background"
              layout={{ visibility: 'none' }}
              paint={{}}
            />
          );
        })
      }
      <StopsLayer train={train} />
      <RailwayTracksLayer />
      <RailwayPlatformsLayer />
      {route && (
        <VehicleRouteLayer
          data={{
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: route.patterns?.[0]?.geometry?.map((c) => [
                c?.lon!,
                c?.lat!,
              ])!,
            },
          }}
        />
      )}
      <VehicleMarkerLayer
        selectedVehicleId={selectedVehicleId}
        onVehicleMarkerClick={onVehicleSelected}
      />
    </Map>
  );
};

export default VehicleMapContainer;
