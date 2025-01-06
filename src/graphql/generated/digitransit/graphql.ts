/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** Either a latitude or a longitude as a WGS84 format floating point number. */
  CoordinateValue: { input: any; output: any; }
  /**
   * A static cost that is applied to a certain event or entity. Cost is a positive integer,
   * for example `450`. One cost unit should roughly match a one second travel on transit.
   */
  Cost: { input: any; output: any; }
  /** Duration in a lenient ISO-8601 duration format. Example P2DT2H12M40S, 2d2h12m40s or 1h */
  Duration: { input: any; output: any; }
  /** Geographic data structures in JSON format. See: https://geojson.org/ */
  GeoJson: { input: any; output: any; }
  Grams: { input: any; output: any; }
  /**
   * An ISO-8601-formatted local date, i.e. `2024-05-24` for the 24th of May, 2024.
   *
   * ISO-8601 allows many different date formats, however only the most common one - `yyyy-MM-dd` - is accepted.
   */
  LocalDate: { input: any; output: any; }
  /** A IETF BCP 47 language tag */
  Locale: { input: any; output: any; }
  /** A 64-bit signed integer */
  Long: { input: any; output: any; }
  /**
   * An ISO-8601-formatted datetime with offset, i.e. `2023-06-13T14:30+03:00` for 2:30pm on June 13th 2023 at Helsinki's offset from UTC at that time.
   *
   * ISO-8601 allows many different formats but OTP will only return the profile specified in RFC3339.
   */
  OffsetDateTime: { input: any; output: any; }
  /** List of coordinates in an encoded polyline format (see https://developers.google.com/maps/documentation/utilities/polylinealgorithm). The value appears in JSON as a string. */
  Polyline: { input: any; output: any; }
  /** A fractional multiplier between 0 and 1, for example 0.25. 0 means 0% and 1 means 100%. */
  Ratio: { input: any; output: any; }
  /**
   * A cost multiplier for how bad something is compared to being in transit for equal lengths of time.
   * The value should be greater than 0. 1 means neutral and values below 1 mean that something is
   * preferred over transit.
   */
  Reluctance: { input: any; output: any; }
  /** Speed in meters per seconds. Values are positive floating point numbers (for example, 2.34). */
  Speed: { input: any; output: any; }
};

/** The cardinal (compass) direction taken when engaging a walking/driving step. */
export enum AbsoluteDirection {
  East = 'EAST',
  North = 'NORTH',
  Northeast = 'NORTHEAST',
  Northwest = 'NORTHWEST',
  South = 'SOUTH',
  Southeast = 'SOUTHEAST',
  Southwest = 'SOUTHWEST',
  West = 'WEST'
}

/**
 * Plan accessibilty preferences. This can be expanded to contain preferences for various accessibility use cases
 * in the future. Currently only generic wheelchair preferences are available.
 */
export type AccessibilityPreferencesInput = {
  /** Wheelchair related preferences. Note, currently this is the only accessibility mode that is available. */
  wheelchair?: InputMaybe<WheelchairPreferencesInput>;
};

/** Entities, which are relevant for an agency and can contain alerts */
export enum AgencyAlertType {
  /** Alerts affecting the agency. */
  Agency = 'AGENCY',
  /** Alerts affecting agency's routes */
  Routes = 'ROUTES',
  /**
   * Alerts affecting the different route types of the agency.
   * Alerts that affect route types on all agencies can be fetched through Feed.
   */
  RouteTypes = 'ROUTE_TYPES'
}

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
  /** ACCESSIBILITY_ISSUE */
  AccessibilityIssue = 'ACCESSIBILITY_ISSUE',
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
  /**
   * Info alerts are used for informational messages that should not have a
   * significant effect on user's journey, for example: A single entrance to a
   * metro station is temporarily closed.
   */
  Info = 'INFO',
  /**
   * Severe alerts are used when a significant part of public transport services is
   * affected, for example: All train services are cancelled due to technical problems.
   */
  Severe = 'SEVERE',
  /** Severity of alert is unknown */
  UnknownSeverity = 'UNKNOWN_SEVERITY',
  /**
   * Warning alerts are used when a single stop or route has a disruption that can
   * affect user's journey, for example: All trams on a specific route are running
   * with irregular schedules.
   */
  Warning = 'WARNING'
}

/** Preferences related to alighting from a transit vehicle. */
export type AlightPreferencesInput = {
  /** What is the required minimum time alighting from a vehicle. */
  slack?: InputMaybe<Scalars['Duration']['input']>;
};

/** Preferences for bicycle parking facilities used during the routing. */
export type BicycleParkingPreferencesInput = {
  /**
   * Selection filters to include or exclude parking facilities.
   * An empty list will include all facilities in the routing search.
   */
  filters?: InputMaybe<Array<ParkingFilter>>;
  /**
   * If non-empty every parking facility that doesn't match this set of conditions will
   * receive an extra cost (defined by `unpreferredCost`) and therefore avoided.
   */
  preferred?: InputMaybe<Array<ParkingFilter>>;
  /**
   * If `preferred` is non-empty, using a parking facility that doesn't contain
   * at least one of the preferred conditions, will receive this extra cost and therefore avoided if
   * preferred options are available.
   */
  unpreferredCost?: InputMaybe<Scalars['Cost']['input']>;
};

/** Preferences related to travel with a bicycle. */
export type BicyclePreferencesInput = {
  /** Cost of boarding a vehicle with a bicycle. */
  boardCost?: InputMaybe<Scalars['Cost']['input']>;
  /** What criteria should be used when optimizing a cycling route. */
  optimization?: InputMaybe<CyclingOptimizationInput>;
  /** Bicycle parking related preferences. */
  parking?: InputMaybe<BicycleParkingPreferencesInput>;
  /** A multiplier for how bad cycling is compared to being in transit for equal lengths of time. */
  reluctance?: InputMaybe<Scalars['Reluctance']['input']>;
  /** Bicycle rental related preferences. */
  rental?: InputMaybe<BicycleRentalPreferencesInput>;
  /**
   * Maximum speed on flat ground while riding a bicycle. Note, this speed is higher than
   * the average speed will be in itineraries as this is the maximum speed but there are
   * factors that slow down cycling such as crossings, intersections and elevation changes.
   */
  speed?: InputMaybe<Scalars['Speed']['input']>;
  /** Walking preferences when walking a bicycle. */
  walk?: InputMaybe<BicycleWalkPreferencesInput>;
};

/** Preferences related to bicycle rental (station based or floating bicycle rental). */
export type BicycleRentalPreferencesInput = {
  /** Rental networks which can be potentially used as part of an itinerary. */
  allowedNetworks?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Rental networks which cannot be used as part of an itinerary. */
  bannedNetworks?: InputMaybe<Array<Scalars['String']['input']>>;
  /**
   * Is it possible to arrive to the destination with a rented bicycle and does it
   * come with an extra cost.
   */
  destinationBicyclePolicy?: InputMaybe<DestinationBicyclePolicyInput>;
};

/** Costs related to walking a bicycle. */
export type BicycleWalkPreferencesCostInput = {
  /**
   * A static cost that is added each time hopping on or off a bicycle to start or end
   * bicycle walking. However, this cost is not applied when getting on a rented bicycle
   * for the first time or when getting off the bicycle when returning the bicycle.
   */
  mountDismountCost?: InputMaybe<Scalars['Cost']['input']>;
  /**
   * A cost multiplier of bicycle walking travel time. The multiplier is for how bad
   * walking the bicycle is compared to being in transit for equal lengths of time.
   */
  reluctance?: InputMaybe<Scalars['Reluctance']['input']>;
};

/** Preferences for walking a bicycle. */
export type BicycleWalkPreferencesInput = {
  /** Costs related to walking a bicycle. */
  cost?: InputMaybe<BicycleWalkPreferencesCostInput>;
  /**
   * How long it takes to hop on or off a bicycle when switching to walking the bicycle
   * or when getting on the bicycle again. However, this is not applied when getting
   * on a rented bicycle for the first time or off the bicycle when returning the bicycle.
   */
  mountDismountTime?: InputMaybe<Scalars['Duration']['input']>;
  /**
   * Maximum walk speed on flat ground. Note, this speed is higher than the average speed
   * will be in itineraries as this is the maximum speed but there are
   * factors that slow down walking such as crossings, intersections and elevation changes.
   */
  speed?: InputMaybe<Scalars['Speed']['input']>;
};

export enum BikesAllowed {
  /** The vehicle being used on this particular trip can accommodate at least one bicycle. */
  Allowed = 'ALLOWED',
  /** No bicycles are allowed on this trip. */
  NotAllowed = 'NOT_ALLOWED',
  /** There is no bike information for the trip. */
  NoInformation = 'NO_INFORMATION'
}

/**
 * Preferences related to boarding a transit vehicle. Note, board costs for each street mode
 * can be found under the street mode preferences.
 */
export type BoardPreferencesInput = {
  /**
   * What is the required minimum waiting time at a stop. Setting this value as `PT0S`, for example, can lead
   * to passenger missing a connection when the vehicle leaves ahead of time or the passenger arrives to the
   * stop later than expected.
   */
  slack?: InputMaybe<Scalars['Duration']['input']>;
  /** A multiplier for how bad waiting at a stop is compared to being in transit for equal lengths of time. */
  waitReluctance?: InputMaybe<Scalars['Reluctance']['input']>;
};

/** Preferences for car parking facilities used during the routing. */
export type CarParkingPreferencesInput = {
  /**
   * Selection filters to include or exclude parking facilities.
   * An empty list will include all facilities in the routing search.
   */
  filters?: InputMaybe<Array<ParkingFilter>>;
  /**
   * If non-empty every parking facility that doesn't match this set of conditions will
   * receive an extra cost (defined by `unpreferredCost`) and therefore avoided.
   */
  preferred?: InputMaybe<Array<ParkingFilter>>;
  /**
   * If `preferred` is non-empty, using a parking facility that doesn't contain
   * at least one of the preferred conditions, will receive this extra cost and therefore avoided if
   * preferred options are available.
   */
  unpreferredCost?: InputMaybe<Scalars['Cost']['input']>;
};

/** Preferences related to traveling on a car (excluding car travel on transit services such as taxi). */
export type CarPreferencesInput = {
  /** Car parking related preferences. */
  parking?: InputMaybe<CarParkingPreferencesInput>;
  /** A multiplier for how bad travelling on car is compared to being in transit for equal lengths of time. */
  reluctance?: InputMaybe<Scalars['Reluctance']['input']>;
  /** Car rental related preferences. */
  rental?: InputMaybe<CarRentalPreferencesInput>;
};

/** Preferences related to car rental (station based or floating car rental). */
export type CarRentalPreferencesInput = {
  /** Rental networks which can be potentially used as part of an itinerary. */
  allowedNetworks?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Rental networks which cannot be used as part of an itinerary. */
  bannedNetworks?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** What criteria should be used when optimizing a cycling route. */
export type CyclingOptimizationInput = {
  /** Define optimization by weighing three criteria. */
  triangle?: InputMaybe<TriangleCyclingFactorsInput>;
  /** Use one of the predefined optimization types. */
  type?: InputMaybe<CyclingOptimizationType>;
};

/**
 * Predefined optimization alternatives for bicycling routing. For more customization,
 * one can use the triangle factors.
 */
export enum CyclingOptimizationType {
  /** Emphasize flatness over safety or duration of the route. This option was previously called `FLAT`. */
  FlatStreets = 'FLAT_STREETS',
  /**
   * Completely ignore the elevation differences and prefer the streets, that are evaluated
   * to be the safest, even more than with the `SAFE_STREETS` option.
   * Safety can also include other concerns such as convenience and general cyclist preferences
   * by taking into account road surface etc. This option was previously called `GREENWAYS`.
   */
  SafestStreets = 'SAFEST_STREETS',
  /**
   * Emphasize cycling safety over flatness or duration of the route. Safety can also include other
   * concerns such as convenience and general cyclist preferences by taking into account
   * road surface etc. This option was previously called `SAFE`.
   */
  SafeStreets = 'SAFE_STREETS',
  /**
   * Search for routes with the shortest duration while ignoring the cycling safety
   * of the streets (the routes should still follow local regulations). Routes can include
   * steep streets, if they are the fastest alternatives. This option was previously called
   * `QUICK`.
   */
  ShortestDuration = 'SHORTEST_DURATION'
}

/**
 * Is it possible to arrive to the destination with a rented bicycle and does it
 * come with an extra cost.
 */
export type DestinationBicyclePolicyInput = {
  /** For networks that require station drop-off, should the routing engine offer results that go directly to the destination without dropping off the rental bicycle first. */
  allowKeeping?: InputMaybe<Scalars['Boolean']['input']>;
  /**
   * Cost associated with arriving to the destination with a rented bicycle.
   * No cost is applied if arriving to the destination after dropping off the rented
   * bicycle.
   */
  keepingCost?: InputMaybe<Scalars['Cost']['input']>;
};

/**
 * Is it possible to arrive to the destination with a rented scooter and does it
 * come with an extra cost.
 */
export type DestinationScooterPolicyInput = {
  /** For networks that require station drop-off, should the routing engine offer results that go directly to the destination without dropping off the rental scooter first. */
  allowKeeping?: InputMaybe<Scalars['Boolean']['input']>;
  /**
   * Cost associated with arriving to the destination with a rented scooter.
   * No cost is applied if arriving to the destination after dropping off the rented
   * scooter.
   */
  keepingCost?: InputMaybe<Scalars['Cost']['input']>;
};

/** Entities, which are relevant for a feed and can contain alerts */
export enum FeedAlertType {
  /** Alerts affecting the feed's agencies */
  Agencies = 'AGENCIES',
  /**
   * Alerts affecting the route types across the feed.
   * There might be alerts that only affect route types within an agency of the feed,
   * and those can be fetched through the Agency.
   */
  RouteTypes = 'ROUTE_TYPES'
}

export enum FilterPlaceType {
  /**
   * Old value for VEHICLE_RENT
   * @deprecated Use VEHICLE_RENT instead as it's clearer that it also returns rental scooters, cars...
   */
  BicycleRent = 'BICYCLE_RENT',
  /** Parking lots (not rental stations) that contain spaces for bicycles */
  BikePark = 'BIKE_PARK',
  /** Parking lots that contain spaces for cars */
  CarPark = 'CAR_PARK',
  /** Departure rows */
  DepartureRow = 'DEPARTURE_ROW',
  /**
   * Stations.
   * NOTE: if this is selected at the same time as `STOP`, stops that have a parent station will not be returned but their parent stations will be returned instead.
   */
  Station = 'STATION',
  /**
   * Stops.
   * NOTE: if this is selected at the same time as `STATION`, stops that have a parent station will not be returned but their parent stations will be returned instead.
   */
  Stop = 'STOP',
  /** Vehicle (bicycles, scooters, cars ...) rental stations and vehicles */
  VehicleRent = 'VEHICLE_RENT'
}

export enum FormFactor {
  /** A bicycle */
  Bicycle = 'BICYCLE',
  /** An automobile */
  Car = 'CAR',
  /** A bicycle with additional space for cargo */
  CargoBicycle = 'CARGO_BICYCLE',
  /** A moped that the rider sits on. For a disambiguation see https://github.com/NABSA/gbfs/pull/370#issuecomment-982631989 */
  Moped = 'MOPED',
  /** A vehicle that doesn't fit into any other category */
  Other = 'OTHER',
  /** A kick scooter that the rider either sits or stands on. Will be deprecated in GBFS v3.0. */
  Scooter = 'SCOOTER',
  /** A kick scooter with a seat */
  ScooterSeated = 'SCOOTER_SEATED',
  /** A kick scooter that the rider stands on */
  ScooterStanding = 'SCOOTER_STANDING'
}

export type InputBanned = {
  /** A comma-separated list of banned agency ids */
  agencies?: InputMaybe<Scalars['String']['input']>;
  /** A comma-separated list of banned route ids */
  routes?: InputMaybe<Scalars['String']['input']>;
  /** A comma-separated list of banned trip ids */
  trips?: InputMaybe<Scalars['String']['input']>;
};

export type InputCoordinates = {
  /** The name of the place. If specified, the place name in results uses this value instead of `"Origin"` or `"Destination"` */
  address?: InputMaybe<Scalars['String']['input']>;
  /** Latitude of the place (WGS 84) */
  lat: Scalars['Float']['input'];
  /** The amount of time, in seconds, to spend at this location before venturing forth. */
  locationSlack?: InputMaybe<Scalars['Int']['input']>;
  /** Longitude of the place (WGS 84) */
  lon: Scalars['Float']['input'];
};

export enum InputField {
  DateTime = 'DATE_TIME',
  From = 'FROM',
  To = 'TO'
}

export type InputFilters = {
  /** Bike parks to include by id. */
  bikeParks?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Bike rentals to include by id (without network identifier). */
  bikeRentalStations?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Car parks to include by id. */
  carParks?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Routes to include by GTFS id. */
  routes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Stations to include by GTFS id. */
  stations?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Stops to include by GTFS id. */
  stops?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type InputModeWeight = {
  /** The weight of AIRPLANE traverse mode. Values over 1 add cost to airplane travel and values under 1 decrease cost */
  AIRPLANE?: InputMaybe<Scalars['Float']['input']>;
  /** The weight of BUS traverse mode. Values over 1 add cost to bus travel and values under 1 decrease cost */
  BUS?: InputMaybe<Scalars['Float']['input']>;
  /** The weight of CABLE_CAR traverse mode. Values over 1 add cost to cable car travel and values under 1 decrease cost */
  CABLE_CAR?: InputMaybe<Scalars['Float']['input']>;
  /** The weight of CARPOOL traverse mode. Values over 1 add cost to carpool travel and values under 1 decrease cost */
  CARPOOL?: InputMaybe<Scalars['Float']['input']>;
  /** The weight of COACH traverse mode. Values over 1 add cost to coach travel and values under 1 decrease cost */
  COACH?: InputMaybe<Scalars['Float']['input']>;
  /** The weight of FERRY traverse mode. Values over 1 add cost to ferry travel and values under 1 decrease cost */
  FERRY?: InputMaybe<Scalars['Float']['input']>;
  /** The weight of FUNICULAR traverse mode. Values over 1 add cost to funicular travel and values under 1 decrease cost */
  FUNICULAR?: InputMaybe<Scalars['Float']['input']>;
  /** The weight of GONDOLA traverse mode. Values over 1 add cost to gondola travel and values under 1 decrease cost */
  GONDOLA?: InputMaybe<Scalars['Float']['input']>;
  /** The weight of MONORAIL traverse mode. Values over 1 add cost to monorail travel and values under 1 decrease cost */
  MONORAIL?: InputMaybe<Scalars['Float']['input']>;
  /** The weight of RAIL traverse mode. Values over 1 add cost to rail travel and values under 1 decrease cost */
  RAIL?: InputMaybe<Scalars['Float']['input']>;
  /** The weight of SUBWAY traverse mode. Values over 1 add cost to subway travel and values under 1 decrease cost */
  SUBWAY?: InputMaybe<Scalars['Float']['input']>;
  /** The weight of TAXI traverse mode. Values over 1 add cost to taxi travel and values under 1 decrease cost */
  TAXI?: InputMaybe<Scalars['Float']['input']>;
  /** The weight of TRAM traverse mode. Values over 1 add cost to tram travel and values under 1 decrease cost */
  TRAM?: InputMaybe<Scalars['Float']['input']>;
  /** The weight of TROLLEYBUS traverse mode. Values over 1 add cost to trolleybus travel and values under 1 decrease cost */
  TROLLEYBUS?: InputMaybe<Scalars['Float']['input']>;
};

export type InputPreferred = {
  /** A comma-separated list of ids of the agencies preferred by the user. */
  agencies?: InputMaybe<Scalars['String']['input']>;
  /**
   * Penalty added for using every route that is not preferred if user set any
   * route as preferred. We return number of seconds that we are willing to wait
   * for preferred route.
   */
  otherThanPreferredRoutesPenalty?: InputMaybe<Scalars['Int']['input']>;
  /** A comma-separated list of ids of the routes preferred by the user. */
  routes?: InputMaybe<Scalars['String']['input']>;
};

/**
 * Relative importances of optimization factors. Only effective for bicycling legs.
 * Invariant: `timeFactor + slopeFactor + safetyFactor == 1`
 */
export type InputTriangle = {
  /** Relative importance of safety */
  safetyFactor?: InputMaybe<Scalars['Float']['input']>;
  /** Relative importance of flat terrain */
  slopeFactor?: InputMaybe<Scalars['Float']['input']>;
  /** Relative importance of duration */
  timeFactor?: InputMaybe<Scalars['Float']['input']>;
};

export type InputUnpreferred = {
  /** A comma-separated list of ids of the agencies unpreferred by the user. */
  agencies?: InputMaybe<Scalars['String']['input']>;
  /** A comma-separated list of ids of the routes unpreferred by the user. */
  routes?: InputMaybe<Scalars['String']['input']>;
  /**
   * An cost function used to calculate penalty for an unpreferred route/agency. Function should return
   * number of seconds that we are willing to wait for unpreferred route/agency.
   * String must be of the format:
   * `A + B x`, where A is fixed penalty and B is a multiplier of transit leg travel time x.
   * For example: `600 + 2.0 x`
   */
  unpreferredCost?: InputMaybe<Scalars['String']['input']>;
};

/**
 * Enable this to attach a system notice to itineraries instead of removing them. This is very
 * convenient when tuning the itinerary-filter-chain.
 */
export enum ItineraryFilterDebugProfile {
  /**
   * Only return the requested number of itineraries, counting both actual and deleted ones.
   * The top `numItineraries` using the request sort order is returned. This does not work
   * with paging, itineraries after the limit, but inside the search-window are skipped when
   * moving to the next page.
   */
  LimitToNumberOfItineraries = 'LIMIT_TO_NUMBER_OF_ITINERARIES',
  /**
   * Return all itineraries, including deleted ones, inside the actual search-window used
   * (the requested search-window may differ).
   */
  LimitToSearchWindow = 'LIMIT_TO_SEARCH_WINDOW',
  /** List all itineraries, including all deleted itineraries. */
  ListAll = 'LIST_ALL',
  /** By default, the debug itinerary filters is turned off. */
  Off = 'OFF'
}

/** Filters an entity by a date range. */
export type LocalDateRangeInput = {
  /**
   * **Exclusive** end date of the filter. This means that if you want a time window from Sunday to
   * Sunday, `end` must be on Monday.
   *
   * If `null` this means that no end filter is applied and all entities that are after or on `start`
   * are selected.
   */
  end?: InputMaybe<Scalars['LocalDate']['input']>;
  /**
   * **Inclusive** start date of the filter. If `null` this means that no `start` filter is applied and all
   * dates that are before `end` are selected.
   */
  start?: InputMaybe<Scalars['LocalDate']['input']>;
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
  /** Private car trips shared with others. */
  Carpool = 'CARPOOL',
  /** COACH */
  Coach = 'COACH',
  /** FERRY */
  Ferry = 'FERRY',
  /** Enables flexible transit for access and egress legs */
  Flex = 'FLEX',
  /**
   * Enables flexible transit for access and egress legs
   * @deprecated Use FLEX instead
   */
  Flexible = 'FLEXIBLE',
  /** FUNICULAR */
  Funicular = 'FUNICULAR',
  /** GONDOLA */
  Gondola = 'GONDOLA',
  /**
   * Only used internally. No use for API users.
   * @deprecated No longer supported
   */
  LegSwitch = 'LEG_SWITCH',
  /** Railway in which the track consists of a single rail or a beam. */
  Monorail = 'MONORAIL',
  /** RAIL */
  Rail = 'RAIL',
  /** SCOOTER */
  Scooter = 'SCOOTER',
  /** SUBWAY */
  Subway = 'SUBWAY',
  /** A taxi, possibly operated by a public transport agency. */
  Taxi = 'TAXI',
  /** TRAM */
  Tram = 'TRAM',
  /** A special transport mode, which includes all public transport. */
  Transit = 'TRANSIT',
  /** Electric buses that draw power from overhead wires using poles. */
  Trolleybus = 'TROLLEYBUS',
  /** WALK */
  Walk = 'WALK'
}

/** Occupancy status of a vehicle. */
export enum OccupancyStatus {
  /**
   * The vehicle or carriage can currently accommodate only standing passengers and has limited
   * space for them. There isn't a big difference between this and FULL so it's possible to handle
   * them as the same value, if one wants to limit the number of different values.
   * SIRI nordic profile: merge into `STANDING_ROOM_ONLY`.
   */
  CrushedStandingRoomOnly = 'CRUSHED_STANDING_ROOM_ONLY',
  /**
   * The vehicle is considered empty by most measures, and has few or no passengers onboard, but is
   * still accepting passengers. There isn't a big difference between this and MANY_SEATS_AVAILABLE
   * so it's possible to handle them as the same value, if one wants to limit the number of different
   * values.
   * SIRI nordic profile: merge these into `MANY_SEATS_AVAILABLE`.
   */
  Empty = 'EMPTY',
  /**
   * The vehicle or carriage has a small number of seats available. The amount of free seats out of
   * the total seats available to be considered small enough to fall into this category is
   * determined at the discretion of the producer.
   * SIRI nordic profile: less than ~50% of seats available.
   */
  FewSeatsAvailable = 'FEW_SEATS_AVAILABLE',
  /**
   * The vehicle is considered full by most measures, but may still be allowing passengers to
   * board.
   */
  Full = 'FULL',
  /**
   * The vehicle or carriage has a large number of seats available. The amount of free seats out of
   * the total seats available to be considered large enough to fall into this category is
   * determined at the discretion of the producer. There isn't a big difference between this and
   * EMPTY so it's possible to handle them as the same value, if one wants to limit the number of
   * different values.
   * SIRI nordic profile: more than ~50% of seats available.
   */
  ManySeatsAvailable = 'MANY_SEATS_AVAILABLE',
  /**
   * The vehicle or carriage is not accepting passengers.
   * SIRI nordic profile: if vehicle/carriage is not in use / unavailable, or passengers are only allowed
   * to alight due to e.g. crowding.
   */
  NotAcceptingPassengers = 'NOT_ACCEPTING_PASSENGERS',
  /** Default. There is no occupancy-data on this departure. */
  NoDataAvailable = 'NO_DATA_AVAILABLE',
  /**
   * The vehicle or carriage can currently accommodate only standing passengers.
   * SIRI nordic profile: less than ~10% of seats available.
   */
  StandingRoomOnly = 'STANDING_ROOM_ONLY'
}

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
  /** **TRIANGLE** optimization type can be used to set relative preferences of optimization factors. See argument `triangle`. */
  Triangle = 'TRIANGLE'
}

/**
 * The filter definition to include or exclude parking facilities used during routing.
 *
 * Logically, the filter algorithm work as follows:
 *
 * - The starting point is the set of all facilities, lets call it `A`.
 * - Then all `select` filters are applied to `A`, potentially reducing the number of facilities used.
 *   Let's call the result of this `B`.
 *   An empty `select` will lead to `A` being equal to `B`.
 * - Lastly, the `not` filters are applied to `B`, reducing the set further.
 *   Lets call this final set `C`.
 *   An empty `not` will lead to `B` being equal to `C`.
 * - The remaining parking facilities in `C` are used for routing.
 */
export type ParkingFilter = {
  /**
   * Exclude parking facilities based on their properties.
   *
   * If empty nothing is excluded from the initial set of facilities but may be filtered down
   * further by the `select` filter.
   */
  not?: InputMaybe<Array<ParkingFilterOperation>>;
  /**
   * Include parking facilities based on their properties.
   *
   * If empty everything is included from the initial set of facilities but may be filtered down
   * further by the `not` filter.
   */
  select?: InputMaybe<Array<ParkingFilterOperation>>;
};

export type ParkingFilterOperation = {
  /** Filter parking facilities based on their tag */
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

/** Entities, which are relevant for a pattern and can contain alerts */
export enum PatternAlertType {
  /** Alerts affecting the pattern's route's agency */
  Agency = 'AGENCY',
  /** Alerts affecting the pattern */
  Pattern = 'PATTERN',
  /** Alerts affecting the route that the pattern runs on */
  Route = 'ROUTE',
  /** Alerts affecting the route type of the route that the pattern runs on */
  RouteType = 'ROUTE_TYPE',
  /** Alerts affecting the stops which are on this pattern */
  StopsOnPattern = 'STOPS_ON_PATTERN',
  /** Alerts affecting the stops of the trips which run on this pattern */
  StopsOnTrips = 'STOPS_ON_TRIPS',
  /** Alerts affecting the trips which run on this pattern */
  Trips = 'TRIPS'
}

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

/** Street modes that can be used for access to the transit network from origin. */
export enum PlanAccessMode {
  /**
   * Cycling to a stop and boarding a vehicle with the bicycle.
   * Note, this can include walking when it's needed to walk the bicycle.
   * Access can use cycling only if the mode used for transfers
   * and egress is also `BICYCLE`.
   */
  Bicycle = 'BICYCLE',
  /**
   * Starting the itinerary with a bicycle and parking the bicycle to
   * a parking location. Note, this can include walking after parking
   * the bicycle or when it's needed to walk the bicycle.
   */
  BicycleParking = 'BICYCLE_PARKING',
  /**
   * Bicycle rental can use either station based systems or "floating"
   * vehicles which are not linked to a rental station. Note, if there are no
   * rental options available, access will include only walking. Also, this
   * can include walking before picking up or after dropping off the
   * bicycle or when it's needed to walk the bicycle.
   */
  BicycleRental = 'BICYCLE_RENTAL',
  /**
   * Driving to a stop and boarding a vehicle with the car.
   * Access can use driving only if the mode used for transfers
   * and egress is also `CAR`.
   */
  Car = 'CAR',
  /**
   * Getting dropped off by a car to a location that is accessible with a car.
   * Note, this can include walking after the drop-off.
   */
  CarDropOff = 'CAR_DROP_OFF',
  /**
   * Starting the itinerary with a car and parking the car to a parking location.
   * Note, this can include walking after parking the car.
   */
  CarParking = 'CAR_PARKING',
  /**
   * Car rental can use either station based systems or "floating"
   * vehicles which are not linked to a rental station. Note, if there are no
   * rental options available, access will include only walking. Also, this
   * can include walking before picking up or after dropping off the
   * car.
   */
  CarRental = 'CAR_RENTAL',
  /**
   * Flexible transit. This can include different forms of flexible transit that
   * can be defined in GTFS-Flex or in Netex. Note, this can include walking before
   * or after the flexible transit leg.
   */
  Flex = 'FLEX',
  /**
   * Scooter rental can use either station based systems or "floating"
   * vehicles which are not linked to a rental station. Note, if there are no
   * rental options available, access will include only walking. Also, this
   * can include walking before picking up or after dropping off the
   * scooter.
   */
  ScooterRental = 'SCOOTER_RENTAL',
  /** Walking to a stop. */
  Walk = 'WALK'
}

/** A coordinate used for a location in a plan query. */
export type PlanCoordinateInput = {
  /** Latitude as a WGS84 format number. */
  latitude: Scalars['CoordinateValue']['input'];
  /** Longitude as a WGS84 format number. */
  longitude: Scalars['CoordinateValue']['input'];
};

/** Plan date time options. Only one of the values should be defined. */
export type PlanDateTimeInput = {
  /**
   * Earliest departure date time. The returned itineraries should not
   * depart before this instant unless one is using paging to find earlier
   * itineraries. Note, it is not currently possible to define both
   * `earliestDeparture` and `latestArrival`.
   */
  earliestDeparture?: InputMaybe<Scalars['OffsetDateTime']['input']>;
  /**
   * Latest arrival time date time. The returned itineraries should not
   * arrive to the destination after this instant unless one is using
   * paging to find later itineraries. Note, it is not currently possible
   * to define both `earliestDeparture` and `latestArrival`.
   */
  latestArrival?: InputMaybe<Scalars['OffsetDateTime']['input']>;
};

/** Street mode that is used when searching for itineraries that don't use any transit. */
export enum PlanDirectMode {
  /**
   * Cycling from the origin to the destination. Note, this can include walking
   * when it's needed to walk the bicycle.
   */
  Bicycle = 'BICYCLE',
  /**
   * Starting the itinerary with a bicycle and parking the bicycle to
   * a parking location. Note, this can include walking after parking
   * the bicycle or when it's needed to walk the bicycle.
   */
  BicycleParking = 'BICYCLE_PARKING',
  /**
   * Bicycle rental can use either station based systems or "floating"
   * vehicles which are not linked to a rental station. Note, if there are no
   * rental options available, itinerary will include only walking.
   * Also, it can include walking before picking up or after dropping off the
   * bicycle or when it's needed to walk the bicycle.
   */
  BicycleRental = 'BICYCLE_RENTAL',
  /** Driving a car from the origin to the destination. */
  Car = 'CAR',
  /**
   * Starting the itinerary with a car and parking the car to a parking location.
   * Note, this can include walking after parking the car.
   */
  CarParking = 'CAR_PARKING',
  /**
   * Car rental can use either station based systems or "floating"
   * vehicles which are not linked to a rental station. Note, if there are no
   * rental options available, itinerary will include only walking. Also, this
   * can include walking before picking up or after dropping off the
   * car.
   */
  CarRental = 'CAR_RENTAL',
  /**
   * Flexible transit. This can include different forms of flexible transit that
   * can be defined in GTFS-Flex or in Netex. Note, this can include walking before
   * or after the flexible transit leg.
   */
  Flex = 'FLEX',
  /**
   * Scooter rental can use either station based systems or "floating"
   * vehicles which are not linked to a rental station. Note, if there are no
   * rental options available, itinerary will include only walking. Also, this
   * can include walking before picking up or after dropping off the
   * scooter.
   */
  ScooterRental = 'SCOOTER_RENTAL',
  /**
   * Walking from the origin to the destination. Note, this can include walking
   * when it's needed to walk the bicycle.
   */
  Walk = 'WALK'
}

/** Street modes that can be used for egress from the transit network to destination. */
export enum PlanEgressMode {
  /**
   * Cycling from a stop to the destination. Note, this can include walking when
   * it's needed to walk the bicycle. Egress can use cycling only if the mode used
   * for access and transfers is also `BICYCLE`.
   */
  Bicycle = 'BICYCLE',
  /**
   * Bicycle rental can use either station based systems or "floating"
   * vehicles which are not linked to a rental station. Note, if there are no
   * rental options available, egress will include only walking. Also, this
   * can include walking before picking up or after dropping off the
   * bicycle or when it's needed to walk the bicycle.
   */
  BicycleRental = 'BICYCLE_RENTAL',
  /**
   * Driving from a stop to the destination. Egress can use driving only if the mode
   * used for access and transfers is also `CAR`.
   */
  Car = 'CAR',
  /**
   * Getting picked up by a car from a location that is accessible with a car.
   * Note, this can include walking before the pickup.
   */
  CarPickup = 'CAR_PICKUP',
  /**
   * Car rental can use either station based systems or "floating"
   * vehicles which are not linked to a rental station. Note, if there are no
   * rental options available, egress will include only walking. Also, this
   * can include walking before picking up or after dropping off the
   * car.
   */
  CarRental = 'CAR_RENTAL',
  /**
   * Flexible transit. This can include different forms of flexible transit that
   * can be defined in GTFS-Flex or in Netex. Note, this can include walking before
   * or after the flexible transit leg.
   */
  Flex = 'FLEX',
  /**
   * Scooter rental can use either station based systems or "floating"
   * vehicles which are not linked to a rental station. Note, if there are no
   * rental options available, egress will include only walking. Also, this
   * can include walking before picking up or after dropping off the
   * scooter.
   */
  ScooterRental = 'SCOOTER_RENTAL',
  /** Walking from a stop to the destination. */
  Walk = 'WALK'
}

/**
 * Settings that control the behavior of itinerary filtering. **These are advanced settings and
 * should not be set by a user through user preferences.**
 */
export type PlanItineraryFilterInput = {
  /**
   * Pick one itinerary from each group after putting itineraries that are `85%` similar together,
   * if the given value is `0.85`, for example. Itineraries are grouped together based on relative
   * the distance of transit travel that is identical between the itineraries (access, egress and
   * transfers are ignored). The value must be at least `0.5`.
   */
  groupSimilarityKeepOne?: InputMaybe<Scalars['Ratio']['input']>;
  /**
   * Pick three itineraries from each group after putting itineraries that are `68%` similar together,
   * if the given value is `0.68`, for example. Itineraries are grouped together based on relative
   * the distance of transit travel that is identical between the itineraries (access, egress and
   * transfers are ignored). The value must be at least `0.5`.
   */
  groupSimilarityKeepThree?: InputMaybe<Scalars['Ratio']['input']>;
  /**
   * Of the itineraries grouped to maximum of three itineraries, how much worse can the non-grouped
   * legs be compared to the lowest cost. `2.0` means that they can be double the cost, and any
   * itineraries having a higher cost will be filtered away. Use a value lower than `1.0` to turn the
   * grouping off.
   */
  groupedOtherThanSameLegsMaxCostMultiplier?: InputMaybe<Scalars['Float']['input']>;
  /** Itinerary filter debug profile used to control the behaviour of itinerary filters. */
  itineraryFilterDebugProfile?: InputMaybe<ItineraryFilterDebugProfile>;
};

/**
 * Plan location settings. Location must be set. Label is optional
 * and used for naming the location.
 */
export type PlanLabeledLocationInput = {
  /**
   * A label that can be attached to the location. This label is then returned with the location
   * in the itineraries.
   */
  label?: InputMaybe<Scalars['String']['input']>;
  /** A location that has to be used in an itinerary. */
  location: PlanLocationInput;
};

/** Plan location. Either a coordinate or a stop location should be defined. */
export type PlanLocationInput = {
  /** Coordinate of the location. Note, either a coordinate or a stop location should be defined. */
  coordinate?: InputMaybe<PlanCoordinateInput>;
  /**
   * Stop, station, a group of stop places or multimodal stop place that should be used as
   * a location for the search. The trip doesn't have to use the given stop location for a
   * transit connection as it's possible to start walking to another stop from the given
   * location. If a station or a group of stop places is provided, a stop that makes the most
   * sense for the journey is picked as the location within the station or group of stop places.
   */
  stopLocation?: InputMaybe<PlanStopLocationInput>;
};

/** Mode selections for the plan search. */
export type PlanModesInput = {
  /**
   * Street mode that is used when searching for itineraries that don't use any transit.
   * If more than one mode is selected, at least one of them must be used but not necessarily all.
   * There are modes that automatically also use walking such as the rental modes. To force rental
   * to be used, this should only include the rental mode and not `WALK` in addition.
   * The default access mode is `WALK`.
   */
  direct?: InputMaybe<Array<PlanDirectMode>>;
  /** Should only the direct search without any transit be done. */
  directOnly?: InputMaybe<Scalars['Boolean']['input']>;
  /**
   * Modes for different phases of an itinerary when transit is included. Also
   * includes street mode selections related to connecting to the transit network
   * and transfers. By default, all transit modes are usable and `WALK` is used for
   * access, egress and transfers.
   */
  transit?: InputMaybe<PlanTransitModesInput>;
  /**
   * Should only the transit search be done and never suggest itineraries that don't
   * contain any transit legs.
   */
  transitOnly?: InputMaybe<Scalars['Boolean']['input']>;
};

/**
 * One of the listed stop locations must be visited on-board a transit vehicle or the journey must
 * alight or board at the location.
 */
export type PlanPassThroughViaLocationInput = {
  /** The label/name of the location. This is pass-through information and is not used in routing. */
  label?: InputMaybe<Scalars['String']['input']>;
  /**
   * A list of stop locations. A stop location can be a stop or a station.
   * It is enough to visit ONE of the locations listed.
   */
  stopLocationIds: Array<Scalars['String']['input']>;
};

/** Wrapper type for different types of preferences related to plan query. */
export type PlanPreferencesInput = {
  /** Accessibility preferences that affect both the street and transit routing. */
  accessibility?: InputMaybe<AccessibilityPreferencesInput>;
  /**
   * Street routing preferences used for ingress, egress and transfers. These do not directly affect
   * the transit legs but can change how preferable walking or cycling, for example, is compared to
   * transit.
   */
  street?: InputMaybe<PlanStreetPreferencesInput>;
  /** Transit routing preferences used for transit legs. */
  transit?: InputMaybe<TransitPreferencesInput>;
};

/**
 * Stop, station, a group of stop places or multimodal stop place that should be used as
 * a location for the search. The trip doesn't have to use the given stop location for a
 * transit connection as it's possible to start walking to another stop from the given
 * location. If a station or a group of stop places is provided, a stop that makes the most
 * sense for the journey is picked as the location within the station or group of stop places.
 */
export type PlanStopLocationInput = {
  /**
   * ID of the stop, station, a group of stop places or multimodal stop place. Format
   * should be `FeedId:StopLocationId`.
   */
  stopLocationId: Scalars['String']['input'];
};

/**
 * Street routing preferences used for ingress, egress and transfers. These do not directly affect
 * the transit legs but can change how preferable walking or cycling, for example, is compared to
 * transit.
 */
export type PlanStreetPreferencesInput = {
  /** Cycling related preferences. */
  bicycle?: InputMaybe<BicyclePreferencesInput>;
  /**
   * Car related preferences. These are not used for car travel as part of transit, such as
   * taxi travel.
   */
  car?: InputMaybe<CarPreferencesInput>;
  /** Scooter (kick or electrical) related preferences. */
  scooter?: InputMaybe<ScooterPreferencesInput>;
  /**
   * Walk related preferences. These are not used when walking a bicycle or a scooter as they
   * have their own preferences.
   */
  walk?: InputMaybe<WalkPreferencesInput>;
};

export enum PlanTransferMode {
  /**
   * Cycling between transit vehicles (typically between stops). Note, this can
   * include walking when it's needed to walk the bicycle. Transfers can only use
   * cycling if the mode used for access and egress is also `BICYCLE`.
   */
  Bicycle = 'BICYCLE',
  /**
   * Driving between transit vehicles. Transfers can only use driving if the mode
   * used for access and egress is also `CAR`.
   */
  Car = 'CAR',
  /** Walking between transit vehicles (typically between stops). */
  Walk = 'WALK'
}

/** Transit mode and a reluctance associated with it. */
export type PlanTransitModePreferenceInput = {
  /** Costs related to using a transit mode. */
  cost?: InputMaybe<TransitModePreferenceCostInput>;
  /** Transit mode that could be (but doesn't have to be) used in an itinerary. */
  mode: TransitMode;
};

/**
 * Modes for different phases of an itinerary when transit is included. Also includes street
 * mode selections related to connecting to the transit network and transfers.
 */
export type PlanTransitModesInput = {
  /**
   * Street mode that is used when searching for access to the transit network from origin.
   * If more than one mode is selected, at least one of them must be used but not necessarily all.
   * There are modes that automatically also use walking such as the rental modes. To force rental
   * to be used, this should only include the rental mode and not `WALK` in addition.
   * The default access mode is `WALK`.
   */
  access?: InputMaybe<Array<PlanAccessMode>>;
  /**
   * Street mode that is used when searching for egress to destination from the transit network.
   * If more than one mode is selected, at least one of them must be used but not necessarily all.
   * There are modes that automatically also use walking such as the rental modes. To force rental
   * to be used, this should only include the rental mode and not `WALK` in addition.
   * The default access mode is `WALK`.
   */
  egress?: InputMaybe<Array<PlanEgressMode>>;
  /**
   * Street mode that is used when searching for transfers. Selection of only one allowed for now.
   * The default transfer mode is `WALK`.
   */
  transfer?: InputMaybe<Array<PlanTransferMode>>;
  /**
   * Transit modes and reluctances associated with them. Each defined mode can be used in
   * an itinerary but doesn't have to be. If direct search is not disabled, there can be an
   * itinerary without any transit legs. By default, all transit modes are usable.
   */
  transit?: InputMaybe<Array<PlanTransitModePreferenceInput>>;
};

/**
 * A via-location is used to specifying a location as an intermediate place the router must
 * route through. The via-location is either a pass-through-location or a visit-via-location.
 */
export type PlanViaLocationInput = {
  /** Board, alight or pass-through(on-board) at the stop location. */
  passThrough?: InputMaybe<PlanPassThroughViaLocationInput>;
  /** Board or alight at a stop location or visit a coordinate. */
  visit?: InputMaybe<PlanVisitViaLocationInput>;
};

/**
 * A visit-via-location is a physical visit to one of the stop locations or coordinates listed. An
 * on-board visit does not count, the traveler must alight or board at the given stop for it to to
 * be accepted. To visit a coordinate, the traveler must walk(bike or drive) to the closest point
 * in the street network from a stop and back to another stop to join the transit network.
 *
 * NOTE! Coordinates are NOT supported yet.
 */
export type PlanVisitViaLocationInput = {
  /** The label/name of the location. This is pass-through information and is not used in routing. */
  label?: InputMaybe<Scalars['String']['input']>;
  /**
   * The minimum wait time is used to force the trip to stay the given duration at the
   * via-location before the itinerary is continued.
   */
  minimumWaitTime?: InputMaybe<Scalars['Duration']['input']>;
  /**
   * A list of stop locations. A stop location can be a stop or a station.
   * It is enough to visit ONE of the locations listed.
   */
  stopLocationIds?: InputMaybe<Array<Scalars['String']['input']>>;
};

export enum PropulsionType {
  /** Powered by gasoline combustion engine */
  Combustion = 'COMBUSTION',
  /** Powered by diesel combustion engine */
  CombustionDiesel = 'COMBUSTION_DIESEL',
  /** Powered by battery-powered electric motor with throttle mode */
  Electric = 'ELECTRIC',
  /** Provides electric motor assist only in combination with human propulsion - no throttle mode */
  ElectricAssist = 'ELECTRIC_ASSIST',
  /** Pedal or foot propulsion */
  Human = 'HUMAN',
  /** Powered by combined combustion engine and battery-powered motor */
  Hybrid = 'HYBRID',
  /** Powered by hydrogen fuel cell powered electric motor */
  HydrogenFuelCell = 'HYDROGEN_FUEL_CELL',
  /** Powered by combined combustion engine and battery-powered motor with plug-in charging */
  PlugInHybrid = 'PLUG_IN_HYBRID'
}

/**
 * Additional qualifier for a transport mode.
 * Note that qualifiers can only be used with certain transport modes.
 */
export enum Qualifier {
  /** The mode is used for the access part of the search. */
  Access = 'ACCESS',
  /** The mode is used for the direct street search. */
  Direct = 'DIRECT',
  /** The user can be dropped off by someone else riding a vehicle */
  Dropoff = 'DROPOFF',
  /** The mode is used for the egress part of the search. */
  Egress = 'EGRESS',
  /** Hailing a ride, for example via an app like Uber. */
  Hail = 'HAIL',
  /**
   * ~~HAVE~~
   * **Currently not used**
   * @deprecated Currently not used
   */
  Have = 'HAVE',
  /**
   * ~~KEEP~~
   * **Currently not used**
   * @deprecated Currently not used
   */
  Keep = 'KEEP',
  /**
   * The vehicle used must be left to a parking area before continuing the journey.
   * This qualifier is usable with transport modes `CAR` and `BICYCLE`.
   * Note that the vehicle is only parked if the journey is continued with public
   * transportation (e.g. if only `CAR` and `WALK` transport modes are allowed to
   * be used, the car will not be parked as it is used for the whole journey).
   */
  Park = 'PARK',
  /** The user can be picked up by someone else riding a vehicle */
  Pickup = 'PICKUP',
  /** The vehicle used for transport can be rented */
  Rent = 'RENT'
}

export enum RealtimeState {
  /** The trip has been added using a real-time update, i.e. the trip was not present in the GTFS feed. */
  Added = 'ADDED',
  /** The trip has been canceled by a real-time update. */
  Canceled = 'CANCELED',
  /**
   * The trip information has been updated and resulted in a different trip pattern
   * compared to the trip pattern of the scheduled trip.
   */
  Modified = 'MODIFIED',
  /** The trip information comes from the GTFS feed, i.e. no real-time update has been applied. */
  Scheduled = 'SCHEDULED',
  /** The trip information has been updated, but the trip pattern stayed the same as the trip pattern of the scheduled trip. */
  Updated = 'UPDATED'
}

/** Actions to take relative to the current position when engaging a walking/driving step. */
export enum RelativeDirection {
  CircleClockwise = 'CIRCLE_CLOCKWISE',
  CircleCounterclockwise = 'CIRCLE_COUNTERCLOCKWISE',
  Continue = 'CONTINUE',
  Depart = 'DEPART',
  Elevator = 'ELEVATOR',
  EnterStation = 'ENTER_STATION',
  ExitStation = 'EXIT_STATION',
  FollowSigns = 'FOLLOW_SIGNS',
  HardLeft = 'HARD_LEFT',
  HardRight = 'HARD_RIGHT',
  Left = 'LEFT',
  Right = 'RIGHT',
  SlightlyLeft = 'SLIGHTLY_LEFT',
  SlightlyRight = 'SLIGHTLY_RIGHT',
  UturnLeft = 'UTURN_LEFT',
  UturnRight = 'UTURN_RIGHT'
}

/** Entities that are relevant for routes that can contain alerts */
export enum RouteAlertType {
  /** Alerts affecting the route's agency. */
  Agency = 'AGENCY',
  /** Alerts affecting route's patterns. */
  Patterns = 'PATTERNS',
  /** Alerts directly affecting the route. */
  Route = 'ROUTE',
  /** Alerts affecting the route type of the route. */
  RouteType = 'ROUTE_TYPE',
  /** Alerts affecting the stops that are on the route. */
  StopsOnRoute = 'STOPS_ON_ROUTE',
  /** Alerts affecting the stops on some trips of the route. */
  StopsOnTrips = 'STOPS_ON_TRIPS',
  /** Alerts affecting the route's trips. */
  Trips = 'TRIPS'
}

export enum RoutingErrorCode {
  /**
   * The specified location is not close to any streets or transit stops currently loaded into the
   * system, even though it is generally within its bounds.
   *
   * This can happen when there is only transit but no street data coverage at the location in
   * question.
   */
  LocationNotFound = 'LOCATION_NOT_FOUND',
  /**
   * No stops are reachable from the start or end locations specified.
   *
   * You can try searching using a different access or egress mode, for example cycling instead of walking,
   * increase the walking/cycling/driving speed or have an administrator change the system's configuration
   * so that stops further away are considered.
   */
  NoStopsInRange = 'NO_STOPS_IN_RANGE',
  /**
   * No transit connection was found between the origin and destination within the operating day or
   * the next day, not even sub-optimal ones.
   */
  NoTransitConnection = 'NO_TRANSIT_CONNECTION',
  /**
   * A transit connection was found, but it was outside the search window. See the metadata for a token
   * for retrieving the result outside the search window.
   */
  NoTransitConnectionInSearchWindow = 'NO_TRANSIT_CONNECTION_IN_SEARCH_WINDOW',
  /**
   * The coordinates are outside the geographic bounds of the transit and street data currently loaded
   * into the system and therefore cannot return any results.
   */
  OutsideBounds = 'OUTSIDE_BOUNDS',
  /**
   * The date specified is outside the range of data currently loaded into the system as it is too
   * far into the future or the past.
   *
   * The specific date range of the system is configurable by an administrator and also depends on
   * the input data provided.
   */
  OutsideServicePeriod = 'OUTSIDE_SERVICE_PERIOD',
  /**
   * Transit connections were requested and found but because it is easier to just walk all the way
   * to the destination they were removed.
   *
   * If you want to still show the transit results, you need to make walking less desirable by
   * increasing the walk reluctance.
   */
  WalkingBetterThanTransit = 'WALKING_BETTER_THAN_TRANSIT'
}

/** What criteria should be used when optimizing a scooter route. */
export type ScooterOptimizationInput = {
  /** Define optimization by weighing three criteria. */
  triangle?: InputMaybe<TriangleScooterFactorsInput>;
  /** Use one of the predefined optimization types. */
  type?: InputMaybe<ScooterOptimizationType>;
};

/**
 * Predefined optimization alternatives for scooter routing. For more customization,
 * one can use the triangle factors.
 */
export enum ScooterOptimizationType {
  /** Emphasize flatness over safety or duration of the route. This option was previously called `FLAT`. */
  FlatStreets = 'FLAT_STREETS',
  /**
   * Completely ignore the elevation differences and prefer the streets, that are evaluated
   * to be safest for scooters, even more than with the `SAFE_STREETS` option.
   * Safety can also include other concerns such as convenience and general preferences by taking
   * into account road surface etc.  Note, currently the same criteria is used both for cycling and
   * scooter travel to determine how safe streets are for cycling or scooter.
   * This option was previously called `GREENWAYS`.
   */
  SafestStreets = 'SAFEST_STREETS',
  /**
   * Emphasize scooter safety over flatness or duration of the route. Safety can also include other
   * concerns such as convenience and general preferences by taking into account road surface etc.
   * Note, currently the same criteria is used both for cycling and scooter travel to determine how
   * safe streets are for cycling or scooter. This option was previously called `SAFE`.
   */
  SafeStreets = 'SAFE_STREETS',
  /**
   * Search for routes with the shortest duration while ignoring the scooter safety
   * of the streets. The routes should still follow local regulations, but currently scooters
   * are only allowed on the same streets as bicycles which might not be accurate for each country
   * or with different types of scooters. Routes can include steep streets, if they are
   * the fastest alternatives. This option was previously called `QUICK`.
   */
  ShortestDuration = 'SHORTEST_DURATION'
}

/** Preferences related to travel with a scooter (kick or e-scooter). */
export type ScooterPreferencesInput = {
  /** What criteria should be used when optimizing a scooter route. */
  optimization?: InputMaybe<ScooterOptimizationInput>;
  /**
   * A multiplier for how bad riding a scooter is compared to being in transit
   * for equal lengths of time.
   */
  reluctance?: InputMaybe<Scalars['Reluctance']['input']>;
  /** Scooter rental related preferences. */
  rental?: InputMaybe<ScooterRentalPreferencesInput>;
  /**
   * Maximum speed on flat ground while riding a scooter. Note, this speed is higher than
   * the average speed will be in itineraries as this is the maximum speed but there are
   * factors that slow down the travel such as crossings, intersections and elevation changes.
   */
  speed?: InputMaybe<Scalars['Speed']['input']>;
};

/** Preferences related to scooter rental (station based or floating scooter rental). */
export type ScooterRentalPreferencesInput = {
  /** Rental networks which can be potentially used as part of an itinerary. */
  allowedNetworks?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Rental networks which cannot be used as part of an itinerary. */
  bannedNetworks?: InputMaybe<Array<Scalars['String']['input']>>;
  /**
   * Is it possible to arrive to the destination with a rented scooter and does it
   * come with an extra cost.
   */
  destinationScooterPolicy?: InputMaybe<DestinationScooterPolicyInput>;
};

/** Entities, which are relevant for a stop and can contain alerts */
export enum StopAlertType {
  /** Alerts affecting the agencies of the routes going through the stop */
  AgenciesOfRoutes = 'AGENCIES_OF_ROUTES',
  /** Alerts affecting the stop's patterns */
  Patterns = 'PATTERNS',
  /** Alerts affecting the routes that go through the stop */
  Routes = 'ROUTES',
  /** Alerts affecting the stop */
  Stop = 'STOP',
  /** Alerts affecting the stop on specific routes */
  StopOnRoutes = 'STOP_ON_ROUTES',
  /** Alerts affecting the stop on specific trips */
  StopOnTrips = 'STOP_ON_TRIPS',
  /** Alerts affecting the trips that go through this stop */
  Trips = 'TRIPS'
}

export type TimetablePreferencesInput = {
  /**
   * When false, real-time updates are considered during the routing.
   * In practice, when this option is set as true, some of the suggestions might not be
   * realistic as the transfers could be invalid due to delays,
   * trips can be cancelled or stops can be skipped.
   */
  excludeRealTimeUpdates?: InputMaybe<Scalars['Boolean']['input']>;
  /**
   * When true, departures that have been cancelled ahead of time will be
   * included during the routing. This means that an itinerary can include
   * a cancelled departure while some other alternative that contains no cancellations
   * could be filtered out as the alternative containing a cancellation would normally
   * be better.
   */
  includePlannedCancellations?: InputMaybe<Scalars['Boolean']['input']>;
  /**
   * When true, departures that have been cancelled through a real-time feed will be
   * included during the routing. This means that an itinerary can include
   * a cancelled departure while some other alternative that contains no cancellations
   * could be filtered out as the alternative containing a cancellation would normally
   * be better. This option can't be set to true while `includeRealTimeUpdates` is false.
   */
  includeRealTimeCancellations?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Preferences related to transfers between transit vehicles (typically between stops). */
export type TransferPreferencesInput = {
  /** A static cost that is added for each transfer on top of other costs. */
  cost?: InputMaybe<Scalars['Cost']['input']>;
  /**
   * How many additional transfers there can be at maximum compared to the itinerary with the
   * least number of transfers.
   */
  maximumAdditionalTransfers?: InputMaybe<Scalars['Int']['input']>;
  /** How many transfers there can be at maximum in an itinerary. */
  maximumTransfers?: InputMaybe<Scalars['Int']['input']>;
  /**
   * A global minimum transfer time (in seconds) that specifies the minimum amount of time
   * that must pass between exiting one transit vehicle and boarding another. This time is
   * in addition to time it might take to walk between transit stops. Setting this value
   * as `PT0S`, for example, can lead to passenger missing a connection when the vehicle leaves
   * ahead of time or the passenger arrives to the stop later than expected.
   */
  slack?: InputMaybe<Scalars['Duration']['input']>;
};

/**
 * Transit modes include modes that are used within organized transportation networks
 * run by public transportation authorities, taxi companies etc.
 * Equivalent to GTFS route_type or to NeTEx TransportMode.
 */
export enum TransitMode {
  Airplane = 'AIRPLANE',
  Bus = 'BUS',
  CableCar = 'CABLE_CAR',
  /** Private car trips shared with others. */
  Carpool = 'CARPOOL',
  Coach = 'COACH',
  Ferry = 'FERRY',
  Funicular = 'FUNICULAR',
  Gondola = 'GONDOLA',
  /** Railway in which the track consists of a single rail or a beam. */
  Monorail = 'MONORAIL',
  /** This includes long or short distance trains. */
  Rail = 'RAIL',
  /** Subway or metro, depending on the local terminology. */
  Subway = 'SUBWAY',
  /** A taxi, possibly operated by a public transport agency. */
  Taxi = 'TAXI',
  Tram = 'TRAM',
  /** Electric buses that draw power from overhead wires using poles. */
  Trolleybus = 'TROLLEYBUS'
}

/** Costs related to using a transit mode. */
export type TransitModePreferenceCostInput = {
  /** A cost multiplier of transit leg travel time. */
  reluctance: Scalars['Reluctance']['input'];
};

/** Transit routing preferences used for transit legs. */
export type TransitPreferencesInput = {
  /** Preferences related to alighting from a transit vehicle. */
  alight?: InputMaybe<AlightPreferencesInput>;
  /**
   * Preferences related to boarding a transit vehicle. Note, board costs for each street mode
   * can be found under the street mode preferences.
   */
  board?: InputMaybe<BoardPreferencesInput>;
  /** Preferences related to cancellations and real-time. */
  timetable?: InputMaybe<TimetablePreferencesInput>;
  /** Preferences related to transfers between transit vehicles (typically between stops). */
  transfer?: InputMaybe<TransferPreferencesInput>;
};

/** Transportation mode which can be used in the itinerary */
export type TransportMode = {
  mode: Mode;
  /** Optional additional qualifier for transport mode, e.g. `RENT` */
  qualifier?: InputMaybe<Qualifier>;
};

/**
 * Relative importance of optimization factors. Only effective for bicycling legs.
 * Invariant: `safety + flatness + time == 1`
 */
export type TriangleCyclingFactorsInput = {
  /** Relative importance of flat terrain */
  flatness: Scalars['Ratio']['input'];
  /**
   * Relative importance of cycling safety, but this factor can also include other
   * concerns such as convenience and general cyclist preferences by taking into account
   * road surface etc.
   */
  safety: Scalars['Ratio']['input'];
  /** Relative importance of duration */
  time: Scalars['Ratio']['input'];
};

/**
 * Relative importance of optimization factors. Only effective for scooter legs.
 * Invariant: `safety + flatness + time == 1`
 */
export type TriangleScooterFactorsInput = {
  /** Relative importance of flat terrain */
  flatness: Scalars['Ratio']['input'];
  /**
   * Relative importance of scooter safety, but this factor can also include other
   * concerns such as convenience and general scooter preferences by taking into account
   * road surface etc.
   */
  safety: Scalars['Ratio']['input'];
  /** Relative importance of duration */
  time: Scalars['Ratio']['input'];
};

/** Entities, which are relevant for a trip and can contain alerts */
export enum TripAlertType {
  /** Alerts affecting the trip's agency */
  Agency = 'AGENCY',
  /** Alerts affecting the trip's pattern */
  Pattern = 'PATTERN',
  /** Alerts affecting the trip's route */
  Route = 'ROUTE',
  /** Alerts affecting the route type of the trip's route */
  RouteType = 'ROUTE_TYPE',
  /**
   * Alerts affecting the stops visited on the trip.
   * Some of the alerts can only affect the trip or its route on the stop.
   */
  StopsOnTrip = 'STOPS_ON_TRIP',
  /** Alerts affecting the trip */
  Trip = 'TRIP'
}

/** Preferences for parking facilities used during the routing. */
export type VehicleParkingInput = {
  /**
   * Selection filters to include or exclude parking facilities.
   * An empty list will include all facilities in the routing search.
   */
  filters?: InputMaybe<Array<InputMaybe<ParkingFilter>>>;
  /**
   * If non-empty every parking facility that doesn't match this set of conditions will
   * receive an extra cost (defined by `unpreferredCost`) and therefore avoided.
   */
  preferred?: InputMaybe<Array<InputMaybe<ParkingFilter>>>;
  /**
   * If `preferred` is non-empty, using a parking facility that doesn't contain
   * at least one of the preferred conditions, will receive this extra cost and therefore avoided if
   * preferred options are available.
   */
  unpreferredCost?: InputMaybe<Scalars['Int']['input']>;
};

/**
 * The state of the vehicle parking. TEMPORARILY_CLOSED and CLOSED are distinct states so that they
 * may be represented differently to the user.
 */
export enum VehicleParkingState {
  /** Can't be used for park and ride. */
  Closed = 'CLOSED',
  /** May be used for park and ride. */
  Operational = 'OPERATIONAL',
  /** Can't be used for park and ride. */
  TemporarilyClosed = 'TEMPORARILY_CLOSED'
}

/** How close the vehicle is to the stop. */
export enum VehicleStopStatus {
  /** The vehicle is just about to arrive at the stop (on a stop display, the vehicle symbol typically flashes). */
  IncomingAt = 'INCOMING_AT',
  /** The vehicle has departed the previous stop and is in transit. */
  InTransitTo = 'IN_TRANSIT_TO',
  /** The vehicle is standing at the stop. */
  StoppedAt = 'STOPPED_AT'
}

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

/** Preferences related to walking (excluding walking a bicycle or a scooter). */
export type WalkPreferencesInput = {
  /** The cost of boarding a vehicle while walking. */
  boardCost?: InputMaybe<Scalars['Cost']['input']>;
  /** A multiplier for how bad walking is compared to being in transit for equal lengths of time. */
  reluctance?: InputMaybe<Scalars['Reluctance']['input']>;
  /**
   * Factor for how much the walk safety is considered in routing. Value should be between 0 and 1.
   * If the value is set to be 0, safety is ignored.
   */
  safetyFactor?: InputMaybe<Scalars['Ratio']['input']>;
  /**
   * Maximum walk speed on flat ground. Note, this speed is higher than the average speed
   * will be in itineraries as this is the maximum speed but there are
   * factors that slow down walking such as crossings, intersections and elevation changes.
   */
  speed?: InputMaybe<Scalars['Speed']['input']>;
};

export enum WheelchairBoarding {
  /** Wheelchair boarding is not possible at this stop. */
  NotPossible = 'NOT_POSSIBLE',
  /** There is no accessibility information for the stop. */
  NoInformation = 'NO_INFORMATION',
  /** At least some vehicles at this stop can be boarded by a rider in a wheelchair. */
  Possible = 'POSSIBLE'
}

/**
 * Wheelchair related preferences. Note, this is the only from of accessibilty available
 * currently and is sometimes is used for other accessibility needs as well.
 */
export type WheelchairPreferencesInput = {
  /**
   * Is wheelchair accessibility considered in routing. Note, this does not guarantee
   * that the itineraries are wheelchair accessible as there can be data issues.
   */
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
};

export type RouteQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type RouteQuery = { __typename?: 'QueryType', route?: { __typename?: 'Route', gtfsId: string, shortName?: string | null, longName?: string | null, patterns?: Array<{ __typename?: 'Pattern', headsign?: string | null, geometry?: Array<{ __typename?: 'Coordinates', lat?: number | null, lon?: number | null } | null> | null } | null> | null } | null };

export type RouteForRailFragment = { __typename?: 'Route', gtfsId: string, shortName?: string | null, longName?: string | null, patterns?: Array<{ __typename?: 'Pattern', headsign?: string | null, geometry?: Array<{ __typename?: 'Coordinates', lat?: number | null, lon?: number | null } | null> | null } | null> | null };

export const RouteForRailFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RouteForRail"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Route"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gtfsId"}},{"kind":"Field","name":{"kind":"Name","value":"shortName"}},{"kind":"Field","name":{"kind":"Name","value":"longName"}},{"kind":"Field","name":{"kind":"Name","value":"patterns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"headsign"}},{"kind":"Field","name":{"kind":"Name","value":"geometry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lon"}}]}}]}}]}}]} as unknown as DocumentNode<RouteForRailFragment, unknown>;
export const RouteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Route"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"route"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RouteForRail"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RouteForRail"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Route"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gtfsId"}},{"kind":"Field","name":{"kind":"Name","value":"shortName"}},{"kind":"Field","name":{"kind":"Name","value":"longName"}},{"kind":"Field","name":{"kind":"Name","value":"patterns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"headsign"}},{"kind":"Field","name":{"kind":"Name","value":"geometry"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lon"}}]}}]}}]}}]} as unknown as DocumentNode<RouteQuery, RouteQueryVariables>;