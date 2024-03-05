import { addDays, format, subDays } from 'date-fns';
import { sortBy, uniqBy } from 'lodash';

import { gqlClients } from '../graphql/client';
import {
  Station,
  TimeTableRowType,
  TrainByStationFragment,
  TrainsByRouteQuery,
  TrainsByRouteQueryVariables,
  TrainsByStationQuery,
  TrainsByStationQueryVariables,
  useTrainsByRouteQuery,
  useTrainsByStationQuery,
} from '../graphql/generated/digitraffic';
import { isDefined } from '../utils/common';
import getTimeTableRowForStation from '../utils/getTimeTableRowForStation';

type TrainsByStationOrRouteQuery = {
  stationCode?: string;
  deptOrArrStationCodeFilter: string | null;
  timeTableType: TimeTableRowType;
};

export default function useTrainsByStationOrRouteQuery({
  stationCode,
  deptOrArrStationCodeFilter,
  timeTableType,
}: TrainsByStationOrRouteQuery) {
  const trainsByStationResult = useTrainsByStationQuery({
    variables: getTrainsByStationQueryVariables(stationCode),
    skip: stationCode == null,
    context: { clientName: gqlClients.digitraffic },
    pollInterval: !deptOrArrStationCodeFilter ? 10000 : 0,
    fetchPolicy: 'no-cache',
  });

  const trainsByRouteResult = useTrainsByRouteQuery({
    variables: getTrainsByRouteQueryVariables(
      deptOrArrStationCodeFilter,
      stationCode,
      timeTableType
    ),
    skip: !deptOrArrStationCodeFilter || !stationCode,
    context: { clientName: gqlClients.digitraffic },
    pollInterval: 10000,
    fetchPolicy: 'no-cache',
  });

  const trains = getTrains(
    deptOrArrStationCodeFilter,
    stationCode,
    timeTableType,
    trainsByStationResult.data?.trainsByStationAndQuantity,
    trainsByRouteResult.data?.trainsByVersionGreaterThan
  );

  const stationsFromCurrentStation = getStationsFromCurrentStation(
    trainsByStationResult.data?.trainsByStationAndQuantity
  );

  return {
    trains,
    loading:
      !stationCode ||
      trainsByStationResult.loading ||
      trainsByRouteResult.loading,
    error: trainsByRouteResult.error || trainsByStationResult.error,
    stationsFromCurrentStation,
  };
}

function getTrainsByRouteQueryVariables(
  deptOrArrStationCodeFilter: string | null,
  stationCode: string | undefined,
  timeTableType: TimeTableRowType
): TrainsByRouteQueryVariables | undefined {
  if (!deptOrArrStationCodeFilter || !stationCode) return undefined;

  const departureStation =
    timeTableType === TimeTableRowType.Departure
      ? stationCode
      : deptOrArrStationCodeFilter;
  const arrivalStation =
    timeTableType === TimeTableRowType.Departure
      ? deptOrArrStationCodeFilter
      : stationCode;

  return {
    departureStation,
    arrivalStation,
    departureDateGreaterThan: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
    departureDateLessThan: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
  };
}

function getTrainsByStationQueryVariables(
  stationCode: string | undefined
): TrainsByStationQueryVariables | undefined {
  if (!stationCode) return undefined;

  return {
    station: stationCode,
    departingTrains: 100,
    departedTrains: 0,
    arrivingTrains: 100,
    arrivedTrains: 0,
  };
}

function getTrains(
  deptOrArrStationCodeFilter: string | null,
  stationCode: string | undefined,
  timeTableType: TimeTableRowType,
  trainsByStation: TrainsByStationQuery['trainsByStationAndQuantity'],
  trainsByRoute: TrainsByRouteQuery['trainsByVersionGreaterThan']
): TrainByStationFragment[] {
  const trainsByRouteRelevant =
    deptOrArrStationCodeFilter && stationCode
      ? (trainsByRoute ?? []).filter(isDefined).filter((train) => {
          const oppositeTimeTableType =
            timeTableType === TimeTableRowType.Departure
              ? TimeTableRowType.Arrival
              : TimeTableRowType.Departure;

          const rowA = getTimeTableRowForStation(
            deptOrArrStationCodeFilter,
            train,
            oppositeTimeTableType
          );
          if (!rowA?.trainStopping) return false;

          const rowB = getTimeTableRowForStation(
            stationCode,
            train,
            timeTableType
          );
          if (!rowB?.trainStopping) return false;

          return timeTableType === TimeTableRowType.Departure
            ? rowA.scheduledTime > rowB.scheduledTime
            : rowA.scheduledTime < rowB.scheduledTime;
        })
      : [];

  const trains = deptOrArrStationCodeFilter
    ? trainsByRouteRelevant
    : (trainsByStation ?? []).filter(isDefined);
  return trains;
}

function getStationsFromCurrentStation(
  trainsByStation: TrainsByStationQuery['trainsByStationAndQuantity']
): Pick<Station, 'name' | 'shortCode'>[] {
  if (!trainsByStation) return [];

  return sortBy(
    uniqBy(
      trainsByStation.flatMap((t) => t?.timeTableRows?.map((r) => r?.station)),
      (s) => s?.shortCode
    ),
    (s) => s?.shortCode
  ).filter(isDefined);
}
