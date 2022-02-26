import { useEffect } from 'react';

import { format, parseISO } from 'date-fns';
import { orderBy } from 'lodash';
import * as mqtt from 'mqtt';

import { vehiclesVar } from '../graphql/client';
import {
  TimeTableRowType,
  TrainByStationFragment,
} from '../graphql/generated/digitraffic';
import {
  TrainLocationMessage,
  VehiclePositionMessage,
} from '../types/vehicles';
import { getBearing, toKmsPerHour } from '../utils/math';
import {
  getTrainDepartureStation,
  getTrainDestinationStation,
} from '../utils/train';

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

function getHslTopic(train?: TrainByStationFragment | null) {
  if (!train?.commuterLineid) return null;
  const routeGtfsId =
    trainCommuterLineToHSLRouteGtfsIdMap[train.commuterLineid];
  const departureTime = getTrainDepartureTimeForHslMqttTopic(train);
  if (!departureTime) return null;
  const depTimeString = format(departureTime, 'HH:mm');
  const hslTopic = `/hfp/v2/journey/ongoing/vp/+/+/+/${routeGtfsId}/+/+/${depTimeString}/#`;
  return hslTopic;
}

function canTrainBeTrackedByHsl(train: TrainByStationFragment): boolean {
  const isCommuterTrain = train.commuterLineid;
  if (isCommuterTrain) {
    const depStation = getTrainDepartureStation(train);
    const destStation = getTrainDestinationStation(train);
    // Train cannot be tracked if both dep and dest stations are outside HSL area
    if (depStation?.shortCode === 'TPE' && destStation?.shortCode === 'RI') {
      return false;
    }
    return true;
  } else {
    return false;
  }
}

function startHslMqttClient(
  trains: (TrainByStationFragment | null | undefined)[]
): mqtt.MqttClient {
  const client = mqtt.connect('wss://mqtt.hsl.fi:443/');

  const hslTrains = trains.filter((t) => t && canTrainBeTrackedByHsl(t));
  const topics = hslTrains
    .map(getHslTopic)
    .filter((t): t is string => t != null);

  client.on('connect', () => client.subscribe(topics));
  client.on('message', (topic, message) => {
    // Topic:   /<prefix>/<version>/<journey_type>/<temporal_type>/<event_type>/<transport_mode>/<operator_id>/<vehicle_number>/<route_id>/<direction_id>/<headsign>/<start_time>/<next_stop>/<geohash_level>/<geohash>/<sid>/#
    // Example: /hfp/v2/journey/ongoing/vp/train/0090/01056/3002U/1/Kirkkonummi/16:12/1174504/4/60;24/19/83/56
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
  });

  return client;
}

function getTrainHeading(tl: TrainLocationMessage): number | null {
  const previousPosition = vehiclesVar()[tl.trainNumber]
    ? {
        lat: vehiclesVar()[tl.trainNumber].lat,
        lng: vehiclesVar()[tl.trainNumber].lng,
      }
    : null;
  let heading: number | null = null;
  if (previousPosition) {
    if (
      previousPosition.lat === tl.location.coordinates[1] &&
      previousPosition.lng === tl.location.coordinates[0]
    ) {
      heading = vehiclesVar()[tl.trainNumber].heading;
    } else {
      heading = getBearing(previousPosition, {
        lat: tl.location.coordinates[1],
        lng: tl.location.coordinates[0],
      });
    }
  }
  return heading;
}

function startDigitrafficMqttClient(
  trains: (TrainByStationFragment | null | undefined)[]
): mqtt.MqttClient {
  const nonHslTrains = trains.filter((t) => t && !canTrainBeTrackedByHsl(t));

  const client = mqtt.connect('wss://rata.digitraffic.fi:443/mqtt');

  const topics = nonHslTrains
    .map((t) => {
      if (!t?.timeTableRows) return null;
      const departureRow = orderBy(
        t.timeTableRows,
        (t) => t?.scheduledTime,
        'asc'
      )?.[0];
      if (!departureRow) return null;
      const departureDate = parseISO(departureRow.scheduledTime);
      const tripTopic = `train-locations/${format(
        departureDate,
        'yyyy-MM-dd'
      )}/${t?.trainNumber}/#`;
      return tripTopic;
    })
    .filter((t): t is string => t != null);

  client.on('connect', () => client.subscribe(topics));
  client.on('message', (topic, message) => {
    const tl: TrainLocationMessage | undefined = JSON.parse(message.toString());
    if (!tl) return;

    const train = trains.find((t) => t?.trainNumber === tl.trainNumber);
    const heading = getTrainHeading(tl);

    vehiclesVar({
      ...vehiclesVar(),
      [tl.trainNumber]: {
        lat: tl.location.coordinates[1],
        lng: tl.location.coordinates[0],
        drst: null,
        acc: 0,
        spd: tl.speed,
        stop: null,
        nextStop: null,
        tripId: undefined,
        startTime: '',
        veh: tl.trainNumber,
        transport_mode: 'train',
        heading: heading,
        routeShortName: train
          ? train.commuterLineid ?? train.trainNumber.toString()
          : null,
        jrn: tl.trainNumber,
      },
    });
  });

  return client;
}

function useTrainLiveTracking(
  trains?: (TrainByStationFragment | null | undefined)[] | null
) {
  useEffect(() => {
    if (!trains) return;

    const client = startHslMqttClient(trains);
    const digiTrafficClient = startDigitrafficMqttClient(trains);

    return function cleanup() {
      client.end();
      digiTrafficClient.end();
    };
  }, [trains]);
}

export default useTrainLiveTracking;
