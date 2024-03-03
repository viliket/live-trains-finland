import { addMinutes, parseISO } from 'date-fns';

import {
  TrainByStationFragment,
  TimeTableRowType,
  TrainTimeTableRowFragment,
} from '../graphql/generated/digitraffic';

import { isDefined } from './common';

export default function getTimeTableRowForStation(
  stationShortCode: string,
  train: TrainByStationFragment,
  type: TimeTableRowType
): TrainTimeTableRowFragment | undefined | null {
  // Filter time table rows that match stationShortCode and type
  let matchingRows = train.timeTableRows
    ?.filter(
      (r) => r?.station?.shortCode === stationShortCode && r?.type === type
    )
    .filter(isDefined);

  if (!matchingRows || matchingRows.length === 0) {
    return undefined;
  } else if (matchingRows.length === 1) {
    return matchingRows[0];
  }

  // There might exist multiple time table rows of same type for same station.
  // For example on Kehärata P and I trains run on a loop from Helsinki to Helsinki.
  // For these cases we want to find the time table row that is next in the future -
  // 10 mins if such exists, and otherwise the latest.

  const now = addMinutes(new Date(), -10);
  for (const row of matchingRows) {
    if (
      now < parseISO(row.scheduledTime) ||
      (row.liveEstimateTime && now < parseISO(row.liveEstimateTime))
    ) {
      return row; // Return the nearest future - 10 mins time table row
    }
  }

  // Return latest (time table rows should be already sorted in ascending order)
  return matchingRows[matchingRows.length - 1];
}
