import { useEffect, useState } from 'react';

import { useTheme } from '@mui/material';
import { LatLngTuple, Map as LMap } from 'leaflet';
import L from 'leaflet';
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
import VectorGrid from './VectorGrid';
import VehicleMarkerContainer from './VehicleMarkerContainer';

type VehicleMapContainerProps = {
  selectedVehicleId: number | null;
  station?: TrainStation;
  route?: RouteForRailFragment | null;
  routeStationCodes?: string[];
  onVehicleSelected: (vehicleId: number) => void;
};

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
      maxZoom={18}
      zoom={16}
      scrollWheelZoom={true}
      style={{ height: '100%' }}
      ref={setMap}
      preferCanvas
    >
      <TileLayer
        url="https://cdn.digitransit.fi/map/v2/hsl-map/{z}/{x}/{y}.png"
        id="hsl-map"
        attribution='&copy; <a href="https://digitransit.fi/">Digitransit</a>'
      />
      <VectorGrid
        url="/tiles/railway_tracks/{z}/{x}/{y}.pbf"
        attribution='&copy; <a href="https://vayla.fi/">Väylävirasto</a>'
        interactive={false}
        maxZoom={14}
        zIndex={1}
        rendererFactory={L.canvas.tile}
        vectorTileLayerStyles={{
          railway_tracks: {
            weight: 1,
            opacity: 0.9,
            color: '#666',
            fill: false,
            stroke: true,
          },
        }}
      />
      {trainStations
        .filter((s) => s.passengerTraffic)
        .map((s) => (
          <CircleMarker
            key={s.stationShortCode}
            center={[s.latitude, s.longitude]}
            pathOptions={{
              color: '#666',
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
      <VectorGrid
        url="/tiles/railway_platforms/{z}/{x}/{y}.pbf"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
        interactive={false}
        zIndex={1}
        vectorTileLayerStyles={{
          railway_platforms: {
            weight: 0.5,
            opacity: 1,
            color: '#ccc',
            fillColor: theme.palette.secondary.main,
            fillOpacity: 0.6,
            fill: true,
            stroke: true,
          },
        }}
      />
      <AttributionControl prefix="" />
    </MapContainer>
  );
};

export default VehicleMapContainer;
