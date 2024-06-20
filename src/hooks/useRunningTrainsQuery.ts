import {
  QueryClient,
  QueryKey,
  queryOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { digitrafficClient } from '../graphql/client';
import {
  RunningTrainsDocument,
  RunningTrainsQuery,
} from '../graphql/generated/digitraffic/graphql';
import {
  findNewestTrainVersion,
  mergeAndOrderTrainsByVersion,
} from '../utils/train';

const REFETCH_INTERVAL = 10000; // Refetch interval in milliseconds
const MAX_TRAINS = 1000; // Maximum number of trains to keep

const getRunningTrainsQueryKey = (): QueryKey => ['runningTrains'];

async function fetchUpdatedTrainsData(
  queryClient: QueryClient
): Promise<RunningTrainsQuery> {
  const queryKey = getRunningTrainsQueryKey();

  // Retrieve the old cached data to find the greatest version number
  const oldData = queryClient.getQueryData<RunningTrainsQuery>(queryKey);

  const newestTrainVersion = findNewestTrainVersion(
    oldData?.currentlyRunningTrains ?? []
  );

  const newData = await digitrafficClient.request(RunningTrainsDocument, {
    versionGreaterThan: newestTrainVersion.toString(),
  });

  const newestTrains = mergeAndOrderTrainsByVersion(
    newData.currentlyRunningTrains ?? [],
    oldData?.currentlyRunningTrains ?? [],
    MAX_TRAINS
  );

  return {
    ...newData,
    currentlyRunningTrains: newestTrains,
  };
}

const runningTrainsQuery = (queryClient: QueryClient) =>
  queryOptions({
    queryKey: ['runningTrains'],
    queryFn: () => fetchUpdatedTrainsData(queryClient),
    refetchInterval: REFETCH_INTERVAL,
  });

export const useRunningTrainsQuery = () => {
  const queryClient = useQueryClient();
  return useQuery(runningTrainsQuery(queryClient));
};
