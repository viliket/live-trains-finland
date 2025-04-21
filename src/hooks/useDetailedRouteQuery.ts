import { queryOptions, useQuery } from '@tanstack/react-query';

const getRouteGeoJson = async (
  routePatternId: string | null
): Promise<GeoJSON.Feature | null> => {
  if (!routePatternId) {
    return null;
  }
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_EXTERNAL_ASSETS_BASE_URL}/routes/${routePatternId}.json`
  );
  if (!response.ok) return null;

  const data: GeoJSON.Feature = await response.json();
  return data;
};

const detailedRouteQuery = (id: string | null) =>
  queryOptions({
    queryKey: ['detailedRoute', id],
    queryFn: () => getRouteGeoJson(id),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    enabled: Boolean(id),
  });

export const useDetailedRouteQuery = (routePatternId: string | null) =>
  useQuery(detailedRouteQuery(routePatternId));
