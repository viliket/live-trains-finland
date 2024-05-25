import { queryOptions, useQuery } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';

export type PlaceInfo = {
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
  coaches: Record<string, WagonInfo>;
};

type WagonMapDataVariables = {
  departureStation: string;
  arrivalStation: string;
  departureTime: string;
  trainNumber: string;
  trainType: string;
};

const getWagonMapDataQueryDocument = gql`
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

const wagonMapDataQuery = ({
  departureStation,
  arrivalStation,
  departureTime,
  trainNumber,
  trainType,
  isCommuterLine,
}: Partial<WagonMapDataVariables> & { isCommuterLine: boolean }) =>
  queryOptions({
    queryKey: [
      'wagonMapData',
      departureStation,
      arrivalStation,
      departureTime,
      trainNumber,
      trainType,
      isCommuterLine,
    ],
    queryFn: () =>
      request<WagonMapData>(
        `${window.location.origin}/vr-api`,
        getWagonMapDataQueryDocument,
        {
          departureStation: departureStation,
          arrivalStation: arrivalStation,
          departureTime: departureTime,
          trainNumber: trainNumber,
          trainType: trainType,
        }
      ),
    enabled: Boolean(
      departureTime &&
        departureStation &&
        arrivalStation &&
        // Only query for non-commmuter trains as commuter trains have no wagon map data
        !isCommuterLine
    ),
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

export const useWagonMapDataQuery = (
  options: Partial<WagonMapDataVariables> & { isCommuterLine: boolean }
) => useQuery(wagonMapDataQuery(options));
