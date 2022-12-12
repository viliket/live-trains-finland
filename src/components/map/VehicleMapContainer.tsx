import { useEffect, useRef } from 'react';

import { useTheme } from '@mui/material';
import { generateStyle, Options } from 'hsl-map-style';
import { VectorSource } from 'mapbox-gl';
import maplibregl from 'maplibre-gl';
import Map, {
  FullscreenControl,
  Layer,
  MapRef,
  NavigationControl,
  ScaleControl,
} from 'react-map-gl';

import { RouteForRailFragment } from '../../graphql/generated/digitransit';
import { TrainStation, trainStations } from '../../utils/stations';
import RailwayPlatformsLayer from './RailwayPlatformsLayer';
import RailwayTracksLayer from './RailwayTracksLayer';
import StopsLayer from './StopsLayer';
import VehicleMarkerLayer from './VehicleMarkerLayer';
import VehicleRouteLayer from './VehicleRouteLayer';

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
  (mapStyle.sources['vector'] as VectorSource).attribution =
    '<a href="https://digitransit.fi/" target="_blank">&copy; Digitransit</a> ' +
    '<a href="https://www.openmaptiles.org/" target="_blank">&copy; OpenMapTiles</a> ' +
    '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap</a>';
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

type VehicleMapContainerProps = {
  selectedVehicleId: number | null;
  station?: TrainStation;
  route?: RouteForRailFragment | null;
  routeStationCodes?: string[];
  onVehicleSelected: (vehicleId: number) => void;
};

const fallbackStation = trainStations.find((s) => s.stationShortCode === 'HKI');
const initialZoom = 15;

const VehicleMapContainer = ({
  selectedVehicleId,
  station,
  route,
  routeStationCodes,
  onVehicleSelected,
}: VehicleMapContainerProps) => {
  const mapRef = useRef<MapRef>(null);
  const theme = useTheme();
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

  return (
    <Map
      mapLib={maplibregl}
      ref={mapRef}
      reuseMaps
      initialViewState={{
        longitude: station?.longitude ?? fallbackStation?.longitude,
        latitude: station?.latitude ?? fallbackStation?.latitude,
        zoom: initialZoom,
      }}
      mapStyle={theme.palette.mode === 'light' ? mapStyle : mapStyleDark}
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
      <StopsLayer routeStationCodes={routeStationCodes} />
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
