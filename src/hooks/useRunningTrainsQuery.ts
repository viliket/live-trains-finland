import { queryOptions, useQuery } from '@tanstack/react-query';

import { digitrafficClient } from '../graphql/client';
import { RunningTrainsDocument } from '../graphql/generated/digitraffic/graphql';

const runningTrainsQuery = () =>
  queryOptions({
    queryKey: ['runningTrains'],
    queryFn: () => digitrafficClient.request(RunningTrainsDocument),
    refetchInterval: 10000,
  });

export const useRunningTrainsQuery = () => useQuery(runningTrainsQuery());
