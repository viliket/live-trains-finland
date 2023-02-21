import { useEffect, useMemo, useState } from 'react';

import { CollideExtension } from '@deck.gl/extensions/typed';
import { GeoJsonLayer } from '@deck.gl/layers/typed';
import { MapboxOverlay } from '@deck.gl/mapbox/typed';
import { Box, Button, useTheme } from '@mui/material';
import { format } from 'date-fns';
import { mapValues } from 'lodash';
import { Crosshairs, CrosshairsGps } from 'mdi-material-ui';
import { useTranslation } from 'react-i18next';
import {
  MapLayerMouseEvent,
  Popup,
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

type VehicleInterpolatedPosition = {
  animStartTimestamp: number;
  startPos: GeoJSON.Position;
  animPos: GeoJSON.Position;
};

const animDurationInMs = 1000;

const deckOverlay = new MapboxOverlay({});

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
    Record<number, VehicleInterpolatedPosition>
  >({});
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const iconUrl = useMemo(() => {
    return getVehicleMarkerIconImage({
      id: `vehiclemarker${theme.palette.mode}-x-0`,
      mapBearing: map?.getBearing() ?? 0,
      colorPrimary: theme.palette.secondary.main,
      colorSecondary: theme.palette.mode === 'light' ? '#eee' : '#ccc',
      colorShadow: theme.palette.mode === 'light' ? '#aaa' : '#aaa',
    });
  }, [map, theme.palette.mode, theme.palette.secondary.main]);

  useEffect(() => {
    if (map) {
      map.addControl(deckOverlay);
    }

    return () => {
      if (map) {
        map.removeControl(deckOverlay);
      }
    };
  }, [map]);

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

  useAnimationFrame(() => {
    setInterpolatedPositions((prevPositions) => {
      const currentVehicles = vehiclesVar();
      const nextPositions: Record<number, VehicleInterpolatedPosition> = {};
      Object.keys(currentVehicles).forEach((idString) => {
        const id = Number.parseInt(idString);
        const vehicle = currentVehicles[id];
        const curPos = vehicle.position;
        const vehiclePrevInterpolatedPos = prevPositions[id];
        let startPos =
          vehiclePrevInterpolatedPos?.startPos ?? vehicle.prevPosition;
        if (
          vehiclePrevInterpolatedPos &&
          vehicle.timestamp > vehiclePrevInterpolatedPos.animStartTimestamp
        ) {
          // Vehicle has received new position from MQTT, set previous position to latest interpolated position
          startPos = vehiclePrevInterpolatedPos.animPos;
        }

        const elapsedTime = performance.now() - vehicle.timestamp;
        let progress = elapsedTime / animDurationInMs;
        if (progress > 1) progress = 1;
        if (progress < 0) progress = 0;

        nextPositions[id] = {
          animStartTimestamp: vehicle.timestamp,
          startPos,
          animPos: [
            startPos[0] + (curPos[0] - startPos[0]) * progress,
            startPos[1] + (curPos[1] - startPos[1]) * progress,
          ],
        };
      });
      return nextPositions;
    });
  });

  const selectedVehicleForPopup = vehicleIdForPopup
    ? vehiclesVar()[vehicleIdForPopup]
    : null;

  const vehiclesLayer = new GeoJsonLayer({
    id: 'vehicles',
    data: getVehiclesGeoJsonData(
      vehiclesVar(),
      mapValues(interpolatedPositions, (p) => p.animPos)
    ) as any, // Correct type does not work - see https://github.com/visgl/deck.gl/issues/7571
    _subLayerProps: {
      'points-text': {
        // Use CollideExtension to hide overlapping texts.
        extensions: [new CollideExtension()],
        // Increase text size when computing collisions to provide greater spacing between visible features.
        collideTestProps: { sizeScale: 3 },
      },
    },
    pointType: 'icon+text',
    getIcon: () => ({
      url: iconUrl,
      width: 80,
      height: 80,
      anchorY: 40,
      anchorX: 40,
    }),
    // Disable billboarding so that our marker icon facing is not affected by map bearing
    iconBillboard: false,
    parameters: {
      // Disable depth test from this layer to avoid z-fighting issues
      depthTest: false,
    },
    getIconSize: 50,
    getIconAngle: (d) => -d.properties?.bearing,
    getText: (d: GeoJSON.Feature) => d.properties?.vehicleNumber,
    getTextColor: [255, 255, 255],
    textFontFamily: 'sans-serif',
    getTextSize: 15,
    pickable: true,
    onClick: (info) => {
      const id = info.object.properties!.vehicleId;
      setVehicleIdForPopup(id);
      onVehicleMarkerClick(Number.parseInt(id, 10));
    },
  });

  deckOverlay.setProps({
    layers: [vehiclesLayer],
  });

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
      {selectedVehicleForPopup && map && (
        <Popup
          anchor="bottom"
          longitude={
            interpolatedPositions[selectedVehicleForPopup.veh].animPos[0] ??
            selectedVehicleForPopup.position[0]
          }
          latitude={
            interpolatedPositions[selectedVehicleForPopup.veh].animPos[1] ??
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
