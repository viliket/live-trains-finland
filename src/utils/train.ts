import { parseISO } from 'date-fns';
import { orderBy } from 'lodash';

import { TrainByStationFragment } from '../graphql/generated/digitraffic';

export function getTimeTableRowRealTime(row: {
  scheduledTime: string;
  actualTime?: string | null;
  liveEstimateTime?: string | null;
}) {
  const time = row.actualTime ?? row.liveEstimateTime ?? row.scheduledTime;
  return parseISO(time);
}

export function getTrainScheduledDepartureTime(train: TrainByStationFragment) {
  const scheduledTime = getDepartureTimeTableRow(train)?.scheduledTime;
  if (!scheduledTime) return undefined;
  return parseISO(scheduledTime);
}

export function getDepartureTimeTableRow(train: TrainByStationFragment) {
  return orderBy(train.timeTableRows, (t) => t?.scheduledTime, 'asc')?.[0];
}

export function getDestinationTimeTableRow(train: TrainByStationFragment) {
  return orderBy(train.timeTableRows, (t) => t?.scheduledTime, 'desc')?.[0];
}

export function getTrainDepartureStation(train: TrainByStationFragment) {
  return getDepartureTimeTableRow(train)?.station;
}

export function getTrainDestinationStation(train: TrainByStationFragment) {
  return getDestinationTimeTableRow(train)?.station;
}

export function getTrainDepartureStationName(train: TrainByStationFragment) {
  const departureStation = getTrainDepartureStation(train);
  return departureStation ? getTrainStationName(departureStation) : undefined;
}

export function getTrainDestinationStationName(train: TrainByStationFragment) {
  const destinationStation = getTrainDestinationStation(train);
  return destinationStation
    ? getTrainStationName(destinationStation)
    : undefined;
}

export function getTrainStationName(station: { name: string }) {
  return station.name.replace('asema', '').trimEnd();
}

export function getWagonNumberFromVehicleId(
  vehicleId: number,
  wagonType?: string | null
) {
  if (wagonType === 'Sm5') {
    // Sm5 wagons have two digit wagon number formed from the two last digits
    // of the vehicle ID. E.g., vehicle ID 1015 = wagon number 15.
    return vehicleId.toString().slice(-2);
  }
  return vehicleId.toString();
}
