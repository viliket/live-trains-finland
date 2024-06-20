import {
  QueryClient,
  QueryKey,
  queryOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { digitrafficClient } from '../graphql/client';
import {
  TrainsByStationDocument,
  TrainsByStationQuery,
} from '../graphql/generated/digitraffic/graphql';
import {
  findNewestTrainVersion,
  mergeAndOrderTrainsByVersion,
} from '../utils/train';

const REFETCH_INTERVAL = 10000; // Refetch interval in milliseconds
const DEPARTING_TRAINS = 100; // Number of departing trains to fetch
const ARRIVING_TRAINS = 100; // Number of arriving trains to fetch
const MAX_TRAINS = DEPARTING_TRAINS + ARRIVING_TRAINS; // Maximum number of trains to keep

const getTrainsByStationQueryKey = (
  stationCode: string | null | undefined
): QueryKey => ['trainsByStation', stationCode];

async function fetchUpdatedTrainsData(
  queryClient: QueryClient,
  stationCode: string | null | undefined
): Promise<TrainsByStationQuery> {
  const queryKey = getTrainsByStationQueryKey(stationCode);

  // Retrieve the old cached data to find the greatest version number
  const oldData = queryClient.getQueryData<TrainsByStationQuery>(queryKey);

  const newestTrainVersion = findNewestTrainVersion(
    oldData?.trainsByStationAndQuantity ?? []
  );

  const newData = await digitrafficClient.request(TrainsByStationDocument, {
    station: stationCode ?? '',
    versionGreaterThan: newestTrainVersion.toString(),
    departingTrains: DEPARTING_TRAINS,
    departedTrains: 0,
    arrivingTrains: ARRIVING_TRAINS,
    arrivedTrains: 0,
  });

  const newestTrains = mergeAndOrderTrainsByVersion(
    newData.trainsByStationAndQuantity ?? [],
    oldData?.trainsByStationAndQuantity ?? [],
    MAX_TRAINS
  );

  return {
    ...newData,
    trainsByStationAndQuantity: newestTrains,
  };
}

const trainsByStationQuery = (
  stationCode: string | null | undefined,
  queryClient: QueryClient
) =>
  queryOptions({
    queryKey: getTrainsByStationQueryKey(stationCode),
    queryFn: () => fetchUpdatedTrainsData(queryClient, stationCode),
    enabled: !!stationCode,
    refetchInterval: REFETCH_INTERVAL,
  });

export const useTrainsByStationQuery = (stationCode?: string | null) => {
  const queryClient = useQueryClient();
  return useQuery(trainsByStationQuery(stationCode, queryClient));
};
