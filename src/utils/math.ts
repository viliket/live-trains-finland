export function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians: number) {
  return (radians * 180) / Math.PI;
}

type LatLngLiteral = { lng: number; lat: number };

/**
 * Gets bearing between two locations in degrees
 */
export function getBearing(start: LatLngLiteral, dest: LatLngLiteral) {
  const startLat = toRadians(start.lat);
  const startLng = toRadians(start.lng);
  const destLat = toRadians(dest.lat);
  const destLng = toRadians(dest.lng);

  const y = Math.sin(destLng - startLng) * Math.cos(destLat);
  const x =
    Math.cos(startLat) * Math.sin(destLat) -
    Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
  const bearing = toDegrees(Math.atan2(y, x));
  return bearing;
}

/**
 * Convert from m/s to km/h
 */
export function toKmsPerHour(metersPerSecond: number) {
  return Math.round(metersPerSecond * 3.6);
}
