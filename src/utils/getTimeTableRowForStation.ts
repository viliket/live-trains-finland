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
  // Filter time table rows that match stationShortCode and type
  const matchingRows = train.timeTableRows?.filter(
    (r): r is NonNullable<typeof r> =>
      r?.station?.shortCode === stationShortCode && r?.type === type
  );

  if (!matchingRows || matchingRows.length === 0) {
    return undefined;
  }

  // If only one matching row found, return it directly
  if (matchingRows.length === 1) {
    return matchingRows[0];
  }

  // There might exist multiple time table rows of same type for same station.
  // For example on Kehärata P and I trains run on a loop from Helsinki to Helsinki.
  // For these cases we want to find the time table row that is next in the future
  // (with a margin of 10 minutes) if such exists, and otherwise the latest.

  const now = addMinutes(new Date(), -10);
  for (const row of matchingRows) {
    if (
      now < parseISO(row.scheduledTime) ||
      (row.liveEstimateTime && now < parseISO(row.liveEstimateTime))
    ) {
      // Return the time table row closest to the future, accounting for 10-minute margin
      return row;
    }
  }

  // Return the latest (time table rows should be already sorted in ascending order)
  return matchingRows[matchingRows.length - 1];
}
