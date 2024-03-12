import {
  Locomotive,
  StationPlatformSide,
  TrainDetailsFragment,
  TrainDirection,
  Wagon,
} from '../graphql/generated/digitraffic/graphql';

type TrainCompositionFragment = NonNullable<
  NonNullable<TrainDetailsFragment['compositions']>[number]
>;

type TrainJourneySectionFragment = NonNullable<
  NonNullable<TrainCompositionFragment['journeySections']>[number]
>;

export type TrainExtendedDetails = TrainDetailsFragment & {
  timeTableGroups?: Array<{
    arrival?: NonNullable<TrainDetailsFragment['timeTableRows']>[number];
    departure?: NonNullable<TrainDetailsFragment['timeTableRows']>[number];
    trainDirection?: TrainDirection | null;
    stationPlatformSide?: StationPlatformSide | null;
  }>;
  compositions?: Array<
    | (TrainCompositionFragment & {
        journeySections?: Array<
          | (TrainJourneySectionFragment & {
              locomotives?: Array<
                | (Locomotive & {
                    vehicleId?: number | null;
                  })
                | null
              > | null;
              wagons?: Array<
                | (Wagon & {
                    vehicleId?: number | null;
                  })
                | null
              > | null;
            })
          | null
        > | null;
      })
    | null
  > | null;
};
