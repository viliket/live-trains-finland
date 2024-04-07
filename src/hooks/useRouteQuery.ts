import { queryOptions, useQuery } from '@tanstack/react-query';

import { digitransitClient } from '../graphql/client';
import { RouteDocument } from '../graphql/generated/digitransit/graphql';

const routeQuery = (id: string | null) =>
  queryOptions({
    queryKey: ['route', id],
    queryFn: () =>
      digitransitClient.request(RouteDocument, {
        id: id ?? '',
      }),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    enabled: Boolean(id),
  });

export const useRouteQuery = (id: string | null) => useQuery(routeQuery(id));
