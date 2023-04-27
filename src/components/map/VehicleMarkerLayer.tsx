import { useEffect, useMemo, useState } from 'react';

import { CollisionFilterExtension } from '@deck.gl/extensions/typed';
import { GeoJsonLayer } from '@deck.gl/layers/typed';
import { MapboxOverlay } from '@deck.gl/mapbox/typed';
import { Box, Button, useTheme } from '@mui/material';
import { format } from 'date-fns';
import { mapValues } from 'lodash';
import { Crosshairs, CrosshairsGps } from 'mdi-material-ui';
import { useTranslation } from 'react-i18next';
import { Popup, useMap, ViewStateChangeEvent } from 'react-map-gl';
import { useNavigate } from 'react-router-dom';

import { vehiclesVar } from '../../graphql/client';
import useAnimationFrame from '../../hooks/useAnimationFrame';
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

    let isInteracting = false;
    let mouseOrTouchStartEvent:
      | maplibregl.MapMouseEvent
      | maplibregl.MapTouchEvent
      | null = null;

    const mouseOrTouchStartCallback = (
      e: maplibregl.MapMouseEvent | maplibregl.MapTouchEvent
    ) => {
      isInteracting = true;
      mouseOrTouchStartEvent = e;
    };

    const mouseOrTouchMoveCallback = () => {
      if (isInteracting) {
        // Stop vehicle tracking if currently tracking as the user has performed drag gesture inside the map view.
        setIsTracking((isTracking) => {
          if (isTracking) {
            if (map && mouseOrTouchStartEvent) {
              // Re-dispatch original mouse down event to immediately trigger Maplibre drag panning.
              map
                .getCanvasContainer()
                .dispatchEvent(mouseOrTouchStartEvent.originalEvent);
            }
          }

          return false;
        });
        isInteracting = false;
      }
    };

    const mouseOrTouchEndCallback = () => {
      isInteracting = false;
    };

    const eventListenerMap = {
      movestart: moveStartCallback,
      mousedown: mouseOrTouchStartCallback,
      mousemove: mouseOrTouchMoveCallback,
      mouseup: mouseOrTouchEndCallback,
      touchstart: mouseOrTouchStartCallback,
      touchmove: mouseOrTouchMoveCallback,
      touchend: mouseOrTouchEndCallback,
    };

    if (map) {
      Object.entries(eventListenerMap).forEach(([type, listener]) => {
        map.on(type, listener);
      });
    }

    return () => {
      if (map) {
        Object.entries(eventListenerMap).forEach(([type, listener]) => {
          map.off(type, listener);
        });
      }
    };
  }, [map]);

  useEffect(() => {
    if (selectedVehicleId != null) {
      setIsTracking(true);
    }
  }, [selectedVehicleId]);

  if (map && isTracking && selectedVehicleId) {
    const vehicle = vehiclesVar()[selectedVehicleId];
    if (vehicle && !map.isMoving()) {
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
  }

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
    ),
    _subLayerProps: {
      'points-text': {
        // Use CollisionFilterExtension to hide overlapping texts.
        extensions: [new CollisionFilterExtension()],
        // Increase text size when computing collisions to provide greater spacing between visible features.
        collisionTestProps: { sizeScale: 3 },
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
    onHover: (info) => {
      if (map) {
        map.getCanvas().style.cursor = info.picked ? 'pointer' : '';
      }
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