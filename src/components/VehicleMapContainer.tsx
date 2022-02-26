import { useEffect, useRef, useState } from 'react';

import { useTheme } from '@mui/material';
import { Map as LMap, TileLayer as LeafletTileLayer } from 'leaflet';
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

const tileLayerUrl = {
  light: 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png',
  dark: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
};

const VehicleMapContainer = ({
  selectedVehicleId,
  station,
  route,
  routeStationCodes,
  onVehicleSelected,
}: VehicleMapContainerProps) => {
  const [map, setMap] = useState<LMap | null>(null);
  const theme = useTheme();
  const baseTileLayerRef = useRef<LeafletTileLayer | null>(null);

  useEffect(() => {
    if (map && station) {
      map.panTo({ lat: station.latitude, lng: station.longitude });
    }
  }, [map, station]);

  useEffect(() => {
    if (baseTileLayerRef.current) {
      baseTileLayerRef.current.setUrl(
        theme.palette.mode === 'light' ? tileLayerUrl.light : tileLayerUrl.dark
      );
    }
  }, [map?.attributionControl, theme.palette.mode]);

  return (
    <MapContainer
      attributionControl={false}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: '100%' }}
      whenCreated={(map) => {
        setTimeout(() => map.invalidateSize(), 500);
        setMap(map);
      }}
    >
      <TileLayer
        ref={baseTileLayerRef}
        url={
          theme.palette.mode === 'light'
            ? tileLayerUrl.light
            : tileLayerUrl.dark
        }
        id="hsl-map"
        attribution={
          '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>, ' +
          '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
        }
      />
      <TileLayer
        url="http://{s}.tiles.openrailwaymap.org/signals/{z}/{x}/{y}.png"
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
          pathOptions={{ color: theme.palette.secondary.main }}
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
