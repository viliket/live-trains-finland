import { useEffect, useState } from 'react';

import { useReactiveVar } from '@apollo/client';
import { Button, useTheme } from '@mui/material';
import { CrosshairsGps } from 'mdi-material-ui';
import { useTranslation } from 'react-i18next';
import { Popup, useMapEvents } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';

import { vehiclesVar } from '../graphql/client';
import { formatEET } from '../utils/date';
import Control from './Control';
import DivIconMarker from './DivIconMarker';
import VehicleMarkerIcon from './VehicleMarkerIcon';

type VehicleMarkerContainerProps = {
  onVehicleMarkerClick: (id: number) => void;
  selectedVehicleId: number | null;
};

export default function VehicleMarkerContainer({
  onVehicleMarkerClick,
  selectedVehicleId,
}: VehicleMarkerContainerProps) {
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [zoomCenterYOffset, setZoomCenterYOffset] = useState<number>(0);
  const vehicles = useReactiveVar(vehiclesVar);
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const visibleVehicles = Object.entries(vehicles);

  const selectedVehicle = selectedVehicleId
    ? vehicles[selectedVehicleId]
    : null;

  const map = useMapEvents({
    movestart() {
      setIsTracking(false);
    },
    popupclose() {
      setZoomCenterYOffset(0);
    },
  });

  useEffect(() => {
    if (selectedVehicleId != null) {
      setIsTracking(true);
    }
  }, [selectedVehicleId]);

  useEffect(() => {
    if (isTracking && selectedVehicle) {
      map.invalidateSize();
      map.panTo(
        {
          lat: selectedVehicle.lat + zoomCenterYOffset,
          lng: selectedVehicle.lng,
        },
        {
          animate: true,
          duration: 1,
          // Do not fire movestart event from programmatic panning
          noMoveStart: true,
        }
      );
    }
  }, [selectedVehicle, map, isTracking, zoomCenterYOffset]);

  return (
    <>
      {selectedVehicle && (
        <Control position="topright">
          <Button
            variant="contained"
            size="small"
            color={isTracking ? 'primary' : 'inherit'}
            sx={{ minWidth: 'auto', padding: '4px' }}
            onClick={() => setIsTracking(!isTracking)}
          >
            <CrosshairsGps />
          </Button>
        </Control>
      )}
      {visibleVehicles.map(([id, message]) => (
        <DivIconMarker
          key={id}
          position={{
            lat: message.lat,
            lng: message.lng,
          }}
          zIndexOffset={10000}
          eventHandlers={{
            click: (e) => {
              // Find the pixel location on the map where the popup anchor is
              const px = map.project(e.latlng);
              // Find the height of the popup container, divide by 2, subtract
              // from the Y axis of marker location
              px.y -= (e.target._popup._container.clientHeight + 10) / 2; // + 10 is the popup tip height
              // Store offset for centering later on selected vehicle marker
              setZoomCenterYOffset(map.unproject(px).lat - e.latlng.lat);

              onVehicleMarkerClick(Number.parseInt(id, 10));
              setIsTracking(true);
            },
          }}
          icon={{
            element: (
              <VehicleMarkerIcon
                rotate={message.heading}
                vehicleNumber={
                  message.routeShortName
                    ? message.routeShortName
                    : message.jrn?.toString() ?? '?'
                }
                color={theme.palette.secondary.main}
              />
            ),
            iconSize: [30, 30],
          }}
        >
          <Popup autoPan={false}>
            <h4>
              {message.routeShortName} {message.jrn}{' '}
              <span style={{ float: 'right' }}>{message.spd} km/h</span>
            </h4>
            <Button
              variant="outlined"
              onClick={(e) => {
                navigate(
                  `/train/${message.jrn}/${formatEET(new Date(), 'yyyy-MM-dd')}`
                );
                e.stopPropagation();
              }}
            >
              {t('train_details')}
            </Button>
          </Popup>
        </DivIconMarker>
      ))}
    </>
  );
}
