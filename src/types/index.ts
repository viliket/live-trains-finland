import {
  Locomotive,
  Maybe,
  StationPlatformSide,
  TrainDetailsFragment,
  TrainDirection,
  Wagon,
} from '../graphql/generated/digitraffic/graphql';

export type TrainCompositionFragment = NonNullable<
  NonNullable<TrainDetailsFragment['compositions']>[number]
>;

export type TrainJourneySectionFragment = NonNullable<
  NonNullable<TrainCompositionFragment['journeySections']>[number]
>;

type TrainTimeTableGroup = {
  arrival?: NonNullable<TrainDetailsFragment['timeTableRows']>[number];
  departure?: NonNullable<TrainDetailsFragment['timeTableRows']>[number];
  trainDirection?: TrainDirection | null;
  stationPlatformSide?: StationPlatformSide | null;
};

type VehicleDetails = {
  vehicleId?: number | null;
};

interface LocomotiveWithDetails extends Locomotive, VehicleDetails {}

interface WagonWithDetails extends Wagon, VehicleDetails {}

export type JourneySectionExtendedDetails = Omit<
  TrainJourneySectionFragment,
  'locomotives' | 'wagons'
> & {
  locomotives?: Maybe<LocomotiveWithDetails>[] | null;
  wagons?: Maybe<WagonWithDetails>[] | null;
};

type Composition = Omit<TrainCompositionFragment, 'journeySections'> & {
  journeySections?: Maybe<JourneySectionExtendedDetails>[] | null;
};

export type TrainExtendedDetails = Omit<
  TrainDetailsFragment,
  'compositions'
> & {
  timeTableGroups?: TrainTimeTableGroup[];
  compositions?: Maybe<Composition>[] | null;
};
