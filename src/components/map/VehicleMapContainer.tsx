import { useCallback, useEffect, useRef } from 'react';

import { Box, useTheme } from '@mui/material';
import { QualityHigh, QualityLow } from 'mdi-material-ui';
import { useTranslation } from 'react-i18next';
import Map, {
  FullscreenControl,
  MapRef,
  NavigationControl,
  ScaleControl,
} from 'react-map-gl/maplibre';
import useLocalStorageState from 'use-local-storage-state';

import { TrainByStationFragment } from '../../graphql/generated/digitraffic/graphql';
import { RouteForRailFragment } from '../../graphql/generated/digitransit/graphql';
import { useDetailedRouteQuery } from '../../hooks/useDetailedRouteQuery';
import { getMapStyle } from '../../utils/map';
import { TrainStation, trainStations } from '../../utils/stations';
import { getTrainRoutePatternId } from '../../utils/train';

import CustomOverlay from './CustomOverlay';
import RailwayPlatformsLayer from './RailwayPlatformsLayer';
import RailwayTracksLayer from './RailwayTracksLayer';
import StopsLayer from './StopsLayer';
import VehicleMarkerLayer from './VehicleMarkerLayer';
import VehicleRouteLayer from './VehicleRouteLayer';

export type VehicleMapContainerProps = {
  selectedVehicleId: number | null;
  station?: TrainStation;
  route?: RouteForRailFragment | null;
  train?: TrainByStationFragment | null;
  onVehicleSelected: (vehicleId: number) => void;
};

const fallbackStation = trainStations.find((s) => s.stationShortCode === 'HKI');
const initialZoom = 15;

function setMapViewState(
  map: MapRef,
  station: TrainStation | undefined,
  selectedVehicleId: number | null
) {
  const stationToCenter = station ?? fallbackStation;
  if (stationToCenter && selectedVehicleId == null) {
    map.setCenter({
      lng: stationToCenter.longitude,
      lat: stationToCenter.latitude,
    });
  }
  map.setZoom(initialZoom);
}

const VehicleMapContainer = ({
  selectedVehicleId,
  station,
  route,
  train,
  onVehicleSelected,
}: VehicleMapContainerProps) => {
  const mapRef = useRef<MapRef | null>(null);
  const theme = useTheme();
  const [useVectorBaseTiles, setUseVectorBaseTiles] = useLocalStorageState(
    'useVectorBaseTiles',
    {
      defaultValue: false,
    }
  );
  const { i18n } = useTranslation();

  const { data: detailedRoute } = useDetailedRouteQuery(
    train ? getTrainRoutePatternId(train) : null
  );

  useEffect(() => {
    if (mapRef.current) {
      setMapViewState(mapRef.current, station, selectedVehicleId);
    }
  }, [station, selectedVehicleId]);

  const handleMapRef = useCallback(
    (map: MapRef | null) => {
      if (map) {
        mapRef.current = map;

        // Set map initial view state
        // Note: We need to do this when "reuseMaps" flag is set since the Map
        // initialViewState has only effect on the first time the map is initialized.
        // Additionally, because we created VehicleMapContainer initially on a detached
        // DOM node without specifying a station, the map center defaults to the fallback
        // station.
        setMapViewState(map, station, selectedVehicleId);

        // As we are creating VehicleMapContainer initially on a detached DOM node,
        // the maplibre-gl Map may have wrong initial canvas size as the Map determines
        // its dimensions from the container element's clientWidth/clientHeight which
        // would be 0 when the container is detached from DOM.
        if (map.getContainer().clientHeight !== map.getCanvas().clientHeight) {
          map.resize();
        }
      }
    },
    [selectedVehicleId, station]
  );

  return (
    <Map
      ref={handleMapRef}
      reuseMaps
      // Disable unneeded RTLTextPlugin that is set by react-map-gl by default
      RTLTextPlugin=""
      initialViewState={{
        longitude: station?.longitude ?? fallbackStation?.longitude,
        latitude: station?.latitude ?? fallbackStation?.latitude,
        zoom: initialZoom,
      }}
      mapStyle={getMapStyle(
        useVectorBaseTiles,
        theme.palette.mode,
        i18n.resolvedLanguage ?? i18n.language
      )}
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
                process.env.NEXT_PUBLIC_DIGITRANSIT_SUBSCRIPTION_KEY,
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
      <CustomOverlay>
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
      </CustomOverlay>
      <StopsLayer train={train} />
      <RailwayTracksLayer />
      <RailwayPlatformsLayer />
      {(detailedRoute || route) && (
        <VehicleRouteLayer
          data={
            detailedRoute
              ? {
                  ...detailedRoute,
                  properties: {
                    ...detailedRoute.properties,
                    detailed: true,
                  },
                }
              : {
                  type: 'Feature',
                  properties: {
                    detailed: false,
                  },
                  geometry: {
                    type: 'LineString',
                    coordinates: route?.patterns?.[0]?.geometry?.map((c) => [
                      c?.lon!,
                      c?.lat!,
                    ])!,
                  },
                }
          }
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
