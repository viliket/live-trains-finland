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
      // Note that actualTime may be set even to (near) future. Thus, we need to check
      // that the actualTime has actually been passed.
      parseISO(r.actualTime) <= new Date()
  );

  return latestDepartureTimeTableRow;
}
