import { useEffect, useRef } from 'react';

import { Box, useTheme } from '@mui/material';
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
import { getMapStyle } from '../../utils/map';
import { TrainStation, trainStations } from '../../utils/stations';
import CustomOverlay from './CustomOverlay';
import RailwayPlatformsLayer from './RailwayPlatformsLayer';
import RailwayTracksLayer from './RailwayTracksLayer';
import StopsLayer from './StopsLayer';
import VehicleMarkerLayer from './VehicleMarkerLayer';
import VehicleRouteLayer from './VehicleRouteLayer';

/**
 * Temporary fix for https://github.com/visgl/react-map-gl/issues/2176 until it gets fixed.
 * Latest maplibregl no longer has built-in supported() method that react-map-gl assumes.
 */
(
  maplibregl as typeof maplibregl & {
    supported: () => boolean;
  }
).supported = () => true;

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
      mapStyle={getMapStyle(useVectorBaseTiles, theme.palette.mode)}
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
