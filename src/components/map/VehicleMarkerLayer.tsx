import { useEffect, useState } from 'react';

import { makeVar, useReactiveVar } from '@apollo/client';
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

export const vehiclesOnMapVar = makeVar<Record<number, VehicleDetails>>({});

export default function VehicleMarkerLayer({
  onVehicleMarkerClick,
  selectedVehicleId,
}: VehicleMarkerLayerProps) {
  const { current: map } = useMap();
  const [vehicleIdForPopup, setVehicleIdForPopup] = useState<number | null>(
    null
  );
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const vehicles = useReactiveVar(vehiclesVar);
  const vehiclesOnMap = useReactiveVar(vehiclesOnMapVar);
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

    const rotateCallback = (e: ViewStateChangeEvent) => {
      missingImages.forEach((id) => {
        const image = getVehicleMarkerIconImage({
          id,
          mapBearing: e.viewState.bearing,
          colorPrimary: theme.palette.secondary.main,
        });
        if (image) {
          map?.updateImage(id, image);
        }
      });
    };

    if (map) {
      map.on('styleimagemissing', styleImageMissingCallback);
      map.on('rotate', rotateCallback);
    }

    return () => {
      if (map) {
        map.off('styleimagemissing', styleImageMissingCallback);
        map.off('rotate', rotateCallback);
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

  useEffect(() => {
    if (map && isTracking && selectedVehicleId) {
      const vehicle = vehicles[selectedVehicleId];
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
  }, [vehicles, map, isTracking, selectedVehicleId, vehicleIdForPopup]);

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
    const previousVehicles = vehiclesOnMapVar();
    const currentVehicles = vehiclesVar();
    const updatedVehicles: Record<number, VehicleDetails> = {};
    Object.entries(currentVehicles).forEach(([id, cur]) => {
      const prev = previousVehicles[Number.parseInt(id)];
      if (prev) {
        const start = [prev.lng, prev.lat];
        const end = [cur.lng, cur.lat];
        const line = lineString([start, end]);
        const d = distance(start, end, { units: 'meters' });
        const newPos = along(line, d / 100, { units: 'meters' });
        updatedVehicles[Number.parseInt(id)] = {
          ...cur,
          lng: newPos.geometry.coordinates[0],
          lat: newPos.geometry.coordinates[1],
        };
      } else {
        updatedVehicles[Number.parseInt(id)] = { ...cur };
      }
    });
    vehiclesOnMapVar(updatedVehicles);
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
              'icon-image': 'vehiclemarker-{vehicleNumber}-{bearing}',
              'icon-size': 0.6,
              'icon-offset': [0, 0],
              'icon-rotation-alignment': 'map',
              'icon-allow-overlap': true,
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
