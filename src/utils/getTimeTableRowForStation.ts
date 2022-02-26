import { addMinutes, parseISO } from 'date-fns';

import {
  TrainByStationFragment,
  TimeTableRowType,
  TrainTimeTableRowFragment,
} from '../graphql/generated/digitraffic';

export default function getTimeTableRowForStation(
  stationShortCode: string,
  train: TrainByStationFragment,
  type: TimeTableRowType
): TrainTimeTableRowFragment | undefined | null {
  // Note that there might exist multiple time table rows of same type for same station
  // for e.g. on Kehärata P and I trains run on a loop from Helsinki to Helsinki
  // Therefore we want to find the time table row that is nearest in the future
  const now = addMinutes(new Date(), -10);
  return train.timeTableRows?.find(
    (r) =>
      r?.station?.shortCode === stationShortCode &&
      r?.type === type &&
      (now < parseISO(r.scheduledTime) ||
        (r?.liveEstimateTime && now < parseISO(r.liveEstimateTime)))
  );
}
