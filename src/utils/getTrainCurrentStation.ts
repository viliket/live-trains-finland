import {
  TimeTableRowType,
  TrainByStationFragment,
} from '../graphql/generated/digitraffic';
import getTrainLatestArrivalRow from './getTrainLatestArrivalRow';

export default function getTrainCurrentStation(train: TrainByStationFragment) {
  const latestArrivalRow = getTrainLatestArrivalRow(train);

  const nextDepatureRow = latestArrivalRow
    ? train.timeTableRows?.find(
        (r) =>
          r?.station.shortCode === latestArrivalRow.station.shortCode &&
          r?.type === TimeTableRowType.Departure &&
          r.scheduledTime > latestArrivalRow.scheduledTime
      )
    : undefined;

  if (!nextDepatureRow) {
    // If there is no departureTimeTableRow, it means that this station
    // is the destination station
    return latestArrivalRow?.station;
  }

  if (
    !nextDepatureRow?.actualTime &&
    new Date(nextDepatureRow?.scheduledTime) < new Date()
  ) {
    // Train has arrived at station and is waiting to depart from that station
    return nextDepatureRow?.station;
  }

  return undefined;
}
