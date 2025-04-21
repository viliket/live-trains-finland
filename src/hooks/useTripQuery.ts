import { queryOptions, useQuery } from '@tanstack/react-query';
import { differenceInSeconds } from 'date-fns';
import { toDate } from 'date-fns-tz';

import { digitransitClient } from '../graphql/client';
import { TripDocument } from '../graphql/generated/digitransit/graphql';

function getDepartureTimeInSeconds(
  departureDate: string,
  departureTime: string
): number {
  const departureDateInEET = toDate(departureDate, {
    timeZone: 'Europe/Helsinki',
  });
  const departureTimeInEET = toDate(departureTime, {
    timeZone: 'Europe/Helsinki',
  });
  return differenceInSeconds(departureTimeInEET, departureDateInEET);
}

const tripQuery = (
  departureDate?: string | null,
  routeId?: string | null,
  departureTime?: string | null
) =>
  queryOptions({
    queryKey: ['trip', departureDate, routeId, departureTime],
    queryFn: () =>
      digitransitClient.request(TripDocument, {
        departureDate: departureDate ?? '',
        routeId: routeId ?? '',
        time:
          departureDate && departureTime
            ? getDepartureTimeInSeconds(departureDate, departureTime)
            : 0,
      }),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    enabled:
      Boolean(departureDate) && Boolean(routeId) && Boolean(departureTime),
  });

export const useTripQuery = ({
  departureDate,
  routeId,
  departureTime,
}: {
  departureDate?: string | null;
  routeId?: string | null;
  departureTime?: string | null;
}) => useQuery(tripQuery(departureDate, routeId, departureTime));
