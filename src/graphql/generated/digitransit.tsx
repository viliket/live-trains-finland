/* eslint-disable */
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Long: any;
  Polyline: any;
};

/** A public transport agency */
export type Agency = Node & {
  __typename?: 'Agency';
  /** List of alerts which have an effect on all operations of the agency (e.g. a strike) */
  alerts?: Maybe<Array<Maybe<Alert>>>;
  /** URL to a web page which has information of fares used by this agency */
  fareUrl?: Maybe<Scalars['String']>;
  /** Agency feed and id */
  gtfsId: Scalars['String'];
  /** Global object ID provided by Relay. This value can be used to refetch this object using **node** query. */
  id: Scalars['ID'];
  lang?: Maybe<Scalars['String']>;
  /** Name of the agency */
  name: Scalars['String'];
  /** Phone number which customers can use to contact this agency */
  phone?: Maybe<Scalars['String']>;
  /** List of routes operated by this agency */
  routes?: Maybe<Array<Maybe<Route>>>;
  /** ID of the time zone which this agency operates on */
  timezone: Scalars['String'];
  /** URL to the home page of the agency */
  url: Scalars['String'];
};

/** Alert of a current or upcoming disruption in public transportation */
export type Alert = Node & {
  __typename?: 'Alert';
  /** Agency affected by the disruption. Note that this value is present only if the disruption has an effect on all operations of the agency (e.g. in case of a strike). */
  agency?: Maybe<Agency>;
  /** Alert cause */
  alertCause?: Maybe<AlertCauseType>;
  /** Long description of the alert */
  alertDescriptionText: Scalars['String'];
  /** Long descriptions of the alert in all different available languages */
  alertDescriptionTextTranslations: Array<TranslatedString>;
  /** Alert effect */
  alertEffect?: Maybe<AlertEffectType>;
  /** hashcode from the original GTFS-RT alert */
  alertHash?: Maybe<Scalars['Int']>;
  /** Header of the alert, if available */
  alertHeaderText?: Maybe<Scalars['String']>;
  /** Header of the alert in all different available languages */
  alertHeaderTextTranslations: Array<TranslatedString>;
  /** Alert severity level */
  alertSeverityLevel?: Maybe<AlertSeverityLevelType>;
  /** Url with more information */
  alertUrl?: Maybe<Scalars['String']>;
  /** Url with more information in all different available languages */
  alertUrlTranslations: Array<TranslatedString>;
  /** Time when this alert is not in effect anymore. Format: Unix timestamp in seconds */
  effectiveEndDate?: Maybe<Scalars['Long']>;
  /** Time when this alert comes into effect. Format: Unix timestamp in seconds */
  effectiveStartDate?: Maybe<Scalars['Long']>;
  /** The feed in which this alert was published */
  feed?: Maybe<Scalars['String']>;
  /** Global object ID provided by Relay. This value can be used to refetch this object using **node** query. */
  id: Scalars['ID'];
  /** Patterns affected by the disruption */
  patterns?: Maybe<Array<Maybe<Pattern>>>;
  /** Route affected by the disruption */
  route?: Maybe<Route>;
  /** Stop affected by the disruption */
  stop?: Maybe<Stop>;
  /** Trip affected by the disruption */
  trip?: Maybe<Trip>;
};

/** Cause of a alert */
export enum AlertCauseType {
  /** ACCIDENT */
  Accident = 'ACCIDENT',
  /** CONSTRUCTION */
  Construction = 'CONSTRUCTION',
  /** DEMONSTRATION */
  Demonstration = 'DEMONSTRATION',
  /** HOLIDAY */
  Holiday = 'HOLIDAY',
  /** MAINTENANCE */
  Maintenance = 'MAINTENANCE',
  /** MEDICAL_EMERGENCY */
  MedicalEmergency = 'MEDICAL_EMERGENCY',
  /** OTHER_CAUSE */
  OtherCause = 'OTHER_CAUSE',
  /** POLICE_ACTIVITY */
  PoliceActivity = 'POLICE_ACTIVITY',
  /** STRIKE */
  Strike = 'STRIKE',
  /** TECHNICAL_PROBLEM */
  TechnicalProblem = 'TECHNICAL_PROBLEM',
  /** UNKNOWN_CAUSE */
  UnknownCause = 'UNKNOWN_CAUSE',
  /** WEATHER */
  Weather = 'WEATHER'
}

/** Effect of a alert */
export enum AlertEffectType {
  /** ADDITIONAL_SERVICE */
  AdditionalService = 'ADDITIONAL_SERVICE',
  /** DETOUR */
  Detour = 'DETOUR',
  /** MODIFIED_SERVICE */
  ModifiedService = 'MODIFIED_SERVICE',
  /** NO_EFFECT */
  NoEffect = 'NO_EFFECT',
  /** NO_SERVICE */
  NoService = 'NO_SERVICE',
  /** OTHER_EFFECT */
  OtherEffect = 'OTHER_EFFECT',
  /** REDUCED_SERVICE */
  ReducedService = 'REDUCED_SERVICE',
  /** SIGNIFICANT_DELAYS */
  SignificantDelays = 'SIGNIFICANT_DELAYS',
  /** STOP_MOVED */
  StopMoved = 'STOP_MOVED',
  /** UNKNOWN_EFFECT */
  UnknownEffect = 'UNKNOWN_EFFECT'
}

/** Severity level of a alert */
export enum AlertSeverityLevelType {
  /** Info alerts are used for informational messages that should not have a significant effect on user's journey, for example: A single entrance to a metro station is temporarily closed. */
  Info = 'INFO',
  /** Severe alerts are used when a significant part of public transport services is affected, for example: All train services are cancelled due to technical problems. */
  Severe = 'SEVERE',
  /** Severity of alert is unknown */
  UnknownSeverity = 'UNKNOWN_SEVERITY',
  /** Warning alerts are used when a single stop or route has a disruption that can affect user's journey, for example: All trams on a specific route are running with irregular schedules. */
  Warning = 'WARNING'
}

/** Bike park represents a location where bicycles can be parked. */
export type BikePark = Node & PlaceInterface & {
  __typename?: 'BikePark';
  /** ID of the bike park */
  bikeParkId?: Maybe<Scalars['String']>;
  /** Global object ID provided by Relay. This value can be used to refetch this object using **node** query. */
  id: Scalars['ID'];
  /** Latitude of the bike park (WGS 84) */
  lat?: Maybe<Scalars['Float']>;
  /** Longitude of the bike park (WGS 84) */
  lon?: Maybe<Scalars['Float']>;
  /** Name of the bike park */
  name: Scalars['String'];
  /** Opening hours for the selected dates using the local time of the park. Each date can have multiple time spans. */
  openingHours?: Maybe<Array<Maybe<LocalTimeSpanDate>>>;
  /** If true, value of `spacesAvailable` is updated from a real-time source. */
  realtime?: Maybe<Scalars['Boolean']>;
  /** Number of spaces available for bikes */
  spacesAvailable?: Maybe<Scalars['Int']>;
  /** Additional information labels (tags) for the Bike park */
  tags?: Maybe<Array<Maybe<Scalars['String']>>>;
};


/** Bike park represents a location where bicycles can be parked. */
export type BikeParkOpeningHoursArgs = {
  dates: Array<Scalars['String']>;
};

/** Bike rental station represents a location where users can rent bicycles for a fee. */
export type BikeRentalStation = Node & PlaceInterface & {
  __typename?: 'BikeRentalStation';
  /** If true, bikes can be returned to this station. */
  allowDropoff?: Maybe<Scalars['Boolean']>;
  /** If true, bikes can be returned even if spacesAvailable is zero or bikes > capacity. */
  allowOverloading?: Maybe<Scalars['Boolean']>;
  /** Number of bikes currently available on the rental station. */
  bikesAvailable?: Maybe<Scalars['Int']>;
  /** Nominal capacity (number of racks) of the rental station. */
  capacity?: Maybe<Scalars['Int']>;
  /** Global object ID provided by Relay. This value can be used to refetch this object using **node** query. */
  id: Scalars['ID'];
  /** If true, this is a car rental system station. */
  isCarStation?: Maybe<Scalars['Boolean']>;
  /** If true, this is a free floating bike. */
  isFloatingBike?: Maybe<Scalars['Boolean']>;
  /** Latitude of the bike rental station (WGS 84) */
  lat?: Maybe<Scalars['Float']>;
  /** Longitude of the bike rental station (WGS 84) */
  lon?: Maybe<Scalars['Float']>;
  /** Name of the bike rental station */
  name: Scalars['String'];
  networks?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** If true, values of `bikesAvailable` and `spacesAvailable` are updated from a real-time source. If false, values of `bikesAvailable` and `spacesAvailable` are always the total capacity divided by two. */
  realtime?: Maybe<Scalars['Boolean']>;
  /**
   * Number of free spaces currently available on the rental station.
   *  Note that this value being 0 does not necessarily indicate that bikes cannot be returned to this station, as it might be possible to leave the bike in the vicinity of the rental station, even if the bike racks don't have any spaces available (see field `allowDropoff`).
   */
  spacesAvailable?: Maybe<Scalars['Int']>;
  /** A description of the current state of this bike rental station, e.g. "Station on" */
  state?: Maybe<Scalars['String']>;
  /** ID of the bike rental station */
  stationId?: Maybe<Scalars['String']>;
};

export enum BikesAllowed {
  /** The vehicle being used on this particular trip can accommodate at least one bicycle. */
  Allowed = 'ALLOWED',
  /** No bicycles are allowed on this trip. */
  NotAllowed = 'NOT_ALLOWED',
  /** There is no bike information for the trip. */
  NoInformation = 'NO_INFORMATION'
}

/** Car park represents a location where cars can be parked. */
export type CarPark = Node & PlaceInterface & {
  __typename?: 'CarPark';
  /** ID of the car park */
  carParkId?: Maybe<Scalars['String']>;
  /** Global object ID provided by Relay. This value can be used to refetch this object using **node** query. */
  id: Scalars['ID'];
  /** Latitude of the car park (WGS 84) */
  lat?: Maybe<Scalars['Float']>;
  /** Longitude of the car park (WGS 84) */
  lon?: Maybe<Scalars['Float']>;
  /** Number of parking spaces at the car park */
  maxCapacity?: Maybe<Scalars['Int']>;
  /** Name of the car park */
  name: Scalars['String'];
  /** Opening hours for the selected dates using the local time of the park. Each date can have multiple time spans. */
  openingHours?: Maybe<Array<Maybe<LocalTimeSpanDate>>>;
  /** If true, value of `spacesAvailable` is updated from a real-time source. */
  realtime?: Maybe<Scalars['Boolean']>;
  /** Number of currently available parking spaces at the car park */
  spacesAvailable?: Maybe<Scalars['Int']>;
  /** Additional information labels (tags) for the car park */
  tags?: Maybe<Array<Maybe<Scalars['String']>>>;
};


/** Car park represents a location where cars can be parked. */
export type CarParkOpeningHoursArgs = {
  dates: Array<Scalars['String']>;
};

/** Cluster is a list of stops grouped by name and proximity */
export type Cluster = Node & {
  __typename?: 'Cluster';
  /** ID of the cluster */
  gtfsId: Scalars['String'];
  /** Global object ID provided by Relay. This value can be used to refetch this object using **node** query. */
  id: Scalars['ID'];
  /** Latitude of the center of this cluster (i.e. average latitude of stops in this cluster) */
  lat: Scalars['Float'];
  /** Longitude of the center of this cluster (i.e. average longitude of stops in this cluster) */
  lon: Scalars['Float'];
  /** Name of the cluster */
  name: Scalars['String'];
  /** List of stops in the cluster */
  stops?: Maybe<Array<Stop>>;
};

export type Coordinates = {
  __typename?: 'Coordinates';
  /** Latitude (WGS 84) */
  lat?: Maybe<Scalars['Float']>;
  /** Longitude (WGS 84) */
  lon?: Maybe<Scalars['Float']>;
};

/** Departure row is a location, which lists departures of a certain pattern from a stop. Departure rows are identified with the pattern, so querying departure rows will return only departures from one stop per pattern */
export type DepartureRow = Node & PlaceInterface & {
  __typename?: 'DepartureRow';
  /** Global object ID provided by Relay. This value can be used to refetch this object using **node** query. */
  id: Scalars['ID'];
  /** Latitude of the stop (WGS 84) */
  lat?: Maybe<Scalars['Float']>;
  /** Longitude of the stop (WGS 84) */
  lon?: Maybe<Scalars['Float']>;
  /** Pattern of the departure row */
  pattern?: Maybe<Pattern>;
  /** Stop from which the departures leave */
  stop?: Maybe<Stop>;
  /** Departures of the pattern from the stop */
  stoptimes?: Maybe<Array<Maybe<Stoptime>>>;
};


/** Departure row is a location, which lists departures of a certain pattern from a stop. Departure rows are identified with the pattern, so querying departure rows will return only departures from one stop per pattern */
export type DepartureRowStoptimesArgs = {
  numberOfDepartures?: InputMaybe<Scalars['Int']>;
  omitCanceled?: InputMaybe<Scalars['Boolean']>;
  omitNonPickups?: InputMaybe<Scalars['Boolean']>;
  startTime?: InputMaybe<Scalars['Long']>;
  timeRange?: InputMaybe<Scalars['Int']>;
};

/** A feed provides routing data (stops, routes, timetables, etc.) from one or more public transport agencies. */
export type Feed = {
  __typename?: 'Feed';
  /** List of agencies which provide data to this feed */
  agencies?: Maybe<Array<Maybe<Agency>>>;
  /** ID of the feed */
  feedId: Scalars['String'];
};

export enum FilterPlaceType {
  /** Bicycle rent stations */
  BicycleRent = 'BICYCLE_RENT',
  /** Bike parks */
  BikePark = 'BIKE_PARK',
  /** Car parks */
  CarPark = 'CAR_PARK',
  /** Departure rows */
  DepartureRow = 'DEPARTURE_ROW',
  /** Stops */
  Stop = 'STOP'
}

export type Geometry = {
  __typename?: 'Geometry';
  /** The number of points in the string */
  length?: Maybe<Scalars['Int']>;
  /** List of coordinates of in a Google encoded polyline format (see https://developers.google.com/maps/documentation/utilities/polylinealgorithm) */
  points?: Maybe<Scalars['Polyline']>;
};

export type InputBanned = {
  /** A comma-separated list of banned agency ids */
  agencies?: InputMaybe<Scalars['String']>;
  /** A comma-separated list of banned route ids */
  routes?: InputMaybe<Scalars['String']>;
  /** A comma-separated list of banned stop ids. Note that these stops are only banned for boarding and disembarking vehicles — it is possible to get an itinerary where a vehicle stops at one of these stops */
  stops?: InputMaybe<Scalars['String']>;
  /** A comma-separated list of banned stop ids. Only itineraries where these stops are not travelled through are returned, e.g. if a bus route stops at one of these stops, that route will not be used in the itinerary, even if the stop is not used for boarding or disembarking the vehicle.  */
  stopsHard?: InputMaybe<Scalars['String']>;
  /** A comma-separated list of banned trip ids */
  trips?: InputMaybe<Scalars['String']>;
};

export type InputCoordinates = {
  /** The name of the place. If specified, the place name in results uses this value instead of `"Origin"` or `"Destination"` */
  address?: InputMaybe<Scalars['String']>;
  /** Latitude of the place (WGS 84) */
  lat: Scalars['Float'];
  /** The amount of time, in seconds, to spend at this location before venturing forth. */
  locationSlack?: InputMaybe<Scalars['Int']>;
  /** Longitude of the place (WGS 84) */
  lon: Scalars['Float'];
};

export type InputFilters = {
  /** Bike parks to include by id. */
  bikeParks?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Bike rentals to include by id. */
  bikeRentalStations?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Car parks to include by id. */
  carParks?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Routes to include by GTFS id. */
  routes?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Stops to include by GTFS id. */
  stops?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type InputModeWeight = {
  /** The weight of AIRPLANE traverse mode. Values over 1 add cost to airplane travel and values under 1 decrease cost */
  AIRPLANE?: InputMaybe<Scalars['Float']>;
  /** The weight of BUS traverse mode. Values over 1 add cost to bus travel and values under 1 decrease cost */
  BUS?: InputMaybe<Scalars['Float']>;
  /** The weight of CABLE_CAR traverse mode. Values over 1 add cost to cable car travel and values under 1 decrease cost */
  CABLE_CAR?: InputMaybe<Scalars['Float']>;
  /** The weight of FERRY traverse mode. Values over 1 add cost to ferry travel and values under 1 decrease cost */
  FERRY?: InputMaybe<Scalars['Float']>;
  /** The weight of FUNICULAR traverse mode. Values over 1 add cost to funicular travel and values under 1 decrease cost */
  FUNICULAR?: InputMaybe<Scalars['Float']>;
  /** The weight of GONDOLA traverse mode. Values over 1 add cost to gondola travel and values under 1 decrease cost */
  GONDOLA?: InputMaybe<Scalars['Float']>;
  /** The weight of RAIL traverse mode. Values over 1 add cost to rail travel and values under 1 decrease cost */
  RAIL?: InputMaybe<Scalars['Float']>;
  /** The weight of SUBWAY traverse mode. Values over 1 add cost to subway travel and values under 1 decrease cost */
  SUBWAY?: InputMaybe<Scalars['Float']>;
  /** The weight of TRAM traverse mode. Values over 1 add cost to tram travel and values under 1 decrease cost */
  TRAM?: InputMaybe<Scalars['Float']>;
};

export type InputPreferred = {
  /** A comma-separated list of ids of the agencies preferred by the user. */
  agencies?: InputMaybe<Scalars['String']>;
  /** Penalty added for using every route that is not preferred if user set any route as preferred. We return number of seconds that we are willing to wait for preferred route. */
  otherThanPreferredRoutesPenalty?: InputMaybe<Scalars['Int']>;
  /** A comma-separated list of ids of the routes preferred by the user. */
  routes?: InputMaybe<Scalars['String']>;
};

/**
 * Relative importances of optimization factors. Only effective for bicycling legs.
 *  Invariant: `timeFactor + slopeFactor + safetyFactor == 1`
 */
export type InputTriangle = {
  /** Relative importance of safety */
  safetyFactor?: InputMaybe<Scalars['Float']>;
  /** Relative importance of flat terrain */
  slopeFactor?: InputMaybe<Scalars['Float']>;
  /** Relative importance of duration */
  timeFactor?: InputMaybe<Scalars['Float']>;
};

export type InputUnpreferred = {
  /** A comma-separated list of ids of the agencies unpreferred by the user. */
  agencies?: InputMaybe<Scalars['String']>;
  /** A comma-separated list of ids of the routes unpreferred by the user. */
  routes?: InputMaybe<Scalars['String']>;
  /** Penalty added for using route that is unpreferred, i.e. number of seconds that we are willing to wait for route that is unpreferred. */
  useUnpreferredRoutesPenalty?: InputMaybe<Scalars['Int']>;
};

export type Itinerary = {
  __typename?: 'Itinerary';
  /** Duration of the trip on this itinerary, in seconds. */
  duration?: Maybe<Scalars['Long']>;
  /** How much elevation is gained, in total, over the course of the itinerary, in meters. */
  elevationGained?: Maybe<Scalars['Float']>;
  /** How much elevation is lost, in total, over the course of the itinerary, in meters. */
  elevationLost?: Maybe<Scalars['Float']>;
  /** Time when the user arrives to the destination.. Format: Unix timestamp in milliseconds. */
  endTime?: Maybe<Scalars['Long']>;
  /** Information about the fares for this itinerary */
  fares?: Maybe<Array<Maybe<Fare>>>;
  /** A list of Legs. Each Leg is either a walking (cycling, car) portion of the itinerary, or a transit leg on a particular vehicle. So a itinerary where the user walks to the Q train, transfers to the 6, then walks to their destination, has four legs. */
  legs: Array<Maybe<Leg>>;
  /** Time when the user leaves from the origin. Format: Unix timestamp in milliseconds. */
  startTime?: Maybe<Scalars['Long']>;
  /** How much time is spent waiting for transit to arrive, in seconds. */
  waitingTime?: Maybe<Scalars['Long']>;
  /** How far the user has to walk, in meters. */
  walkDistance?: Maybe<Scalars['Float']>;
  /** How much time is spent walking, in seconds. */
  walkTime?: Maybe<Scalars['Long']>;
};

export type Leg = {
  __typename?: 'Leg';
  /** For transit legs, the transit agency that operates the service used for this leg. For non-transit legs, `null`. */
  agency?: Maybe<Agency>;
  /** For transit leg, the offset from the scheduled arrival time of the alighting stop in this leg, i.e. scheduled time of arrival at alighting stop = `endTime - arrivalDelay` */
  arrivalDelay?: Maybe<Scalars['Int']>;
  /** For transit leg, the offset from the scheduled departure time of the boarding stop in this leg, i.e. scheduled time of departure at boarding stop = `startTime - departureDelay` */
  departureDelay?: Maybe<Scalars['Int']>;
  /** The distance traveled while traversing the leg in meters. */
  distance?: Maybe<Scalars['Float']>;
  /** The leg's duration in seconds */
  duration?: Maybe<Scalars['Float']>;
  /** The date and time when this leg ends. Format: Unix timestamp in milliseconds. */
  endTime?: Maybe<Scalars['Long']>;
  /** The Place where the leg originates. */
  from: Place;
  /** Interlines with previous leg. This is true when the same vehicle is used for the previous leg as for this leg and passenger can stay inside the vehicle. */
  interlineWithPreviousLeg?: Maybe<Scalars['Boolean']>;
  /** Whether the destination of this leg (field `to`) is one of the intermediate places specified in the query. */
  intermediatePlace?: Maybe<Scalars['Boolean']>;
  /** For transit legs, intermediate stops between the Place where the leg originates and the Place where the leg ends. For non-transit legs, null. Returns Place type, which has fields for e.g. departure and arrival times */
  intermediatePlaces?: Maybe<Array<Maybe<Place>>>;
  /** For transit legs, intermediate stops between the Place where the leg originates and the Place where the leg ends. For non-transit legs, null. */
  intermediateStops?: Maybe<Array<Maybe<Stop>>>;
  /** The leg's geometry. */
  legGeometry?: Maybe<Geometry>;
  /** The mode (e.g. `WALK`) used when traversing this leg. */
  mode?: Maybe<Mode>;
  /** Whether there is real-time data about this Leg */
  realTime?: Maybe<Scalars['Boolean']>;
  /** State of real-time data */
  realtimeState?: Maybe<RealtimeState>;
  /** Whether this leg is traversed with a rented bike. */
  rentedBike?: Maybe<Scalars['Boolean']>;
  /** For transit legs, the route that is used for traversing the leg. For non-transit legs, `null`. */
  route?: Maybe<Route>;
  /** For transit legs, the service date of the trip. Format: YYYYMMDD. For non-transit legs, null. */
  serviceDate?: Maybe<Scalars['String']>;
  /** The date and time when this leg begins. Format: Unix timestamp in milliseconds. */
  startTime?: Maybe<Scalars['Long']>;
  steps?: Maybe<Array<Maybe<Step>>>;
  /** The Place where the leg ends. */
  to: Place;
  /** Whether this leg is a transit leg or not. */
  transitLeg?: Maybe<Scalars['Boolean']>;
  /** For transit legs, the trip that is used for traversing the leg. For non-transit legs, `null`. */
  trip?: Maybe<Trip>;
};

/** A span of time. */
export type LocalTimeSpan = {
  __typename?: 'LocalTimeSpan';
  /** The start of the time timespan as seconds from midnight. */
  from: Scalars['Int'];
  /** The end of the timespan as seconds from midnight. */
  to: Scalars['Int'];
};

/** A date using the local timezone of the object that can contain timespans. */
export type LocalTimeSpanDate = {
  __typename?: 'LocalTimeSpanDate';
  /** The date of this time span. Format: YYYYMMDD. */
  date: Scalars['String'];
  /** The time spans for this date. */
  timeSpans?: Maybe<Array<Maybe<LocalTimeSpan>>>;
};

/** Identifies whether this stop represents a stop or station. */
export enum LocationType {
  Entrance = 'ENTRANCE',
  /** A physical structure or area that contains one or more stop. */
  Station = 'STATION',
  /** A location where passengers board or disembark from a transit vehicle. */
  Stop = 'STOP'
}

export enum Mode {
  /** AIRPLANE */
  Airplane = 'AIRPLANE',
  /** BICYCLE */
  Bicycle = 'BICYCLE',
  /** BUS */
  Bus = 'BUS',
  /** CABLE_CAR */
  CableCar = 'CABLE_CAR',
  /** CAR */
  Car = 'CAR',
  /** FERRY */
  Ferry = 'FERRY',
  /** FUNICULAR */
  Funicular = 'FUNICULAR',
  /** GONDOLA */
  Gondola = 'GONDOLA',
  /** Only used internally. No use for API users. */
  LegSwitch = 'LEG_SWITCH',
  /** RAIL */
  Rail = 'RAIL',
  /** SUBWAY */
  Subway = 'SUBWAY',
  /** TRAM */
  Tram = 'TRAM',
  /** A special transport mode, which includes all public transport. */
  Transit = 'TRANSIT',
  /** WALK */
  Walk = 'WALK'
}

/** An object with an ID */
export type Node = {
  /** The ID of an object */
  id: Scalars['ID'];
};

/** Optimization type for bicycling legs */
export enum OptimizeType {
  /** Prefer flat terrain */
  Flat = 'FLAT',
  /** GREENWAYS */
  Greenways = 'GREENWAYS',
  /** Prefer faster routes */
  Quick = 'QUICK',
  /** Prefer safer routes, i.e. avoid crossing streets and use bike paths when possible */
  Safe = 'SAFE',
  /** Deprecated, use argument `transferPenalty` to optimize for less transfers. */
  Transfers = 'TRANSFERS',
  /** **TRIANGLE** optimization type can be used to set relative preferences of optimization factors. See argument `triangle`. */
  Triangle = 'TRIANGLE'
}

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
};

/** Pattern is sequence of stops used by trips on a specific direction and variant of a route. Most routes have only two patterns: one for outbound trips and one for inbound trips */
export type Pattern = Node & {
  __typename?: 'Pattern';
  /** List of alerts which have an effect on trips of the pattern */
  alerts?: Maybe<Array<Maybe<Alert>>>;
  /** ID of the pattern */
  code: Scalars['String'];
  /**
   * Direction of the pattern. Possible values: 0, 1 or -1.
   *  -1 indicates that the direction is irrelevant, i.e. the route has patterns only in one direction.
   */
  directionId?: Maybe<Scalars['Int']>;
  geometry?: Maybe<Array<Maybe<Coordinates>>>;
  /** Vehicle headsign used by trips of this pattern */
  headsign?: Maybe<Scalars['String']>;
  /** Global object ID provided by Relay. This value can be used to refetch this object using **node** query. */
  id: Scalars['ID'];
  /** Name of the pattern. Pattern name can be just the name of the route or it can include details of destination and origin stops. */
  name?: Maybe<Scalars['String']>;
  /** Coordinates of the route of this pattern in Google polyline encoded format */
  patternGeometry?: Maybe<Geometry>;
  /** The route this pattern runs on */
  route: Route;
  /** Hash code of the pattern. This value is stable and not dependent on the pattern id, i.e. this value can be used to check whether two patterns are the same, even if their ids have changed. */
  semanticHash?: Maybe<Scalars['String']>;
  /** List of stops served by this pattern */
  stops?: Maybe<Array<Stop>>;
  /** Trips which run on this pattern */
  trips?: Maybe<Array<Trip>>;
  /** Trips which run on this pattern on the specified date */
  tripsForDate?: Maybe<Array<Trip>>;
};


/** Pattern is sequence of stops used by trips on a specific direction and variant of a route. Most routes have only two patterns: one for outbound trips and one for inbound trips */
export type PatternTripsForDateArgs = {
  serviceDate?: InputMaybe<Scalars['String']>;
  serviceDay?: InputMaybe<Scalars['String']>;
};

export enum PickupDropoffType {
  /** Must phone agency to arrange pickup / drop off. */
  CallAgency = 'CALL_AGENCY',
  /** Must coordinate with driver to arrange pickup / drop off. */
  CoordinateWithDriver = 'COORDINATE_WITH_DRIVER',
  /** No pickup / drop off available. */
  None = 'NONE',
  /** Regularly scheduled pickup / drop off. */
  Scheduled = 'SCHEDULED'
}

export type Place = {
  __typename?: 'Place';
  /** The time the rider will arrive at the place. Format: Unix timestamp in milliseconds. */
  arrivalTime: Scalars['Long'];
  /** The bike parking related to the place */
  bikePark?: Maybe<BikePark>;
  /** The bike rental station related to the place */
  bikeRentalStation?: Maybe<BikeRentalStation>;
  /** The car parking related to the place */
  carPark?: Maybe<CarPark>;
  /** The time the rider will depart the place. Format: Unix timestamp in milliseconds. */
  departureTime: Scalars['Long'];
  /** Latitude of the place (WGS 84) */
  lat: Scalars['Float'];
  /** Longitude of the place (WGS 84) */
  lon: Scalars['Float'];
  /** For transit stops, the name of the stop. For points of interest, the name of the POI. */
  name?: Maybe<Scalars['String']>;
  /** The stop related to the place. */
  stop?: Maybe<Stop>;
  /** For transit stops, the sequence number of the stop. */
  stopSequence?: Maybe<Scalars['Int']>;
  /** Type of vertex. (Normal, Bike sharing station, Bike P+R, Transit stop) Mostly used for better localization of bike sharing and P+R station names */
  vertexType?: Maybe<VertexType>;
};

/** Interface for places, e.g. stops, stations, parking areas.. */
export type PlaceInterface = {
  id: Scalars['ID'];
  /** Latitude of the place (WGS 84) */
  lat?: Maybe<Scalars['Float']>;
  /** Longitude of the place (WGS 84) */
  lon?: Maybe<Scalars['Float']>;
};

export type Plan = {
  __typename?: 'Plan';
  /** The time and date of travel. Format: Unix timestamp in milliseconds. */
  date?: Maybe<Scalars['Long']>;
  /** Information about the timings for the plan generation */
  debugOutput: DebugOutput;
  /** The origin */
  from: Place;
  /** A list of possible itineraries */
  itineraries: Array<Maybe<Itinerary>>;
  /** A list of possible error messages as enum */
  messageEnums: Array<Maybe<Scalars['String']>>;
  /** A list of possible error messages in cleartext */
  messageStrings: Array<Maybe<Scalars['String']>>;
  /** The destination */
  to: Place;
};

/**
 * Additional qualifier for a transport mode.
 *  Note that qualifiers can only be used with certain transport modes.
 */
export enum Qualifier {
  /**
   * ~~HAVE~~
   *  **Currently not used**
   */
  Have = 'HAVE',
  /**
   * ~~KEEP~~
   *  **Currently not used**
   */
  Keep = 'KEEP',
  /**
   * The vehicle used must be left to a parking area before continuing the journey. This qualifier is usable with transport modes `CAR` and `BICYCLE`.
   *  Note that the vehicle is only parked if the journey is continued with public transportation (e.g. if only `CAR` and `WALK` transport modes are allowed to be used, the car will not be parked as it is used for the whole journey).
   */
  Park = 'PARK',
  /** The user can be picked up by someone else riding a vehicle */
  Pickup = 'PICKUP',
  /** The vehicle used for transport can be rented */
  Rent = 'RENT'
}

export type QueryType = {
  __typename?: 'QueryType';
  /** Get all agencies */
  agencies?: Maybe<Array<Maybe<Agency>>>;
  /** Get a single agency based on agency ID, i.e. value of field `gtfsId` (ID format is `FeedId:StopId`) */
  agency?: Maybe<Agency>;
  /** Get all active alerts */
  alerts?: Maybe<Array<Maybe<Alert>>>;
  /** Get a single bike park based on its ID, i.e. value of field `bikeParkId` */
  bikePark?: Maybe<BikePark>;
  /** Get all bike parks */
  bikeParks?: Maybe<Array<Maybe<BikePark>>>;
  /** Get a single bike rental station based on its ID, i.e. value of field `stationId` */
  bikeRentalStation?: Maybe<BikeRentalStation>;
  /** Get all bike rental stations */
  bikeRentalStations?: Maybe<Array<Maybe<BikeRentalStation>>>;
  /** Get cancelled TripTimes. */
  cancelledTripTimes?: Maybe<Array<Maybe<Stoptime>>>;
  /** Get a single car park based on its ID, i.e. value of field `carParkId` */
  carPark?: Maybe<CarPark>;
  /** Get all car parks */
  carParks?: Maybe<Array<Maybe<CarPark>>>;
  /** Get a single cluster based on its ID, i.e. value of field `gtfsId` */
  cluster?: Maybe<Cluster>;
  /** Get all clusters */
  clusters?: Maybe<Array<Maybe<Cluster>>>;
  /** Get a single departure row based on its ID (ID format is `FeedId:StopId:PatternId`) */
  departureRow?: Maybe<DepartureRow>;
  /** Get all available feeds */
  feeds?: Maybe<Array<Maybe<Feed>>>;
  /** Finds a trip matching the given parameters. This query type is useful if the id of a trip is not known, but other details uniquely identifying the trip are available from some source (e.g. MQTT vehicle positions). */
  fuzzyTrip?: Maybe<Trip>;
  /** Get all places (stops, stations, etc. with coordinates) within the specified radius from a location. The returned type is a Relay connection (see https://facebook.github.io/relay/graphql/connections.htm). The placeAtDistance type has two fields: place and distance. The search is done by walking so the distance is according to the network of walkable streets and paths. */
  nearest?: Maybe<PlaceAtDistanceConnection>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Get a single pattern based on its ID, i.e. value of field `code` (format is `FeedId:RouteId:DirectionId:PatternVariantNumber`) */
  pattern?: Maybe<Pattern>;
  /** Get all patterns */
  patterns?: Maybe<Array<Maybe<Pattern>>>;
  /** Plans an itinerary from point A to point B based on the given arguments */
  plan?: Maybe<Plan>;
  /** Get a single route based on its ID, i.e. value of field `gtfsId` (format is `FeedId:RouteId`) */
  route?: Maybe<Route>;
  /** Get all routes */
  routes?: Maybe<Array<Maybe<Route>>>;
  /** Get the time range for which the API has data available */
  serviceTimeRange?: Maybe<ServiceTimeRange>;
  /** Get a single station based on its ID, i.e. value of field `gtfsId` (format is `FeedId:StopId`) */
  station?: Maybe<Stop>;
  /** Get all stations */
  stations?: Maybe<Array<Maybe<Stop>>>;
  /** Get a single stop based on its ID, i.e. value of field `gtfsId` (ID format is `FeedId:StopId`) */
  stop?: Maybe<Stop>;
  /** Get all stops */
  stops?: Maybe<Array<Maybe<Stop>>>;
  /** Get all stops within the specified bounding box */
  stopsByBbox?: Maybe<Array<Maybe<Stop>>>;
  /** Get all stops within the specified radius from a location. The returned type is a Relay connection (see https://facebook.github.io/relay/graphql/connections.htm). The stopAtDistance type has two values: stop and distance. */
  stopsByRadius?: Maybe<StopAtDistanceConnection>;
  /** Return list of available ticket types */
  ticketTypes?: Maybe<Array<Maybe<TicketType>>>;
  /** Get a single trip based on its ID, i.e. value of field `gtfsId` (format is `FeedId:TripId`) */
  trip?: Maybe<Trip>;
  /** Get all trips */
  trips?: Maybe<Array<Maybe<Trip>>>;
  /** Needed until https://github.com/facebook/relay/issues/112 is resolved */
  viewer?: Maybe<QueryType>;
};


export type QueryTypeAgencyArgs = {
  id: Scalars['String'];
};


export type QueryTypeAlertsArgs = {
  cause?: InputMaybe<Array<AlertCauseType>>;
  effect?: InputMaybe<Array<AlertEffectType>>;
  feeds?: InputMaybe<Array<Scalars['String']>>;
  route?: InputMaybe<Array<Scalars['String']>>;
  severityLevel?: InputMaybe<Array<AlertSeverityLevelType>>;
  stop?: InputMaybe<Array<Scalars['String']>>;
};


export type QueryTypeBikeParkArgs = {
  id: Scalars['String'];
};


export type QueryTypeBikeRentalStationArgs = {
  id: Scalars['String'];
};


export type QueryTypeBikeRentalStationsArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryTypeCancelledTripTimesArgs = {
  feeds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  maxArrivalTime?: InputMaybe<Scalars['Int']>;
  maxDate?: InputMaybe<Scalars['String']>;
  maxDepartureTime?: InputMaybe<Scalars['Int']>;
  minArrivalTime?: InputMaybe<Scalars['Int']>;
  minDate?: InputMaybe<Scalars['String']>;
  minDepartureTime?: InputMaybe<Scalars['Int']>;
  patterns?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  routes?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  trips?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryTypeCarParkArgs = {
  id: Scalars['String'];
};


export type QueryTypeCarParksArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryTypeClusterArgs = {
  id: Scalars['String'];
};


export type QueryTypeDepartureRowArgs = {
  id: Scalars['String'];
};


export type QueryTypeFuzzyTripArgs = {
  date: Scalars['String'];
  direction?: InputMaybe<Scalars['Int']>;
  route: Scalars['String'];
  time: Scalars['Int'];
};


export type QueryTypeNearestArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filterByIds?: InputMaybe<InputFilters>;
  filterByModes?: InputMaybe<Array<InputMaybe<Mode>>>;
  filterByPlaceTypes?: InputMaybe<Array<InputMaybe<FilterPlaceType>>>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  lat: Scalars['Float'];
  lon: Scalars['Float'];
  maxDistance?: InputMaybe<Scalars['Int']>;
  maxResults?: InputMaybe<Scalars['Int']>;
};


export type QueryTypeNodeArgs = {
  id: Scalars['ID'];
};


export type QueryTypePatternArgs = {
  id: Scalars['String'];
};


export type QueryTypePlanArgs = {
  alightSlack?: InputMaybe<Scalars['Int']>;
  allowBikeRental?: InputMaybe<Scalars['Boolean']>;
  allowedBikeRentalNetworks?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  allowedTicketTypes?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  arriveBy?: InputMaybe<Scalars['Boolean']>;
  banned?: InputMaybe<InputBanned>;
  batch?: InputMaybe<Scalars['Boolean']>;
  bikeBoardCost?: InputMaybe<Scalars['Int']>;
  bikeSpeed?: InputMaybe<Scalars['Float']>;
  bikeSwitchCost?: InputMaybe<Scalars['Int']>;
  bikeSwitchTime?: InputMaybe<Scalars['Int']>;
  boardSlack?: InputMaybe<Scalars['Int']>;
  carParkCarLegWeight?: InputMaybe<Scalars['Float']>;
  claimInitialWait?: InputMaybe<Scalars['Long']>;
  compactLegsByReversedSearch?: InputMaybe<Scalars['Boolean']>;
  date?: InputMaybe<Scalars['String']>;
  disableRemainingWeightHeuristic?: InputMaybe<Scalars['Boolean']>;
  from?: InputMaybe<InputCoordinates>;
  fromPlace?: InputMaybe<Scalars['String']>;
  heuristicStepsPerMainStep?: InputMaybe<Scalars['Int']>;
  ignoreRealtimeUpdates?: InputMaybe<Scalars['Boolean']>;
  intermediatePlaces?: InputMaybe<Array<InputMaybe<InputCoordinates>>>;
  itineraryFiltering?: InputMaybe<Scalars['Float']>;
  locale?: InputMaybe<Scalars['String']>;
  maxPreTransitTime?: InputMaybe<Scalars['Int']>;
  maxSlope?: InputMaybe<Scalars['Float']>;
  maxTransfers?: InputMaybe<Scalars['Int']>;
  maxWalkDistance?: InputMaybe<Scalars['Float']>;
  minTransferTime?: InputMaybe<Scalars['Int']>;
  modeWeight?: InputMaybe<InputModeWeight>;
  modes?: InputMaybe<Scalars['String']>;
  nonpreferredTransferPenalty?: InputMaybe<Scalars['Int']>;
  numItineraries?: InputMaybe<Scalars['Int']>;
  omitCanceled?: InputMaybe<Scalars['Boolean']>;
  optimize?: InputMaybe<OptimizeType>;
  preferred?: InputMaybe<InputPreferred>;
  reverseOptimizeOnTheFly?: InputMaybe<Scalars['Boolean']>;
  startTransitStopId?: InputMaybe<Scalars['String']>;
  startTransitTripId?: InputMaybe<Scalars['String']>;
  ticketTypes?: InputMaybe<Scalars['String']>;
  time?: InputMaybe<Scalars['String']>;
  to?: InputMaybe<InputCoordinates>;
  toPlace?: InputMaybe<Scalars['String']>;
  transferPenalty?: InputMaybe<Scalars['Int']>;
  transportModes?: InputMaybe<Array<InputMaybe<TransportMode>>>;
  triangle?: InputMaybe<InputTriangle>;
  unpreferred?: InputMaybe<InputUnpreferred>;
  waitAtBeginningFactor?: InputMaybe<Scalars['Float']>;
  waitReluctance?: InputMaybe<Scalars['Float']>;
  walkBoardCost?: InputMaybe<Scalars['Int']>;
  walkOnStreetReluctance?: InputMaybe<Scalars['Float']>;
  walkReluctance?: InputMaybe<Scalars['Float']>;
  walkSpeed?: InputMaybe<Scalars['Float']>;
  wheelchair?: InputMaybe<Scalars['Boolean']>;
};


export type QueryTypeRouteArgs = {
  id: Scalars['String'];
};


export type QueryTypeRoutesArgs = {
  feeds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  modes?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  transportModes?: InputMaybe<Array<InputMaybe<Mode>>>;
};


export type QueryTypeStationArgs = {
  id: Scalars['String'];
};


export type QueryTypeStationsArgs = {
  feeds?: InputMaybe<Array<Scalars['String']>>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  maxResults?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
};


export type QueryTypeStopArgs = {
  id: Scalars['String'];
};


export type QueryTypeStopsArgs = {
  feeds?: InputMaybe<Array<Scalars['String']>>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  maxResults?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
};


export type QueryTypeStopsByBboxArgs = {
  agency?: InputMaybe<Scalars['String']>;
  feeds?: InputMaybe<Array<Scalars['String']>>;
  maxLat: Scalars['Float'];
  maxLon: Scalars['Float'];
  minLat: Scalars['Float'];
  minLon: Scalars['Float'];
};


export type QueryTypeStopsByRadiusArgs = {
  after?: InputMaybe<Scalars['String']>;
  agency?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  feeds?: InputMaybe<Array<Scalars['String']>>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  lat: Scalars['Float'];
  lon: Scalars['Float'];
  radius: Scalars['Int'];
};


export type QueryTypeTripArgs = {
  id: Scalars['String'];
};


export type QueryTypeTripsArgs = {
  feeds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export enum RealtimeState {
  /** The trip has been added using a real-time update, i.e. the trip was not present in the GTFS feed. */
  Added = 'ADDED',
  /** The trip has been canceled by a real-time update. */
  Canceled = 'CANCELED',
  /** The trip information has been updated and resulted in a different trip pattern compared to the trip pattern of the scheduled trip. */
  Modified = 'MODIFIED',
  /** The trip information comes from the GTFS feed, i.e. no real-time update has been applied. */
  Scheduled = 'SCHEDULED',
  /** The trip information has been updated, but the trip pattern stayed the same as the trip pattern of the scheduled trip. */
  Updated = 'UPDATED'
}

/** Route represents a public transportation service, usually from point A to point B and *back*, shown to customers under a single name, e.g. bus 550. Routes contain patterns (see field `patterns`), which describe different variants of the route, e.g. outbound pattern from point A to point B and inbound pattern from point B to point A. */
export type Route = Node & {
  __typename?: 'Route';
  /** Agency operating the route */
  agency?: Maybe<Agency>;
  /** List of alerts which have an effect on the route */
  alerts?: Maybe<Array<Maybe<Alert>>>;
  bikesAllowed?: Maybe<BikesAllowed>;
  /** The color (in hexadecimal format) the agency operating this route would prefer to use on UI elements (e.g. polylines on a map) related to this route. This value is not available for most routes. */
  color?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['String']>;
  /** ID of the route in format `FeedId:RouteId` */
  gtfsId: Scalars['String'];
  /** Global object ID provided by Relay. This value can be used to refetch this object using **node** query. */
  id: Scalars['ID'];
  /** Long name of the route, e.g. Helsinki-Leppävaara */
  longName?: Maybe<Scalars['String']>;
  /** Transport mode of this route, e.g. `BUS` */
  mode?: Maybe<Mode>;
  /** List of patterns which operate on this route */
  patterns?: Maybe<Array<Maybe<Pattern>>>;
  /** Short name of the route, usually a line number, e.g. 550 */
  shortName?: Maybe<Scalars['String']>;
  /** List of stops on this route */
  stops?: Maybe<Array<Maybe<Stop>>>;
  /** The color (in hexadecimal format) the agency operating this route would prefer to use when displaying text related to this route. This value is not available for most routes. */
  textColor?: Maybe<Scalars['String']>;
  /** List of trips which operate on this route */
  trips?: Maybe<Array<Maybe<Trip>>>;
  /** The raw GTFS route type as a integer. For the list of possible values, see: https://developers.google.com/transit/gtfs/reference/#routestxt and https://developers.google.com/transit/gtfs/reference/extended-route-types */
  type?: Maybe<Scalars['Int']>;
  url?: Maybe<Scalars['String']>;
};

/** Stop can represent either a single public transport stop, where passengers can board and/or disembark vehicles, or a station, which contains multiple stops. See field `locationType`. */
export type Stop = Node & PlaceInterface & {
  __typename?: 'Stop';
  /** List of alerts which have an effect on this stop */
  alerts?: Maybe<Array<Maybe<Alert>>>;
  /** The cluster which this stop is part of */
  cluster?: Maybe<Cluster>;
  /** Stop code which is visible at the stop */
  code?: Maybe<Scalars['String']>;
  /** Description of the stop, usually a street name */
  desc?: Maybe<Scalars['String']>;
  direction?: Maybe<Scalars['String']>;
  /** ÌD of the stop in format `FeedId:StopId` */
  gtfsId: Scalars['String'];
  /** Global object ID provided by Relay. This value can be used to refetch this object using **node** query. */
  id: Scalars['ID'];
  /** Latitude of the stop (WGS 84) */
  lat?: Maybe<Scalars['Float']>;
  /** Identifies whether this stop represents a stop or station. */
  locationType?: Maybe<LocationType>;
  /** Longitude of the stop (WGS 84) */
  lon?: Maybe<Scalars['Float']>;
  /** Name of the stop, e.g. Pasilan asema */
  name: Scalars['String'];
  /** The station which this stop is part of (or null if this stop is not part of a station) */
  parentStation?: Maybe<Stop>;
  /** Patterns which pass through this stop */
  patterns?: Maybe<Array<Maybe<Pattern>>>;
  /** Identifier of the platform, usually a number. This value is only present for stops that are part of a station */
  platformCode?: Maybe<Scalars['String']>;
  /** Routes which pass through this stop */
  routes?: Maybe<Array<Route>>;
  /** Returns timetable of the specified pattern at this stop */
  stopTimesForPattern?: Maybe<Array<Maybe<Stoptime>>>;
  /** Returns all stops that are children of this station (Only applicable for stations) */
  stops?: Maybe<Array<Maybe<Stop>>>;
  /** Returns list of stoptimes (arrivals and departures) at this stop, grouped by patterns */
  stoptimesForPatterns?: Maybe<Array<Maybe<StoptimesInPattern>>>;
  /** Returns list of stoptimes for the specified date */
  stoptimesForServiceDate?: Maybe<Array<Maybe<StoptimesInPattern>>>;
  /** Returns list of stoptimes (arrivals and departures) at this stop */
  stoptimesWithoutPatterns?: Maybe<Array<Maybe<Stoptime>>>;
  timezone?: Maybe<Scalars['String']>;
  /** List of nearby stops which can be used for transfers */
  transfers?: Maybe<Array<Maybe<StopAtDistance>>>;
  url?: Maybe<Scalars['String']>;
  /**
   * Transport mode (e.g. `BUS`) used by routes which pass through this stop or `null` if mode cannot be determined, e.g. in case no routes pass through the stop.
   *  Note that also other types of vehicles may use the stop, e.g. tram replacement buses might use stops which have `TRAM` as their mode.
   */
  vehicleMode?: Maybe<Mode>;
  /** The raw GTFS route type used by routes which pass through this stop. For the list of possible values, see: https://developers.google.com/transit/gtfs/reference/#routestxt and https://developers.google.com/transit/gtfs/reference/extended-route-types */
  vehicleType?: Maybe<Scalars['Int']>;
  /** Whether wheelchair boarding is possible for at least some of vehicles on this stop */
  wheelchairBoarding?: Maybe<WheelchairBoarding>;
  /** ID of the zone where this stop is located */
  zoneId?: Maybe<Scalars['String']>;
};


/** Stop can represent either a single public transport stop, where passengers can board and/or disembark vehicles, or a station, which contains multiple stops. See field `locationType`. */
export type StopStopTimesForPatternArgs = {
  id: Scalars['String'];
  numberOfDepartures?: InputMaybe<Scalars['Int']>;
  omitCanceled?: InputMaybe<Scalars['Boolean']>;
  omitNonPickups?: InputMaybe<Scalars['Boolean']>;
  startTime?: InputMaybe<Scalars['Long']>;
  timeRange?: InputMaybe<Scalars['Int']>;
};


/** Stop can represent either a single public transport stop, where passengers can board and/or disembark vehicles, or a station, which contains multiple stops. See field `locationType`. */
export type StopStoptimesForPatternsArgs = {
  numberOfDepartures?: InputMaybe<Scalars['Int']>;
  omitCanceled?: InputMaybe<Scalars['Boolean']>;
  omitNonPickups?: InputMaybe<Scalars['Boolean']>;
  startTime?: InputMaybe<Scalars['Long']>;
  timeRange?: InputMaybe<Scalars['Int']>;
};


/** Stop can represent either a single public transport stop, where passengers can board and/or disembark vehicles, or a station, which contains multiple stops. See field `locationType`. */
export type StopStoptimesForServiceDateArgs = {
  date?: InputMaybe<Scalars['String']>;
  omitCanceled?: InputMaybe<Scalars['Boolean']>;
  omitNonPickups?: InputMaybe<Scalars['Boolean']>;
};


/** Stop can represent either a single public transport stop, where passengers can board and/or disembark vehicles, or a station, which contains multiple stops. See field `locationType`. */
export type StopStoptimesWithoutPatternsArgs = {
  numberOfDepartures?: InputMaybe<Scalars['Int']>;
  omitCanceled?: InputMaybe<Scalars['Boolean']>;
  omitNonPickups?: InputMaybe<Scalars['Boolean']>;
  startTime?: InputMaybe<Scalars['Long']>;
  timeRange?: InputMaybe<Scalars['Int']>;
};


/** Stop can represent either a single public transport stop, where passengers can board and/or disembark vehicles, or a station, which contains multiple stops. See field `locationType`. */
export type StopTransfersArgs = {
  maxDistance?: InputMaybe<Scalars['Int']>;
};

/** Stoptime represents the time when a specific trip arrives to or departs from a specific stop. */
export type Stoptime = {
  __typename?: 'Stoptime';
  /** The offset from the scheduled arrival time in seconds. Negative values indicate that the trip is running ahead of schedule. */
  arrivalDelay?: Maybe<Scalars['Int']>;
  /** The offset from the scheduled departure time in seconds. Negative values indicate that the trip is running ahead of schedule */
  departureDelay?: Maybe<Scalars['Int']>;
  /** Whether the vehicle can be disembarked at this stop. This field can also be used to indicate if disembarkation is possible only with special arrangements. */
  dropoffType?: Maybe<PickupDropoffType>;
  /** Vehicle headsign of the trip on this stop. Trip headsigns can change during the trip (e.g. on routes which run on loops), so this value should be used instead of `tripHeadsign` to display the headsign relevant to the user.  */
  headsign?: Maybe<Scalars['String']>;
  /** Whether the vehicle can be boarded at this stop. This field can also be used to indicate if boarding is possible only with special arrangements. */
  pickupType?: Maybe<PickupDropoffType>;
  /** true, if this stoptime has real-time data available */
  realtime?: Maybe<Scalars['Boolean']>;
  /** Realtime prediction of arrival time. Format: seconds since midnight of the departure date */
  realtimeArrival?: Maybe<Scalars['Int']>;
  /** Realtime prediction of departure time. Format: seconds since midnight of the departure date */
  realtimeDeparture?: Maybe<Scalars['Int']>;
  /** State of real-time data */
  realtimeState?: Maybe<RealtimeState>;
  /** Scheduled arrival time. Format: seconds since midnight of the departure date */
  scheduledArrival?: Maybe<Scalars['Int']>;
  /** Scheduled departure time. Format: seconds since midnight of the departure date */
  scheduledDeparture?: Maybe<Scalars['Int']>;
  /** Departure date of the trip. Format: Unix timestamp (local time) in seconds. */
  serviceDay?: Maybe<Scalars['Long']>;
  /** The stop where this arrival/departure happens */
  stop?: Maybe<Stop>;
  /** @deprecated Use headsign instead, will be removed in the future */
  stopHeadsign?: Maybe<Scalars['String']>;
  /** The sequence number of the stop */
  stopSequence?: Maybe<Scalars['Int']>;
  /** true, if this stop is used as a time equalization stop. false otherwise. */
  timepoint?: Maybe<Scalars['Boolean']>;
  /** Trip which this stoptime is for */
  trip?: Maybe<Trip>;
};

/** Stoptimes grouped by pattern */
export type StoptimesInPattern = {
  __typename?: 'StoptimesInPattern';
  pattern?: Maybe<Pattern>;
  stoptimes?: Maybe<Array<Maybe<Stoptime>>>;
};

/** Describes ticket type */
export type TicketType = Node & {
  __typename?: 'TicketType';
  /** ISO 4217 currency code */
  currency?: Maybe<Scalars['String']>;
  /** Ticket type ID in format `FeedId:TicketTypeId`. Ticket type IDs are usually combination of ticket zones where the ticket is valid. */
  fareId: Scalars['ID'];
  /** Global object ID provided by Relay. This value can be used to refetch this object using **node** query. */
  id: Scalars['ID'];
  /** Price of the ticket in currency that is specified in `currency` field */
  price?: Maybe<Scalars['Float']>;
  /**
   * List of zones where this ticket is valid.
   *   Corresponds to field `zoneId` in **Stop** type.
   */
  zones?: Maybe<Array<Scalars['String']>>;
};

/** Text with language */
export type TranslatedString = {
  __typename?: 'TranslatedString';
  /** Two-letter language code (ISO 639-1) */
  language?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
};

/** Transportation mode which can be used in the itinerary */
export type TransportMode = {
  mode: Mode;
  /** Optional additional qualifier for transport mode, e.g. `RENT` */
  qualifier?: InputMaybe<Qualifier>;
};

/** Trip is a specific occurance of a pattern, usually identified by route, direction on the route and exact departure time. */
export type Trip = Node & {
  __typename?: 'Trip';
  /** List of dates when this trip is in service. Format: YYYYMMDD */
  activeDates?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** List of alerts which have an effect on this trip */
  alerts?: Maybe<Array<Maybe<Alert>>>;
  /** Arrival time to the final stop */
  arrivalStoptime?: Maybe<Stoptime>;
  /** Whether bikes are allowed on board the vehicle running this trip */
  bikesAllowed?: Maybe<BikesAllowed>;
  blockId?: Maybe<Scalars['String']>;
  /** Departure time from the first stop */
  departureStoptime?: Maybe<Stoptime>;
  /** Direction code of the trip, i.e. is this the outbound or inbound trip of a pattern. Possible values: 0, 1 or `null` if the direction is irrelevant, i.e. the pattern has trips only in one direction. */
  directionId?: Maybe<Scalars['String']>;
  /** List of coordinates of this trip's route */
  geometry?: Maybe<Array<Maybe<Array<Maybe<Scalars['Float']>>>>>;
  /** ID of the trip in format `FeedId:TripId` */
  gtfsId: Scalars['String'];
  /** Global object ID provided by Relay. This value can be used to refetch this object using **node** query. */
  id: Scalars['ID'];
  /** The pattern the trip is running on */
  pattern?: Maybe<Pattern>;
  /** The route the trip is running on */
  route: Route;
  /** Short name of the route this trip is running. See field `shortName` of Route. */
  routeShortName?: Maybe<Scalars['String']>;
  /** Hash code of the trip. This value is stable and not dependent on the trip id. */
  semanticHash: Scalars['String'];
  serviceId?: Maybe<Scalars['String']>;
  shapeId?: Maybe<Scalars['String']>;
  /** List of stops this trip passes through */
  stops: Array<Stop>;
  /** List of times when this trip arrives to or departs from a stop */
  stoptimes?: Maybe<Array<Maybe<Stoptime>>>;
  stoptimesForDate?: Maybe<Array<Maybe<Stoptime>>>;
  /** Coordinates of the route of this trip in Google polyline encoded format */
  tripGeometry?: Maybe<Geometry>;
  /** Headsign of the vehicle when running on this trip */
  tripHeadsign?: Maybe<Scalars['String']>;
  tripShortName?: Maybe<Scalars['String']>;
  /** Whether the vehicle running this trip can be boarded by a wheelchair */
  wheelchairAccessible?: Maybe<WheelchairBoarding>;
};


/** Trip is a specific occurance of a pattern, usually identified by route, direction on the route and exact departure time. */
export type TripArrivalStoptimeArgs = {
  serviceDate?: InputMaybe<Scalars['String']>;
};


/** Trip is a specific occurance of a pattern, usually identified by route, direction on the route and exact departure time. */
export type TripDepartureStoptimeArgs = {
  serviceDate?: InputMaybe<Scalars['String']>;
};


/** Trip is a specific occurance of a pattern, usually identified by route, direction on the route and exact departure time. */
export type TripStoptimesForDateArgs = {
  serviceDate?: InputMaybe<Scalars['String']>;
  serviceDay?: InputMaybe<Scalars['String']>;
};

export enum VertexType {
  /** BIKEPARK */
  Bikepark = 'BIKEPARK',
  /** BIKESHARE */
  Bikeshare = 'BIKESHARE',
  /** NORMAL */
  Normal = 'NORMAL',
  /** PARKANDRIDE */
  Parkandride = 'PARKANDRIDE',
  /** TRANSIT */
  Transit = 'TRANSIT'
}

export enum WheelchairBoarding {
  /** Wheelchair boarding is not possible at this stop. */
  NotPossible = 'NOT_POSSIBLE',
  /** There is no accessibility information for the stop. */
  NoInformation = 'NO_INFORMATION',
  /** At least some vehicles at this stop can be boarded by a rider in a wheelchair. */
  Possible = 'POSSIBLE'
}

export type DebugOutput = {
  __typename?: 'debugOutput';
  pathCalculationTime?: Maybe<Scalars['Long']>;
  precalculationTime?: Maybe<Scalars['Long']>;
  renderingTime?: Maybe<Scalars['Long']>;
  timedOut?: Maybe<Scalars['Boolean']>;
  totalTime?: Maybe<Scalars['Long']>;
};

export type ElevationProfileComponent = {
  __typename?: 'elevationProfileComponent';
  /** The distance from the start of the step, in meters. */
  distance?: Maybe<Scalars['Float']>;
  /** The elevation at this distance, in meters. */
  elevation?: Maybe<Scalars['Float']>;
};

export type Fare = {
  __typename?: 'fare';
  /** Fare price in cents. **Note:** this value is dependent on the currency used, as one cent is not necessarily ¹/₁₀₀ of the basic monerary unit. */
  cents?: Maybe<Scalars['Int']>;
  /** Components which this fare is composed of */
  components?: Maybe<Array<Maybe<FareComponent>>>;
  /** ISO 4217 currency code */
  currency?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

/** Component of the fare (i.e. ticket) for a part of the itinerary */
export type FareComponent = {
  __typename?: 'fareComponent';
  /** Fare price in cents. **Note:** this value is dependent on the currency used, as one cent is not necessarily ¹/₁₀₀ of the basic monerary unit. */
  cents?: Maybe<Scalars['Int']>;
  /** ISO 4217 currency code */
  currency?: Maybe<Scalars['String']>;
  /** ID of the ticket type. Corresponds to `fareId` in **TicketType**. */
  fareId?: Maybe<Scalars['String']>;
  /** List of routes which use this fare component */
  routes?: Maybe<Array<Maybe<Route>>>;
};

export type PlaceAtDistance = Node & {
  __typename?: 'placeAtDistance';
  /** Walking distance to the place along streets and paths */
  distance?: Maybe<Scalars['Int']>;
  /** Global object ID provided by Relay. This value can be used to refetch this object using **node** query. */
  id: Scalars['ID'];
  place?: Maybe<PlaceInterface>;
};

/** A connection to a list of items. */
export type PlaceAtDistanceConnection = {
  __typename?: 'placeAtDistanceConnection';
  edges?: Maybe<Array<Maybe<PlaceAtDistanceEdge>>>;
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type PlaceAtDistanceEdge = {
  __typename?: 'placeAtDistanceEdge';
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<PlaceAtDistance>;
};

/** Time range for which the API has data available */
export type ServiceTimeRange = {
  __typename?: 'serviceTimeRange';
  /** Time until which the API has data available. Format: Unix timestamp in seconds */
  end?: Maybe<Scalars['Long']>;
  /** Time from which the API has data available. Format: Unix timestamp in seconds */
  start?: Maybe<Scalars['Long']>;
};

export type Step = {
  __typename?: 'step';
  /** The distance in meters that this step takes. */
  distance?: Maybe<Scalars['Float']>;
  /** The elevation profile as a list of { distance, elevation } values. */
  elevationProfile?: Maybe<Array<Maybe<ElevationProfileComponent>>>;
  /** The latitude of the start of the step. */
  lat?: Maybe<Scalars['Float']>;
  /** The longitude of the start of the step. */
  lon?: Maybe<Scalars['Float']>;
};

export type StopAtDistance = Node & {
  __typename?: 'stopAtDistance';
  /** Walking distance to the stop along streets and paths */
  distance?: Maybe<Scalars['Int']>;
  /** Global object ID provided by Relay. This value can be used to refetch this object using **node** query. */
  id: Scalars['ID'];
  stop?: Maybe<Stop>;
};

/** A connection to a list of items. */
export type StopAtDistanceConnection = {
  __typename?: 'stopAtDistanceConnection';
  edges?: Maybe<Array<Maybe<StopAtDistanceEdge>>>;
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type StopAtDistanceEdge = {
  __typename?: 'stopAtDistanceEdge';
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<StopAtDistance>;
};

export type RouteQueryVariables = Exact<{
  id: Scalars['String'];
}>;


export type RouteQuery = { __typename?: 'QueryType', route?: { __typename?: 'Route', gtfsId: string, shortName?: string | null, longName?: string | null, patterns?: Array<{ __typename?: 'Pattern', headsign?: string | null, geometry?: Array<{ __typename?: 'Coordinates', lat?: number | null, lon?: number | null } | null> | null } | null> | null } | null };

export type RouteForRailFragment = { __typename?: 'Route', gtfsId: string, shortName?: string | null, longName?: string | null, patterns?: Array<{ __typename?: 'Pattern', headsign?: string | null, geometry?: Array<{ __typename?: 'Coordinates', lat?: number | null, lon?: number | null } | null> | null } | null> | null };

export const RouteForRailFragmentDoc = gql`
    fragment RouteForRail on Route {
  gtfsId
  shortName
  longName
  patterns {
    headsign
    geometry {
      lat
      lon
    }
  }
}
    `;
export const RouteDocument = gql`
    query Route($id: String!) {
  route(id: $id) {
    ...RouteForRail
  }
}
    ${RouteForRailFragmentDoc}`;

/**
 * __useRouteQuery__
 *
 * To run a query within a React component, call `useRouteQuery` and pass it any options that fit your needs.
 * When your component renders, `useRouteQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRouteQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRouteQuery(baseOptions: Apollo.QueryHookOptions<RouteQuery, RouteQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RouteQuery, RouteQueryVariables>(RouteDocument, options);
      }
export function useRouteLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RouteQuery, RouteQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RouteQuery, RouteQueryVariables>(RouteDocument, options);
        }
export type RouteQueryHookResult = ReturnType<typeof useRouteQuery>;
export type RouteLazyQueryHookResult = ReturnType<typeof useRouteLazyQuery>;
export type RouteQueryResult = Apollo.QueryResult<RouteQuery, RouteQueryVariables>;