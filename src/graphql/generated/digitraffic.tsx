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
  /** An RFC-3339 compliant Full Date Scalar */
  Date: string;
  /** An RFC-3339 compliant DateTime Scalar */
  DateTime: string;
};

/** # PRIMITIVE FILTERS */
export type BooleanWhere = {
  equals?: InputMaybe<Scalars['Boolean']>;
  unequals?: InputMaybe<Scalars['Boolean']>;
};

export type CategoryCode = {
  __typename?: 'CategoryCode';
  code: Scalars['String'];
  name: Scalars['String'];
  validFrom: Scalars['Date'];
  validTo?: Maybe<Scalars['Date']>;
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
  version: Scalars['String'];
};


export type CompositionJourneySectionsArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<JourneySectionOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
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
  inside?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
};

export type DateTimeWhere = {
  equals?: InputMaybe<Scalars['DateTime']>;
  greaterThan?: InputMaybe<Scalars['DateTime']>;
  lessThan?: InputMaybe<Scalars['DateTime']>;
  unequals?: InputMaybe<Scalars['DateTime']>;
};

export type DateWhere = {
  equals?: InputMaybe<Scalars['Date']>;
  greaterThan?: InputMaybe<Scalars['Date']>;
  lessThan?: InputMaybe<Scalars['Date']>;
  unequals?: InputMaybe<Scalars['Date']>;
};

export type DetailedCategoryCode = {
  __typename?: 'DetailedCategoryCode';
  code: Scalars['String'];
  name: Scalars['String'];
  validFrom: Scalars['Date'];
  validTo?: Maybe<Scalars['Date']>;
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
  equals?: InputMaybe<Scalars['String']>;
  unequals?: InputMaybe<Scalars['String']>;
};

export enum EstimateSourceType {
  Combocalc = 'COMBOCALC',
  LiikeAutomatic = 'LIIKE_AUTOMATIC',
  LiikeUser = 'LIIKE_USER',
  MikuUser = 'MIKU_USER',
  Unknown = 'UNKNOWN'
}

export type IntWhere = {
  equals?: InputMaybe<Scalars['Int']>;
  greaterThan?: InputMaybe<Scalars['Int']>;
  lessThan?: InputMaybe<Scalars['Int']>;
  unequals?: InputMaybe<Scalars['Int']>;
};

export type JourneySection = {
  __typename?: 'JourneySection';
  endTimeTableRow?: Maybe<TimeTableRow>;
  locomotives?: Maybe<Array<Maybe<Locomotive>>>;
  maximumSpeed: Scalars['Int'];
  startTimeTableRow?: Maybe<TimeTableRow>;
  totalLength: Scalars['Int'];
  wagons?: Maybe<Array<Maybe<Wagon>>>;
};


export type JourneySectionLocomotivesArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<LocomotiveOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<LocomotiveWhere>;
};


export type JourneySectionWagonsArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<WagonOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
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
  location: Scalars['Int'];
  locomotiveType: Scalars['String'];
  powerTypeAbbreviation: Scalars['String'];
  vehicleId?: Maybe<Scalars['Int']>;
  vehicleNumber?: Maybe<Scalars['String']>;
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
  name: Scalars['String'];
  shortCode: Scalars['String'];
  uicCode: Scalars['Int'];
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
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  version: Scalars['String'];
  where?: InputMaybe<CompositionWhere>;
};


export type QueryCurrentlyRunningTrainsArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<TrainOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TrainWhere>;
};


export type QueryLatestTrainLocationsArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<TrainLocationOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TrainLocationWhere>;
};


export type QueryRoutesetMessagesByVersionGreaterThanArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<RoutesetMessageOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  version: Scalars['String'];
  where?: InputMaybe<RoutesetMessageWhere>;
};


export type QueryStationsArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<StationOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<StationWhere>;
};


export type QueryTrainArgs = {
  departureDate: Scalars['Date'];
  orderBy?: InputMaybe<Array<InputMaybe<TrainOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  trainNumber: Scalars['Int'];
  where?: InputMaybe<TrainWhere>;
};


export type QueryTrainTrackingMessagesByVersionGreaterThanArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<TrainTrackingMessageOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  version: Scalars['String'];
  where?: InputMaybe<TrainTrackingMessageWhere>;
};


export type QueryTrainsByDepartureDateArgs = {
  departureDate: Scalars['Date'];
  orderBy?: InputMaybe<Array<InputMaybe<TrainOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TrainWhere>;
};


export type QueryTrainsByStationAndQuantityArgs = {
  arrivedTrains?: InputMaybe<Scalars['Int']>;
  arrivingTrains?: InputMaybe<Scalars['Int']>;
  departedTrains?: InputMaybe<Scalars['Int']>;
  departingTrains?: InputMaybe<Scalars['Int']>;
  includeNonStopping?: InputMaybe<Scalars['Boolean']>;
  orderBy?: InputMaybe<Array<InputMaybe<TrainOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']>;
  station: Scalars['String'];
  take?: InputMaybe<Scalars['Int']>;
  trainCategories?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  where?: InputMaybe<TrainWhere>;
};


export type QueryTrainsByVersionGreaterThanArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<TrainOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  version: Scalars['String'];
  where?: InputMaybe<TrainWhere>;
};

export type Routesection = {
  __typename?: 'Routesection';
  commercialTrackId: Scalars['String'];
  routesetId: Scalars['Int'];
  sectionId: Scalars['String'];
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
  clientSystem: Scalars['String'];
  id: Scalars['Int'];
  messageTime: Scalars['DateTime'];
  routeType: Scalars['String'];
  routesections?: Maybe<Array<Maybe<Routesection>>>;
  train?: Maybe<Train>;
  version: Scalars['String'];
};


export type RoutesetMessageRoutesectionsArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<RoutesectionOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
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
  countryCode: Scalars['String'];
  location?: Maybe<Array<Maybe<Scalars['Float']>>>;
  name: Scalars['String'];
  passengerTraffic: Scalars['Boolean'];
  shortCode: Scalars['String'];
  timeTableRows?: Maybe<Array<Maybe<TimeTableRow>>>;
  type: StationType;
  uicCode: Scalars['Int'];
};


export type StationTimeTableRowsArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<TimeTableRowOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
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
  equals?: InputMaybe<Scalars['String']>;
  unequals?: InputMaybe<Scalars['String']>;
};

export type ThirdCategoryCode = {
  __typename?: 'ThirdCategoryCode';
  code: Scalars['String'];
  description: Scalars['String'];
  name: Scalars['String'];
  validFrom: Scalars['Date'];
  validTo?: Maybe<Scalars['Date']>;
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

export type TimeTableRow = {
  __typename?: 'TimeTableRow';
  actualTime?: Maybe<Scalars['DateTime']>;
  cancelled: Scalars['Boolean'];
  causes?: Maybe<Array<Maybe<Cause>>>;
  commercialStop?: Maybe<Scalars['Boolean']>;
  commercialTrack?: Maybe<Scalars['String']>;
  differenceInMinutes?: Maybe<Scalars['Int']>;
  estimateSourceType?: Maybe<EstimateSourceType>;
  liveEstimateTime?: Maybe<Scalars['DateTime']>;
  scheduledTime: Scalars['DateTime'];
  station: Station;
  train: Train;
  trainStopping: Scalars['Boolean'];
  type: TimeTableRowType;
  unknownDelay?: Maybe<Scalars['Boolean']>;
};


export type TimeTableRowCausesArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<CauseOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
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
  endKilometres: Scalars['Int'];
  endMetres: Scalars['Int'];
  endTrack: Scalars['String'];
  startKilometres: Scalars['Int'];
  startMetres: Scalars['Int'];
  startTrack: Scalars['String'];
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
  id: Scalars['Int'];
  ranges: Array<Maybe<TrackRange>>;
  station: Station;
  trackSectionCode: Scalars['String'];
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
  cancelled: Scalars['Boolean'];
  commuterLineid?: Maybe<Scalars['String']>;
  compositions?: Maybe<Array<Maybe<Composition>>>;
  deleted?: Maybe<Scalars['Boolean']>;
  departureDate: Scalars['Date'];
  operator: Operator;
  routesetMessages?: Maybe<Array<Maybe<RoutesetMessage>>>;
  runningCurrently: Scalars['Boolean'];
  timeTableRows?: Maybe<Array<Maybe<TimeTableRow>>>;
  timetableAcceptanceDate: Scalars['DateTime'];
  timetableType: TimetableType;
  trainLocations?: Maybe<Array<Maybe<TrainLocation>>>;
  trainNumber: Scalars['Int'];
  trainTrackingMessages?: Maybe<Array<Maybe<TrainTrackingMessage>>>;
  trainType: TrainType;
  version: Scalars['String'];
};


export type TrainCompositionsArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<CompositionOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<CompositionWhere>;
};


export type TrainRoutesetMessagesArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<RoutesetMessageOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<RoutesetMessageWhere>;
};


export type TrainTimeTableRowsArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<TimeTableRowOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TimeTableRowWhere>;
};


export type TrainTrainLocationsArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<TrainLocationOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TrainLocationWhere>;
};


export type TrainTrainTrackingMessagesArgs = {
  orderBy?: InputMaybe<Array<InputMaybe<TrainTrackingMessageOrderBy>>>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TrainTrackingMessageWhere>;
};

export type TrainCategory = {
  __typename?: 'TrainCategory';
  name: Scalars['String'];
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

export type TrainLocation = {
  __typename?: 'TrainLocation';
  accuracy?: Maybe<Scalars['Int']>;
  location?: Maybe<Array<Maybe<Scalars['Float']>>>;
  speed: Scalars['Int'];
  timestamp: Scalars['DateTime'];
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
  id: Scalars['Int'];
  nextStation?: Maybe<Station>;
  nextTrackSectionCode?: Maybe<Scalars['String']>;
  previousStation?: Maybe<Station>;
  previousTrackSectionCode?: Maybe<Scalars['String']>;
  station: Station;
  timestamp: Scalars['DateTime'];
  trackSection?: Maybe<TrackSection>;
  trackSectionCode: Scalars['String'];
  train?: Maybe<Train>;
  type: TrainTrackingMessageType;
  version: Scalars['String'];
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
  name: Scalars['String'];
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
  equals?: InputMaybe<Scalars['String']>;
  greaterThan?: InputMaybe<Scalars['String']>;
  lessThan?: InputMaybe<Scalars['String']>;
  unequals?: InputMaybe<Scalars['String']>;
};

export type Wagon = {
  __typename?: 'Wagon';
  catering?: Maybe<Scalars['Boolean']>;
  disabled?: Maybe<Scalars['Boolean']>;
  length: Scalars['Int'];
  location: Scalars['Int'];
  luggage?: Maybe<Scalars['Boolean']>;
  pet?: Maybe<Scalars['Boolean']>;
  playground?: Maybe<Scalars['Boolean']>;
  salesNumber: Scalars['Int'];
  smoking?: Maybe<Scalars['Boolean']>;
  vehicleId?: Maybe<Scalars['Int']>;
  vehicleNumber?: Maybe<Scalars['String']>;
  video?: Maybe<Scalars['Boolean']>;
  wagonType?: Maybe<Scalars['String']>;
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

export type StationQueryVariables = Exact<{ [key: string]: never; }>;


export type StationQuery = { __typename?: 'Query', stations?: Array<{ __typename?: 'Station', name: string, shortCode: string } | null> | null };

export type StationSummaryFragment = { __typename?: 'Station', name: string, shortCode: string };

export type TrainQueryVariables = Exact<{
  trainNumber: Scalars['Int'];
  departureDate: Scalars['Date'];
}>;


export type TrainQuery = { __typename?: 'Query', train?: Array<{ __typename?: 'Train', trainNumber: number, departureDate: string, version: string, runningCurrently: boolean, commuterLineid?: string | null, operator: { __typename?: 'Operator', name: string, shortCode: string, uicCode: number }, trainType: { __typename?: 'TrainType', name: string, trainCategory: { __typename?: 'TrainCategory', name: string } }, compositions?: Array<{ __typename?: 'Composition', journeySections?: Array<{ __typename?: 'JourneySection', maximumSpeed: number, totalLength: number, startTimeTableRow?: { __typename?: 'TimeTableRow', scheduledTime: string, liveEstimateTime?: string | null, actualTime?: string | null, station: { __typename?: 'Station', name: string } } | null, endTimeTableRow?: { __typename?: 'TimeTableRow', scheduledTime: string, liveEstimateTime?: string | null, actualTime?: string | null, station: { __typename?: 'Station', name: string } } | null, locomotives?: Array<{ __typename?: 'Locomotive', vehicleNumber?: string | null, powerTypeAbbreviation: string, locomotiveType: string, location: number, vehicleId?: number | null } | null> | null, wagons?: Array<{ __typename?: 'Wagon', vehicleNumber?: string | null, salesNumber: number, wagonType?: string | null, location: number, length: number, playground?: boolean | null, pet?: boolean | null, catering?: boolean | null, video?: boolean | null, luggage?: boolean | null, smoking?: boolean | null, disabled?: boolean | null, vehicleId?: number | null } | null> | null } | null> | null } | null> | null, timeTableRows?: Array<{ __typename?: 'TimeTableRow', trainStopping: boolean, scheduledTime: string, liveEstimateTime?: string | null, actualTime?: string | null, differenceInMinutes?: number | null, unknownDelay?: boolean | null, cancelled: boolean, type: TimeTableRowType, commercialTrack?: string | null, causes?: Array<{ __typename?: 'Cause', categoryCode: { __typename?: 'CategoryCode', code: string, name: string }, detailedCategoryCode?: { __typename?: 'DetailedCategoryCode', name: string, code: string } | null, thirdCategoryCode?: { __typename?: 'ThirdCategoryCode', name: string, code: string } | null } | null> | null, station: { __typename?: 'Station', name: string, shortCode: string } } | null> | null } | null> | null };

export type TrainByStationFragment = { __typename?: 'Train', commuterLineid?: string | null, runningCurrently: boolean, trainNumber: number, departureDate: string, version: string, trainType: { __typename?: 'TrainType', name: string, trainCategory: { __typename?: 'TrainCategory', name: string } }, timeTableRows?: Array<{ __typename?: 'TimeTableRow', trainStopping: boolean, scheduledTime: string, liveEstimateTime?: string | null, actualTime?: string | null, differenceInMinutes?: number | null, unknownDelay?: boolean | null, cancelled: boolean, type: TimeTableRowType, commercialTrack?: string | null, causes?: Array<{ __typename?: 'Cause', categoryCode: { __typename?: 'CategoryCode', code: string, name: string }, detailedCategoryCode?: { __typename?: 'DetailedCategoryCode', name: string, code: string } | null, thirdCategoryCode?: { __typename?: 'ThirdCategoryCode', name: string, code: string } | null } | null> | null, station: { __typename?: 'Station', name: string, shortCode: string } } | null> | null, operator: { __typename?: 'Operator', shortCode: string, uicCode: number } };

export type TrainDetailsFragment = { __typename?: 'Train', trainNumber: number, departureDate: string, version: string, runningCurrently: boolean, commuterLineid?: string | null, operator: { __typename?: 'Operator', name: string, shortCode: string, uicCode: number }, trainType: { __typename?: 'TrainType', name: string, trainCategory: { __typename?: 'TrainCategory', name: string } }, compositions?: Array<{ __typename?: 'Composition', journeySections?: Array<{ __typename?: 'JourneySection', maximumSpeed: number, totalLength: number, startTimeTableRow?: { __typename?: 'TimeTableRow', scheduledTime: string, liveEstimateTime?: string | null, actualTime?: string | null, station: { __typename?: 'Station', name: string } } | null, endTimeTableRow?: { __typename?: 'TimeTableRow', scheduledTime: string, liveEstimateTime?: string | null, actualTime?: string | null, station: { __typename?: 'Station', name: string } } | null, locomotives?: Array<{ __typename?: 'Locomotive', vehicleNumber?: string | null, powerTypeAbbreviation: string, locomotiveType: string, location: number, vehicleId?: number | null } | null> | null, wagons?: Array<{ __typename?: 'Wagon', vehicleNumber?: string | null, salesNumber: number, wagonType?: string | null, location: number, length: number, playground?: boolean | null, pet?: boolean | null, catering?: boolean | null, video?: boolean | null, luggage?: boolean | null, smoking?: boolean | null, disabled?: boolean | null, vehicleId?: number | null } | null> | null } | null> | null } | null> | null, timeTableRows?: Array<{ __typename?: 'TimeTableRow', trainStopping: boolean, scheduledTime: string, liveEstimateTime?: string | null, actualTime?: string | null, differenceInMinutes?: number | null, unknownDelay?: boolean | null, cancelled: boolean, type: TimeTableRowType, commercialTrack?: string | null, causes?: Array<{ __typename?: 'Cause', categoryCode: { __typename?: 'CategoryCode', code: string, name: string }, detailedCategoryCode?: { __typename?: 'DetailedCategoryCode', name: string, code: string } | null, thirdCategoryCode?: { __typename?: 'ThirdCategoryCode', name: string, code: string } | null } | null> | null, station: { __typename?: 'Station', name: string, shortCode: string } } | null> | null };

export type TrainTimeTableRowFragment = { __typename?: 'TimeTableRow', trainStopping: boolean, scheduledTime: string, liveEstimateTime?: string | null, actualTime?: string | null, differenceInMinutes?: number | null, unknownDelay?: boolean | null, cancelled: boolean, type: TimeTableRowType, commercialTrack?: string | null, causes?: Array<{ __typename?: 'Cause', categoryCode: { __typename?: 'CategoryCode', code: string, name: string }, detailedCategoryCode?: { __typename?: 'DetailedCategoryCode', name: string, code: string } | null, thirdCategoryCode?: { __typename?: 'ThirdCategoryCode', name: string, code: string } | null } | null> | null, station: { __typename?: 'Station', name: string, shortCode: string } };

export type TrainsByStationQueryVariables = Exact<{
  station: Scalars['String'];
  departingTrains: Scalars['Int'];
  departedTrains: Scalars['Int'];
  arrivingTrains: Scalars['Int'];
  arrivedTrains: Scalars['Int'];
}>;


export type TrainsByStationQuery = { __typename?: 'Query', trainsByStationAndQuantity?: Array<{ __typename?: 'Train', commuterLineid?: string | null, runningCurrently: boolean, trainNumber: number, departureDate: string, version: string, trainType: { __typename?: 'TrainType', name: string, trainCategory: { __typename?: 'TrainCategory', name: string } }, timeTableRows?: Array<{ __typename?: 'TimeTableRow', trainStopping: boolean, scheduledTime: string, liveEstimateTime?: string | null, actualTime?: string | null, differenceInMinutes?: number | null, unknownDelay?: boolean | null, cancelled: boolean, type: TimeTableRowType, commercialTrack?: string | null, causes?: Array<{ __typename?: 'Cause', categoryCode: { __typename?: 'CategoryCode', code: string, name: string }, detailedCategoryCode?: { __typename?: 'DetailedCategoryCode', name: string, code: string } | null, thirdCategoryCode?: { __typename?: 'ThirdCategoryCode', name: string, code: string } | null } | null> | null, station: { __typename?: 'Station', name: string, shortCode: string } } | null> | null, operator: { __typename?: 'Operator', shortCode: string, uicCode: number } } | null> | null };

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
  runningCurrently
  trainNumber
  departureDate
  version
  trainType {
    name
    trainCategory {
      name
    }
  }
  timeTableRows(where: {and: [{trainStopping: {equals: true}}]}) {
    ...TrainTimeTableRow
  }
  operator {
    shortCode
    uicCode
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
}
    ${TrainTimeTableRowFragmentDoc}`;
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
export type StationQueryHookResult = ReturnType<typeof useStationQuery>;
export type StationLazyQueryHookResult = ReturnType<typeof useStationLazyQuery>;
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
export function useTrainQuery(baseOptions: Apollo.QueryHookOptions<TrainQuery, TrainQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TrainQuery, TrainQueryVariables>(TrainDocument, options);
      }
export function useTrainLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TrainQuery, TrainQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TrainQuery, TrainQueryVariables>(TrainDocument, options);
        }
export type TrainQueryHookResult = ReturnType<typeof useTrainQuery>;
export type TrainLazyQueryHookResult = ReturnType<typeof useTrainLazyQuery>;
export type TrainQueryResult = Apollo.QueryResult<TrainQuery, TrainQueryVariables>;
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
export function useTrainsByStationQuery(baseOptions: Apollo.QueryHookOptions<TrainsByStationQuery, TrainsByStationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TrainsByStationQuery, TrainsByStationQueryVariables>(TrainsByStationDocument, options);
      }
export function useTrainsByStationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TrainsByStationQuery, TrainsByStationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TrainsByStationQuery, TrainsByStationQueryVariables>(TrainsByStationDocument, options);
        }
export type TrainsByStationQueryHookResult = ReturnType<typeof useTrainsByStationQuery>;
export type TrainsByStationLazyQueryHookResult = ReturnType<typeof useTrainsByStationLazyQuery>;
export type TrainsByStationQueryResult = Apollo.QueryResult<TrainsByStationQuery, TrainsByStationQueryVariables>;