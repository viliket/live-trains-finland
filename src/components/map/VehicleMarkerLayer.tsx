import { useEffect, useRef, useState } from 'react';

import { Button, useTheme } from '@mui/material';
import { along, distance, lineString } from '@turf/turf';
import { format } from 'date-fns';
import { MapStyleImageMissingEvent } from 'maplibre-gl';
import { CrosshairsGps } from 'mdi-material-ui';
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
import { VehicleDetails } from '../../types/vehicles';
import {
  getVehicleMarkerIconImage,
  getVehiclesGeoJsonData,
} from '../../utils/map';
import CustomOverlay from './CustomOverlay';

type VehicleMarkerLayerProps = {
  onVehicleMarkerClick: (id: number) => void;
  selectedVehicleId: number | null;
};

export default function VehicleMarkerLayer({
  onVehicleMarkerClick,
  selectedVehicleId,
}: VehicleMarkerLayerProps) {
  const { current: map } = useMap();
  const [vehicleIdForPopup, setVehicleIdForPopup] = useState<number | null>(
    null
  );
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [vehiclesOnMap, setVehiclesOnMap] = useState<
    Record<number, VehicleDetails>
  >({});
  const vehiclesOnMapRef = useRef(vehiclesOnMap);
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const selectedVehicle = selectedVehicleId
    ? vehiclesOnMap[selectedVehicleId]
    : null;

  const selectedVehicleForPopup = vehicleIdForPopup
    ? vehiclesOnMap[vehicleIdForPopup]
    : null;

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
      const vehicle = vehiclesOnMap[selectedVehicleId];
      if (!vehicle) return;
      map.flyTo(
        {
          center: [vehicle.lng, vehicle.lat],
          animate: true,
          duration: 1000,
          // When popup is open, offset the y location by the popup height
          offset: vehicleIdForPopup ? [0, 40] : [0, 0],
        },
        { triggerSource: 'flyTo' }
      );
    }
  }, 500);

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
    // TODO: Improve vehicle marker animation logic
    const previousVehicles = vehiclesOnMapRef.current;
    const currentVehicles = { ...vehiclesVar() };
    Object.keys(currentVehicles).forEach((id) => {
      const cur = currentVehicles[Number.parseInt(id)];
      const prev = previousVehicles[Number.parseInt(id)];
      if (prev) {
        const start = [prev.lng, prev.lat];
        const end = [cur.lng, cur.lat];
        const line = lineString([start, end]);
        const d = distance(start, end, { units: 'meters' });
        const newPos = along(line, d / 100, { units: 'meters' }).geometry
          .coordinates;
        currentVehicles[Number.parseInt(id)] = {
          ...cur,
          lng: newPos[0],
          lat: newPos[1],
        };
      }
    });
    vehiclesOnMapRef.current = currentVehicles;
    setVehiclesOnMap(currentVehicles);
  });

  return (
    <>
      {selectedVehicle && (
        <CustomOverlay
          children={
            <Button
              variant="contained"
              size="small"
              color={isTracking ? 'primary' : 'inherit'}
              sx={{ minWidth: 'auto', padding: '4px' }}
              onClick={() => setIsTracking(!isTracking)}
            >
              <CrosshairsGps />
            </Button>
          }
        />
      )}
      <Source type="geojson" data={getVehiclesGeoJsonData(vehiclesOnMap)}>
        <Layer
          {...{
            id: 'vehicles',
            beforeId: 'z10',
            source: 'point',
            type: 'symbol',
            layout: {
              'icon-image': 'vehiclemarker-x-0',
              'icon-rotate': ['get', 'bearing'],
              'icon-size': 0.6,
              'icon-offset': [0, 0],
              'icon-padding': 0,
              'icon-rotation-alignment': 'map',
              'icon-allow-overlap': true,
              'icon-ignore-placement': true,
              'text-allow-overlap': false,
              'text-optional': true,
              'text-padding': 0,
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
          longitude={selectedVehicleForPopup.lng}
          latitude={selectedVehicleForPopup.lat}
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
