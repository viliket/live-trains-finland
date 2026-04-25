import {
  Locomotive,
  StationPlatformSide,
  TrainDetailsFragment,
  TrainDirection,
  Wagon,
} from '../graphql/generated/digitraffic/graphql';

export type TrainCompositionFragment =
  TrainDetailsFragment['compositions'][number];

export type TrainJourneySectionFragment =
  TrainCompositionFragment['journeySections'][number];

type TrainTimeTableGroup = {
  arrival?: TrainDetailsFragment['timeTableRows'][number] | null;
  departure?: TrainDetailsFragment['timeTableRows'][number] | null;
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
  locomotives: LocomotiveWithDetails[];
  wagons: WagonWithDetails[];
};

type Composition = Omit<TrainCompositionFragment, 'journeySections'> & {
  journeySections: JourneySectionExtendedDetails[];
};

export type TrainExtendedDetails = Omit<
  TrainDetailsFragment,
  'compositions'
> & {
  timeTableGroups?: TrainTimeTableGroup[];
  compositions: Composition[];
};
