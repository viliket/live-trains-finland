import { useEffect, useState } from 'react';

import { useTheme } from '@mui/material';
import { LatLngTuple, Map as LMap } from 'leaflet';
import {
  AttributionControl,
  CircleMarker,
  MapContainer,
  Polyline,
  TileLayer,
} from 'react-leaflet';

import { RouteForRailFragment } from '../graphql/generated/digitransit';
import { TrainStation } from '../utils/stations';
import { trainStations } from '../utils/stations';
import StationTooltip from './StationTooltip';
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
const initialCenter: LatLngTuple | undefined = hkiStation
  ? [hkiStation.latitude, hkiStation.longitude]
  : undefined;

const VehicleMapContainer = ({
  selectedVehicleId,
  station,
  route,
  routeStationCodes,
  onVehicleSelected,
}: VehicleMapContainerProps) => {
  const [map, setMap] = useState<LMap | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (map && station) {
      map.panTo({ lat: station.latitude, lng: station.longitude });
    }
  }, [map, station]);

  return (
    <MapContainer
      attributionControl={false}
      center={initialCenter}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: '100%' }}
      ref={setMap}
      preferCanvas
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
            pane="markerPane"
          >
            <StationTooltip
              direction="left"
              offset={[-4, 0]}
              permanent={
                station?.stationShortCode === s.stationShortCode ||
                routeStationCodes?.some((c) => c === s.stationShortCode)
              }
            >
              {s.stationName}
            </StationTooltip>
          </CircleMarker>
        ))}
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
      <AttributionControl prefix="" />
    </MapContainer>
  );
};

export default VehicleMapContainer;
