import { useEffect, useMemo, useRef, useState } from 'react';

import { CollisionFilterExtension } from '@deck.gl/extensions';
import { GeoJsonLayer } from '@deck.gl/layers';
import { Box, Button, useTheme } from '@mui/material';
import { format } from 'date-fns';
import { mapValues } from 'lodash';
import { Crosshairs, CrosshairsGps } from 'mdi-material-ui';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Popup, useMap, ViewStateChangeEvent } from 'react-map-gl';

import useAnimationFrame from '../../hooks/useAnimationFrame';
import useVehicleStore from '../../hooks/useVehicleStore';
import {
  getVehicleMarkerIconImage,
  getVehiclesGeoJsonData,
} from '../../utils/map';
import { distanceInKm } from '../../utils/math';

import CustomOverlay from './CustomOverlay';
import DeckGLOverlay from './DeckGLOverlay';

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

/**
 * Maximum distance in kilometers between the vehicle's new location
 * and previous location to use interpolation to animate the position change.
 * If the distance if larger than than this threshold, the vehicle position will
 * not be interpolated but updated immediately to the new location.
 */
const maxInterpolationDistanceKm = 0.4;

export default function VehicleMarkerLayer({
  onVehicleMarkerClick,
  selectedVehicleId,
}: VehicleMarkerLayerProps) {
  const { current: map } = useMap();
  const glRef = useRef<WebGLRenderingContext>();
  const getVehicleById = useVehicleStore((state) => state.getVehicleById);
  const [vehicleIdForPopup, setVehicleIdForPopup] = useState<number | null>(
    null
  );
  const [isTracking, setIsTracking] = useState<boolean>(
    selectedVehicleId != null
  );
  const [interpolatedPositions, setInterpolatedPositions] = useState<
    Record<number, VehicleInterpolatedPosition>
  >({});
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  const iconUrl = useMemo(() => {
    return getVehicleMarkerIconImage({
      id: `vehiclemarker${theme.palette.mode}-x-0`,
      mapBearing: map?.getBearing() ?? 0,
      colorPrimary: theme.palette.secondary.main,
      colorSecondary: theme.palette.mode === 'light' ? '#eee' : '#666',
      colorShadow: theme.palette.mode === 'light' ? '#aaa' : '#000',
    });
  }, [map, theme.palette.mode, theme.palette.secondary.main]);

  useEffect(() => {
    return () => {
      if (glRef.current) {
        // Workaround for https://github.com/visgl/deck.gl/issues/1312
        const extension = glRef.current.getExtension('WEBGL_lose_context');
        if (extension) extension.loseContext();
      }
    };
  }, []);

  useEffect(() => {
    const moveStartCallback = (e: ViewStateChangeEvent) => {
      // Check if user-initiated movestart
      // User-initiated movestart has originalEvent set (e.g. TouchEvent or MouseEvent).
      if (
        (!('triggerSource' in e) && e.originalEvent) ||
        ('triggerSource' in e && e.triggerSource === 'TrainStationTimelineItem')
      ) {
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
    const vehicle = getVehicleById(selectedVehicleId);
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
      const currentVehicles = useVehicleStore.getState().vehicles;
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

          // If the distance between new position and previous position exceeds
          // the max threshold, skip interpolation by setting start position as
          // the current vehicle position. This could occur if there is a long
          // gap between the  previous MQTT message and the next message, e.g.
          // due to a temporary connection problem.
          const interpolationDistanceKm = distanceInKm(startPos, curPos);
          if (interpolationDistanceKm > maxInterpolationDistanceKm) {
            startPos = curPos;
          }
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
    ? getVehicleById(vehicleIdForPopup)
    : null;

  const vehiclesLayer = new GeoJsonLayer({
    id: 'vehicles',
    data: getVehiclesGeoJsonData(
      useVehicleStore.getState().vehicles,
      mapValues(interpolatedPositions, (p) => p.animPos)
    ),
    _subLayerProps: {
      'points-text': {
        // Use CollisionFilterExtension to hide overlapping texts.
        extensions: [new CollisionFilterExtension()],
        // Increase text size when computing collisions to provide greater spacing between visible features.
        collisionTestProps: { sizeScale: 4 },
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
    getIconSize: 60,
    getIconAngle: (d) => -d.properties?.bearing,
    getText: (d: GeoJSON.Feature) => d.properties?.vehicleNumber,
    getTextColor: [255, 255, 255],
    textFontFamily: 'sans-serif',
    getTextSize: 15,
    textFontWeight: 700,
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

  return (
    <>
      <DeckGLOverlay
        layers={[vehiclesLayer]}
        onWebGLInitialized={(gl) => (glRef.current = gl)}
      />
      {selectedVehicleId != null &&
        interpolatedPositions[selectedVehicleId] && (
          <CustomOverlay>
            <Box
              component="button"
              onClick={() => setIsTracking(!isTracking)}
              sx={[
                {
                  svg: {
                    verticalAlign: 'middle',
                    padding: '4px',
                  },
                },
                isTracking
                  ? {
                      svg: {
                        color: 'primary.main',
                      },
                    }
                  : {
                      svg: {
                        color: 'text.primary',
                      },
                    },
              ]}
            >
              {isTracking ? (
                <CrosshairsGps className="maplibregl-ctrl-icon" />
              ) : (
                <Crosshairs className="maplibregl-ctrl-icon" />
              )}
            </Box>
          </CustomOverlay>
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
              router.push(
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
