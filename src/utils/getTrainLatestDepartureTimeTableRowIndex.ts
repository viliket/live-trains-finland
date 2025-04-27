import { parseISO } from 'date-fns';
import { orderBy } from 'lodash';

import {
  TimeTableRowType,
  TrainByStationFragment,
} from '../graphql/generated/digitraffic/graphql';

export default function getTrainLatestDepartureTimeTableRowIndex(
  train: TrainByStationFragment
) {
  const latestDepartureTimeTableRowIndex = orderBy(
    train.timeTableRows,
    (r) => r?.scheduledTime,
    'asc'
  ).findLastIndex(
    (r) =>
      r?.type === TimeTableRowType.Departure &&
      (r.actualTime || r.liveEstimateTime) &&
      parseISO(r.actualTime ?? r.liveEstimateTime) <= new Date()
  );

  return latestDepartureTimeTableRowIndex;
}
