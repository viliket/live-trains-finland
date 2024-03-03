import { addDays, format, subDays } from 'date-fns';
import { sortBy, uniqBy } from 'lodash';

import { gqlClients } from '../graphql/client';
import {
  TimeTableRowType,
  useTrainsByRouteQuery,
  useTrainsByStationQuery,
} from '../graphql/generated/digitraffic';
import { isDefined } from '../utils/common';
import getTimeTableRowForStation from '../utils/getTimeTableRowForStation';

type TrainsByStationOrRouteQuery = {
  stationCode?: string;
  deptOrArrStationCodeFilter?: string;
  timeTableType: TimeTableRowType;
};

export default function useTrainsByStationOrRouteQuery({
  stationCode,
  deptOrArrStationCodeFilter,
  timeTableType,
}: TrainsByStationOrRouteQuery) {
  const trainsByStationResult = useTrainsByStationQuery({
    variables: stationCode
      ? {
          station: stationCode,
          departingTrains: 100,
          departedTrains: 0,
          arrivingTrains: 100,
          arrivedTrains: 0,
        }
      : undefined,
    skip: stationCode == null,
    context: { clientName: gqlClients.digitraffic },
    pollInterval: !deptOrArrStationCodeFilter ? 10000 : 0,
    fetchPolicy: 'no-cache',
  });

  const trainsByStation =
    trainsByStationResult.data?.trainsByStationAndQuantity?.filter(isDefined) ??
    [];

  const trainsByRouteResult = useTrainsByRouteQuery({
    variables:
      deptOrArrStationCodeFilter && stationCode
        ? {
            departureStation:
              timeTableType == TimeTableRowType.Departure
                ? stationCode
                : deptOrArrStationCodeFilter,
            arrivalStation:
              timeTableType == TimeTableRowType.Departure
                ? deptOrArrStationCodeFilter
                : stationCode,
            departureDateGreaterThan: format(
              subDays(new Date(), 1),
              'yyyy-MM-dd'
            ),
            departureDateLessThan: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
          }
        : undefined,
    skip: !deptOrArrStationCodeFilter || !stationCode,
    context: { clientName: gqlClients.digitraffic },
    pollInterval: 10000,
    fetchPolicy: 'no-cache',
  });
  const trainsByRoute =
    deptOrArrStationCodeFilter && stationCode
      ? (trainsByRouteResult.data?.trainsByVersionGreaterThan ?? [])
          .filter(isDefined)
          .filter((train) => {
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

  const trains = deptOrArrStationCodeFilter ? trainsByRoute : trainsByStation;

  const stationsFromCurrentStation = sortBy(
    uniqBy(
      trainsByStation.flatMap((t) => t.timeTableRows?.map((r) => r?.station)),
      (s) => s?.shortCode
    ),
    (s) => s?.name
  ).filter(isDefined);

  return {
    trains,
    loading:
      !stationCode ||
      trainsByStationResult.loading ||
      (deptOrArrStationCodeFilter && trainsByRouteResult.loading),
    error: trainsByRouteResult.error || trainsByStationResult.error,
    stationsFromCurrentStation,
  };
}
