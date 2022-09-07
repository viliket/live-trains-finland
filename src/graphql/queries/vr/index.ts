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

type WagonMapData = {
  wagonMapData: Record<string, WagonInfo>;
};

type WagonMapDataVariables = {
  departureStation: string;
  arrivalStation: string;
  departureTime: string;
  trainNumber: string;
  trainType: string;
};

const GET_WAGON_MAP_DATA = gql`
  query getWagonMapData(
    $departureStation: String!
    $arrivalStation: String!
    $departureTime: String!
    $trainNumber: String!
    $trainType: String!
  ) {
    wagonMapData(
      departureStation: $departureStation
      arrivalStation: $arrivalStation
      departureTime: $departureTime
      trainNumber: $trainNumber
      trainType: $trainType
    )
  }
`;

export function useWagonMapDataQuery(
  baseOptions: QueryHookOptions<WagonMapData, WagonMapDataVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return useQuery<WagonMapData, WagonMapDataVariables>(
    GET_WAGON_MAP_DATA,
    options
  );
}
