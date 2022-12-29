import { useEffect, useState } from 'react';

import { Box, Button, useTheme } from '@mui/material';
import { format } from 'date-fns';
import { MapStyleImageMissingEvent } from 'maplibre-gl';
import { Crosshairs, CrosshairsGps } from 'mdi-material-ui';
import { useTranslation } from 'react-i18next';
import {
  Layer,
  MapLayerMouseEvent,
  Popup,
  Source,
  useMap,
  ViewStateChangeEvent,
} from 'react-map-gl';
import { useNavigate } from 'react-router-dom';

import { vehiclesVar } from '../../graphql/client';
import useAnimationFrame from '../../hooks/useAnimationFrame';
import useInterval from '../../hooks/useInterval';
import {
  getVehicleMarkerIconImage,
  getVehiclesGeoJsonData,
} from '../../utils/map';
import CustomOverlay from './CustomOverlay';

type VehicleMarkerLayerProps = {
  onVehicleMarkerClick: (id: number) => void;
  selectedVehicleId: number | null;
};

const animDurationInMs = 1000;

export default function VehicleMarkerLayer({
  onVehicleMarkerClick,
  selectedVehicleId,
}: VehicleMarkerLayerProps) {
  const { current: map } = useMap();
  const [vehicleIdForPopup, setVehicleIdForPopup] = useState<number | null>(
    null
  );
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [interpolatedPositions, setInterpolatedPositions] = useState<
    Record<number, GeoJSON.Position>
  >({});
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const missingImages: string[] = [];

    const styleImageMissingCallback = (e: MapStyleImageMissingEvent) => {
      if (!map) return;
      const id = e.id;

      // Only create if not already added
      if (missingImages.indexOf(id) !== -1) return;
      missingImages.push(id);

      const image = getVehicleMarkerIconImage({
        id,
        mapBearing: map.getBearing(),
        colorPrimary: theme.palette.secondary.main,
      });
      if (image) {
        map.addImage(id, image);
      }
    };

    if (map) {
      map.on('styleimagemissing', styleImageMissingCallback);
    }

    return () => {
      if (map) {
        map.off('styleimagemissing', styleImageMissingCallback);
        missingImages.forEach((img) => {
          if (map.loaded()) {
            map.removeImage(img);
          }
        });
      }
    };
  }, [map, theme.palette.secondary.main]);

  useEffect(() => {
    const moveStartCallback = (e: ViewStateChangeEvent) => {
      if (!('triggerSource' in e)) {
        setIsTracking(false);
      }
    };

    if (map) {
      map.on('movestart', moveStartCallback);
    }

    return () => {
      if (map) {
        map.off('movestart', moveStartCallback);
      }
    };
  }, [map]);

  useEffect(() => {
    if (selectedVehicleId != null) {
      setIsTracking(true);
    }
  }, [selectedVehicleId]);

  useInterval(() => {
    if (map && isTracking && selectedVehicleId) {
      const vehicle = vehiclesVar()[selectedVehicleId];
      if (!vehicle) return;
      map.flyTo(
        {
          center: vehicle.position,
          animate: true,
          easing: (t) => t,
          duration: animDurationInMs,
          // When popup is open, offset the y location by the popup height
          offset: vehicleIdForPopup ? [0, 40] : [0, 0],
        },
        { triggerSource: 'flyTo' }
      );
    }
  }, animDurationInMs);

  useEffect(() => {
    const clickCallback = (e: MapLayerMouseEvent) => {
      if (!e.features) return;

      // Copy coordinates array
      const feature = e.features[0];
      if (feature.geometry.type !== 'Point') return;
      const coordinates = feature.geometry.coordinates.slice();
      const id = feature.properties!.vehicleId;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      setVehicleIdForPopup(id);
      onVehicleMarkerClick(Number.parseInt(id, 10));
    };

    const mouseEnterCallback = () => {
      if (map) {
        map.getCanvas().style.cursor = 'pointer';
      }
    };

    const mouseLeaveCallback = () => {
      if (map) {
        map.getCanvas().style.cursor = '';
      }
    };

    if (map) {
      // When a click event occurs on a feature in the vehicles layer, open a popup with vehicle details
      map.on('click', 'vehicles', clickCallback);

      // Change the cursor to a pointer when the mouse is over the vehicles layer
      map.on('mouseenter', 'vehicles', mouseEnterCallback);

      // Change it back to a pointer when it leaves
      map.on('mouseleave', 'vehicles', mouseLeaveCallback);
    }

    return () => {
      if (map) {
        map.off('click', 'vehicles', clickCallback);
        map.off('mouseenter', 'vehicles', mouseEnterCallback);
        map.off('mouseleave', 'vehicles', mouseLeaveCallback);
      }
    };
  }, [map, onVehicleMarkerClick]);

  useAnimationFrame((timestamp) => {
    const currentVehicles = vehiclesVar();
    const vehiclePositions: Record<number, GeoJSON.Position> = {};
    Object.keys(currentVehicles).forEach((id) => {
      const vehicle = currentVehicles[Number.parseInt(id)];
      const prevPos = vehicle.prevPosition;
      const curPos = vehicle.position;

      const elapsedTime = timestamp - vehicle.timestamp;
      let progress = elapsedTime / animDurationInMs;
      if (progress > 1) progress = 1;

      vehiclePositions[Number.parseInt(id)] = [
        prevPos[0] + (curPos[0] - prevPos[0]) * progress,
        prevPos[1] + (curPos[1] - prevPos[1]) * progress,
      ];
    });
    setInterpolatedPositions(vehiclePositions);
  });

  const selectedVehicleForPopup = vehicleIdForPopup
    ? vehiclesVar()[vehicleIdForPopup]
    : null;

  return (
    <>
      {selectedVehicleId != null &&
        interpolatedPositions[selectedVehicleId] && (
          <CustomOverlay
            children={
              <Box
                component="button"
                onClick={() => setIsTracking(!isTracking)}
                sx={{
                  svg: {
                    verticalAlign: 'middle',
                    padding: '4px',
                    color: isTracking ? 'primary.main' : 'text.primary',
                  },
                }}
              >
                {isTracking ? (
                  <CrosshairsGps className="maplibregl-ctrl-icon" />
                ) : (
                  <Crosshairs className="maplibregl-ctrl-icon" />
                )}
              </Box>
            }
          />
        )}
      <Source
        type="geojson"
        data={getVehiclesGeoJsonData(vehiclesVar(), interpolatedPositions)}
      >
        <Layer
          {...{
            id: 'vehicles',
            beforeId: 'z10',
            source: 'point',
            type: 'symbol',
            layout: {
              'symbol-z-order': 'viewport-y',
              'icon-image': 'vehiclemarker-x-0',
              'icon-rotate': ['get', 'bearing'],
              'icon-size': 0.6,
              'icon-offset': [0, 0],
              'icon-padding': 0,
              'icon-rotation-alignment': 'map',
              'icon-allow-overlap': true,
              'icon-ignore-placement': true,
              // Prevent text flickering on larger zoom levels when vehicle marker icon is moving fast
              'text-allow-overlap': map && map.getZoom() > 15,
              'text-optional': true,
              'text-padding': 3,
              'text-size': 12,
              'text-anchor': 'top',
              'text-offset': [0, -0.4],
              'text-field': '{vehicleNumber}',
              'text-font': ['Gotham Rounded Medium'],
            },
            paint: {
              'text-color': '#fff',
            },
          }}
        />
      </Source>
      {selectedVehicleForPopup && map && (
        <Popup
          anchor="bottom"
          longitude={
            interpolatedPositions[selectedVehicleForPopup.veh][0] ??
            selectedVehicleForPopup.position[0]
          }
          latitude={
            interpolatedPositions[selectedVehicleForPopup.veh][1] ??
            selectedVehicleForPopup.position[1]
          }
          onClose={() => setVehicleIdForPopup(null)}
        >
          <h4 style={{ margin: '0.5em 0' }}>
            {selectedVehicleForPopup.routeShortName}{' '}
            {selectedVehicleForPopup.jrn}{' '}
            <span style={{ float: 'right' }}>
              {selectedVehicleForPopup.spd} km/h
            </span>
          </h4>
          <Button
            variant="outlined"
            onClick={(e) => {
              navigate(
                `/train/${selectedVehicleForPopup.jrn}/${format(
                  new Date(),
                  'yyyy-MM-dd'
                )}`
              );
              e.stopPropagation();
            }}
          >
            {t('train_details')}
          </Button>
        </Popup>
      )}
    </>
  );
}
