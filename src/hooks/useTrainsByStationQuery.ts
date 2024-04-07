import { queryOptions, useQuery } from '@tanstack/react-query';

import { digitrafficClient } from '../graphql/client';
import { TrainsByStationDocument } from '../graphql/generated/digitraffic/graphql';

const trainsByStationQuery = (stationCode?: string | null) =>
  queryOptions({
    queryKey: ['trainsByStation', stationCode],
    queryFn: () =>
      digitrafficClient.request(TrainsByStationDocument, {
        station: stationCode ?? '',
        departingTrains: 100,
        departedTrains: 0,
        arrivingTrains: 100,
        arrivedTrains: 0,
      }),
    enabled: !!stationCode,
    refetchInterval: 10000,
  });

export const useTrainsByStationQuery = (stationCode?: string | null) =>
  useQuery(trainsByStationQuery(stationCode));
