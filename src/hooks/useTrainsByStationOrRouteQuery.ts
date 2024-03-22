import { sortBy, uniqBy } from 'lodash';

import {
  Station,
  TimeTableRowType,
  TrainByStationFragment,
  TrainsByStationQuery,
} from '../graphql/generated/digitraffic/graphql';
import { isDefined } from '../utils/common';

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
    trainsByStationResult.data?.trainsByStationAndQuantity,
    trainsByRouteResult.data
  );

  const stationsFromCurrentStation = getStationsFromCurrentStation(
    trainsByStationResult.data?.trainsByStationAndQuantity
  );

  return {
    trains,
    loading: deptOrArrStationCodeFilter
      ? trainsByRouteResult.isLoading ||
        !trainsByRouteResult.isFetchedAfterMount
      : trainsByStationResult.isLoading ||
        !trainsByStationResult.isFetchedAfterMount,
    error: trainsByRouteResult.error || trainsByStationResult.error,
    stationsFromCurrentStation,
  };
}

function getTrains(
  deptOrArrStationCodeFilter: string | null,
  trainsByStation: TrainsByStationQuery['trainsByStationAndQuantity'],
  trainsByRoute: TrainByStationFragment[] | undefined
): TrainByStationFragment[] {
  const trains = deptOrArrStationCodeFilter
    ? trainsByRoute
    : trainsByStation?.filter(isDefined);
  return trains ?? [];
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
