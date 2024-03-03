/* eslint-disable */
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** An RFC-3339 compliant Full Date Scalar */
  Date: { input: string; output: string; }
  /** A slightly refined version of RFC-3339 compliant DateTime Scalar */
  DateTime: { input: string; output: string; }
};

/** # PRIMITIVE FILTERS */
export type BooleanWhere = {
  equals?: InputMaybe<Scalars['Boolean']['input']>;
  unequals?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CategoryCode = {
  __typename?: 'CategoryCode';
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
  validFrom: Scalars['Date']['output'];
  validTo?: Maybe<Scalars['Date']['output']>;
};

export type CategoryCodeCollectionWhere = {
  contains?: InputMaybe<CategoryCodeWhere>;
};

export type CategoryCodeOrderBy = {
  code?: InputMaybe<OrderDirection>;
  name?: InputMaybe<OrderDirection>;
  validFrom?: InputMaybe<OrderDirection>;
  validTo?: InputMaybe<OrderDirection>;
};

export type CategoryCodeWhere = {
  and?: InputMaybe<Array<InputMaybe<CategoryCodeWhere>>>;
  code?: InputMaybe<StringWhere>;
  name?: InputMaybe<StringWhere>;
  or?: InputMaybe<Array<InputMaybe<CategoryCodeWhere>>>;
  validFrom?: InputMaybe<DateWhere>;
  validTo?: InputMaybe<DateWhere>;
};

export type Cause = {
  __typename?: 'Cause';
  categoryCode: CategoryCode;
  detailedCategoryCode?: Maybe<DetailedCategoryCode>;
  thirdCategoryCode?: Maybe<ThirdCategoryCode>;
};

export type CauseCollectionWhere = {
  contains?: InputMaybe<CauseWhere>;
};

export type CauseOrderBy = {
  categoryCode?: InputMaybe<CategoryCodeOrderBy>;
  detailedCategoryCode?: InputMaybe<DetailedCategoryCodeOrderBy>;
  thirdCategoryCode?: InputMaybe<ThirdCategoryCodeOrderBy>;
};

export type CauseWhere = {
  and?: InputMaybe<Array<InputMaybe<CauseWhere>>>;
  categoryCode?: InputMaybe<CategoryCodeWhere>;
  detailedCategoryCode?: InputMaybe<DetailedCategoryCodeWhere>;
  or?: InputMaybe<Array<InputMaybe<CauseWhere>>>;
  thirdCategoryCode?: InputMaybe<ThirdCategoryCodeWhere>;
};

export type Composition = {
  __typename?: 'Composition';
  journeySections?: Maybe<Array<Maybe<JourneySection>>>;
  train?: Maybe<Train>;
  version: Scalars['String']['output'];
};


export type CompositionJourneySectionsArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<JourneySectionOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<JourneySectionWhere>;
};

export type CompositionCollectionWhere = {
  contains?: InputMaybe<CompositionWhere>;
};

export type CompositionOrderBy = {
  train?: InputMaybe<TrainOrderBy>;
  version?: InputMaybe<OrderDirection>;
};

export type CompositionWhere = {
  and?: InputMaybe<Array<InputMaybe<CompositionWhere>>>;
  journeySections?: InputMaybe<JourneySectionCollectionWhere>;
  or?: InputMaybe<Array<InputMaybe<CompositionWhere>>>;
  train?: InputMaybe<TrainWhere>;
  version?: InputMaybe<StringWhere>;
};

export type CoordinateWhere = {
  inside?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};

export type DateTimeWhere = {
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  greaterThan?: InputMaybe<Scalars['DateTime']['input']>;
  lessThan?: InputMaybe<Scalars['DateTime']['input']>;
  unequals?: InputMaybe<Scalars['DateTime']['input']>;
};

export type DateWhere = {
  equals?: InputMaybe<Scalars['Date']['input']>;
  greaterThan?: InputMaybe<Scalars['Date']['input']>;
  lessThan?: InputMaybe<Scalars['Date']['input']>;
  unequals?: InputMaybe<Scalars['Date']['input']>;
};

export type DetailedCategoryCode = {
  __typename?: 'DetailedCategoryCode';
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
  validFrom: Scalars['Date']['output'];
  validTo?: Maybe<Scalars['Date']['output']>;
};

export type DetailedCategoryCodeCollectionWhere = {
  contains?: InputMaybe<DetailedCategoryCodeWhere>;
};

export type DetailedCategoryCodeOrderBy = {
  code?: InputMaybe<OrderDirection>;
  name?: InputMaybe<OrderDirection>;
  validFrom?: InputMaybe<OrderDirection>;
  validTo?: InputMaybe<OrderDirection>;
};

export type DetailedCategoryCodeWhere = {
  and?: InputMaybe<Array<InputMaybe<DetailedCategoryCodeWhere>>>;
  code?: InputMaybe<StringWhere>;
  name?: InputMaybe<StringWhere>;
  or?: InputMaybe<Array<InputMaybe<DetailedCategoryCodeWhere>>>;
  validFrom?: InputMaybe<DateWhere>;
  validTo?: InputMaybe<DateWhere>;
};

export type EnumWhere = {
  equals?: InputMaybe<Scalars['String']['input']>;
  unequals?: InputMaybe<Scalars['String']['input']>;
};

export enum EstimateSourceType {
  Combocalc = 'COMBOCALC',
  LiikeAutomatic = 'LIIKE_AUTOMATIC',
  LiikeUser = 'LIIKE_USER',
  MikuUser = 'MIKU_USER',
  Unknown = 'UNKNOWN'
}

export type IntWhere = {
  equals?: InputMaybe<Scalars['Int']['input']>;
  greaterThan?: InputMaybe<Scalars['Int']['input']>;
  lessThan?: InputMaybe<Scalars['Int']['input']>;
  unequals?: InputMaybe<Scalars['Int']['input']>;
};

export type JourneySection = {
  __typename?: 'JourneySection';
  endTimeTableRow?: Maybe<TimeTableRow>;
  locomotives?: Maybe<Array<Maybe<Locomotive>>>;
  maximumSpeed: Scalars['Int']['output'];
  startTimeTableRow?: Maybe<TimeTableRow>;
  totalLength: Scalars['Int']['output'];
  wagons?: Maybe<Array<Maybe<Wagon>>>;
};


export type JourneySectionLocomotivesArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<LocomotiveOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<LocomotiveWhere>;
};


export type JourneySectionWagonsArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<WagonOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<WagonWhere>;
};

export type JourneySectionCollectionWhere = {
  contains?: InputMaybe<JourneySectionWhere>;
};

export type JourneySectionOrderBy = {
  endTimeTableRow?: InputMaybe<TimeTableRowOrderBy>;
  maximumSpeed?: InputMaybe<OrderDirection>;
  startTimeTableRow?: InputMaybe<TimeTableRowOrderBy>;
  totalLength?: InputMaybe<OrderDirection>;
};

export type JourneySectionWhere = {
  and?: InputMaybe<Array<InputMaybe<JourneySectionWhere>>>;
  endTimeTableRow?: InputMaybe<TimeTableRowWhere>;
  locomotives?: InputMaybe<LocomotiveCollectionWhere>;
  maximumSpeed?: InputMaybe<IntWhere>;
  or?: InputMaybe<Array<InputMaybe<JourneySectionWhere>>>;
  startTimeTableRow?: InputMaybe<TimeTableRowWhere>;
  totalLength?: InputMaybe<IntWhere>;
  wagons?: InputMaybe<WagonCollectionWhere>;
};

export type Locomotive = {
  __typename?: 'Locomotive';
  location: Scalars['Int']['output'];
  locomotiveType: Scalars['String']['output'];
  powerTypeAbbreviation: Scalars['String']['output'];
  vehicleId?: Maybe<Scalars['Int']['output']>;
  vehicleNumber?: Maybe<Scalars['String']['output']>;
};

export type LocomotiveCollectionWhere = {
  contains?: InputMaybe<LocomotiveWhere>;
};

export type LocomotiveOrderBy = {
  location?: InputMaybe<OrderDirection>;
  locomotiveType?: InputMaybe<OrderDirection>;
  powerTypeAbbreviation?: InputMaybe<OrderDirection>;
  vehicleNumber?: InputMaybe<OrderDirection>;
};

export type LocomotiveWhere = {
  and?: InputMaybe<Array<InputMaybe<LocomotiveWhere>>>;
  location?: InputMaybe<IntWhere>;
  locomotiveType?: InputMaybe<StringWhere>;
  or?: InputMaybe<Array<InputMaybe<LocomotiveWhere>>>;
  powerTypeAbbreviation?: InputMaybe<StringWhere>;
  vehicleNumber?: InputMaybe<StringWhere>;
};

export type Operator = {
  __typename?: 'Operator';
  name: Scalars['String']['output'];
  shortCode: Scalars['String']['output'];
  uicCode: Scalars['Int']['output'];
};

export type OperatorCollectionWhere = {
  contains?: InputMaybe<OperatorWhere>;
};

export type OperatorOrderBy = {
  name?: InputMaybe<OrderDirection>;
  shortCode?: InputMaybe<OrderDirection>;
  uicCode?: InputMaybe<OrderDirection>;
};

export type OperatorWhere = {
  and?: InputMaybe<Array<InputMaybe<OperatorWhere>>>;
  name?: InputMaybe<StringWhere>;
  or?: InputMaybe<Array<InputMaybe<OperatorWhere>>>;
  shortCode?: InputMaybe<StringWhere>;
  uicCode?: InputMaybe<IntWhere>;
};

export enum OrderDirection {
  Ascending = 'ASCENDING',
  Descending = 'DESCENDING'
}

export type Query = {
  __typename?: 'Query';
  compositionsGreaterThanVersion?: Maybe<Array<Maybe<Composition>>>;
  currentlyRunningTrains?: Maybe<Array<Maybe<Train>>>;
  latestTrainLocations?: Maybe<Array<Maybe<TrainLocation>>>;
  routesetMessagesByVersionGreaterThan?: Maybe<Array<Maybe<RoutesetMessage>>>;
  stations?: Maybe<Array<Maybe<Station>>>;
  train?: Maybe<Array<Maybe<Train>>>;
  trainTrackingMessagesByVersionGreaterThan?: Maybe<Array<Maybe<TrainTrackingMessage>>>;
  trainsByDepartureDate?: Maybe<Array<Maybe<Train>>>;
  trainsByStationAndQuantity?: Maybe<Array<Maybe<Train>>>;
  trainsByVersionGreaterThan?: Maybe<Array<Maybe<Train>>>;
};


export type QueryCompositionsGreaterThanVersionArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<CompositionOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  version: Scalars['String']['input'];
  where?: InputMaybe<CompositionWhere>;
};


export type QueryCurrentlyRunningTrainsArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<TrainOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TrainWhere>;
};


export type QueryLatestTrainLocationsArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<TrainLocationOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TrainLocationWhere>;
};


export type QueryRoutesetMessagesByVersionGreaterThanArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<RoutesetMessageOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  version: Scalars['String']['input'];
  where?: InputMaybe<RoutesetMessageWhere>;
};


export type QueryStationsArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<StationOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<StationWhere>;
};


export type QueryTrainArgs = {
  departureDate: Scalars['Date']['input'];
  orderBy?: InputMaybe<Array<InputMaybe<TrainOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  trainNumber: Scalars['Int']['input'];
  where?: InputMaybe<TrainWhere>;
};


export type QueryTrainTrackingMessagesByVersionGreaterThanArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<TrainTrackingMessageOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  version: Scalars['String']['input'];
  where?: InputMaybe<TrainTrackingMessageWhere>;
};


export type QueryTrainsByDepartureDateArgs = {
  departureDate: Scalars['Date']['input'];
  orderBy?: InputMaybe<Array<InputMaybe<TrainOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TrainWhere>;
};


export type QueryTrainsByStationAndQuantityArgs = {
  arrivedTrains?: InputMaybe<Scalars['Int']['input']>;
  arrivingTrains?: InputMaybe<Scalars['Int']['input']>;
  departedTrains?: InputMaybe<Scalars['Int']['input']>;
  departingTrains?: InputMaybe<Scalars['Int']['input']>;
  includeNonStopping?: InputMaybe<Scalars['Boolean']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<TrainOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  station: Scalars['String']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  trainCategories?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  where?: InputMaybe<TrainWhere>;
};


export type QueryTrainsByVersionGreaterThanArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<TrainOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  version: Scalars['String']['input'];
  where?: InputMaybe<TrainWhere>;
};

export type Routesection = {
  __typename?: 'Routesection';
  commercialTrackId: Scalars['String']['output'];
  routesetId: Scalars['Int']['output'];
  sectionId: Scalars['String']['output'];
  station: Station;
};

export type RoutesectionCollectionWhere = {
  contains?: InputMaybe<RoutesectionWhere>;
};

export type RoutesectionOrderBy = {
  commercialTrackId?: InputMaybe<OrderDirection>;
  routesetId?: InputMaybe<OrderDirection>;
  sectionId?: InputMaybe<OrderDirection>;
  station?: InputMaybe<StationOrderBy>;
};

export type RoutesectionWhere = {
  and?: InputMaybe<Array<InputMaybe<RoutesectionWhere>>>;
  commercialTrackId?: InputMaybe<StringWhere>;
  or?: InputMaybe<Array<InputMaybe<RoutesectionWhere>>>;
  routesetId?: InputMaybe<IntWhere>;
  sectionId?: InputMaybe<StringWhere>;
  station?: InputMaybe<StationWhere>;
};

export type RoutesetMessage = {
  __typename?: 'RoutesetMessage';
  clientSystem: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  messageTime: Scalars['DateTime']['output'];
  routeType: Scalars['String']['output'];
  routesections?: Maybe<Array<Maybe<Routesection>>>;
  train?: Maybe<Train>;
  version: Scalars['String']['output'];
};


export type RoutesetMessageRoutesectionsArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<RoutesectionOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RoutesectionWhere>;
};

export type RoutesetMessageCollectionWhere = {
  contains?: InputMaybe<RoutesetMessageWhere>;
};

export type RoutesetMessageOrderBy = {
  clientSystem?: InputMaybe<OrderDirection>;
  id?: InputMaybe<OrderDirection>;
  messageTime?: InputMaybe<OrderDirection>;
  routeType?: InputMaybe<OrderDirection>;
  train?: InputMaybe<TrainOrderBy>;
  version?: InputMaybe<OrderDirection>;
};

export type RoutesetMessageWhere = {
  and?: InputMaybe<Array<InputMaybe<RoutesetMessageWhere>>>;
  clientSystem?: InputMaybe<StringWhere>;
  id?: InputMaybe<IntWhere>;
  messageTime?: InputMaybe<DateTimeWhere>;
  or?: InputMaybe<Array<InputMaybe<RoutesetMessageWhere>>>;
  routeType?: InputMaybe<StringWhere>;
  routesections?: InputMaybe<RoutesectionCollectionWhere>;
  train?: InputMaybe<TrainWhere>;
  version?: InputMaybe<StringWhere>;
};

export type Station = {
  __typename?: 'Station';
  countryCode: Scalars['String']['output'];
  location?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
  name: Scalars['String']['output'];
  passengerTraffic: Scalars['Boolean']['output'];
  shortCode: Scalars['String']['output'];
  timeTableRows?: Maybe<Array<Maybe<TimeTableRow>>>;
  type: StationType;
  uicCode: Scalars['Int']['output'];
};


export type StationTimeTableRowsArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<TimeTableRowOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TimeTableRowWhere>;
};

export type StationCollectionWhere = {
  contains?: InputMaybe<StationWhere>;
};

export type StationOrderBy = {
  countryCode?: InputMaybe<OrderDirection>;
  name?: InputMaybe<OrderDirection>;
  passengerTraffic?: InputMaybe<OrderDirection>;
  shortCode?: InputMaybe<OrderDirection>;
  type?: InputMaybe<OrderDirection>;
  uicCode?: InputMaybe<OrderDirection>;
};

export enum StationPlatformSide {
  Left = 'LEFT',
  Right = 'RIGHT'
}

export enum StationType {
  Station = 'STATION',
  StoppingPoint = 'STOPPING_POINT',
  TurnoutInTheOpenLine = 'TURNOUT_IN_THE_OPEN_LINE'
}

export type StationWhere = {
  and?: InputMaybe<Array<InputMaybe<StationWhere>>>;
  countryCode?: InputMaybe<StringWhere>;
  name?: InputMaybe<StringWhere>;
  or?: InputMaybe<Array<InputMaybe<StationWhere>>>;
  passengerTraffic?: InputMaybe<BooleanWhere>;
  shortCode?: InputMaybe<StringWhere>;
  timeTableRows?: InputMaybe<TimeTableRowCollectionWhere>;
  type?: InputMaybe<EnumWhere>;
  uicCode?: InputMaybe<IntWhere>;
};

export type StringWhere = {
  equals?: InputMaybe<Scalars['String']['input']>;
  unequals?: InputMaybe<Scalars['String']['input']>;
};

export type ThirdCategoryCode = {
  __typename?: 'ThirdCategoryCode';
  code: Scalars['String']['output'];
  description: Scalars['String']['output'];
  name: Scalars['String']['output'];
  validFrom: Scalars['Date']['output'];
  validTo?: Maybe<Scalars['Date']['output']>;
};

export type ThirdCategoryCodeCollectionWhere = {
  contains?: InputMaybe<ThirdCategoryCodeWhere>;
};

export type ThirdCategoryCodeOrderBy = {
  code?: InputMaybe<OrderDirection>;
  description?: InputMaybe<OrderDirection>;
  name?: InputMaybe<OrderDirection>;
  validFrom?: InputMaybe<OrderDirection>;
  validTo?: InputMaybe<OrderDirection>;
};

export type ThirdCategoryCodeWhere = {
  and?: InputMaybe<Array<InputMaybe<ThirdCategoryCodeWhere>>>;
  code?: InputMaybe<StringWhere>;
  description?: InputMaybe<StringWhere>;
  name?: InputMaybe<StringWhere>;
  or?: InputMaybe<Array<InputMaybe<ThirdCategoryCodeWhere>>>;
  validFrom?: InputMaybe<DateWhere>;
  validTo?: InputMaybe<DateWhere>;
};

export type TimeTableGroup = {
  __typename?: 'TimeTableGroup';
  arrival?: Maybe<TimeTableRow>;
  departure?: Maybe<TimeTableRow>;
  stationPlatformSide?: Maybe<StationPlatformSide>;
  trainDirection?: Maybe<TrainDirection>;
};

export type TimeTableRow = {
  __typename?: 'TimeTableRow';
  actualTime?: Maybe<Scalars['DateTime']['output']>;
  cancelled: Scalars['Boolean']['output'];
  causes?: Maybe<Array<Maybe<Cause>>>;
  commercialStop?: Maybe<Scalars['Boolean']['output']>;
  commercialTrack?: Maybe<Scalars['String']['output']>;
  differenceInMinutes?: Maybe<Scalars['Int']['output']>;
  estimateSourceType?: Maybe<EstimateSourceType>;
  liveEstimateTime?: Maybe<Scalars['DateTime']['output']>;
  scheduledTime: Scalars['DateTime']['output'];
  station: Station;
  train: Train;
  trainStopping: Scalars['Boolean']['output'];
  type: TimeTableRowType;
  unknownDelay?: Maybe<Scalars['Boolean']['output']>;
};


export type TimeTableRowCausesArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<CauseOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<CauseWhere>;
};

export type TimeTableRowCollectionWhere = {
  contains?: InputMaybe<TimeTableRowWhere>;
};

export type TimeTableRowOrderBy = {
  actualTime?: InputMaybe<OrderDirection>;
  cancelled?: InputMaybe<OrderDirection>;
  commercialStop?: InputMaybe<OrderDirection>;
  commercialTrack?: InputMaybe<OrderDirection>;
  differenceInMinutes?: InputMaybe<OrderDirection>;
  estimateSourceType?: InputMaybe<OrderDirection>;
  liveEstimateTime?: InputMaybe<OrderDirection>;
  scheduledTime?: InputMaybe<OrderDirection>;
  station?: InputMaybe<StationOrderBy>;
  train?: InputMaybe<TrainOrderBy>;
  trainStopping?: InputMaybe<OrderDirection>;
  type?: InputMaybe<OrderDirection>;
  unknownDelay?: InputMaybe<OrderDirection>;
};

export enum TimeTableRowType {
  Arrival = 'ARRIVAL',
  Departure = 'DEPARTURE'
}

export type TimeTableRowWhere = {
  actualTime?: InputMaybe<DateTimeWhere>;
  and?: InputMaybe<Array<InputMaybe<TimeTableRowWhere>>>;
  cancelled?: InputMaybe<BooleanWhere>;
  causes?: InputMaybe<CauseCollectionWhere>;
  commercialStop?: InputMaybe<BooleanWhere>;
  commercialTrack?: InputMaybe<StringWhere>;
  differenceInMinutes?: InputMaybe<IntWhere>;
  estimateSourceType?: InputMaybe<EnumWhere>;
  liveEstimateTime?: InputMaybe<DateTimeWhere>;
  or?: InputMaybe<Array<InputMaybe<TimeTableRowWhere>>>;
  scheduledTime?: InputMaybe<DateTimeWhere>;
  station?: InputMaybe<StationWhere>;
  train?: InputMaybe<TrainWhere>;
  trainStopping?: InputMaybe<BooleanWhere>;
  type?: InputMaybe<EnumWhere>;
  unknownDelay?: InputMaybe<BooleanWhere>;
};

/** # ENUMS */
export enum TimetableType {
  Adhoc = 'ADHOC',
  Regular = 'REGULAR'
}

export type TrackRange = {
  __typename?: 'TrackRange';
  endKilometres: Scalars['Int']['output'];
  endMetres: Scalars['Int']['output'];
  endTrack: Scalars['String']['output'];
  startKilometres: Scalars['Int']['output'];
  startMetres: Scalars['Int']['output'];
  startTrack: Scalars['String']['output'];
};

export type TrackRangeCollectionWhere = {
  contains?: InputMaybe<TrackRangeWhere>;
};

export type TrackRangeOrderBy = {
  endKilometres?: InputMaybe<OrderDirection>;
  endMetres?: InputMaybe<OrderDirection>;
  endTrack?: InputMaybe<OrderDirection>;
  startKilometres?: InputMaybe<OrderDirection>;
  startMetres?: InputMaybe<OrderDirection>;
  startTrack?: InputMaybe<OrderDirection>;
};

export type TrackRangeWhere = {
  and?: InputMaybe<Array<InputMaybe<TrackRangeWhere>>>;
  endKilometres?: InputMaybe<IntWhere>;
  endMetres?: InputMaybe<IntWhere>;
  endTrack?: InputMaybe<StringWhere>;
  or?: InputMaybe<Array<InputMaybe<TrackRangeWhere>>>;
  startKilometres?: InputMaybe<IntWhere>;
  startMetres?: InputMaybe<IntWhere>;
  startTrack?: InputMaybe<StringWhere>;
};

export type TrackSection = {
  __typename?: 'TrackSection';
  id: Scalars['Int']['output'];
  ranges: Array<Maybe<TrackRange>>;
  station: Station;
  trackSectionCode: Scalars['String']['output'];
};

export type TrackSectionCollectionWhere = {
  contains?: InputMaybe<TrackSectionWhere>;
};

export type TrackSectionOrderBy = {
  id?: InputMaybe<OrderDirection>;
  station?: InputMaybe<StationOrderBy>;
  trackSectionCode?: InputMaybe<OrderDirection>;
};

export type TrackSectionWhere = {
  and?: InputMaybe<Array<InputMaybe<TrackSectionWhere>>>;
  id?: InputMaybe<IntWhere>;
  or?: InputMaybe<Array<InputMaybe<TrackSectionWhere>>>;
  station?: InputMaybe<StationWhere>;
  trackSectionCode?: InputMaybe<StringWhere>;
};

export type Train = {
  __typename?: 'Train';
  cancelled: Scalars['Boolean']['output'];
  commuterLineid?: Maybe<Scalars['String']['output']>;
  compositions?: Maybe<Array<Maybe<Composition>>>;
  deleted?: Maybe<Scalars['Boolean']['output']>;
  departureDate: Scalars['Date']['output'];
  operator: Operator;
  routesetMessages?: Maybe<Array<Maybe<RoutesetMessage>>>;
  runningCurrently: Scalars['Boolean']['output'];
  timeTableGroups?: Maybe<Array<TimeTableGroup>>;
  timeTableRows?: Maybe<Array<Maybe<TimeTableRow>>>;
  timetableAcceptanceDate: Scalars['DateTime']['output'];
  timetableType: TimetableType;
  trainLocations?: Maybe<Array<Maybe<TrainLocation>>>;
  trainNumber: Scalars['Int']['output'];
  trainTrackingMessages?: Maybe<Array<Maybe<TrainTrackingMessage>>>;
  trainType: TrainType;
  version: Scalars['String']['output'];
};


export type TrainCompositionsArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<CompositionOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<CompositionWhere>;
};


export type TrainRoutesetMessagesArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<RoutesetMessageOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RoutesetMessageWhere>;
};


export type TrainTimeTableRowsArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<TimeTableRowOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TimeTableRowWhere>;
};


export type TrainTrainLocationsArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<TrainLocationOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TrainLocationWhere>;
};


export type TrainTrainTrackingMessagesArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<TrainTrackingMessageOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TrainTrackingMessageWhere>;
};

export type TrainCategory = {
  __typename?: 'TrainCategory';
  name: Scalars['String']['output'];
};

export type TrainCategoryCollectionWhere = {
  contains?: InputMaybe<TrainCategoryWhere>;
};

export type TrainCategoryOrderBy = {
  name?: InputMaybe<OrderDirection>;
};

export type TrainCategoryWhere = {
  and?: InputMaybe<Array<InputMaybe<TrainCategoryWhere>>>;
  name?: InputMaybe<StringWhere>;
  or?: InputMaybe<Array<InputMaybe<TrainCategoryWhere>>>;
};

export type TrainCollectionWhere = {
  contains?: InputMaybe<TrainWhere>;
};

export enum TrainDirection {
  Decreasing = 'DECREASING',
  Increasing = 'INCREASING'
}

export type TrainLocation = {
  __typename?: 'TrainLocation';
  accuracy?: Maybe<Scalars['Int']['output']>;
  location?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
  speed: Scalars['Int']['output'];
  timestamp: Scalars['DateTime']['output'];
  train?: Maybe<Train>;
};

export type TrainLocationCollectionWhere = {
  contains?: InputMaybe<TrainLocationWhere>;
};

export type TrainLocationOrderBy = {
  accuracy?: InputMaybe<OrderDirection>;
  speed?: InputMaybe<OrderDirection>;
  timestamp?: InputMaybe<OrderDirection>;
  train?: InputMaybe<TrainOrderBy>;
};

export type TrainLocationWhere = {
  accuracy?: InputMaybe<IntWhere>;
  and?: InputMaybe<Array<InputMaybe<TrainLocationWhere>>>;
  or?: InputMaybe<Array<InputMaybe<TrainLocationWhere>>>;
  speed?: InputMaybe<IntWhere>;
  timestamp?: InputMaybe<DateTimeWhere>;
  train?: InputMaybe<TrainWhere>;
};

export type TrainOrderBy = {
  cancelled?: InputMaybe<OrderDirection>;
  commuterLineid?: InputMaybe<OrderDirection>;
  deleted?: InputMaybe<OrderDirection>;
  departureDate?: InputMaybe<OrderDirection>;
  operator?: InputMaybe<OperatorOrderBy>;
  runningCurrently?: InputMaybe<OrderDirection>;
  timetableAcceptanceDate?: InputMaybe<OrderDirection>;
  timetableType?: InputMaybe<OrderDirection>;
  trainNumber?: InputMaybe<OrderDirection>;
  trainType?: InputMaybe<TrainTypeOrderBy>;
  version?: InputMaybe<OrderDirection>;
};

export type TrainTrackingMessage = {
  __typename?: 'TrainTrackingMessage';
  id: Scalars['Int']['output'];
  nextStation?: Maybe<Station>;
  nextTrackSectionCode?: Maybe<Scalars['String']['output']>;
  previousStation?: Maybe<Station>;
  previousTrackSectionCode?: Maybe<Scalars['String']['output']>;
  station: Station;
  timestamp: Scalars['DateTime']['output'];
  trackSection?: Maybe<TrackSection>;
  trackSectionCode: Scalars['String']['output'];
  train?: Maybe<Train>;
  type: TrainTrackingMessageType;
  version: Scalars['String']['output'];
};

export type TrainTrackingMessageCollectionWhere = {
  contains?: InputMaybe<TrainTrackingMessageWhere>;
};

export type TrainTrackingMessageOrderBy = {
  id?: InputMaybe<OrderDirection>;
  nextStation?: InputMaybe<StationOrderBy>;
  nextTrackSectionCode?: InputMaybe<OrderDirection>;
  previousStation?: InputMaybe<StationOrderBy>;
  previousTrackSectionCode?: InputMaybe<OrderDirection>;
  station?: InputMaybe<StationOrderBy>;
  timestamp?: InputMaybe<OrderDirection>;
  trackSection?: InputMaybe<TrackSectionOrderBy>;
  trackSectionCode?: InputMaybe<OrderDirection>;
  train?: InputMaybe<TrainOrderBy>;
  type?: InputMaybe<OrderDirection>;
  version?: InputMaybe<OrderDirection>;
};

export enum TrainTrackingMessageType {
  Occupy = 'OCCUPY',
  Release = 'RELEASE'
}

export type TrainTrackingMessageWhere = {
  and?: InputMaybe<Array<InputMaybe<TrainTrackingMessageWhere>>>;
  id?: InputMaybe<IntWhere>;
  nextStation?: InputMaybe<StationWhere>;
  nextTrackSectionCode?: InputMaybe<StringWhere>;
  or?: InputMaybe<Array<InputMaybe<TrainTrackingMessageWhere>>>;
  previousStation?: InputMaybe<StationWhere>;
  previousTrackSectionCode?: InputMaybe<StringWhere>;
  station?: InputMaybe<StationWhere>;
  timestamp?: InputMaybe<DateTimeWhere>;
  trackSection?: InputMaybe<TrackSectionWhere>;
  trackSectionCode?: InputMaybe<StringWhere>;
  train?: InputMaybe<TrainWhere>;
  type?: InputMaybe<EnumWhere>;
  version?: InputMaybe<StringWhere>;
};

export type TrainType = {
  __typename?: 'TrainType';
  name: Scalars['String']['output'];
  trainCategory: TrainCategory;
};

export type TrainTypeCollectionWhere = {
  contains?: InputMaybe<TrainTypeWhere>;
};

export type TrainTypeOrderBy = {
  name?: InputMaybe<OrderDirection>;
  trainCategory?: InputMaybe<TrainCategoryOrderBy>;
};

export type TrainTypeWhere = {
  and?: InputMaybe<Array<InputMaybe<TrainTypeWhere>>>;
  name?: InputMaybe<StringWhere>;
  or?: InputMaybe<Array<InputMaybe<TrainTypeWhere>>>;
  trainCategory?: InputMaybe<TrainCategoryWhere>;
};

export type TrainWhere = {
  and?: InputMaybe<Array<InputMaybe<TrainWhere>>>;
  cancelled?: InputMaybe<BooleanWhere>;
  commuterLineid?: InputMaybe<StringWhere>;
  compositions?: InputMaybe<CompositionCollectionWhere>;
  deleted?: InputMaybe<BooleanWhere>;
  departureDate?: InputMaybe<DateWhere>;
  operator?: InputMaybe<OperatorWhere>;
  or?: InputMaybe<Array<InputMaybe<TrainWhere>>>;
  routesetMessages?: InputMaybe<RoutesetMessageCollectionWhere>;
  runningCurrently?: InputMaybe<BooleanWhere>;
  timeTableRows?: InputMaybe<TimeTableRowCollectionWhere>;
  timetableAcceptanceDate?: InputMaybe<DateTimeWhere>;
  timetableType?: InputMaybe<EnumWhere>;
  trainLocations?: InputMaybe<TrainLocationCollectionWhere>;
  trainNumber?: InputMaybe<IntWhere>;
  trainTrackingMessages?: InputMaybe<TrainTrackingMessageCollectionWhere>;
  trainType?: InputMaybe<TrainTypeWhere>;
  version?: InputMaybe<StringWhere>;
};

export type VersionWhere = {
  equals?: InputMaybe<Scalars['String']['input']>;
  greaterThan?: InputMaybe<Scalars['String']['input']>;
  lessThan?: InputMaybe<Scalars['String']['input']>;
  unequals?: InputMaybe<Scalars['String']['input']>;
};

export type Wagon = {
  __typename?: 'Wagon';
  catering?: Maybe<Scalars['Boolean']['output']>;
  disabled?: Maybe<Scalars['Boolean']['output']>;
  length: Scalars['Int']['output'];
  location: Scalars['Int']['output'];
  luggage?: Maybe<Scalars['Boolean']['output']>;
  pet?: Maybe<Scalars['Boolean']['output']>;
  playground?: Maybe<Scalars['Boolean']['output']>;
  salesNumber: Scalars['Int']['output'];
  smoking?: Maybe<Scalars['Boolean']['output']>;
  vehicleId?: Maybe<Scalars['Int']['output']>;
  vehicleNumber?: Maybe<Scalars['String']['output']>;
  video?: Maybe<Scalars['Boolean']['output']>;
  wagonType?: Maybe<Scalars['String']['output']>;
};

export type WagonCollectionWhere = {
  contains?: InputMaybe<WagonWhere>;
};

export type WagonOrderBy = {
  catering?: InputMaybe<OrderDirection>;
  disabled?: InputMaybe<OrderDirection>;
  length?: InputMaybe<OrderDirection>;
  location?: InputMaybe<OrderDirection>;
  luggage?: InputMaybe<OrderDirection>;
  pet?: InputMaybe<OrderDirection>;
  playground?: InputMaybe<OrderDirection>;
  salesNumber?: InputMaybe<OrderDirection>;
  smoking?: InputMaybe<OrderDirection>;
  vehicleNumber?: InputMaybe<OrderDirection>;
  video?: InputMaybe<OrderDirection>;
  wagonType?: InputMaybe<OrderDirection>;
};

export type WagonWhere = {
  and?: InputMaybe<Array<InputMaybe<WagonWhere>>>;
  catering?: InputMaybe<BooleanWhere>;
  disabled?: InputMaybe<BooleanWhere>;
  length?: InputMaybe<IntWhere>;
  location?: InputMaybe<IntWhere>;
  luggage?: InputMaybe<BooleanWhere>;
  or?: InputMaybe<Array<InputMaybe<WagonWhere>>>;
  pet?: InputMaybe<BooleanWhere>;
  playground?: InputMaybe<BooleanWhere>;
  salesNumber?: InputMaybe<IntWhere>;
  smoking?: InputMaybe<BooleanWhere>;
  vehicleNumber?: InputMaybe<StringWhere>;
  video?: InputMaybe<BooleanWhere>;
  wagonType?: InputMaybe<StringWhere>;
};

export type RunningTrainsQueryVariables = Exact<{ [key: string]: never; }>;


export type RunningTrainsQuery = { __typename?: 'Query', currentlyRunningTrains?: Array<{ __typename?: 'Train', trainNumber: number, commuterLineid?: string | null, departureDate: string, version: string, operator: { __typename?: 'Operator', uicCode: number }, trainType: { __typename?: 'TrainType', name: string, trainCategory: { __typename?: 'TrainCategory', name: string } }, trainLocations?: Array<{ __typename?: 'TrainLocation', speed: number, timestamp: string, location?: Array<number | null> | null } | null> | null, timeTableRows?: Array<{ __typename?: 'TimeTableRow', trainStopping: boolean, scheduledTime: string, liveEstimateTime?: string | null, actualTime?: string | null, differenceInMinutes?: number | null, unknownDelay?: boolean | null, cancelled: boolean, type: TimeTableRowType, commercialTrack?: string | null, causes?: Array<{ __typename?: 'Cause', categoryCode: { __typename?: 'CategoryCode', code: string, name: string }, detailedCategoryCode?: { __typename?: 'DetailedCategoryCode', name: string, code: string } | null, thirdCategoryCode?: { __typename?: 'ThirdCategoryCode', name: string, code: string } | null } | null> | null, station: { __typename?: 'Station', name: string, shortCode: string } } | null> | null } | null> | null };

export type StationQueryVariables = Exact<{ [key: string]: never; }>;


export type StationQuery = { __typename?: 'Query', stations?: Array<{ __typename?: 'Station', name: string, shortCode: string } | null> | null };

export type StationSummaryFragment = { __typename?: 'Station', name: string, shortCode: string };

export type TrainQueryVariables = Exact<{
  trainNumber: Scalars['Int']['input'];
  departureDate: Scalars['Date']['input'];
}>;


export type TrainQuery = { __typename?: 'Query', train?: Array<{ __typename?: 'Train', trainNumber: number, departureDate: string, version: string, runningCurrently: boolean, commuterLineid?: string | null, operator: { __typename?: 'Operator', name: string, shortCode: string, uicCode: number }, trainType: { __typename?: 'TrainType', name: string, trainCategory: { __typename?: 'TrainCategory', name: string } }, compositions?: Array<{ __typename?: 'Composition', journeySections?: Array<{ __typename?: 'JourneySection', maximumSpeed: number, totalLength: number, startTimeTableRow?: { __typename?: 'TimeTableRow', scheduledTime: string, liveEstimateTime?: string | null, actualTime?: string | null, station: { __typename?: 'Station', name: string } } | null, endTimeTableRow?: { __typename?: 'TimeTableRow', scheduledTime: string, liveEstimateTime?: string | null, actualTime?: string | null, station: { __typename?: 'Station', name: string } } | null, locomotives?: Array<{ __typename?: 'Locomotive', vehicleNumber?: string | null, powerTypeAbbreviation: string, locomotiveType: string, location: number, vehicleId?: number | null } | null> | null, wagons?: Array<{ __typename?: 'Wagon', vehicleNumber?: string | null, salesNumber: number, wagonType?: string | null, location: number, length: number, playground?: boolean | null, pet?: boolean | null, catering?: boolean | null, video?: boolean | null, luggage?: boolean | null, smoking?: boolean | null, disabled?: boolean | null, vehicleId?: number | null } | null> | null } | null> | null } | null> | null, timeTableRows?: Array<{ __typename?: 'TimeTableRow', trainStopping: boolean, scheduledTime: string, liveEstimateTime?: string | null, actualTime?: string | null, differenceInMinutes?: number | null, unknownDelay?: boolean | null, cancelled: boolean, type: TimeTableRowType, commercialTrack?: string | null, causes?: Array<{ __typename?: 'Cause', categoryCode: { __typename?: 'CategoryCode', code: string, name: string }, detailedCategoryCode?: { __typename?: 'DetailedCategoryCode', name: string, code: string } | null, thirdCategoryCode?: { __typename?: 'ThirdCategoryCode', name: string, code: string } | null } | null> | null, station: { __typename?: 'Station', name: string, shortCode: string } } | null> | null, timeTableGroups?: Array<{ __typename?: 'TimeTableGroup', trainDirection?: TrainDirection | null, stationPlatformSide?: StationPlatformSide | null, arrival?: { __typename?: 'TimeTableRow', trainStopping: boolean, scheduledTime: string, liveEstimateTime?: string | null, actualTime?: string | null, differenceInMinutes?: number | null, unknownDelay?: boolean | null, cancelled: boolean, type: TimeTableRowType, commercialTrack?: string | null, causes?: Array<{ __typename?: 'Cause', categoryCode: { __typename?: 'CategoryCode', code: string, name: string }, detailedCategoryCode?: { __typename?: 'DetailedCategoryCode', name: string, code: string } | null, thirdCategoryCode?: { __typename?: 'ThirdCategoryCode', name: string, code: string } | null } | null> | null, station: { __typename?: 'Station', name: string, shortCode: string } } | null, departure?: { __typename?: 'TimeTableRow', trainStopping: boolean, scheduledTime: string, liveEstimateTime?: string | null, actualTime?: string | null, differenceInMinutes?: number | null, unknownDelay?: boolean | null, cancelled: boolean, type: TimeTableRowType, commercialTrack?: string | null, causes?: Array<{ __typename?: 'Cause', categoryCode: { __typename?: 'CategoryCode', code: string, name: string }, detailedCategoryCode?: { __typename?: 'DetailedCategoryCode', name: string, code: string } | null, thirdCategoryCode?: { __typename?: 'ThirdCategoryCode', name: string, code: string } | null } | null> | null, station: { __typename?: 'Station', name: string, shortCode: string } } | null }> | null } | null> | null };

export type TrainByStationFragment = { __typename?: 'Train', commuterLineid?: string | null, trainNumber: number, departureDate: string, version: string, operator: { __typename?: 'Operator', uicCode: number }, trainType: { __typename?: 'TrainType', name: string, trainCategory: { __typename?: 'TrainCategory', name: string } }, timeTableRows?: Array<{ __typename?: 'TimeTableRow', trainStopping: boolean, scheduledTime: string, liveEstimateTime?: string | null, actualTime?: string | null, differenceInMinutes?: number | null, unknownDelay?: boolean | null, cancelled: boolean, type: TimeTableRowType, commercialTrack?: string | null, causes?: Array<{ __typename?: 'Cause', categoryCode: { __typename?: 'CategoryCode', code: string, name: string }, detailedCategoryCode?: { __typename?: 'DetailedCategoryCode', name: string, code: string } | null, thirdCategoryCode?: { __typename?: 'ThirdCategoryCode', name: string, code: string } | null } | null> | null, station: { __typename?: 'Station', name: string, shortCode: string } } | null> | null };

export type TrainDetailsFragment = { __typename?: 'Train', trainNumber: number, departureDate: string, version: string, runningCurrently: boolean, commuterLineid?: string | null, operator: { __typename?: 'Operator', name: string, shortCode: string, uicCode: number }, trainType: { __typename?: 'TrainType', name: string, trainCategory: { __typename?: 'TrainCategory', name: string } }, compositions?: Array<{ __typename?: 'Composition', journeySections?: Array<{ __typename?: 'JourneySection', maximumSpeed: number, totalLength: number, startTimeTableRow?: { __typename?: 'TimeTableRow', scheduledTime: string, liveEstimateTime?: string | null, actualTime?: string | null, station: { __typename?: 'Station', name: string } } | null, endTimeTableRow?: { __typename?: 'TimeTableRow', scheduledTime: string, liveEstimateTime?: string | null, actualTime?: string | null, station: { __typename?: 'Station', name: string } } | null, locomotives?: Array<{ __typename?: 'Locomotive', vehicleNumber?: string | null, powerTypeAbbreviation: string, locomotiveType: string, location: number, vehicleId?: number | null } | null> | null, wagons?: Array<{ __typename?: 'Wagon', vehicleNumber?: string | null, salesNumber: number, wagonType?: string | null, location: number, length: number, playground?: boolean | null, pet?: boolean | null, catering?: boolean | null, video?: boolean | null, luggage?: boolean | null, smoking?: boolean | null, disabled?: boolean | null, vehicleId?: number | null } | null> | null } | null> | null } | null> | null, timeTableRows?: Array<{ __typename?: 'TimeTableRow', trainStopping: boolean, scheduledTime: string, liveEstimateTime?: string | null, actualTime?: string | null, differenceInMinutes?: number | null, unknownDelay?: boolean | null, cancelled: boolean, type: TimeTableRowType, commercialTrack?: string | null, causes?: Array<{ __typename?: 'Cause', categoryCode: { __typename?: 'CategoryCode', code: string, name: string }, detailedCategoryCode?: { __typename?: 'DetailedCategoryCode', name: string, code: string } | null, thirdCategoryCode?: { __typename?: 'ThirdCategoryCode', name: string, code: string } | null } | null> | null, station: { __typename?: 'Station', name: string, shortCode: string } } | null> | null, timeTableGroups?: Array<{ __typename?: 'TimeTableGroup', trainDirection?: TrainDirection | null, stationPlatformSide?: StationPlatformSide | null, arrival?: { __typename?: 'TimeTableRow', trainStopping: boolean, scheduledTime: string, liveEstimateTime?: string | null, actualTime?: string | null, differenceInMinutes?: number | null, unknownDelay?: boolean | null, cancelled: boolean, type: TimeTableRowType, commercialTrack?: string | null, causes?: Array<{ __typename?: 'Cause', categoryCode: { __typename?: 'CategoryCode', code: string, name: string }, detailedCategoryCode?: { __typename?: 'DetailedCategoryCode', name: string, code: string } | null, thirdCategoryCode?: { __typename?: 'ThirdCategoryCode', name: string, code: string } | null } | null> | null, station: { __typename?: 'Station', name: string, shortCode: string } } | null, departure?: { __typename?: 'TimeTableRow', trainStopping: boolean, scheduledTime: string, liveEstimateTime?: string | null, actualTime?: string | null, differenceInMinutes?: number | null, unknownDelay?: boolean | null, cancelled: boolean, type: TimeTableRowType, commercialTrack?: string | null, causes?: Array<{ __typename?: 'Cause', categoryCode: { __typename?: 'CategoryCode', code: string, name: string }, detailedCategoryCode?: { __typename?: 'DetailedCategoryCode', name: string, code: string } | null, thirdCategoryCode?: { __typename?: 'ThirdCategoryCode', name: string, code: string } | null } | null> | null, station: { __typename?: 'Station', name: string, shortCode: string } } | null }> | null };

export type TrainTimeTableGroupFragment = { __typename?: 'TimeTableGroup', trainDirection?: TrainDirection | null, stationPlatformSide?: StationPlatformSide | null, arrival?: { __typename?: 'TimeTableRow', trainStopping: boolean, scheduledTime: string, liveEstimateTime?: string | null, actualTime?: string | null, differenceInMinutes?: number | null, unknownDelay?: boolean | null, cancelled: boolean, type: TimeTableRowType, commercialTrack?: string | null, causes?: Array<{ __typename?: 'Cause', categoryCode: { __typename?: 'CategoryCode', code: string, name: string }, detailedCategoryCode?: { __typename?: 'DetailedCategoryCode', name: string, code: string } | null, thirdCategoryCode?: { __typename?: 'ThirdCategoryCode', name: string, code: string } | null } | null> | null, station: { __typename?: 'Station', name: string, shortCode: string } } | null, departure?: { __typename?: 'TimeTableRow', trainStopping: boolean, scheduledTime: string, liveEstimateTime?: string | null, actualTime?: string | null, differenceInMinutes?: number | null, unknownDelay?: boolean | null, cancelled: boolean, type: TimeTableRowType, commercialTrack?: string | null, causes?: Array<{ __typename?: 'Cause', categoryCode: { __typename?: 'CategoryCode', code: string, name: string }, detailedCategoryCode?: { __typename?: 'DetailedCategoryCode', name: string, code: string } | null, thirdCategoryCode?: { __typename?: 'ThirdCategoryCode', name: string, code: string } | null } | null> | null, station: { __typename?: 'Station', name: string, shortCode: string } } | null };

export type TrainTimeTableRowFragment = { __typename?: 'TimeTableRow', trainStopping: boolean, scheduledTime: string, liveEstimateTime?: string | null, actualTime?: string | null, differenceInMinutes?: number | null, unknownDelay?: boolean | null, cancelled: boolean, type: TimeTableRowType, commercialTrack?: string | null, causes?: Array<{ __typename?: 'Cause', categoryCode: { __typename?: 'CategoryCode', code: string, name: string }, detailedCategoryCode?: { __typename?: 'DetailedCategoryCode', name: string, code: string } | null, thirdCategoryCode?: { __typename?: 'ThirdCategoryCode', name: string, code: string } | null } | null> | null, station: { __typename?: 'Station', name: string, shortCode: string } };

export type TrainsByRouteQueryVariables = Exact<{
  departureStation: Scalars['String']['input'];
  arrivalStation: Scalars['String']['input'];
  departureDateGreaterThan: Scalars['Date']['input'];
  departureDateLessThan: Scalars['Date']['input'];
}>;


export type TrainsByRouteQuery = { __typename?: 'Query', trainsByVersionGreaterThan?: Array<{ __typename?: 'Train', commuterLineid?: string | null, trainNumber: number, departureDate: string, version: string, operator: { __typename?: 'Operator', uicCode: number }, trainType: { __typename?: 'TrainType', name: string, trainCategory: { __typename?: 'TrainCategory', name: string } }, timeTableRows?: Array<{ __typename?: 'TimeTableRow', trainStopping: boolean, scheduledTime: string, liveEstimateTime?: string | null, actualTime?: string | null, differenceInMinutes?: number | null, unknownDelay?: boolean | null, cancelled: boolean, type: TimeTableRowType, commercialTrack?: string | null, causes?: Array<{ __typename?: 'Cause', categoryCode: { __typename?: 'CategoryCode', code: string, name: string }, detailedCategoryCode?: { __typename?: 'DetailedCategoryCode', name: string, code: string } | null, thirdCategoryCode?: { __typename?: 'ThirdCategoryCode', name: string, code: string } | null } | null> | null, station: { __typename?: 'Station', name: string, shortCode: string } } | null> | null } | null> | null };

export type TrainsByStationQueryVariables = Exact<{
  station: Scalars['String']['input'];
  departingTrains: Scalars['Int']['input'];
  departedTrains: Scalars['Int']['input'];
  arrivingTrains: Scalars['Int']['input'];
  arrivedTrains: Scalars['Int']['input'];
}>;


export type TrainsByStationQuery = { __typename?: 'Query', trainsByStationAndQuantity?: Array<{ __typename?: 'Train', commuterLineid?: string | null, trainNumber: number, departureDate: string, version: string, operator: { __typename?: 'Operator', uicCode: number }, trainType: { __typename?: 'TrainType', name: string, trainCategory: { __typename?: 'TrainCategory', name: string } }, timeTableRows?: Array<{ __typename?: 'TimeTableRow', trainStopping: boolean, scheduledTime: string, liveEstimateTime?: string | null, actualTime?: string | null, differenceInMinutes?: number | null, unknownDelay?: boolean | null, cancelled: boolean, type: TimeTableRowType, commercialTrack?: string | null, causes?: Array<{ __typename?: 'Cause', categoryCode: { __typename?: 'CategoryCode', code: string, name: string }, detailedCategoryCode?: { __typename?: 'DetailedCategoryCode', name: string, code: string } | null, thirdCategoryCode?: { __typename?: 'ThirdCategoryCode', name: string, code: string } | null } | null> | null, station: { __typename?: 'Station', name: string, shortCode: string } } | null> | null } | null> | null };

export const StationSummaryFragmentDoc = gql`
    fragment StationSummary on Station {
  name
  shortCode
}
    `;
export const TrainTimeTableRowFragmentDoc = gql`
    fragment TrainTimeTableRow on TimeTableRow {
  trainStopping
  scheduledTime
  liveEstimateTime
  actualTime
  differenceInMinutes
  unknownDelay
  cancelled
  causes {
    categoryCode {
      code
      name
    }
    detailedCategoryCode {
      name
      code
    }
    thirdCategoryCode {
      name
      code
    }
  }
  type
  station {
    name
    shortCode
  }
  commercialTrack
}
    `;
export const TrainByStationFragmentDoc = gql`
    fragment TrainByStation on Train {
  commuterLineid
  trainNumber
  departureDate
  version
  operator {
    uicCode
  }
  trainType {
    name
    trainCategory {
      name
    }
  }
  timeTableRows(where: {and: [{trainStopping: {equals: true}}]}) {
    ...TrainTimeTableRow
  }
  trainType {
    name
  }
}
    ${TrainTimeTableRowFragmentDoc}`;
export const TrainDetailsFragmentDoc = gql`
    fragment TrainDetails on Train {
  trainNumber
  departureDate
  version
  runningCurrently
  operator {
    name
  }
  commuterLineid
  trainType {
    name
    trainCategory {
      name
    }
  }
  operator {
    shortCode
    uicCode
  }
  compositions {
    journeySections {
      startTimeTableRow {
        scheduledTime
        liveEstimateTime
        actualTime
        station {
          name
        }
      }
      endTimeTableRow {
        scheduledTime
        liveEstimateTime
        actualTime
        station {
          name
        }
      }
      maximumSpeed
      totalLength
      locomotives {
        vehicleNumber
        powerTypeAbbreviation
        locomotiveType
        location
        vehicleId @client
      }
      wagons {
        vehicleNumber
        salesNumber
        wagonType
        location
        length
        playground
        pet
        catering
        video
        luggage
        smoking
        disabled
        vehicleId @client
      }
    }
  }
  timeTableRows(where: {and: [{trainStopping: {equals: true}}]}) {
    ...TrainTimeTableRow
  }
  timeTableGroups @client {
    arrival {
      ...TrainTimeTableRow
    }
    departure {
      ...TrainTimeTableRow
    }
    trainDirection
    stationPlatformSide
  }
}
    ${TrainTimeTableRowFragmentDoc}`;
export const TrainTimeTableGroupFragmentDoc = gql`
    fragment TrainTimeTableGroup on TimeTableGroup {
  arrival {
    ...TrainTimeTableRow
  }
  departure {
    ...TrainTimeTableRow
  }
  trainDirection
  stationPlatformSide
}
    ${TrainTimeTableRowFragmentDoc}`;
export const RunningTrainsDocument = gql`
    query RunningTrains {
  currentlyRunningTrains(
    where: {and: [{trainType: {trainCategory: {or: [{name: {equals: "Commuter"}}, {name: {equals: "Long-distance"}}]}}}, {operator: {shortCode: {equals: "vr"}}}]}
  ) {
    trainNumber
    commuterLineid
    departureDate
    version
    operator {
      uicCode
    }
    trainType {
      name
      trainCategory {
        name
      }
    }
    trainLocations(orderBy: {timestamp: DESCENDING}, take: 2) {
      speed
      timestamp
      location
    }
    timeTableRows(where: {commercialStop: {equals: true}}) {
      ...TrainTimeTableRow
    }
  }
}
    ${TrainTimeTableRowFragmentDoc}`;

/**
 * __useRunningTrainsQuery__
 *
 * To run a query within a React component, call `useRunningTrainsQuery` and pass it any options that fit your needs.
 * When your component renders, `useRunningTrainsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRunningTrainsQuery({
 *   variables: {
 *   },
 * });
 */
export function useRunningTrainsQuery(baseOptions?: Apollo.QueryHookOptions<RunningTrainsQuery, RunningTrainsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RunningTrainsQuery, RunningTrainsQueryVariables>(RunningTrainsDocument, options);
      }
export function useRunningTrainsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RunningTrainsQuery, RunningTrainsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RunningTrainsQuery, RunningTrainsQueryVariables>(RunningTrainsDocument, options);
        }
export function useRunningTrainsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<RunningTrainsQuery, RunningTrainsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<RunningTrainsQuery, RunningTrainsQueryVariables>(RunningTrainsDocument, options);
        }
export type RunningTrainsQueryHookResult = ReturnType<typeof useRunningTrainsQuery>;
export type RunningTrainsLazyQueryHookResult = ReturnType<typeof useRunningTrainsLazyQuery>;
export type RunningTrainsSuspenseQueryHookResult = ReturnType<typeof useRunningTrainsSuspenseQuery>;
export type RunningTrainsQueryResult = Apollo.QueryResult<RunningTrainsQuery, RunningTrainsQueryVariables>;
export const StationDocument = gql`
    query Station {
  stations(where: {passengerTraffic: {equals: true}}) {
    ...StationSummary
  }
}
    ${StationSummaryFragmentDoc}`;

/**
 * __useStationQuery__
 *
 * To run a query within a React component, call `useStationQuery` and pass it any options that fit your needs.
 * When your component renders, `useStationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStationQuery({
 *   variables: {
 *   },
 * });
 */
export function useStationQuery(baseOptions?: Apollo.QueryHookOptions<StationQuery, StationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StationQuery, StationQueryVariables>(StationDocument, options);
      }
export function useStationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StationQuery, StationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StationQuery, StationQueryVariables>(StationDocument, options);
        }
export function useStationSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<StationQuery, StationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<StationQuery, StationQueryVariables>(StationDocument, options);
        }
export type StationQueryHookResult = ReturnType<typeof useStationQuery>;
export type StationLazyQueryHookResult = ReturnType<typeof useStationLazyQuery>;
export type StationSuspenseQueryHookResult = ReturnType<typeof useStationSuspenseQuery>;
export type StationQueryResult = Apollo.QueryResult<StationQuery, StationQueryVariables>;
export const TrainDocument = gql`
    query Train($trainNumber: Int!, $departureDate: Date!) {
  train(trainNumber: $trainNumber, departureDate: $departureDate) {
    ...TrainDetails
  }
}
    ${TrainDetailsFragmentDoc}`;

/**
 * __useTrainQuery__
 *
 * To run a query within a React component, call `useTrainQuery` and pass it any options that fit your needs.
 * When your component renders, `useTrainQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTrainQuery({
 *   variables: {
 *      trainNumber: // value for 'trainNumber'
 *      departureDate: // value for 'departureDate'
 *   },
 * });
 */
export function useTrainQuery(baseOptions: Apollo.QueryHookOptions<TrainQuery, TrainQueryVariables> & ({ variables: TrainQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TrainQuery, TrainQueryVariables>(TrainDocument, options);
      }
export function useTrainLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TrainQuery, TrainQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TrainQuery, TrainQueryVariables>(TrainDocument, options);
        }
export function useTrainSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<TrainQuery, TrainQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TrainQuery, TrainQueryVariables>(TrainDocument, options);
        }
export type TrainQueryHookResult = ReturnType<typeof useTrainQuery>;
export type TrainLazyQueryHookResult = ReturnType<typeof useTrainLazyQuery>;
export type TrainSuspenseQueryHookResult = ReturnType<typeof useTrainSuspenseQuery>;
export type TrainQueryResult = Apollo.QueryResult<TrainQuery, TrainQueryVariables>;
export const TrainsByRouteDocument = gql`
    query TrainsByRoute($departureStation: String!, $arrivalStation: String!, $departureDateGreaterThan: Date!, $departureDateLessThan: Date!) {
  trainsByVersionGreaterThan(
    version: "1"
    where: {and: [{and: [{departureDate: {greaterThan: $departureDateGreaterThan}}, {departureDate: {lessThan: $departureDateLessThan}}]}, {timeTableRows: {contains: {and: [{station: {shortCode: {equals: $departureStation}}}, {station: {shortCode: {equals: $arrivalStation}}}]}}}]}
  ) {
    ...TrainByStation
  }
}
    ${TrainByStationFragmentDoc}`;

/**
 * __useTrainsByRouteQuery__
 *
 * To run a query within a React component, call `useTrainsByRouteQuery` and pass it any options that fit your needs.
 * When your component renders, `useTrainsByRouteQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTrainsByRouteQuery({
 *   variables: {
 *      departureStation: // value for 'departureStation'
 *      arrivalStation: // value for 'arrivalStation'
 *      departureDateGreaterThan: // value for 'departureDateGreaterThan'
 *      departureDateLessThan: // value for 'departureDateLessThan'
 *   },
 * });
 */
export function useTrainsByRouteQuery(baseOptions: Apollo.QueryHookOptions<TrainsByRouteQuery, TrainsByRouteQueryVariables> & ({ variables: TrainsByRouteQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TrainsByRouteQuery, TrainsByRouteQueryVariables>(TrainsByRouteDocument, options);
      }
export function useTrainsByRouteLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TrainsByRouteQuery, TrainsByRouteQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TrainsByRouteQuery, TrainsByRouteQueryVariables>(TrainsByRouteDocument, options);
        }
export function useTrainsByRouteSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<TrainsByRouteQuery, TrainsByRouteQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TrainsByRouteQuery, TrainsByRouteQueryVariables>(TrainsByRouteDocument, options);
        }
export type TrainsByRouteQueryHookResult = ReturnType<typeof useTrainsByRouteQuery>;
export type TrainsByRouteLazyQueryHookResult = ReturnType<typeof useTrainsByRouteLazyQuery>;
export type TrainsByRouteSuspenseQueryHookResult = ReturnType<typeof useTrainsByRouteSuspenseQuery>;
export type TrainsByRouteQueryResult = Apollo.QueryResult<TrainsByRouteQuery, TrainsByRouteQueryVariables>;
export const TrainsByStationDocument = gql`
    query TrainsByStation($station: String!, $departingTrains: Int!, $departedTrains: Int!, $arrivingTrains: Int!, $arrivedTrains: Int!) {
  trainsByStationAndQuantity(
    station: $station
    departingTrains: $departingTrains
    departedTrains: $departedTrains
    arrivingTrains: $arrivingTrains
    arrivedTrains: $arrivedTrains
    where: {trainType: {trainCategory: {or: [{name: {equals: "Commuter"}}, {name: {equals: "Long-distance"}}]}}}
  ) {
    ...TrainByStation
  }
}
    ${TrainByStationFragmentDoc}`;

/**
 * __useTrainsByStationQuery__
 *
 * To run a query within a React component, call `useTrainsByStationQuery` and pass it any options that fit your needs.
 * When your component renders, `useTrainsByStationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTrainsByStationQuery({
 *   variables: {
 *      station: // value for 'station'
 *      departingTrains: // value for 'departingTrains'
 *      departedTrains: // value for 'departedTrains'
 *      arrivingTrains: // value for 'arrivingTrains'
 *      arrivedTrains: // value for 'arrivedTrains'
 *   },
 * });
 */
export function useTrainsByStationQuery(baseOptions: Apollo.QueryHookOptions<TrainsByStationQuery, TrainsByStationQueryVariables> & ({ variables: TrainsByStationQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TrainsByStationQuery, TrainsByStationQueryVariables>(TrainsByStationDocument, options);
      }
export function useTrainsByStationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TrainsByStationQuery, TrainsByStationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TrainsByStationQuery, TrainsByStationQueryVariables>(TrainsByStationDocument, options);
        }
export function useTrainsByStationSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<TrainsByStationQuery, TrainsByStationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TrainsByStationQuery, TrainsByStationQueryVariables>(TrainsByStationDocument, options);
        }
export type TrainsByStationQueryHookResult = ReturnType<typeof useTrainsByStationQuery>;
export type TrainsByStationLazyQueryHookResult = ReturnType<typeof useTrainsByStationLazyQuery>;
export type TrainsByStationSuspenseQueryHookResult = ReturnType<typeof useTrainsByStationSuspenseQuery>;
export type TrainsByStationQueryResult = Apollo.QueryResult<TrainsByStationQuery, TrainsByStationQueryVariables>;