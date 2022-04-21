import { useTheme } from '@mui/material';
import { LatLngTuple } from 'leaflet';
import {
  AttributionControl,
  CircleMarker,
  MapContainer,
  Polyline,
  Popup,
  TileLayer,
} from 'react-leaflet';

import { RouteForRailFragment } from '../graphql/generated/digitransit';
import { TrainStation } from '../utils/stations';
import { trainStations } from '../utils/stations';
import VehicleMarkerContainer from './VehicleMarkerContainer';

type VehicleMapContainerProps = {
  selectedVehicleId: number | null;
  station?: TrainStation;
  route?: RouteForRailFragment | null;
  routeStationCodes?: string[];
  onVehicleSelected: (vehicleId: number) => void;
};

const tileLayerUrl =
  'https://stamen-tiles.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png';

const hkiStation = trainStations.find((s) => s.stationShortCode === 'HKI');
const defaultCenter: LatLngTuple | undefined = hkiStation
  ? [hkiStation.latitude, hkiStation.longitude]
  : undefined;

const VehicleMapContainer = ({
  selectedVehicleId,
  station,
  route,
  routeStationCodes,
  onVehicleSelected,
}: VehicleMapContainerProps) => {
  const theme = useTheme();

  let initialCenter = defaultCenter;
  if (station) {
    initialCenter = [station.latitude, station.longitude];
  }

  return (
    <MapContainer
      attributionControl={false}
      center={initialCenter}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: '100%' }}
    >
      <TileLayer
        url={tileLayerUrl}
        id="hsl-map"
        attribution={
          '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>, ' +
          '&copy; <a href="http://stamen.com">Stamen Design</a>'
        }
      />
      <TileLayer
        url="https://{s}.tiles.openrailwaymap.org/signals/{z}/{x}/{y}.png"
        id="openrailway-map"
        attribution='&copy; <a href="http://www.openrailwaymap.org/">OpenRailwayMap</a>'
      />
      <VehicleMarkerContainer
        selectedVehicleId={selectedVehicleId}
        onVehicleMarkerClick={(id) => {
          onVehicleSelected(id);
        }}
      />
      {route?.patterns?.[0]?.geometry && (
        <Polyline
          color={theme.palette.secondary.main}
          positions={route.patterns?.[0]?.geometry.map((p) => ({
            lat: p!.lat!,
            lng: p!.lon!,
          }))}
        />
      )}
      {trainStations
        .filter((s) => s.passengerTraffic)
        .map((s) => (
          <CircleMarker
            key={s.stationShortCode}
            center={[s.latitude, s.longitude]}
            pathOptions={{
              color: 'white',
              fillColor: routeStationCodes?.find(
                (stationCode) => stationCode === s.stationShortCode
              )
                ? theme.palette.secondary.main
                : theme.palette.grey[300],
              fillOpacity: 1,
            }}
            radius={5}
            pane={'markerPane'}
          >
            <Popup>{s.stationName}</Popup>
          </CircleMarker>
        ))}
      <AttributionControl prefix="" />
    </MapContainer>
  );
};

export default VehicleMapContainer;
