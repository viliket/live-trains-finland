import { queryOptions, useQuery } from '@tanstack/react-query';

const getRouteGeoJson = async (routePatternId: string | null) => {
  if (!routePatternId) {
    return;
  }
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_EXTERNAL_ASSETS_BASE_URL}/routes/${routePatternId}.json`
  );
  if (!response.ok) return;

  const data: GeoJSON.Feature = await response.json();
  return data;
};

const detailedRouteQuery = (id: string | null) =>
  queryOptions({
    queryKey: ['route', id],
    queryFn: () => getRouteGeoJson(id),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    enabled: Boolean(id),
  });

export const useDetailedRouteQuery = (routePatternId: string | null) =>
  useQuery(detailedRouteQuery(routePatternId));
