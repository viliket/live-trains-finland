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
  Duration: any;
  GeoJson: any;
  Grams: any;
  Long: any;
  Polyline: any;
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

/** A public transport agency */
export type Agency = Node & {
  __typename?: 'Agency';
  /**
   * By default, list of alerts which have an effect on all operations of the agency (e.g. a strike).
   * It's also possible to return other relevant alerts through defining types.
   */
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


/** A public transport agency */
export type AgencyAlertsArgs = {
  types?: InputMaybe<Array<InputMaybe<AgencyAlertType>>>;
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

/** Alert of a current or upcoming disruption in public transportation */
export type Alert = Node & {
  __typename?: 'Alert';
  /**
   * Agency affected by the disruption. Note that this value is present only if the
   * disruption has an effect on all operations of the agency (e.g. in case of a strike).
   * @deprecated Alert can have multiple affected entities now instead of there being duplicate alerts
   * for different entities. This will return only one of the affected agencies.
   * Use entities instead.
   */
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
  /** Entities affected by the disruption. */
  entities?: Maybe<Array<Maybe<AlertEntity>>>;
  /** The feed in which this alert was published */
  feed?: Maybe<Scalars['String']>;
  /** Global object ID provided by Relay. This value can be used to refetch this object using **node** query. */
  id: Scalars['ID'];
  /**
   * Patterns affected by the disruption
   * @deprecated This will always return an empty list. Use entities instead.
   */
  patterns?: Maybe<Array<Maybe<Pattern>>>;
  /**
   * Route affected by the disruption
   * @deprecated Alert can have multiple affected entities now instead of there being duplicate alerts
   * for different entities. This will return only one of the affected routes.
   * Use entities instead.
   */
  route?: Maybe<Route>;
  /**
   * Stop affected by the disruption
   * @deprecated Alert can have multiple affected entities now instead of there being duplicate alerts
   * for different entities. This will return only one of the affected stops.
   * Use entities instead.
   */
  stop?: Maybe<Stop>;
  /**
   * Trip affected by the disruption
   * @deprecated Alert can have multiple affected entities now instead of there being duplicate alerts
   * for different entities. This will return only one of the affected trips.
   * Use entities instead.
   */
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

/** Entity related to an alert */
export type AlertEntity = Agency | Pattern | Route | RouteType | Stop | StopOnRoute | StopOnTrip | Trip | Unknown;

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
  /** Opening hours of the parking facility */
  openingHours?: Maybe<OpeningHours>;
  /** If true, value of `spacesAvailable` is updated from a real-time source. */
  realtime?: Maybe<Scalars['Boolean']>;
  /** Number of spaces available for bikes */
  spacesAvailable?: Maybe<Scalars['Int']>;
  /** Source specific tags of the bike park, which describe the available features. */
  tags?: Maybe<Array<Maybe<Scalars['String']>>>;
};


/** Bike park represents a location where bicycles can be parked. */
export type BikeParkNameArgs = {
  language?: InputMaybe<Scalars['String']>;
};

/** Bike rental station represents a location where users can rent bicycles for a fee. */
export type BikeRentalStation = Node & PlaceInterface & {
  __typename?: 'BikeRentalStation';
  /**
   * If true, bikes can be returned to this station if the station has spaces available
   * or allows overloading.
   */
  allowDropoff?: Maybe<Scalars['Boolean']>;
  /** If true, bikes can be currently returned to this station. */
  allowDropoffNow?: Maybe<Scalars['Boolean']>;
  /** If true, bikes can be returned even if spacesAvailable is zero or bikes > capacity. */
  allowOverloading?: Maybe<Scalars['Boolean']>;
  /** If true, bikes can be picked up from this station if the station has bikes available. */
  allowPickup?: Maybe<Scalars['Boolean']>;
  /** If true, bikes can be currently picked up from this station. */
  allowPickupNow?: Maybe<Scalars['Boolean']>;
  /**
   * Number of bikes currently available on the rental station.
   * See field `allowPickupNow` to know if is currently possible to pick up a bike.
   */
  bikesAvailable?: Maybe<Scalars['Int']>;
  /** Nominal capacity (number of racks) of the rental station. */
  capacity?: Maybe<Scalars['Int']>;
  /** Global object ID provided by Relay. This value can be used to refetch this object using **node** query. */
  id: Scalars['ID'];
  /** Latitude of the bike rental station (WGS 84) */
  lat?: Maybe<Scalars['Float']>;
  /** Longitude of the bike rental station (WGS 84) */
  lon?: Maybe<Scalars['Float']>;
  /** Name of the bike rental station */
  name: Scalars['String'];
  networks?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** If true, station is on and in service. */
  operative?: Maybe<Scalars['Boolean']>;
  /**
   * If true, values of `bikesAvailable` and `spacesAvailable` are updated from a
   * real-time source. If false, values of `bikesAvailable` and `spacesAvailable`
   * are always the total capacity divided by two.
   */
  realtime?: Maybe<Scalars['Boolean']>;
  /** Platform-specific URLs to begin renting a bike from this station. */
  rentalUris?: Maybe<BikeRentalStationUris>;
  /**
   * Number of free spaces currently available on the rental station.
   * Note that this value being 0 does not necessarily indicate that bikes cannot be returned
   * to this station, as for example it might be possible to leave the bike in the vicinity of
   * the rental station, even if the bike racks don't have any spaces available.
   * See field `allowDropoffNow` to know if is currently possible to return a bike.
   */
  spacesAvailable?: Maybe<Scalars['Int']>;
  /**
   * A description of the current state of this bike rental station, e.g. "Station on"
   * @deprecated Use operative instead
   */
  state?: Maybe<Scalars['String']>;
  /** ID of the bike rental station */
  stationId?: Maybe<Scalars['String']>;
};

export type BikeRentalStationUris = {
  __typename?: 'BikeRentalStationUris';
  /**
   * A URI that can be passed to an Android app with an {@code android.intent.action.VIEW} Android
   * intent to support Android Deep Links.
   * May be null if a rental URI does not exist.
   */
  android?: Maybe<Scalars['String']>;
  /**
   * A URI that can be used on iOS to launch the rental app for this station.
   * May be {@code null} if a rental URI does not exist.
   */
  ios?: Maybe<Scalars['String']>;
  /**
   * A URL that can be used by a web browser to show more information about renting a vehicle at
   * this station.
   * May be {@code null} if a rental URL does not exist.
   */
  web?: Maybe<Scalars['String']>;
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
 * Booking information for a stop time which has special requirements to use, like calling ahead or
 * using an app.
 */
export type BookingInfo = {
  __typename?: 'BookingInfo';
  /** Contact information for reaching the service provider */
  contactInfo?: Maybe<ContactInfo>;
  /** A message specific to the drop off */
  dropOffMessage?: Maybe<Scalars['String']>;
  /** When is the earliest time the service can be booked. */
  earliestBookingTime?: Maybe<BookingTime>;
  /** When is the latest time the service can be booked */
  latestBookingTime?: Maybe<BookingTime>;
  /** Maximum number of seconds before travel to make the request */
  maximumBookingNoticeSeconds?: Maybe<Scalars['Long']>;
  /** A general message for those booking the service */
  message?: Maybe<Scalars['String']>;
  /** Minimum number of seconds before travel to make the request */
  minimumBookingNoticeSeconds?: Maybe<Scalars['Long']>;
  /** A message specific to the pick up */
  pickupMessage?: Maybe<Scalars['String']>;
};

/** Temporal restriction for a booking */
export type BookingTime = {
  __typename?: 'BookingTime';
  /** How many days before the booking */
  daysPrior?: Maybe<Scalars['Int']>;
  /** Time of the booking */
  time?: Maybe<Scalars['String']>;
};

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
  /**
   * Opening hours for the selected dates using the local time of the park.
   * Each date can have multiple time spans.
   */
  openingHours?: Maybe<OpeningHours>;
  /** If true, value of `spacesAvailable` is updated from a real-time source. */
  realtime?: Maybe<Scalars['Boolean']>;
  /** Number of currently available parking spaces at the car park */
  spacesAvailable?: Maybe<Scalars['Int']>;
  /** Source specific tags of the car park, which describe the available features. */
  tags?: Maybe<Array<Maybe<Scalars['String']>>>;
};


/** Car park represents a location where cars can be parked. */
export type CarParkNameArgs = {
  language?: InputMaybe<Scalars['String']>;
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

/** Contact information for booking an on-demand or flexible service. */
export type ContactInfo = {
  __typename?: 'ContactInfo';
  /** Additional notes about the contacting the service provider */
  additionalDetails?: Maybe<Scalars['String']>;
  /** URL to the booking systems of the service */
  bookingUrl?: Maybe<Scalars['String']>;
  /** Name of the person to contact */
  contactPerson?: Maybe<Scalars['String']>;
  /** Email to contact */
  eMail?: Maybe<Scalars['String']>;
  /** Fax number to contact */
  faxNumber?: Maybe<Scalars['String']>;
  /** URL containing general information about the service */
  infoUrl?: Maybe<Scalars['String']>;
  /** Phone number to contact */
  phoneNumber?: Maybe<Scalars['String']>;
};

export type Coordinates = {
  __typename?: 'Coordinates';
  /** Latitude (WGS 84) */
  lat?: Maybe<Scalars['Float']>;
  /** Longitude (WGS 84) */
  lon?: Maybe<Scalars['Float']>;
};

/** A currency */
export type Currency = {
  __typename?: 'Currency';
  /** ISO-4217 currency code, for example `USD` or `EUR`. */
  code: Scalars['String'];
  /**
   * Fractional digits of this currency. A value of 2 would express that in this currency
   * 100 minor units make up one major unit.
   *
   * Expressed more concretely: 100 Euro-cents make up one Euro.
   *
   * Note: Some currencies don't even have any fractional digits, for example the Japanese Yen.
   *
   * See also https://en.wikipedia.org/wiki/ISO_4217#Minor_unit_fractions
   */
  digits: Scalars['Int'];
};

/**
 * The standard case of a fare product: it only has a single price to be paid by the passenger
 * and no discounts are applied.
 */
export type DefaultFareProduct = FareProduct & {
  __typename?: 'DefaultFareProduct';
  /** Identifier for the fare product. */
  id: Scalars['String'];
  /**
   * The 'medium' that this product applies to, for example "Oyster Card" or "Berlin Ticket App".
   *
   * This communicates to riders that a specific way of buying or keeping this product is required.
   */
  medium?: Maybe<FareMedium>;
  /** Human readable name of the product, for example example "Day pass" or "Single ticket". */
  name: Scalars['String'];
  /** The price of the product */
  price: Money;
  /** The category of riders this product applies to, for example students or pensioners. */
  riderCategory?: Maybe<RiderCategory>;
};

/**
 * Departure row is a combination of a pattern and a stop of that pattern.
 *
 * They are de-duplicated so for each pattern there will only be a single departure row.
 *
 * This is useful if you want to show a list of stop/pattern combinations but want each pattern to be
 * listed only once.
 */
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


/**
 * Departure row is a combination of a pattern and a stop of that pattern.
 *
 * They are de-duplicated so for each pattern there will only be a single departure row.
 *
 * This is useful if you want to show a list of stop/pattern combinations but want each pattern to be
 * listed only once.
 */
export type DepartureRowStoptimesArgs = {
  numberOfDepartures?: InputMaybe<Scalars['Int']>;
  omitCanceled?: InputMaybe<Scalars['Boolean']>;
  omitNonPickups?: InputMaybe<Scalars['Boolean']>;
  startTime?: InputMaybe<Scalars['Long']>;
  timeRange?: InputMaybe<Scalars['Int']>;
};

export type Emissions = {
  __typename?: 'Emissions';
  /** CO₂ emissions in grams. */
  co2?: Maybe<Scalars['Grams']>;
};

/** A 'medium' that a fare product applies to, for example cash, 'Oyster Card' or 'DB Navigator App'. */
export type FareMedium = {
  __typename?: 'FareMedium';
  /** ID of the medium */
  id: Scalars['String'];
  /** Human readable name of the medium. */
  name?: Maybe<Scalars['String']>;
};

/** A fare product (a ticket) to be bought by a passenger */
export type FareProduct = {
  /** Identifier for the fare product. */
  id: Scalars['String'];
  /**
   * The 'medium' that this product applies to, for example "Oyster Card" or "Berlin Ticket App".
   *
   * This communicates to riders that a specific way of buying or keeping this product is required.
   */
  medium?: Maybe<FareMedium>;
  /** Human readable name of the product, for example example "Day pass" or "Single ticket". */
  name: Scalars['String'];
  /** The category of riders this product applies to, for example students or pensioners. */
  riderCategory?: Maybe<RiderCategory>;
};

/** A container for both a fare product (a ticket) and its relationship to the itinerary. */
export type FareProductUse = {
  __typename?: 'FareProductUse';
  /**
   * Represents the use of a single instance of a fare product throughout the itinerary. It can
   * be used to cross-reference and de-duplicate fare products that are applicable for more than one
   * leg.
   *
   * If you want to uniquely identify the fare product itself (not its use) use the product's `id`.
   *
   * ### Example: Day pass
   *
   * The day pass is valid for both legs in the itinerary. It is listed as the applicable `product` for each leg,
   * and the same FareProductUse id is shown, indicating that only one pass was used/bought.
   *
   * **Illustration**
   * ```yaml
   * itinerary:
   *   leg1:
   *     fareProducts:
   *       id: "AAA" // id of a FareProductUse instance
   *       product:
   *         id: "day-pass" // product id
   *         name: "Day Pass"
   *   leg2:
   *     fareProducts:
   *       id: "AAA" // identical to leg1. the passenger needs to buy ONE pass, not two.
   *       product:
   *         id: "day-pass"  // product id
   *         name: "Day Pass"
   * ```
   *
   * **It is the responsibility of the API consumers to display the day pass as a product for the
   * entire itinerary rather than two day passes!**
   *
   * ### Example: Several single tickets
   *
   * If you have two legs and need to buy two single tickets they will appear in each leg with the
   * same `FareProduct.id` but different `FareProductUse.id`.
   *
   * **Illustration**
   * ```yaml
   * itinerary:
   *   leg1:
   *     fareProducts:
   *       id: "AAA" // id of a FareProductUse instance, not product id
   *       product:
   *         id: "single-ticket" // product id
   *         name: "Single Ticket"
   *   leg2:
   *     fareProducts:
   *       id: "BBB" // different to leg1. the passenger needs to buy two single tickets.
   *       product:
   *         id: "single-ticket"  // product id
   *         name: "Single Ticket"
   * ```
   */
  id: Scalars['String'];
  /** The purchasable fare product */
  product?: Maybe<FareProduct>;
};

/** A feed provides routing data (stops, routes, timetables, etc.) from one or more public transport agencies. */
export type Feed = {
  __typename?: 'Feed';
  /** List of agencies which provide data to this feed */
  agencies?: Maybe<Array<Maybe<Agency>>>;
  /** Alerts relevant for the feed. */
  alerts?: Maybe<Array<Maybe<Alert>>>;
  /** ID of the feed */
  feedId: Scalars['String'];
};


/** A feed provides routing data (stops, routes, timetables, etc.) from one or more public transport agencies. */
export type FeedAlertsArgs = {
  types?: InputMaybe<Array<FeedAlertType>>;
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
  /** Stops */
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

export type Geometry = {
  __typename?: 'Geometry';
  /** The number of points in the string */
  length?: Maybe<Scalars['Int']>;
  /**
   * List of coordinates of in a Google encoded polyline format (see
   * https://developers.google.com/maps/documentation/utilities/polylinealgorithm)
   */
  points?: Maybe<Scalars['Polyline']>;
};

export type InputBanned = {
  /** A comma-separated list of banned agency ids */
  agencies?: InputMaybe<Scalars['String']>;
  /** A comma-separated list of banned route ids */
  routes?: InputMaybe<Scalars['String']>;
  /**
   * A comma-separated list of banned stop ids. Note that these stops are only
   * banned for boarding and disembarking vehicles — it is possible to get an
   * itinerary where a vehicle stops at one of these stops
   */
  stops?: InputMaybe<Scalars['String']>;
  /**
   * A comma-separated list of banned stop ids. Only itineraries where these stops
   * are not travelled through are returned, e.g. if a bus route stops at one of
   * these stops, that route will not be used in the itinerary, even if the stop is
   * not used for boarding or disembarking the vehicle.
   */
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

export enum InputField {
  DateTime = 'DATE_TIME',
  From = 'FROM',
  To = 'TO'
}

export type InputFilters = {
  /** Bike parks to include by id. */
  bikeParks?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Bike rentals to include by id (without network identifier). */
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
  /**
   * Penalty added for using every route that is not preferred if user set any
   * route as preferred. We return number of seconds that we are willing to wait
   * for preferred route.
   */
  otherThanPreferredRoutesPenalty?: InputMaybe<Scalars['Int']>;
  /** A comma-separated list of ids of the routes preferred by the user. */
  routes?: InputMaybe<Scalars['String']>;
};

/**
 * Relative importances of optimization factors. Only effective for bicycling legs.
 * Invariant: `timeFactor + slopeFactor + safetyFactor == 1`
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
  /**
   * An cost function used to calculate penalty for an unpreferred route/agency. Function should return
   * number of seconds that we are willing to wait for unpreferred route/agency.
   * String must be of the format:
   * `A + B x`, where A is fixed penalty and B is a multiplier of transit leg travel time x.
   * For example: `600 + 2.0 x`
   */
  unpreferredCost?: InputMaybe<Scalars['String']>;
};

export type Itinerary = {
  __typename?: 'Itinerary';
  /**
   * Computes a numeric accessibility score between 0 and 1.
   *
   * The closer the value is to 1 the better the wheelchair-accessibility of this itinerary is.
   * A value of `null` means that no score has been computed, not that the leg is inaccessible.
   *
   * More information is available in the [feature documentation](https://docs.opentripplanner.org/en/dev-2.x/sandbox/IBIAccessibilityScore/).
   */
  accessibilityScore?: Maybe<Scalars['Float']>;
  /** Does the itinerary end without dropping off the rented bicycle: */
  arrivedAtDestinationWithRentedBicycle?: Maybe<Scalars['Boolean']>;
  /** Duration of the trip on this itinerary, in seconds. */
  duration?: Maybe<Scalars['Long']>;
  /** How much elevation is gained, in total, over the course of the itinerary, in meters. */
  elevationGained?: Maybe<Scalars['Float']>;
  /** How much elevation is lost, in total, over the course of the itinerary, in meters. */
  elevationLost?: Maybe<Scalars['Float']>;
  /** Emissions of this itinerary per traveler. */
  emissionsPerPerson?: Maybe<Emissions>;
  /** Time when the user arrives to the destination.. Format: Unix timestamp in milliseconds. */
  endTime?: Maybe<Scalars['Long']>;
  /**
   * Information about the fares for this itinerary. This is primarily a GTFS Fares V1 interface
   * will be removed in the future.
   * @deprecated Use the leg's `fareProducts`.
   */
  fares?: Maybe<Array<Maybe<Fare>>>;
  /** Generalized cost of the itinerary. Used for debugging search results. */
  generalizedCost?: Maybe<Scalars['Int']>;
  /**
   * A list of Legs. Each Leg is either a walking (cycling, car) portion of the
   * itinerary, or a transit leg on a particular vehicle. So a itinerary where the
   * user walks to the Q train, transfers to the 6, then walks to their
   * destination, has four legs.
   */
  legs: Array<Maybe<Leg>>;
  /** Time when the user leaves from the origin. Format: Unix timestamp in milliseconds. */
  startTime?: Maybe<Scalars['Long']>;
  /**
   * A list of system notices. Contains debug information for itineraries.
   * One use-case is to run a routing search with 'debugItineraryFilter: true'.
   * This will then tag itineraries instead of removing them from the result.
   * This make it possible to inspect the itinerary-filter-chain.
   */
  systemNotices: Array<Maybe<SystemNotice>>;
  /** How much time is spent waiting for transit to arrive, in seconds. */
  waitingTime?: Maybe<Scalars['Long']>;
  /** How far the user has to walk, in meters. */
  walkDistance?: Maybe<Scalars['Float']>;
  /** How much time is spent walking, in seconds. */
  walkTime?: Maybe<Scalars['Long']>;
};

export type Leg = {
  __typename?: 'Leg';
  /**
   * Computes a numeric accessibility score between 0 and 1.
   *
   * The closer the value is to 1 the better the wheelchair-accessibility of this leg is.
   * A value of `null` means that no score has been computed, not that the itinerary is inaccessible.
   *
   * More information is available in the [feature documentation](https://docs.opentripplanner.org/en/dev-2.x/sandbox/IBIAccessibilityScore/).
   */
  accessibilityScore?: Maybe<Scalars['Float']>;
  /** For transit legs, the transit agency that operates the service used for this leg. For non-transit legs, `null`. */
  agency?: Maybe<Agency>;
  /** Applicable alerts for this leg. */
  alerts?: Maybe<Array<Maybe<Alert>>>;
  /**
   * For transit leg, the offset from the scheduled arrival time of the alighting
   * stop in this leg, i.e. scheduled time of arrival at alighting stop = `endTime
   * - arrivalDelay`
   */
  arrivalDelay?: Maybe<Scalars['Int']>;
  /**
   * For transit leg, the offset from the scheduled departure time of the boarding
   * stop in this leg, i.e. scheduled time of departure at boarding stop =
   * `startTime - departureDelay`
   */
  departureDelay?: Maybe<Scalars['Int']>;
  /** The distance traveled while traversing the leg in meters. */
  distance?: Maybe<Scalars['Float']>;
  /**
   * Special booking information for the drop off stop of this leg if, for example, it needs
   * to be booked in advance. This could be due to a flexible or on-demand service.
   */
  dropOffBookingInfo?: Maybe<BookingInfo>;
  /** This is used to indicate if alighting from this leg is possible only with special arrangements. */
  dropoffType?: Maybe<PickupDropoffType>;
  /** The leg's duration in seconds */
  duration?: Maybe<Scalars['Float']>;
  /** The date and time when this leg ends. Format: Unix timestamp in milliseconds. */
  endTime?: Maybe<Scalars['Long']>;
  /**
   * Fare products are purchasable tickets which may have an optional fare container or rider
   * category that limits who can buy them or how.
   *
   * Please read the documentation of `id` very carefully to learn how a single fare product
   * that applies to multiple legs can appear several times.
   */
  fareProducts?: Maybe<Array<Maybe<FareProductUse>>>;
  /** The Place where the leg originates. */
  from: Place;
  /** Generalized cost of the leg. Used for debugging search results. */
  generalizedCost?: Maybe<Scalars['Int']>;
  /**
   * For transit legs, the headsign that the vehicle shows at the stop where the passenger boards.
   * For non-transit legs, null.
   */
  headsign?: Maybe<Scalars['String']>;
  /**
   * Interlines with previous leg.
   * This is true when the same vehicle is used for the previous leg as for this leg
   * and passenger can stay inside the vehicle.
   */
  interlineWithPreviousLeg?: Maybe<Scalars['Boolean']>;
  /** Whether the destination of this leg (field `to`) is one of the intermediate places specified in the query. */
  intermediatePlace?: Maybe<Scalars['Boolean']>;
  /**
   * For transit legs, intermediate stops between the Place where the leg
   * originates and the Place where the leg ends. For non-transit legs, null.
   * Returns Place type, which has fields for e.g. departure and arrival times
   */
  intermediatePlaces?: Maybe<Array<Maybe<Place>>>;
  /**
   * For transit legs, intermediate stops between the Place where the leg
   * originates and the Place where the leg ends. For non-transit legs, null.
   */
  intermediateStops?: Maybe<Array<Maybe<Stop>>>;
  /** The leg's geometry. */
  legGeometry?: Maybe<Geometry>;
  /** The mode (e.g. `WALK`) used when traversing this leg. */
  mode?: Maybe<Mode>;
  /** Future legs with same origin and destination stops or stations */
  nextLegs?: Maybe<Array<Leg>>;
  /**
   * Special booking information for the pick up stop of this leg if, for example, it needs
   * to be booked in advance. This could be due to a flexible or on-demand service.
   */
  pickupBookingInfo?: Maybe<BookingInfo>;
  /** This is used to indicate if boarding this leg is possible only with special arrangements. */
  pickupType?: Maybe<PickupDropoffType>;
  /** Whether there is real-time data about this Leg */
  realTime?: Maybe<Scalars['Boolean']>;
  /** State of real-time data */
  realtimeState?: Maybe<RealtimeState>;
  /** Whether this leg is traversed with a rented bike. */
  rentedBike?: Maybe<Scalars['Boolean']>;
  /** Estimate of a hailed ride like Uber. */
  rideHailingEstimate?: Maybe<RideHailingEstimate>;
  /** For transit legs, the route that is used for traversing the leg. For non-transit legs, `null`. */
  route?: Maybe<Route>;
  /** For transit legs, the service date of the trip. Format: YYYYMMDD. For non-transit legs, null. */
  serviceDate?: Maybe<Scalars['String']>;
  /** The date and time when this leg begins. Format: Unix timestamp in milliseconds. */
  startTime?: Maybe<Scalars['Long']>;
  /** The turn-by-turn navigation instructions. */
  steps?: Maybe<Array<Maybe<Step>>>;
  /** The Place where the leg ends. */
  to: Place;
  /** Whether this leg is a transit leg or not. */
  transitLeg?: Maybe<Scalars['Boolean']>;
  /** For transit legs, the trip that is used for traversing the leg. For non-transit legs, `null`. */
  trip?: Maybe<Trip>;
  /** Whether this leg is walking with a bike. */
  walkingBike?: Maybe<Scalars['Boolean']>;
};


export type LegNextLegsArgs = {
  destinationModesWithParentStation?: InputMaybe<Array<TransitMode>>;
  numberOfLegs: Scalars['Int'];
  originModesWithParentStation?: InputMaybe<Array<TransitMode>>;
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
  /** "Private car trips shared with others. */
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

/** An amount of money. */
export type Money = {
  __typename?: 'Money';
  /**
   * Money in the major currency unit, so 3.10 USD is represented as `3.1`.
   *
   * If you want to get the minor currency unit (310 cents), multiply with
   * (10 to the power of `currency.digits`).
   */
  amount: Scalars['Float'];
  /** The currency of this money amount. */
  currency: Currency;
};

/** An object with an ID */
export type Node = {
  /** The ID of an object */
  id: Scalars['ID'];
};

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

export type OpeningHours = {
  __typename?: 'OpeningHours';
  /**
   * Opening hours for the selected dates using the local time of the parking lot.
   * Each date can have multiple time spans.
   *
   * Note: This is not implemented yet and always returns null.
   */
  dates?: Maybe<Array<Maybe<LocalTimeSpanDate>>>;
  /**
   * OSM-formatted string of the opening hours.
   *
   * The spec is available at: https://wiki.openstreetmap.org/wiki/Key:opening_hours
   */
  osm?: Maybe<Scalars['String']>;
};


export type OpeningHoursDatesArgs = {
  dates: Array<Scalars['String']>;
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
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/**
 * Pattern is sequence of stops used by trips on a specific direction and variant
 * of a route. Most routes have only two patterns: one for outbound trips and one
 * for inbound trips
 */
export type Pattern = Node & {
  __typename?: 'Pattern';
  /**
   * By default, list of alerts which have directly an effect on just the pattern.
   * It's also possible to return other relevant alerts through defining types.
   */
  alerts?: Maybe<Array<Maybe<Alert>>>;
  /** ID of the pattern */
  code: Scalars['String'];
  /**
   * Direction of the pattern. Possible values: 0, 1 or -1.
   * -1 indicates that the direction is irrelevant, i.e. the route has patterns only in one direction.
   */
  directionId?: Maybe<Scalars['Int']>;
  geometry?: Maybe<Array<Maybe<Coordinates>>>;
  /** Vehicle headsign used by trips of this pattern */
  headsign?: Maybe<Scalars['String']>;
  /** Global object ID provided by Relay. This value can be used to refetch this object using **node** query. */
  id: Scalars['ID'];
  /**
   * Name of the pattern. Pattern name can be just the name of the route or it can
   * include details of destination and origin stops.
   */
  name?: Maybe<Scalars['String']>;
  /** Original Trip pattern for changed patterns */
  originalTripPattern?: Maybe<Pattern>;
  /** Coordinates of the route of this pattern in Google polyline encoded format */
  patternGeometry?: Maybe<Geometry>;
  /** The route this pattern runs on */
  route: Route;
  /**
   * Hash code of the pattern. This value is stable and not dependent on the
   * pattern id, i.e. this value can be used to check whether two patterns are the
   * same, even if their ids have changed.
   */
  semanticHash?: Maybe<Scalars['String']>;
  /** List of stops served by this pattern */
  stops?: Maybe<Array<Stop>>;
  /** Trips which run on this pattern */
  trips?: Maybe<Array<Trip>>;
  /** Trips which run on this pattern on the specified date */
  tripsForDate?: Maybe<Array<Trip>>;
  /** Realtime-updated position of vehicles that are serving this pattern. */
  vehiclePositions?: Maybe<Array<VehiclePosition>>;
};


/**
 * Pattern is sequence of stops used by trips on a specific direction and variant
 * of a route. Most routes have only two patterns: one for outbound trips and one
 * for inbound trips
 */
export type PatternAlertsArgs = {
  types?: InputMaybe<Array<InputMaybe<PatternAlertType>>>;
};


/**
 * Pattern is sequence of stops used by trips on a specific direction and variant
 * of a route. Most routes have only two patterns: one for outbound trips and one
 * for inbound trips
 */
export type PatternTripsForDateArgs = {
  serviceDate?: InputMaybe<Scalars['String']>;
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

export type Place = {
  __typename?: 'Place';
  /** The time the rider will arrive at the place. Format: Unix timestamp in milliseconds. */
  arrivalTime: Scalars['Long'];
  /**
   * The bike parking related to the place
   * @deprecated bikePark is deprecated. Use vehicleParking instead.
   */
  bikePark?: Maybe<BikePark>;
  /**
   * The bike rental station related to the place
   * @deprecated Use vehicleRentalStation and rentalVehicle instead
   */
  bikeRentalStation?: Maybe<BikeRentalStation>;
  /**
   * The car parking related to the place
   * @deprecated carPark is deprecated. Use vehicleParking instead.
   */
  carPark?: Maybe<CarPark>;
  /** The time the rider will depart the place. Format: Unix timestamp in milliseconds. */
  departureTime: Scalars['Long'];
  /** Latitude of the place (WGS 84) */
  lat: Scalars['Float'];
  /** Longitude of the place (WGS 84) */
  lon: Scalars['Float'];
  /** For transit stops, the name of the stop. For points of interest, the name of the POI. */
  name?: Maybe<Scalars['String']>;
  /** The rental vehicle related to the place */
  rentalVehicle?: Maybe<RentalVehicle>;
  /** The stop related to the place. */
  stop?: Maybe<Stop>;
  /**
   * The position of the stop in the pattern. This is not required to start from 0 or be consecutive - any
   * increasing integer sequence along the stops is valid.
   *
   * The purpose of this field is to identify the stop within the pattern so it can be cross-referenced
   * between it and the itinerary. It is safe to cross-reference when done quickly, i.e. within seconds.
   * However, it should be noted that realtime updates can change the values, so don't store it for
   * longer amounts of time.
   *
   * Depending on the source data, this might not be the GTFS `stop_sequence` but another value, perhaps
   * even generated.
   *
   * The position can be either at a certain stop or in between two for trips where this is possible.
   */
  stopPosition?: Maybe<StopPosition>;
  /** The vehicle parking related to the place */
  vehicleParking?: Maybe<VehicleParking>;
  /** The vehicle rental station related to the place */
  vehicleRentalStation?: Maybe<VehicleRentalStation>;
  /**
   * Type of vertex. (Normal, Bike sharing station, Bike P+R, Transit stop) Mostly
   * used for better localization of bike sharing and P+R station names
   */
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
  /**
   * This is the suggested search time for the "next page" or time window. Insert it together
   * with the searchWindowUsed in the request to get a new set of trips following in the
   * search-window AFTER the current search. No duplicate trips should be returned, unless a trip
   * is delayed and new realtime-data is available.
   * @deprecated Use nextPageCursor instead
   */
  nextDateTime?: Maybe<Scalars['Long']>;
  /**
   * Use the cursor to go to the next "page" of itineraries. Copy the cursor from the last response
   * to the pageCursor query parameter and keep the original request as is. This will enable you to
   * search for itineraries in the next search-window.
   * The cursor based paging only support stepping to the next page, as it does not support jumping.
   * This is only usable when public transportation mode(s) are included in the query.
   */
  nextPageCursor?: Maybe<Scalars['String']>;
  /**
   * This is the suggested search time for the "previous page" or time window. Insert it together
   * with the searchWindowUsed in the request to get a new set of trips preceding in the
   * search-window BEFORE the current search. No duplicate trips should be returned, unless a trip
   * is delayed and new realtime-data is available.
   * @deprecated Use previousPageCursor instead
   */
  prevDateTime?: Maybe<Scalars['Long']>;
  /**
   * Use the cursor to go to the previous "page" of itineraries. Copy the cursor from the last
   * response to the pageCursor query parameter and keep the original request otherwise as is.
   * This will enable you to search for itineraries in the previous search-window.
   * The cursor based paging only support stepping to the previous page, as it does not support
   * jumping.
   * This is only usable when public transportation mode(s) are included in the query.
   */
  previousPageCursor?: Maybe<Scalars['String']>;
  /** A list of routing errors, and fields which caused them */
  routingErrors: Array<RoutingError>;
  /**
   * This is the `searchWindow` used by the raptor search. It is provided here for debugging
   * purpousess.
   *
   * The unit is seconds.
   */
  searchWindowUsed?: Maybe<Scalars['Long']>;
  /** The destination */
  to: Place;
};

/** Stop position at a specific stop. */
export type PositionAtStop = {
  __typename?: 'PositionAtStop';
  /** Position of the stop in the pattern. Positions are not required to start from 0 or be consecutive. */
  position?: Maybe<Scalars['Int']>;
};

/** The board/alight position in between two stops of the pattern of a trip with continuous pickup/drop off. */
export type PositionBetweenStops = {
  __typename?: 'PositionBetweenStops';
  /** Position of the next stop in the pattern. Positions are not required to start from 0 or be consecutive. */
  nextPosition?: Maybe<Scalars['Int']>;
  /** Position of the previous stop in the pattern. Positions are not required to start from 0 or be consecutive. */
  previousPosition?: Maybe<Scalars['Int']>;
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

export type QueryType = {
  __typename?: 'QueryType';
  /** Get all agencies */
  agencies?: Maybe<Array<Maybe<Agency>>>;
  /** Get a single agency based on agency ID, i.e. value of field `gtfsId` (ID format is `FeedId:StopId`) */
  agency?: Maybe<Agency>;
  /** Get all active alerts */
  alerts?: Maybe<Array<Maybe<Alert>>>;
  /**
   * Get a single bike park based on its ID, i.e. value of field `bikeParkId`
   * @deprecated bikePark is deprecated. Use vehicleParking instead.
   */
  bikePark?: Maybe<BikePark>;
  /**
   * Get all bike parks
   * @deprecated bikeParks is deprecated. Use vehicleParkings instead.
   */
  bikeParks?: Maybe<Array<Maybe<BikePark>>>;
  /**
   * Get a single bike rental station based on its ID, i.e. value of field `stationId`
   * @deprecated Use rentalVehicle or vehicleRentalStation instead
   */
  bikeRentalStation?: Maybe<BikeRentalStation>;
  /**
   * Get all bike rental stations
   * @deprecated Use rentalVehicles or vehicleRentalStations instead
   */
  bikeRentalStations?: Maybe<Array<Maybe<BikeRentalStation>>>;
  /** Get cancelled TripTimes. */
  cancelledTripTimes?: Maybe<Array<Maybe<Stoptime>>>;
  /**
   * Get a single car park based on its ID, i.e. value of field `carParkId`
   * @deprecated carPark is deprecated. Use vehicleParking instead.
   */
  carPark?: Maybe<CarPark>;
  /**
   * Get all car parks
   * @deprecated carParks is deprecated. Use vehicleParkings instead.
   */
  carParks?: Maybe<Array<Maybe<CarPark>>>;
  /** Get a single cluster based on its ID, i.e. value of field `gtfsId` */
  cluster?: Maybe<Cluster>;
  /** Get all clusters */
  clusters?: Maybe<Array<Maybe<Cluster>>>;
  /** Get a single departure row based on its ID (ID format is `FeedId:StopId:PatternId`) */
  departureRow?: Maybe<DepartureRow>;
  /** Get all available feeds */
  feeds?: Maybe<Array<Maybe<Feed>>>;
  /**
   * Finds a trip matching the given parameters. This query type is useful if the
   * id of a trip is not known, but other details uniquely identifying the trip are
   * available from some source (e.g. MQTT vehicle positions).
   */
  fuzzyTrip?: Maybe<Trip>;
  /**
   * Get all places (stops, stations, etc. with coordinates) within the specified
   * radius from a location. The returned type is a Relay connection (see
   * https://facebook.github.io/relay/graphql/connections.htm). The placeAtDistance
   * type has two fields: place and distance. The search is done by walking so the
   * distance is according to the network of walkable streets and paths.
   */
  nearest?: Maybe<PlaceAtDistanceConnection>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /**
   * Get a single pattern based on its ID, i.e. value of field `code` (format is
   * `FeedId:RouteId:DirectionId:PatternVariantNumber`)
   */
  pattern?: Maybe<Pattern>;
  /** Get all patterns */
  patterns?: Maybe<Array<Maybe<Pattern>>>;
  /** Plans an itinerary from point A to point B based on the given arguments */
  plan?: Maybe<Plan>;
  /** Get a single rental vehicle based on its ID, i.e. value of field `vehicleId` */
  rentalVehicle?: Maybe<RentalVehicle>;
  /** Get all rental vehicles */
  rentalVehicles?: Maybe<Array<Maybe<RentalVehicle>>>;
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
  /**
   * Get all stops within the specified radius from a location. The returned type
   * is a Relay connection (see
   * https://facebook.github.io/relay/graphql/connections.htm). The stopAtDistance
   * type has two values: stop and distance.
   */
  stopsByRadius?: Maybe<StopAtDistanceConnection>;
  /** Return list of available ticket types */
  ticketTypes?: Maybe<Array<Maybe<TicketType>>>;
  /** Get a single trip based on its ID, i.e. value of field `gtfsId` (format is `FeedId:TripId`) */
  trip?: Maybe<Trip>;
  /** Get all trips */
  trips?: Maybe<Array<Maybe<Trip>>>;
  /** Get a single vehicle parking based on its ID */
  vehicleParking?: Maybe<VehicleParking>;
  /** Get all vehicle parkings */
  vehicleParkings?: Maybe<Array<Maybe<VehicleParking>>>;
  /** Get a single vehicle rental station based on its ID, i.e. value of field `stationId` */
  vehicleRentalStation?: Maybe<VehicleRentalStation>;
  /** Get all vehicle rental stations */
  vehicleRentalStations?: Maybe<Array<Maybe<VehicleRentalStation>>>;
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
  allowKeepingRentedBicycleAtDestination?: InputMaybe<Scalars['Boolean']>;
  allowedTicketTypes?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  allowedVehicleRentalNetworks?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  arriveBy?: InputMaybe<Scalars['Boolean']>;
  banned?: InputMaybe<InputBanned>;
  bannedVehicleRentalNetworks?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  bikeBoardCost?: InputMaybe<Scalars['Int']>;
  bikeReluctance?: InputMaybe<Scalars['Float']>;
  bikeSpeed?: InputMaybe<Scalars['Float']>;
  bikeSwitchCost?: InputMaybe<Scalars['Int']>;
  bikeSwitchTime?: InputMaybe<Scalars['Int']>;
  bikeWalkingReluctance?: InputMaybe<Scalars['Float']>;
  boardSlack?: InputMaybe<Scalars['Int']>;
  carReluctance?: InputMaybe<Scalars['Float']>;
  date?: InputMaybe<Scalars['String']>;
  debugItineraryFilter?: InputMaybe<Scalars['Boolean']>;
  from?: InputMaybe<InputCoordinates>;
  fromPlace?: InputMaybe<Scalars['String']>;
  ignoreRealtimeUpdates?: InputMaybe<Scalars['Boolean']>;
  keepingRentedBicycleAtDestinationCost?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  maxTransfers?: InputMaybe<Scalars['Int']>;
  minTransferTime?: InputMaybe<Scalars['Int']>;
  modeWeight?: InputMaybe<InputModeWeight>;
  nonpreferredTransferPenalty?: InputMaybe<Scalars['Int']>;
  numItineraries?: InputMaybe<Scalars['Int']>;
  omitCanceled?: InputMaybe<Scalars['Boolean']>;
  optimize?: InputMaybe<OptimizeType>;
  pageCursor?: InputMaybe<Scalars['String']>;
  parking?: InputMaybe<VehicleParkingInput>;
  preferred?: InputMaybe<InputPreferred>;
  searchWindow?: InputMaybe<Scalars['Long']>;
  startTransitStopId?: InputMaybe<Scalars['String']>;
  time?: InputMaybe<Scalars['String']>;
  to?: InputMaybe<InputCoordinates>;
  toPlace?: InputMaybe<Scalars['String']>;
  transferPenalty?: InputMaybe<Scalars['Int']>;
  transportModes?: InputMaybe<Array<InputMaybe<TransportMode>>>;
  triangle?: InputMaybe<InputTriangle>;
  unpreferred?: InputMaybe<InputUnpreferred>;
  waitReluctance?: InputMaybe<Scalars['Float']>;
  walkBoardCost?: InputMaybe<Scalars['Int']>;
  walkReluctance?: InputMaybe<Scalars['Float']>;
  walkSafetyFactor?: InputMaybe<Scalars['Float']>;
  walkSpeed?: InputMaybe<Scalars['Float']>;
  wheelchair?: InputMaybe<Scalars['Boolean']>;
};


export type QueryTypeRentalVehicleArgs = {
  id: Scalars['String'];
};


export type QueryTypeRentalVehiclesArgs = {
  formFactors?: InputMaybe<Array<InputMaybe<FormFactor>>>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryTypeRouteArgs = {
  id: Scalars['String'];
};


export type QueryTypeRoutesArgs = {
  feeds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  name?: InputMaybe<Scalars['String']>;
  transportModes?: InputMaybe<Array<InputMaybe<Mode>>>;
};


export type QueryTypeStationArgs = {
  id: Scalars['String'];
};


export type QueryTypeStationsArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  name?: InputMaybe<Scalars['String']>;
};


export type QueryTypeStopArgs = {
  id: Scalars['String'];
};


export type QueryTypeStopsArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  name?: InputMaybe<Scalars['String']>;
};


export type QueryTypeStopsByBboxArgs = {
  feeds?: InputMaybe<Array<Scalars['String']>>;
  maxLat: Scalars['Float'];
  maxLon: Scalars['Float'];
  minLat: Scalars['Float'];
  minLon: Scalars['Float'];
};


export type QueryTypeStopsByRadiusArgs = {
  after?: InputMaybe<Scalars['String']>;
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


export type QueryTypeVehicleParkingArgs = {
  id: Scalars['String'];
};


export type QueryTypeVehicleParkingsArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryTypeVehicleRentalStationArgs = {
  id: Scalars['String'];
};


export type QueryTypeVehicleRentalStationsArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

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

/** Rental vehicle represents a vehicle that belongs to a rental network. */
export type RentalVehicle = Node & PlaceInterface & {
  __typename?: 'RentalVehicle';
  /** If true, vehicle is currently available for renting. */
  allowPickupNow?: Maybe<Scalars['Boolean']>;
  /** Global object ID provided by Relay. This value can be used to refetch this object using **node** query. */
  id: Scalars['ID'];
  /** Latitude of the vehicle (WGS 84) */
  lat?: Maybe<Scalars['Float']>;
  /** Longitude of the vehicle (WGS 84) */
  lon?: Maybe<Scalars['Float']>;
  /** Name of the vehicle */
  name: Scalars['String'];
  /** ID of the rental network. */
  network?: Maybe<Scalars['String']>;
  /** If true, vehicle is not disabled. */
  operative?: Maybe<Scalars['Boolean']>;
  /** Platform-specific URLs to begin the vehicle. */
  rentalUris?: Maybe<VehicleRentalUris>;
  /** ID of the vehicle in the format of network:id */
  vehicleId?: Maybe<Scalars['String']>;
  /** The type of the rental vehicle (scooter, bicycle, car...) */
  vehicleType?: Maybe<RentalVehicleType>;
};

export type RentalVehicleEntityCounts = {
  __typename?: 'RentalVehicleEntityCounts';
  /** The number of entities by type */
  byType: Array<RentalVehicleTypeCount>;
  /** The total number of entities (e.g. vehicles, spaces). */
  total: Scalars['Int'];
};

export type RentalVehicleType = {
  __typename?: 'RentalVehicleType';
  /** The vehicle's general form factor */
  formFactor?: Maybe<FormFactor>;
  /** The primary propulsion type of the vehicle */
  propulsionType?: Maybe<PropulsionType>;
};

export type RentalVehicleTypeCount = {
  __typename?: 'RentalVehicleTypeCount';
  /** The number of vehicles of this type */
  count: Scalars['Int'];
  /** The type of the rental vehicle (scooter, bicycle, car...) */
  vehicleType: RentalVehicleType;
};

/** An estimate for a ride on a hailed vehicle, like an Uber car. */
export type RideHailingEstimate = {
  __typename?: 'RideHailingEstimate';
  /** The estimated time it takes for the vehicle to arrive. */
  arrival: Scalars['Duration'];
  /** The upper bound of the price estimate of this ride. */
  maxPrice: Money;
  /** The lower bound of the price estimate of this ride. */
  minPrice: Money;
  /** The name of the ride, ie. UberX */
  productName?: Maybe<Scalars['String']>;
  /** The provider of the ride hailing service. */
  provider: RideHailingProvider;
};

export type RideHailingProvider = {
  __typename?: 'RideHailingProvider';
  /** The ID of the ride hailing provider. */
  id: Scalars['String'];
};

/** Category of riders a fare product applies to, for example students or pensioners. */
export type RiderCategory = {
  __typename?: 'RiderCategory';
  /** ID of the category */
  id: Scalars['String'];
  /** Human readable name of the category. */
  name?: Maybe<Scalars['String']>;
};

/**
 * Route represents a public transportation service, usually from point A to point
 * B and *back*, shown to customers under a single name, e.g. bus 550. Routes
 * contain patterns (see field `patterns`), which describe different variants of
 * the route, e.g. outbound pattern from point A to point B and inbound pattern
 * from point B to point A.
 */
export type Route = Node & {
  __typename?: 'Route';
  /** Agency operating the route */
  agency?: Maybe<Agency>;
  /**
   * List of alerts which have an effect on the route directly or indirectly.
   * By default only alerts directly affecting this route are returned. It's also possible
   * to return other relevant alerts through defining types.
   */
  alerts?: Maybe<Array<Maybe<Alert>>>;
  bikesAllowed?: Maybe<BikesAllowed>;
  /**
   * The color (in hexadecimal format) the agency operating this route would prefer
   * to use on UI elements (e.g. polylines on a map) related to this route. This
   * value is not available for most routes.
   */
  color?: Maybe<Scalars['String']>;
  desc?: Maybe<Scalars['String']>;
  /** ID of the route in format `FeedId:RouteId` */
  gtfsId: Scalars['String'];
  /** Global object ID provided by Relay. This value can be used to refetch this object using **node** query. */
  id: Scalars['ID'];
  /** Long name of the route, e.g. Helsinki-Leppävaara */
  longName?: Maybe<Scalars['String']>;
  /** Transport mode of this route, e.g. `BUS` */
  mode?: Maybe<TransitMode>;
  /** List of patterns which operate on this route */
  patterns?: Maybe<Array<Maybe<Pattern>>>;
  /** Short name of the route, usually a line number, e.g. 550 */
  shortName?: Maybe<Scalars['String']>;
  /** List of stops on this route */
  stops?: Maybe<Array<Maybe<Stop>>>;
  /**
   * The color (in hexadecimal format) the agency operating this route would prefer
   * to use when displaying text related to this route. This value is not available
   * for most routes.
   */
  textColor?: Maybe<Scalars['String']>;
  /** List of trips which operate on this route */
  trips?: Maybe<Array<Maybe<Trip>>>;
  /**
   * The raw GTFS route type as a integer. For the list of possible values, see:
   * https://developers.google.com/transit/gtfs/reference/#routestxt and
   * https://developers.google.com/transit/gtfs/reference/extended-route-types
   */
  type?: Maybe<Scalars['Int']>;
  url?: Maybe<Scalars['String']>;
};


/**
 * Route represents a public transportation service, usually from point A to point
 * B and *back*, shown to customers under a single name, e.g. bus 550. Routes
 * contain patterns (see field `patterns`), which describe different variants of
 * the route, e.g. outbound pattern from point A to point B and inbound pattern
 * from point B to point A.
 */
export type RouteAlertsArgs = {
  types?: InputMaybe<Array<InputMaybe<RouteAlertType>>>;
};


/**
 * Route represents a public transportation service, usually from point A to point
 * B and *back*, shown to customers under a single name, e.g. bus 550. Routes
 * contain patterns (see field `patterns`), which describe different variants of
 * the route, e.g. outbound pattern from point A to point B and inbound pattern
 * from point B to point A.
 */
export type RouteLongNameArgs = {
  language?: InputMaybe<Scalars['String']>;
};

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

/**
 * Route type entity which covers all agencies if agency is null,
 * otherwise only relevant for one agency.
 */
export type RouteType = {
  __typename?: 'RouteType';
  /** A public transport agency */
  agency?: Maybe<Agency>;
  /**
   * GTFS Route type.
   * For the list of possible values, see:
   *     https://developers.google.com/transit/gtfs/reference/#routestxt and
   *     https://developers.google.com/transit/gtfs/reference/extended-route-types
   */
  routeType: Scalars['Int'];
  /**
   * The routes which have the defined routeType and belong to the agency, if defined.
   * Otherwise all routes of the feed that have the defined routeType.
   */
  routes?: Maybe<Array<Maybe<Route>>>;
};

/** Description of the reason, why the planner did not return any results */
export type RoutingError = {
  __typename?: 'RoutingError';
  /** An enum describing the reason */
  code: RoutingErrorCode;
  /** A textual description of why the search failed. The clients are expected to have their own translations based on the code, for user visible error messages. */
  description: Scalars['String'];
  /** An enum describing the field which should be changed, in order for the search to succeed */
  inputField?: Maybe<InputField>;
};

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

/**
 * Stop can represent either a single public transport stop, where passengers can
 * board and/or disembark vehicles, or a station, which contains multiple stops.
 * See field `locationType`.
 */
export type Stop = Node & PlaceInterface & {
  __typename?: 'Stop';
  /**
   * By default, list of alerts which have directly an effect on just the stop.
   * It's also possible to return other relevant alerts through defining types.
   */
  alerts?: Maybe<Array<Maybe<Alert>>>;
  /** The cluster which this stop is part of */
  cluster?: Maybe<Cluster>;
  /** Stop code which is visible at the stop */
  code?: Maybe<Scalars['String']>;
  /** Description of the stop, usually a street name */
  desc?: Maybe<Scalars['String']>;
  direction?: Maybe<Scalars['String']>;
  /**
   * Representations of this stop's geometry. This is mainly interesting for flex stops which can be
   * a polygon or a group of stops either consisting of either points or polygons.
   *
   * Regular fixed-schedule stops return a single point.
   *
   * Stations (parent stations with child stops) contain a geometry collection with a point for the
   * central coordinate plus a convex hull polygon (https://en.wikipedia.org/wiki/Convex_hull) of all
   * coordinates of the child stops.
   *
   * If there are only two child stops then the convex hull is a straight line between the them. If
   * there is a single child stop then it's a single point.
   */
  geometries?: Maybe<StopGeometries>;
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
   * Transport mode (e.g. `BUS`) used by routes which pass through this stop or
   * `null` if mode cannot be determined, e.g. in case no routes pass through the stop.
   * Note that also other types of vehicles may use the stop, e.g. tram replacement
   * buses might use stops which have `TRAM` as their mode.
   */
  vehicleMode?: Maybe<Mode>;
  /**
   * The raw GTFS route type used by routes which pass through this stop. For the
   * list of possible values, see:
   * https://developers.google.com/transit/gtfs/reference/#routestxt and
   * https://developers.google.com/transit/gtfs/reference/extended-route-types
   */
  vehicleType?: Maybe<Scalars['Int']>;
  /** Whether wheelchair boarding is possible for at least some of vehicles on this stop */
  wheelchairBoarding?: Maybe<WheelchairBoarding>;
  /** ID of the zone where this stop is located */
  zoneId?: Maybe<Scalars['String']>;
};


/**
 * Stop can represent either a single public transport stop, where passengers can
 * board and/or disembark vehicles, or a station, which contains multiple stops.
 * See field `locationType`.
 */
export type StopAlertsArgs = {
  types?: InputMaybe<Array<InputMaybe<StopAlertType>>>;
};


/**
 * Stop can represent either a single public transport stop, where passengers can
 * board and/or disembark vehicles, or a station, which contains multiple stops.
 * See field `locationType`.
 */
export type StopDescArgs = {
  language?: InputMaybe<Scalars['String']>;
};


/**
 * Stop can represent either a single public transport stop, where passengers can
 * board and/or disembark vehicles, or a station, which contains multiple stops.
 * See field `locationType`.
 */
export type StopNameArgs = {
  language?: InputMaybe<Scalars['String']>;
};


/**
 * Stop can represent either a single public transport stop, where passengers can
 * board and/or disembark vehicles, or a station, which contains multiple stops.
 * See field `locationType`.
 */
export type StopStopTimesForPatternArgs = {
  id: Scalars['String'];
  numberOfDepartures?: InputMaybe<Scalars['Int']>;
  omitCanceled?: InputMaybe<Scalars['Boolean']>;
  omitNonPickups?: InputMaybe<Scalars['Boolean']>;
  startTime?: InputMaybe<Scalars['Long']>;
  timeRange?: InputMaybe<Scalars['Int']>;
};


/**
 * Stop can represent either a single public transport stop, where passengers can
 * board and/or disembark vehicles, or a station, which contains multiple stops.
 * See field `locationType`.
 */
export type StopStoptimesForPatternsArgs = {
  numberOfDepartures?: InputMaybe<Scalars['Int']>;
  omitCanceled?: InputMaybe<Scalars['Boolean']>;
  omitNonPickups?: InputMaybe<Scalars['Boolean']>;
  startTime?: InputMaybe<Scalars['Long']>;
  timeRange?: InputMaybe<Scalars['Int']>;
};


/**
 * Stop can represent either a single public transport stop, where passengers can
 * board and/or disembark vehicles, or a station, which contains multiple stops.
 * See field `locationType`.
 */
export type StopStoptimesForServiceDateArgs = {
  date?: InputMaybe<Scalars['String']>;
  omitCanceled?: InputMaybe<Scalars['Boolean']>;
  omitNonPickups?: InputMaybe<Scalars['Boolean']>;
};


/**
 * Stop can represent either a single public transport stop, where passengers can
 * board and/or disembark vehicles, or a station, which contains multiple stops.
 * See field `locationType`.
 */
export type StopStoptimesWithoutPatternsArgs = {
  numberOfDepartures?: InputMaybe<Scalars['Int']>;
  omitCanceled?: InputMaybe<Scalars['Boolean']>;
  omitNonPickups?: InputMaybe<Scalars['Boolean']>;
  startTime?: InputMaybe<Scalars['Long']>;
  timeRange?: InputMaybe<Scalars['Int']>;
};


/**
 * Stop can represent either a single public transport stop, where passengers can
 * board and/or disembark vehicles, or a station, which contains multiple stops.
 * See field `locationType`.
 */
export type StopTransfersArgs = {
  maxDistance?: InputMaybe<Scalars['Int']>;
};


/**
 * Stop can represent either a single public transport stop, where passengers can
 * board and/or disembark vehicles, or a station, which contains multiple stops.
 * See field `locationType`.
 */
export type StopUrlArgs = {
  language?: InputMaybe<Scalars['String']>;
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

export type StopGeometries = {
  __typename?: 'StopGeometries';
  /** Representation of the stop geometries as GeoJSON (https://geojson.org/) */
  geoJson?: Maybe<Scalars['GeoJson']>;
  /**
   * Representation of a stop as a series of polylines.
   *
   * Polygons of flex stops are represented as linear rings (lines where the first and last point are the same).
   *
   * Proper stops are represented as single point "lines".
   */
  googleEncoded?: Maybe<Array<Maybe<Geometry>>>;
};

/** Stop that should (but not guaranteed) to exist on a route. */
export type StopOnRoute = {
  __typename?: 'StopOnRoute';
  /** Route which contains the stop. */
  route: Route;
  /** Stop at the route. It's also possible that the stop is no longer on the route. */
  stop: Stop;
};

/** Stop that should (but not guaranteed) to exist on a trip. */
export type StopOnTrip = {
  __typename?: 'StopOnTrip';
  /** Stop at the trip. It's also possible that the stop is no longer on the trip. */
  stop: Stop;
  /** Trip which contains the stop. */
  trip: Trip;
};

export type StopPosition = PositionAtStop | PositionBetweenStops;

/** Upcoming or current stop and how close the vehicle is to it. */
export type StopRelationship = {
  __typename?: 'StopRelationship';
  /** How close the vehicle is to `stop` */
  status: VehicleStopStatus;
  stop: Stop;
};

/** Stoptime represents the time when a specific trip arrives to or departs from a specific stop. */
export type Stoptime = {
  __typename?: 'Stoptime';
  /**
   * The offset from the scheduled arrival time in seconds. Negative values
   * indicate that the trip is running ahead of schedule.
   */
  arrivalDelay?: Maybe<Scalars['Int']>;
  /**
   * The offset from the scheduled departure time in seconds. Negative values
   * indicate that the trip is running ahead of schedule
   */
  departureDelay?: Maybe<Scalars['Int']>;
  /**
   * Whether the vehicle can be disembarked at this stop. This field can also be
   * used to indicate if disembarkation is possible only with special arrangements.
   */
  dropoffType?: Maybe<PickupDropoffType>;
  /**
   * Vehicle headsign of the trip on this stop. Trip headsigns can change during
   * the trip (e.g. on routes which run on loops), so this value should be used
   * instead of `tripHeadsign` to display the headsign relevant to the user.
   */
  headsign?: Maybe<Scalars['String']>;
  /**
   * Whether the vehicle can be boarded at this stop. This field can also be used
   * to indicate if boarding is possible only with special arrangements.
   */
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
  /**
   * The sequence of the stop in the pattern. This is not required to start from 0 or be consecutive - any
   * increasing integer sequence along the stops is valid.
   *
   * The purpose of this field is to identify the stop within the pattern so it can be cross-referenced
   * between it and the itinerary. It is safe to cross-reference when done quickly, i.e. within seconds.
   * However, it should be noted that realtime updates can change the values, so don't store it for
   * longer amounts of time.
   *
   * Depending on the source data, this might not be the GTFS `stop_sequence` but another value, perhaps
   * even generated.
   */
  stopPosition?: Maybe<Scalars['Int']>;
  /** true, if this stop is used as a time equalization stop. false otherwise. */
  timepoint?: Maybe<Scalars['Boolean']>;
  /** Trip which this stoptime is for */
  trip?: Maybe<Trip>;
};


/** Stoptime represents the time when a specific trip arrives to or departs from a specific stop. */
export type StoptimeHeadsignArgs = {
  language?: InputMaybe<Scalars['String']>;
};

/** Stoptimes grouped by pattern */
export type StoptimesInPattern = {
  __typename?: 'StoptimesInPattern';
  pattern?: Maybe<Pattern>;
  stoptimes?: Maybe<Array<Maybe<Stoptime>>>;
};

/**
 * A system notice is used to tag elements with system information for debugging
 * or other system related purpose. One use-case is to run a routing search with
 * 'debugItineraryFilter: true'. This will then tag itineraries instead of removing
 * them from the result. This make it possible to inspect the itinerary-filter-chain.
 * A SystemNotice only has english text,
 * because the primary user are technical staff, like testers and developers.
 */
export type SystemNotice = {
  __typename?: 'SystemNotice';
  /** Notice's tag */
  tag?: Maybe<Scalars['String']>;
  /** Notice's description */
  text?: Maybe<Scalars['String']>;
};

/** Describes ticket type */
export type TicketType = Node & {
  __typename?: 'TicketType';
  /** ISO 4217 currency code */
  currency?: Maybe<Scalars['String']>;
  /**
   * Ticket type ID in format `FeedId:TicketTypeId`. Ticket type IDs are usually
   * combination of ticket zones where the ticket is valid.
   */
  fareId: Scalars['String'];
  /** Global object ID provided by Relay. This value can be used to refetch this object using **node** query. */
  id: Scalars['ID'];
  /** Price of the ticket in currency that is specified in `currency` field */
  price?: Maybe<Scalars['Float']>;
  /**
   * List of zones where this ticket is valid.
   * Corresponds to field `zoneId` in **Stop** type.
   */
  zones?: Maybe<Array<Scalars['String']>>;
};

export enum TransitMode {
  /** AIRPLANE */
  Airplane = 'AIRPLANE',
  /** BUS */
  Bus = 'BUS',
  /** CABLE_CAR */
  CableCar = 'CABLE_CAR',
  /** "Private car trips shared with others. */
  Carpool = 'CARPOOL',
  /** COACH */
  Coach = 'COACH',
  /** FERRY */
  Ferry = 'FERRY',
  /** FUNICULAR */
  Funicular = 'FUNICULAR',
  /** GONDOLA */
  Gondola = 'GONDOLA',
  /** Railway in which the track consists of a single rail or a beam. */
  Monorail = 'MONORAIL',
  /** RAIL */
  Rail = 'RAIL',
  /** SUBWAY */
  Subway = 'SUBWAY',
  /** A taxi, possibly operated by a public transport agency. */
  Taxi = 'TAXI',
  /** TRAM */
  Tram = 'TRAM',
  /** Electric buses that draw power from overhead wires using poles. */
  Trolleybus = 'TROLLEYBUS'
}

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
  /**
   * By default, list of alerts which have directly an effect on just the trip.
   * It's also possible to return other relevant alerts through defining types.
   */
  alerts?: Maybe<Array<Maybe<Alert>>>;
  /** Arrival time to the final stop */
  arrivalStoptime?: Maybe<Stoptime>;
  /** Whether bikes are allowed on board the vehicle running this trip */
  bikesAllowed?: Maybe<BikesAllowed>;
  blockId?: Maybe<Scalars['String']>;
  /** Departure time from the first stop */
  departureStoptime?: Maybe<Stoptime>;
  /**
   * Direction code of the trip, i.e. is this the outbound or inbound trip of a
   * pattern. Possible values: 0, 1 or `null` if the direction is irrelevant, i.e.
   * the pattern has trips only in one direction.
   */
  directionId?: Maybe<Scalars['String']>;
  /** List of coordinates of this trip's route */
  geometry?: Maybe<Array<Maybe<Array<Maybe<Scalars['Float']>>>>>;
  /** ID of the trip in format `FeedId:TripId` */
  gtfsId: Scalars['String'];
  /** Global object ID provided by Relay. This value can be used to refetch this object using **node** query. */
  id: Scalars['ID'];
  /**
   * The latest realtime occupancy information for the latest occurance of this
   * trip.
   */
  occupancy?: Maybe<TripOccupancy>;
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
export type TripAlertsArgs = {
  types?: InputMaybe<Array<InputMaybe<TripAlertType>>>;
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
};


/** Trip is a specific occurance of a pattern, usually identified by route, direction on the route and exact departure time. */
export type TripTripHeadsignArgs = {
  language?: InputMaybe<Scalars['String']>;
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

/**
 * Occupancy of a vehicle on a trip. This should include the most recent occupancy information
 * available for a trip. Historic data might not be available.
 */
export type TripOccupancy = {
  __typename?: 'TripOccupancy';
  /** Occupancy information mapped to a limited set of descriptive states. */
  occupancyStatus?: Maybe<OccupancyStatus>;
};

/** This is used for alert entities that we don't explicitly handle or they are missing. */
export type Unknown = {
  __typename?: 'Unknown';
  /** Entity's description */
  description?: Maybe<Scalars['String']>;
};

/** Vehicle parking represents a location where bicycles or cars can be parked. */
export type VehicleParking = Node & PlaceInterface & {
  __typename?: 'VehicleParking';
  /**
   * Does this vehicle parking have spaces (capacity) for either wheelchair accessible (disabled)
   * or normal cars.
   */
  anyCarPlaces?: Maybe<Scalars['Boolean']>;
  /** The currently available spaces at this vehicle parking. */
  availability?: Maybe<VehicleParkingSpaces>;
  /** Does this vehicle parking have spaces (capacity) for bicycles. */
  bicyclePlaces?: Maybe<Scalars['Boolean']>;
  /** The capacity (maximum available spaces) of this vehicle parking. */
  capacity?: Maybe<VehicleParkingSpaces>;
  /**
   * Does this vehicle parking have spaces (capacity) for cars excluding wheelchair accessible spaces.
   * Use anyCarPlaces to check if any type of car may use this vehicle parking.
   */
  carPlaces?: Maybe<Scalars['Boolean']>;
  /** URL which contains details of this vehicle parking. */
  detailsUrl?: Maybe<Scalars['String']>;
  /** Global object ID provided by Relay. This value can be used to refetch this object using **node** query. */
  id: Scalars['ID'];
  /** URL of an image which may be displayed to the user showing the vehicle parking. */
  imageUrl?: Maybe<Scalars['String']>;
  /** Latitude of the bike park (WGS 84) */
  lat?: Maybe<Scalars['Float']>;
  /** Longitude of the bike park (WGS 84) */
  lon?: Maybe<Scalars['Float']>;
  /** Name of the park */
  name: Scalars['String'];
  /** A short translatable note containing details of this vehicle parking. */
  note?: Maybe<Scalars['String']>;
  /** Opening hours of the parking facility */
  openingHours?: Maybe<OpeningHours>;
  /** If true, value of `spacesAvailable` is updated from a real-time source. */
  realtime?: Maybe<Scalars['Boolean']>;
  /**
   * The state of this vehicle parking.
   * Only ones in an OPERATIONAL state may be used for Park and Ride.
   */
  state?: Maybe<VehicleParkingState>;
  /**
   * Source specific tags of the vehicle parking, which describe the available features. For example
   * park_and_ride, bike_lockers, or static_osm_data.
   */
  tags?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** ID of the park */
  vehicleParkingId?: Maybe<Scalars['String']>;
  /** Does this vehicle parking have wheelchair accessible (disabled) car spaces (capacity). */
  wheelchairAccessibleCarPlaces?: Maybe<Scalars['Boolean']>;
};


/** Vehicle parking represents a location where bicycles or cars can be parked. */
export type VehicleParkingNameArgs = {
  language?: InputMaybe<Scalars['String']>;
};


/** Vehicle parking represents a location where bicycles or cars can be parked. */
export type VehicleParkingNoteArgs = {
  language?: InputMaybe<Scalars['String']>;
};

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
  unpreferredCost?: InputMaybe<Scalars['Int']>;
};

/** The number of spaces by type. null if unknown. */
export type VehicleParkingSpaces = {
  __typename?: 'VehicleParkingSpaces';
  /** The number of bicycle spaces. */
  bicycleSpaces?: Maybe<Scalars['Int']>;
  /** The number of car spaces. */
  carSpaces?: Maybe<Scalars['Int']>;
  /** The number of wheelchair accessible (disabled) car spaces. */
  wheelchairAccessibleCarSpaces?: Maybe<Scalars['Int']>;
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

/** Realtime vehicle position */
export type VehiclePosition = {
  __typename?: 'VehiclePosition';
  /**
   * Bearing, in degrees, clockwise from North, i.e., 0 is North and 90 is East. This can be the
   * compass bearing, or the direction towards the next stop or intermediate location.
   */
  heading?: Maybe<Scalars['Float']>;
  /** Human-readable label of the vehicle, eg. a publicly visible number or a license plate */
  label?: Maybe<Scalars['String']>;
  /** When the position of the vehicle was recorded in seconds since the UNIX epoch. */
  lastUpdated?: Maybe<Scalars['Long']>;
  /** Latitude of the vehicle */
  lat?: Maybe<Scalars['Float']>;
  /** Longitude of the vehicle */
  lon?: Maybe<Scalars['Float']>;
  /** Speed of the vehicle in meters/second */
  speed?: Maybe<Scalars['Float']>;
  /** The current stop where the vehicle will be or is currently arriving. */
  stopRelationship?: Maybe<StopRelationship>;
  /** Which trip this vehicles runs on. */
  trip: Trip;
  /** Feed-scoped ID that uniquely identifies the vehicle in the format FeedId:VehicleId */
  vehicleId?: Maybe<Scalars['String']>;
};

/** Vehicle rental station represents a location where users can rent bicycles etc. for a fee. */
export type VehicleRentalStation = Node & PlaceInterface & {
  __typename?: 'VehicleRentalStation';
  /**
   * If true, vehicles can be returned to this station if the station has spaces available
   * or allows overloading.
   */
  allowDropoff?: Maybe<Scalars['Boolean']>;
  /** If true, vehicles can be currently returned to this station. */
  allowDropoffNow?: Maybe<Scalars['Boolean']>;
  /** If true, vehicles can be returned even if spacesAvailable is zero or vehicles > capacity. */
  allowOverloading?: Maybe<Scalars['Boolean']>;
  /** If true, vehicles can be picked up from this station if the station has vehicles available. */
  allowPickup?: Maybe<Scalars['Boolean']>;
  /** If true, vehicles can be currently picked up from this station. */
  allowPickupNow?: Maybe<Scalars['Boolean']>;
  /** Number of free spaces currently available on the rental station, grouped by vehicle type. */
  availableSpaces?: Maybe<RentalVehicleEntityCounts>;
  /** Number of vehicles currently available on the rental station, grouped by vehicle type. */
  availableVehicles?: Maybe<RentalVehicleEntityCounts>;
  /** Nominal capacity (number of racks) of the rental station. */
  capacity?: Maybe<Scalars['Int']>;
  /** Global object ID provided by Relay. This value can be used to refetch this object using **node** query. */
  id: Scalars['ID'];
  /** Latitude of the vehicle rental station (WGS 84) */
  lat?: Maybe<Scalars['Float']>;
  /** Longitude of the vehicle rental station (WGS 84) */
  lon?: Maybe<Scalars['Float']>;
  /** Name of the vehicle rental station */
  name: Scalars['String'];
  /** ID of the rental network. */
  network?: Maybe<Scalars['String']>;
  /** If true, station is on and in service. */
  operative?: Maybe<Scalars['Boolean']>;
  /**
   * If true, values of `vehiclesAvailable` and `spacesAvailable` are updated from a
   * real-time source. If false, values of `vehiclesAvailable` and `spacesAvailable`
   * are always the total capacity divided by two.
   */
  realtime?: Maybe<Scalars['Boolean']>;
  /** Platform-specific URLs to begin renting a vehicle from this station. */
  rentalUris?: Maybe<VehicleRentalUris>;
  /**
   * Number of free spaces currently available on the rental station.
   * Note that this value being 0 does not necessarily indicate that vehicles cannot be returned
   * to this station, as for example it might be possible to leave the vehicle in the vicinity of
   * the rental station, even if the vehicle racks don't have any spaces available.
   * See field `allowDropoffNow` to know if is currently possible to return a vehicle.
   * @deprecated Use `availableSpaces` instead, which also contains the space vehicle types
   */
  spacesAvailable?: Maybe<Scalars['Int']>;
  /** ID of the vehicle in the format of network:id */
  stationId?: Maybe<Scalars['String']>;
  /**
   * Number of vehicles currently available on the rental station.
   * See field `allowPickupNow` to know if is currently possible to pick up a vehicle.
   * @deprecated Use `availableVehicles` instead, which also contains vehicle types
   */
  vehiclesAvailable?: Maybe<Scalars['Int']>;
};

export type VehicleRentalUris = {
  __typename?: 'VehicleRentalUris';
  /**
   * A URI that can be passed to an Android app with an {@code android.intent.action.VIEW} Android
   * intent to support Android Deep Links.
   * May be null if a rental URI does not exist.
   */
  android?: Maybe<Scalars['String']>;
  /**
   * A URI that can be used on iOS to launch the rental app for this rental network.
   * May be {@code null} if a rental URI does not exist.
   */
  ios?: Maybe<Scalars['String']>;
  /**
   * A URL that can be used by a web browser to show more information about renting a vehicle.
   * May be {@code null} if a rental URL does not exist.
   */
  web?: Maybe<Scalars['String']>;
};

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
  /**
   * Fare price in cents. **Note:** this value is dependent on the currency used,
   * as one cent is not necessarily ¹/₁₀₀ of the basic monerary unit.
   * @deprecated No longer supported
   */
  cents?: Maybe<Scalars['Int']>;
  /**
   * Components which this fare is composed of
   * @deprecated No longer supported
   */
  components?: Maybe<Array<Maybe<FareComponent>>>;
  /**
   * ISO 4217 currency code
   * @deprecated No longer supported
   */
  currency?: Maybe<Scalars['String']>;
  /** @deprecated No longer supported */
  type?: Maybe<Scalars['String']>;
};

/** Component of the fare (i.e. ticket) for a part of the itinerary */
export type FareComponent = {
  __typename?: 'fareComponent';
  /**
   * Fare price in cents. **Note:** this value is dependent on the currency used,
   * as one cent is not necessarily ¹/₁₀₀ of the basic monerary unit.
   * @deprecated No longer supported
   */
  cents?: Maybe<Scalars['Int']>;
  /**
   * ISO 4217 currency code
   * @deprecated No longer supported
   */
  currency?: Maybe<Scalars['String']>;
  /**
   * ID of the ticket type. Corresponds to `fareId` in **TicketType**.
   * @deprecated No longer supported
   */
  fareId?: Maybe<Scalars['String']>;
  /**
   * List of routes which use this fare component
   * @deprecated No longer supported
   */
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
  /** The cardinal (compass) direction (e.g. north, northeast) taken when engaging this step. */
  absoluteDirection?: Maybe<AbsoluteDirection>;
  /** A list of alerts (e.g. construction, detours) applicable to the step. */
  alerts?: Maybe<Array<Maybe<Alert>>>;
  /**
   * This step is on an open area, such as a plaza or train platform,
   * and thus the directions should say something like "cross".
   */
  area?: Maybe<Scalars['Boolean']>;
  /**
   * The name of this street was generated by the system, so we should only display it once, and
   * generally just display right/left directions
   */
  bogusName?: Maybe<Scalars['Boolean']>;
  /** The distance in meters that this step takes. */
  distance?: Maybe<Scalars['Float']>;
  /** The elevation profile as a list of { distance, elevation } values. */
  elevationProfile?: Maybe<Array<Maybe<ElevationProfileComponent>>>;
  /** When exiting a highway or traffic circle, the exit name/number. */
  exit?: Maybe<Scalars['String']>;
  /** The latitude of the start of the step. */
  lat?: Maybe<Scalars['Float']>;
  /** The longitude of the start of the step. */
  lon?: Maybe<Scalars['Float']>;
  /** The relative direction (e.g. left or right turn) to take when engaging this step. */
  relativeDirection?: Maybe<RelativeDirection>;
  /** Indicates whether or not a street changes direction at an intersection. */
  stayOn?: Maybe<Scalars['Boolean']>;
  /** The name of the street, road, or path taken for this step. */
  streetName?: Maybe<Scalars['String']>;
  /** Is this step walking with a bike? */
  walkingBike?: Maybe<Scalars['Boolean']>;
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

export type RouteForRailFragment = { __typename?: 'Route', gtfsId: string, shortName?: string | null, longName?: string | null, patterns?: Array<{ __typename?: 'Pattern', headsign?: string | null, geometry?: Array<{ __typename?: 'Coordinates', lat?: number | null, lon?: number | null } | null> | null } | null> | null };

export type RoutesForRailQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type RoutesForRailQuery = { __typename?: 'QueryType', routes?: Array<{ __typename?: 'Route', gtfsId: string, shortName?: string | null, longName?: string | null, patterns?: Array<{ __typename?: 'Pattern', headsign?: string | null, geometry?: Array<{ __typename?: 'Coordinates', lat?: number | null, lon?: number | null } | null> | null } | null> | null } | null> | null };

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
export const RoutesForRailDocument = gql`
    query RoutesForRail($name: String!) {
  routes(name: $name, transportModes: RAIL) {
    ...RouteForRail
  }
}
    ${RouteForRailFragmentDoc}`;

/**
 * __useRoutesForRailQuery__
 *
 * To run a query within a React component, call `useRoutesForRailQuery` and pass it any options that fit your needs.
 * When your component renders, `useRoutesForRailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRoutesForRailQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useRoutesForRailQuery(baseOptions: Apollo.QueryHookOptions<RoutesForRailQuery, RoutesForRailQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RoutesForRailQuery, RoutesForRailQueryVariables>(RoutesForRailDocument, options);
      }
export function useRoutesForRailLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RoutesForRailQuery, RoutesForRailQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RoutesForRailQuery, RoutesForRailQueryVariables>(RoutesForRailDocument, options);
        }
export type RoutesForRailQueryHookResult = ReturnType<typeof useRoutesForRailQuery>;
export type RoutesForRailLazyQueryHookResult = ReturnType<typeof useRoutesForRailLazyQuery>;
export type RoutesForRailQueryResult = Apollo.QueryResult<RoutesForRailQuery, RoutesForRailQueryVariables>;