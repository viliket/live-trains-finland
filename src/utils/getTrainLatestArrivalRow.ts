import { parseISO } from 'date-fns';
import { orderBy } from 'lodash';

import {
  TimeTableRowType,
  TrainByStationFragment,
} from '../graphql/generated/digitraffic';

export default function getTrainLatestArrivalRow(
  train: TrainByStationFragment
) {
  const latestArrivalRow = orderBy(
    train.timeTableRows?.filter(
      (r) =>
        r?.type === TimeTableRowType.Arrival &&
        r?.actualTime &&
        // Note that actualTime may be set even to (near) future. Thus, we need to check
        // that the actualTime has actually been passed.
        parseISO(r.actualTime) <= new Date()
    ),
    (r) => r?.actualTime,
    'desc'
  )[0];

  return latestArrivalRow;
}
