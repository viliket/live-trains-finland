import { useEffect, useRef } from 'react';

import { format, parseISO } from 'date-fns';

import { vehiclesVar } from '../graphql/client';
import { TrainByStationFragment } from '../graphql/generated/digitraffic';
import { TrainLocationMessage } from '../types/vehicles';
import { isDefined } from '../utils/common';
import { getBearing } from '../utils/math';
import { getDepartureTimeTableRow } from '../utils/train';
import useMqttClient from './useMqttClient';

const digitrafficEndpointUrl = 'wss://rata.digitraffic.fi:443/mqtt';

function getTrainCurrentHeading(tl: TrainLocationMessage): number | null {
  const prevLoc = vehiclesVar()[tl.trainNumber]
    ? {
        lat: vehiclesVar()[tl.trainNumber].position[1],
        lng: vehiclesVar()[tl.trainNumber].position[0],
      }
    : null;
  let heading: number | null = null;
  if (prevLoc) {
    if (
      prevLoc.lat === tl.location.coordinates[1] &&
      prevLoc.lng === tl.location.coordinates[0]
    ) {
      heading = vehiclesVar()[tl.trainNumber].heading;
    } else {
      heading = getBearing(prevLoc, {
        lat: tl.location.coordinates[1],
        lng: tl.location.coordinates[0],
      });
    }
  }
  return heading;
}

const handleTrainLocationMessage = (
  message: Buffer,
  trains?: TrainByStationFragment[]
) => {
  const tl: TrainLocationMessage | undefined = JSON.parse(message.toString());
  if (!tl || !trains) return;

  const train = trains.find((t) => t.trainNumber === tl.trainNumber);
  const heading = getTrainCurrentHeading(tl);

  const oldVehicles = vehiclesVar();

  vehiclesVar({
    ...oldVehicles,
    [tl.trainNumber]: {
      position: tl.location.coordinates,
      prevPosition:
        oldVehicles[tl.trainNumber]?.prevPosition ?? tl.location.coordinates,
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
        ? train.commuterLineid || train.trainNumber.toString()
        : null,
      jrn: tl.trainNumber,
      timestamp: Date.now(),
    },
  });
};

function getTopic(train: TrainByStationFragment) {
  if (!train.timeTableRows) return null;
  const departureRow = getDepartureTimeTableRow(train);
  if (!departureRow) return null;
  const departureDate = parseISO(departureRow.scheduledTime);
  const topic = `train-locations/${format(departureDate, 'yyyy-MM-dd')}/${
    train.trainNumber
  }/#`;
  return topic;
}

function useTrainLiveTrackingWithDigitraffic(
  trains?: TrainByStationFragment[]
) {
  const { client, error } = useMqttClient(digitrafficEndpointUrl);
  const subscribedTopics = useRef(new Set<string>());

  useEffect(() => {
    const callback = (_topic: string, message: Buffer) =>
      handleTrainLocationMessage(message, trains);

    if (client) {
      client.on('message', callback);
    }

    return () => {
      if (client) {
        client.off('message', callback);
      }
    };
  }, [client, trains]);

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

export default useTrainLiveTrackingWithDigitraffic;
