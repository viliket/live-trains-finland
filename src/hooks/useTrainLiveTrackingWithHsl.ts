import { useEffect, useRef } from 'react';

import { format, parseISO } from 'date-fns';
import { orderBy } from 'lodash';

import { vehiclesVar } from '../graphql/client';
import {
  TimeTableRowType,
  TrainByStationFragment,
} from '../graphql/generated/digitraffic';
import { VehiclePositionMessage } from '../types/vehicles';
import { isDefined } from '../utils/common';
import { toKmsPerHour } from '../utils/math';
import {
  getTrainDepartureStation,
  getTrainDestinationStation,
} from '../utils/train';
import useMqttClient from './useMqttClient';

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

const handleVehiclePositionMessage = (topic: string, message: Buffer) => {
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
    , // route_id
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
  if (!vp || !vp.lat || !vp.long) return;
  vehiclesVar({
    ...vehiclesVar(),
    [vp.veh]: {
      lat: vp.lat,
      lng: vp.long,
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
  const depStation = getTrainDepartureStation(train);
  const destStation = getTrainDestinationStation(train);

  let departureRow;
  if (
    (depStation?.shortCode === 'TPE' || depStation?.shortCode === 'HL') &&
    destStation?.shortCode === 'HKI'
  ) {
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

function getTopic(train: TrainByStationFragment) {
  if (!train.commuterLineid) return null;
  const routerId = trainCommuterLineToHSLRouteGtfsIdMap[train.commuterLineid];
  const departureTime = getTrainDepartureTimeForHslMqttTopic(train);
  if (!departureTime) return null;
  const depTimeString = format(departureTime, 'HH:mm');
  const topic = `/hfp/v2/journey/ongoing/vp/+/+/+/${routerId}/+/+/${depTimeString}/#`;
  return topic;
}

function useTrainLiveTrackingWithHsl(trains?: TrainByStationFragment[]) {
  const { client, error } = useMqttClient(hslEndpointUrl);
  const subscribedTopics = useRef(new Set<string>());

  useEffect(() => {
    if (client) {
      client.on('message', (topic, message) => {
        handleVehiclePositionMessage(topic, message);
      });
    }
  }, [client]);

  useEffect(() => {
    if (client && trains) {
      const topics = trains.map(getTopic).filter(isDefined);
      const newTopics = [...topics].filter(
        (t) => !subscribedTopics.current.has(t)
      );
      client.subscribe(newTopics);
      newTopics.forEach((t) => subscribedTopics.current.add(t));
    }
  }, [client, trains]);

  return { error };
}

export default useTrainLiveTrackingWithHsl;
