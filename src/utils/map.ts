import { VehicleDetails } from '../types/vehicles';
import { toRadians } from './math';

const canvas = document.createElement('canvas');

type VehicleMarkerIconImageProps = {
  id: string;
  mapBearing: number;
  width?: number;
  height?: number;
  colorPrimary?: string;
  colorSecondary?: string;
  colorShadow?: string;
  drawText?: boolean;
};

export const getVehicleMarkerIconImage = ({
  id,
  mapBearing,
  width = 80,
  height = 80,
  colorPrimary = '#00A651',
  colorSecondary = '#eee',
  colorShadow = '#aaa',
  drawText = false,
}: VehicleMarkerIconImageProps) => {
  // Check whether we can generate an image from this icon ID
  if (id.indexOf('vehiclemarker') !== 0) return;

  canvas.width = width;
  canvas.height = height;

  // Extract details from the icon ID
  const idDetails = id.split('-');
  const route = idDetails[1];
  const heading = idDetails[2] !== 'null' ? parseInt(idDetails[2]) : null;

  // Get rendering context
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  // Clear canvas (as we are reusing existing)
  ctx.save();
  ctx.fillStyle = '#fff';
  ctx.clearRect(0, 0, width, height);

  // Prepare for drawing
  const radius = (width / 2) * 0.6;
  ctx.translate(width / 2, height / 2);

  // Draw base (circle)
  ctx.shadowColor = colorShadow;
  ctx.shadowBlur = 5;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.lineWidth = 4;
  ctx.strokeStyle = colorSecondary;
  ctx.fillStyle = colorPrimary;
  ctx.fill('evenodd');
  ctx.stroke();

  // Draw heading angle
  if (heading != null) {
    ctx.rotate(toRadians(heading));
    ctx.beginPath();
    ctx.fillStyle = colorSecondary;
    const height = 15;
    const width = 18;
    ctx.moveTo(0, 0 - radius - height);
    ctx.lineTo(0 - width / 2, 0 - radius);
    ctx.lineTo(0 + width / 2, 0 - radius);
    ctx.closePath();
    ctx.fill('evenodd');
    ctx.rotate(toRadians(-heading));
  }

  if (drawText) {
    // Draw text (route)
    ctx.fillStyle = '#eee';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.rotate(toRadians(mapBearing));
    ctx.fillText(route, 0, 0);
  }

  ctx.restore();

  // Extract data
  return canvas.toDataURL();
};

export function getVehiclesGeoJsonData(
  vehicles: Record<number, VehicleDetails>,
  interpolatedPositions: Record<number, GeoJSON.Position>
): GeoJSON.FeatureCollection<GeoJSON.Geometry> {
  return {
    type: 'FeatureCollection',
    features: Object.entries(vehicles).map(([id, message], idx) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates:
          interpolatedPositions[Number.parseInt(id)] ?? message.position,
      },
      properties: {
        title: 'Car',
        'marker-symbol': 'car',
        idx,
        vehicleId: id,
        vehicleNumber: message.routeShortName
          ? message.routeShortName
          : message.jrn?.toString() ?? '?',
        bearing: message.heading ?? null,
      },
    })),
  };
}
