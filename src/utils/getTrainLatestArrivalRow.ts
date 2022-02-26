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
      (r) => r?.type === TimeTableRowType.Arrival && r?.actualTime
    ),
    (r) => r?.actualTime,
    'desc'
  )[0];

  return latestArrivalRow;
}
