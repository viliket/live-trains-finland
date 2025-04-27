import { queryOptions, useQuery } from '@tanstack/react-query';

const getDetailedRouteUrl = async (
  routePatternId: string | null
): Promise<string | null> => {
  if (!routePatternId) {
    return null;
  }
  const detailedRouteUrl = `${process.env.NEXT_PUBLIC_EXTERNAL_ASSETS_BASE_URL}/routes/${routePatternId}.json`;
  const response = await fetch(detailedRouteUrl, { method: 'HEAD' });
  if (!response.ok) return null;

  return detailedRouteUrl;
};

const detailedRouteUrlQuery = (id: string | null) =>
  queryOptions({
    queryKey: ['detailedRouteUrl', id],
    queryFn: () => getDetailedRouteUrl(id),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    enabled: Boolean(id),
  });

export const useDetailedRouteUrlQuery = (routePatternId: string | null) =>
  useQuery(detailedRouteUrlQuery(routePatternId));
