/**
 * The real-time details of an vehicle.
 */
export type VehicleDetails = {
  /**
   * Vehicle number that can be seen painted on the side of the vehicle,
   * often next to the front door.
   *
   * @example
   * An example vehicle number: 6306
   * For Sm4 (MT): 63xx and for Sm4 (M): 64xx
   */
  veh: number;
  position: GeoJSONPosition;
  prevPosition: GeoJSONPosition;
  /** Door status (0 if all the doors are closed, 1 if any of the doors are open). */
  drst: number | null;
  /** Speed of the vehicle, in kilometers per hour (km/h). */
  spd: number;
  /** Acceleration (m/s^2). Negative values indicate that the speed of the vehicle is decreasing. */
  acc: number;
  /** ID of the stop related to the event */
  stop: string | null;
  nextStop: string | null;
  tripId?: string;
  startTime: string;
  transport_mode: string;
  /**
   * Heading of the vehicle, in degrees (⁰) starting clockwise from geographic north.
   * Valid values are on the closed interval [0, 360].
   */
  heading: number | null;
  routeShortName: string | null;
  /** Internal journey descriptor - for trains this is the train number */
  jrn: number | null;
  /**
   * Timestamp of the latest real-time event represented as the time elapsed since
   * the beginning of the current document's lifetime.
   */
  timestamp: DOMHighResTimeStamp;
};

/**
 * A vehicle position message from digitransit (HSL) high-frequency positioning MQTT API
 */
export type VehiclePositionMessage = {
  /**
   * Vehicle number that can be seen painted on the side of the vehicle,
   * often next to the front door.
   *
   * @example
   * An example vehicle number: 6306
   */
  veh: number;
  lat: number | null;
  long: number | null;
  /** Door status (0 if all the doors are closed, 1 if any of the doors are open). */
  drst: number | null;
  /** Speed of the vehicle, in meters per second (m/s). */
  spd: number;
  /** Acceleration (m/s^2). Negative values indicate that the speed of the vehicle is decreasing. */
  acc: number;
  /** ID of the stop related to the event */
  stop: string | null;
  transport_mode: string;
  /**
   * Heading of the vehicle, in degrees (⁰) starting clockwise from geographic north.
   * Valid values are on the closed interval [0, 360].
   */
  hdg: number | null;
  /** Route number (Route short name) visible to passengers. */
  desi: string | null;
  /** Internal journey descriptor - for trains this is the train number, metros do not seem to have this at all (undefined). */
  jrn?: number | null;
};

/**
 * A position is an array of numbers. There MUST be two or more elements. The first two elements are longitude and
 * latitude, or easting and northing, precisely in that order and using decimal numbers.
 */
type GeoJSONPosition = [longitude: number, latitude: number];

type GeoJSONPoint = {
  type: 'Point';
  coordinates: GeoJSONPosition;
};

/**
 * A train location message from digitraffic (VR) high-frequency positioning MQTT API
 */
export type TrainLocationMessage = {
  /** Train number. For example, the train number of the train "IC 59" is 59. */
  trainNumber: number;
  /** Departure date of the first station of the train. May be empty in cases where the train schedule is unknown. */
  departureDate: string;
  /** Timestamp (in ISO format) when the location was read. */
  timestamp: string;
  /** Location in GeoJSON format. */
  location: GeoJSONPoint;
  /** Train speed in km/h. */
  speed: number;
};
