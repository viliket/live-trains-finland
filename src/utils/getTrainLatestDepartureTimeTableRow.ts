import { parseISO } from 'date-fns';
import { orderBy } from 'lodash';

import {
  TimeTableRowType,
  TrainByStationFragment,
} from '../graphql/generated/digitraffic';

export default function getTrainLatestDepartureTimeTableRow(
  train: TrainByStationFragment
) {
  const latestDepartureTimeTableRow = orderBy(
    train.timeTableRows,
    (r) => r?.scheduledTime,
    'desc'
  ).find(
    (r) =>
      r?.type === TimeTableRowType.Departure &&
      r?.actualTime &&
      parseISO(r.actualTime) <= new Date()
  );

  return latestDepartureTimeTableRow;
}
