import {
  TimeTableRowType,
  TrainByStationFragment,
} from '../graphql/generated/digitraffic/graphql';

import getTrainLatestArrivalRow from './getTrainLatestArrivalRow';
import { getDepartureTimeTableRow } from './train';

export default function getTrainCurrentStation(train: TrainByStationFragment) {
  const latestArrivalRow = getTrainLatestArrivalRow(train);

  const nextDepatureRow = latestArrivalRow
    ? train.timeTableRows?.find(
        (r) =>
          r?.station.shortCode === latestArrivalRow.station.shortCode &&
          r?.type === TimeTableRowType.Departure &&
          r.scheduledTime > latestArrivalRow.scheduledTime
      )
    : getDepartureTimeTableRow(train);

  if (!nextDepatureRow) {
    // If there is no departureTimeTableRow, it means that the latest
    // arrival row is the destination station
    return latestArrivalRow?.station;
  }

  if (
    !nextDepatureRow.actualTime ||
    new Date() < new Date(nextDepatureRow.actualTime)
  ) {
    // Train has arrived at station and is waiting to depart from that station
    return nextDepatureRow?.station;
  }

  return undefined;
}
