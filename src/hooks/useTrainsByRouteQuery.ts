import { queryOptions, useQuery } from '@tanstack/react-query';
import { addDays, format, subDays } from 'date-fns';

import { digitrafficClient } from '../graphql/client';
import {
  TimeTableRowType,
  TrainsByRouteDocument,
} from '../graphql/generated/digitraffic/graphql';

const trainsByRouteQuery = (
  deptOrArrStationCodeFilter: string | null,
  stationCode: string | undefined,
  timeTableType: TimeTableRowType
) => {
  const departureStation =
    timeTableType === TimeTableRowType.Departure
      ? stationCode
      : deptOrArrStationCodeFilter;
  const arrivalStation =
    timeTableType === TimeTableRowType.Departure
      ? deptOrArrStationCodeFilter
      : stationCode;
  return queryOptions({
    queryKey: [
      'trainsByRouteQuery',
      deptOrArrStationCodeFilter,
      stationCode,
      timeTableType,
    ],
    queryFn: () =>
      digitrafficClient.request(TrainsByRouteDocument, {
        departureStation: departureStation ?? '',
        arrivalStation: arrivalStation ?? '',
        departureDateGreaterThan: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
        departureDateLessThan: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
      }),
    enabled: Boolean(departureStation && arrivalStation),
    refetchInterval: 10000,
  });
};

export const useTrainsByRouteQuery = (
  deptOrArrStationCodeFilter: string | null,
  stationCode: string | undefined,
  timeTableType: TimeTableRowType
) =>
  useQuery(
    trainsByRouteQuery(deptOrArrStationCodeFilter, stationCode, timeTableType)
  );
