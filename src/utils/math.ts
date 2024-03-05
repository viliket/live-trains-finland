export function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export function toDegrees(radians: number) {
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

/**
 * Get distance in kilometers between two coordinates using equirectangular
 * distance approximation. This approximation is faster than the Haversine formula
 * used in @turf/distance.
 */
export function distanceInKm(from: GeoJSON.Position, to: GeoJSON.Position) {
  const R = 6371; // Earth radius in kilometers
  const x =
    (toRadians(to[0]) - toRadians(from[0])) *
    Math.cos(0.5 * (toRadians(to[1]) + toRadians(from[1])));
  const y = toRadians(to[1]) - toRadians(from[1]);
  const distance = R * Math.sqrt(x * x + y * y);

  return distance;
}
