import { useRef } from 'react';

import { useTheme } from '@mui/material';
import { generateStyle } from 'hsl-map-style';
import maplibregl from 'maplibre-gl';
import Map, {
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

const mapStyle = generateStyle();

const mapStyleDark = generateStyle({
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

const hkiStation = trainStations.find((s) => s.stationShortCode === 'HKI');

const VehicleMapContainer = ({
  selectedVehicleId,
  station,
  route,
  routeStationCodes,
  onVehicleSelected,
}: VehicleMapContainerProps) => {
  const mapRef = useRef<MapRef>(null);
  const theme = useTheme();

  return (
    <Map
      mapLib={maplibregl}
      ref={mapRef}
      initialViewState={{
        longitude: station?.longitude ?? hkiStation?.longitude,
        latitude: station?.latitude ?? hkiStation?.latitude,
        zoom: 15,
      }}
      mapStyle={theme.palette.mode === 'light' ? mapStyle : mapStyleDark}
    >
      <NavigationControl position="top-left" />
      <ScaleControl />
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
