import { parseISO } from 'date-fns';
import { orderBy } from 'lodash';

import { trainsVar, vehiclesVar } from '../graphql/client';
import {
  TimeTableRowType,
  TrainByStationFragment,
} from '../graphql/generated/digitraffic';
import { VehiclePositionMessage } from '../types/vehicles';

import { formatEET } from './date';
import { toKmsPerHour } from './math';
import {
  getTrainDestinationStation,
  getTrainScheduledDepartureTime,
} from './train';

const hslEndpointUrl = 'wss://mqtt.hsl.fi:443/';

const trainCommuterLineToHSLRouteGtfsIdMap: Record<string, string> = {
  D: '3001D',
  I: '3001I',
  K: '3001K',
  R: '3001R',
  T: '3001T',
  Z: '3001Z',
  A: '3002A',
  E: '3002E',
  L: '3002L',
  P: '3002P',
  U: '3002U',
  X: '3002X',
  Y: '3002Y',
};

export const handleVehiclePositionMessage = (
  topic: string,
  message: Buffer,
  topicToTrain: Map<string, TrainByStationFragment>
) => {
  // prettier-ignore
  const [
    ,
    , // prefix
    , // version
    , // journey_type
    , // temporal_type
    , // event_type
    , // transport_mode
    , // operator_id
    , // vehicle_number
    routeId,
    , // direction_id
    , // headsign
    startTime,
    nextStop,
    , // geoHashDeg1
    , // geoHashDeg2
    , // geoHashDeg3
    , // geoHashDeg4
    , // sid
  ] = topic.split("/");

  const vp: VehiclePositionMessage | undefined = JSON.parse(
    message.toString()
  ).VP;
  if (!vp?.lat || !vp.long) return;

  const train = topicToTrain.get(getMqttTopic(routeId, startTime));

  const trackedTrains = trainsVar();
  if (vp.jrn != null && !(vp.jrn in trackedTrains) && train) {
    trainsVar({
      ...trackedTrains,
      [vp.jrn]: {
        departureDate: formatEET(
          getTrainScheduledDepartureTime(train) ?? new Date(),
          'yyyy-MM-dd'
        ),
      },
    });
  }

  const oldVehicles = vehiclesVar();

  vehiclesVar({
    ...oldVehicles,
    [vp.veh]: {
      position: [vp.long, vp.lat],
      prevPosition: oldVehicles[vp.veh]?.position ?? [vp.long, vp.lat],
      drst: vp.drst,
      acc: vp.acc,
      spd: toKmsPerHour(vp.spd),
      stop: vp.stop,
      nextStop: 'HSL:' + nextStop,
      tripId: undefined,
      startTime: startTime,
      veh: vp.veh,
      transport_mode: vp.transport_mode,
      heading: vp.hdg,
      routeShortName: vp.desi,
      jrn: vp.jrn ?? null,
      timestamp: performance.now(),
    },
  });
};

/**
 * Gets the departure time of a train for HSL MQTT topic.
 *
 * Note that from HSL MQTT topic perspective the train departure time
 * may not be the departure time of the first time table row if the
 * first time table row is outside HSL area.
 */
function getTrainDepartureTimeForHslMqttTopic(
  train: TrainByStationFragment
): Date | undefined {
  const orderedDepartureRows = orderBy(
    train.timeTableRows?.filter((r) => r?.type === TimeTableRowType.Departure),
    (t) => t?.scheduledTime,
    'asc'
  );
  const destStation = getTrainDestinationStation(train);

  let departureRow;
  if (train.commuterLineid === 'R' && destStation?.shortCode === 'HKI') {
    // R TPE -> HKI and R HL -> HKI are actually RI -> HKI from HSL MQTT topic perspective
    // so we have to get departure time from RI station
    departureRow = orderedDepartureRows?.find(
      (r) => r?.station.shortCode === 'RI'
    );
  } else {
    departureRow = orderedDepartureRows?.[0];
  }
  const departureTime = departureRow
    ? parseISO(departureRow.scheduledTime)
    : undefined;
  return departureTime;
}

function getMqttTopic(routeId: string, startTime: string) {
  return `/hfp/v2/journey/ongoing/vp/+/+/+/${routeId}/+/+/${startTime}/#`;
}

export function getTopic(train: TrainByStationFragment) {
  if (!train.commuterLineid) return null;
  const routeId = trainCommuterLineToHSLRouteGtfsIdMap[train.commuterLineid];
  const departureTime = getTrainDepartureTimeForHslMqttTopic(train);
  if (!departureTime) return null;
  const depTimeString = formatEET(departureTime, 'HH:mm');
  return getMqttTopic(routeId, depTimeString);
}

export const mqttDigitransit = {
  endpointUrl: hslEndpointUrl,
  getTopic: getTopic,
  handleMessage: handleVehiclePositionMessage,
};
