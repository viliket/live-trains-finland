import { gql, QueryHookOptions, useQuery } from '@apollo/client';

const defaultOptions = {} as const;

type PlaceInfo = {
  floor: number;
  logicalSection: number;
  number: number;
  position: string;
  type: 'SEAT' | 'BED';
  bookable: boolean;
  services: string[];
  attributeCode: string;
  productType: string;
};

export type WagonInfo = {
  number: number;
  type: string;
  bookable: boolean;
  placeType: string;
  floorCount: number;
  order: number;
  services: string[];
  placeList: PlaceInfo[];
  servicesUp: string[];
  servicesDown: string[];
};

type WagonMap = {
  /** Record<string, WagonInfo> serialized as JSON string */
  coaches: string;
};

type TrainInfoForLeg = {
  id: string;
  wagonMap: WagonMap;
};

type TrainInfoData = {
  trainInfoForLegs: TrainInfoForLeg[];
};

type Leg = {
  departureTime: string;
  departureStation: string;
  arrivalStation: string;
  trainNumber: string;
};

type TrainInfoVariables = {
  legs: Leg[];
};

const GET_TRAIN_INFO = gql`
  query getTrainInfo($legs: [LegInput!]!) {
    trainInfoForLegs(legs: $legs) {
      id
      stops {
        station
        arrivalTime
        departureTime
        __typename
      }
      wagonMap {
        coaches
        __typename
      }
      __typename
    }
  }
`;

export function useTrainInfoQuery(
  baseOptions: QueryHookOptions<TrainInfoData, TrainInfoVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return useQuery<TrainInfoData, TrainInfoVariables>(GET_TRAIN_INFO, options);
}
