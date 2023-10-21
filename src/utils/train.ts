import { parseISO } from 'date-fns';
import { orderBy } from 'lodash';

import {
  TimeTableRowType,
  TrainByStationFragment,
} from '../graphql/generated/digitraffic';

import getTimeTableRowForStation from './getTimeTableRowForStation';

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

export function getTrainDestinationStation(
  train: TrainByStationFragment,
  stationCode?: string
) {
  // Special handling for ring route (kehärata) trains:
  // Return LEN (airport) as the destination station if
  // the given station code is earlier on the train
  // time table rows than the airport.
  if (
    stationCode &&
    train.commuterLineid &&
    ['I', 'P'].includes(train.commuterLineid)
  ) {
    const stationRow = getTimeTableRowForStation(
      stationCode,
      train,
      TimeTableRowType.Departure
    );
    const airportArrivalRow = getTimeTableRowForStation(
      'LEN',
      train,
      TimeTableRowType.Arrival
    );
    if (
      airportArrivalRow &&
      stationRow &&
      stationRow.scheduledTime < airportArrivalRow.scheduledTime
    ) {
      return airportArrivalRow.station;
    }
  }
  return getDestinationTimeTableRow(train)?.station;
}

export function getTrainDepartureStationName(train: TrainByStationFragment) {
  const departureStation = getTrainDepartureStation(train);
  return departureStation ? getTrainStationName(departureStation) : undefined;
}

export function getTrainDestinationStationName(
  train: TrainByStationFragment,
  stationCode?: string
) {
  const destinationStation = getTrainDestinationStation(train, stationCode);
  return destinationStation
    ? getTrainStationName(destinationStation)
    : undefined;
}

export function getTrainStationName(station: { name: string }) {
  return station.name.replace(' asema', '').trimEnd();
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

export function getTrainDisplayName(train: TrainByStationFragment) {
  return train.commuterLineid
    ? train.commuterLineid
    : train.trainType.name + ' ' + train.trainNumber;
}
