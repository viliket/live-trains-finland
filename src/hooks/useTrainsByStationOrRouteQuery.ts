import { sortBy, uniqBy } from 'lodash';

import {
  Station,
  TimeTableRowType,
  TrainByStationFragment,
  TrainsByRouteQuery,
  TrainsByStationQuery,
} from '../graphql/generated/digitraffic/graphql';
import { isDefined } from '../utils/common';
import getTimeTableRowForStation from '../utils/getTimeTableRowForStation';

import { useTrainsByRouteQuery } from './useTrainsByRouteQuery';
import { useTrainsByStationQuery } from './useTrainsByStationQuery';

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
  const trainsByStationResult = useTrainsByStationQuery(stationCode);

  const trainsByRouteResult = useTrainsByRouteQuery(
    deptOrArrStationCodeFilter,
    stationCode,
    timeTableType
  );

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
      trainsByStationResult.isLoading ||
      trainsByRouteResult.isLoading,
    error: trainsByRouteResult.error || trainsByStationResult.error,
    stationsFromCurrentStation,
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
