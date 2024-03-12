import { parseISO } from 'date-fns';
import { orderBy } from 'lodash';

import {
  TimeTableRowType,
  TrainByStationFragment,
} from '../graphql/generated/digitraffic/graphql';

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
  // Special handling for ring route (kehärata) trains: Return LEN (airport) as
  // the destination station if the first time table row for the given station
  // code is before the airport time table row on the train time table rows
  // (ordered by scheduled time) and based on the current time we have not arrived
  // at the airport.
  if (
    stationCode &&
    train.commuterLineid &&
    train.timeTableRows &&
    ['I', 'P'].includes(train.commuterLineid)
  ) {
    const stationDepartureRowIdx = train.timeTableRows.findIndex(
      (r) =>
        r?.station?.shortCode === stationCode &&
        r?.type === TimeTableRowType.Departure
    );
    const airportArrivalRowIndex = train.timeTableRows.findIndex(
      (r) =>
        r?.station?.shortCode === 'LEN' && r?.type === TimeTableRowType.Arrival
    );

    if (
      stationDepartureRowIdx !== -1 &&
      stationDepartureRowIdx < airportArrivalRowIndex
    ) {
      const airportArrivalRow = train.timeTableRows[airportArrivalRowIndex];
      if (
        airportArrivalRow &&
        new Date() < getTimeTableRowRealTime(airportArrivalRow)
      ) {
        return airportArrivalRow.station;
      }
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
  if (train.commuterLineid) {
    return train.commuterLineid;
  } else {
    return `${train.trainType.name} ${train.trainNumber}`;
  }
}

/**
 * A map from the the Digitraffic train category name to the GTFS extended route type (integer).
 * - 109 = Suburban Railway - used in Finland for commuter rails
 * - 102 = Long Distance Trains - used in Finland for IC, S, and regional (HDM) trains
 *
 * @see https://developers.google.com/transit/gtfs/reference/extended-route-type
 */
const trainCategoryNameToGtfsRouteTypeMap: Record<string, number> = {
  'Long-distance': 102,
  Commuter: 109,
};

/**
 * Gets the train route GTFS ID used in Digitransit routing API.
 *
 * @example
 * // returns "digitraffic:TPE_HKI_R_109_10"
 * getTrainRouteGtfsId(<R train from Tampere to Helsinki operated by VR>);
 */
export function getTrainRouteGtfsId(train: TrainByStationFragment) {
  const deptStationCode = getTrainDepartureStation(train)?.shortCode;
  const destStationCode = getTrainDestinationStation(train)?.shortCode;
  const routeType =
    trainCategoryNameToGtfsRouteTypeMap[train.trainType.trainCategory.name];
  const agency = train.operator.uicCode;
  return `digitraffic:${deptStationCode}_${destStationCode}_${
    train.commuterLineid ? train.commuterLineid : train.trainNumber
  }_${routeType}_${agency}`;
}
