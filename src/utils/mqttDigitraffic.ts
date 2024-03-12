import { parseISO } from 'date-fns';

import { TrainByStationFragment } from '../graphql/generated/digitraffic/graphql';
import useTrainStore from '../hooks/useTrainStore';
import useVehicleStore from '../hooks/useVehicleStore';
import { TrainLocationMessage } from '../types/vehicles';

import { formatEET } from './date';
import { getBearing } from './math';
import { getDepartureTimeTableRow } from './train';

const digitrafficEndpointUrl = 'wss://rata.digitraffic.fi:443/mqtt';

function getTrainCurrentHeading(tl: TrainLocationMessage): number | null {
  const vehicles = useVehicleStore.getState().vehicles;
  const prevLoc = vehicles[tl.trainNumber]
    ? {
        lat: vehicles[tl.trainNumber].position[1],
        lng: vehicles[tl.trainNumber].position[0],
      }
    : null;
  let heading: number | null = null;
  if (prevLoc) {
    if (
      prevLoc.lat === tl.location.coordinates[1] &&
      prevLoc.lng === tl.location.coordinates[0]
    ) {
      heading = vehicles[tl.trainNumber].heading;
    } else {
      heading = getBearing(prevLoc, {
        lat: tl.location.coordinates[1],
        lng: tl.location.coordinates[0],
      });
    }
  }
  return heading;
}

export const handleTrainLocationMessage = (
  topic: string,
  message: Buffer,
  topicToTrain: Map<string, TrainByStationFragment>
) => {
  const tl: TrainLocationMessage | undefined = JSON.parse(message.toString());
  if (!tl) return;

  const train = topicToTrain.get(
    `train-locations/${tl.departureDate}/${tl.trainNumber}/#`
  );
  const heading = getTrainCurrentHeading(tl);

  const trackedTrains = useTrainStore.getState().trains;
  if (!(tl.trainNumber in trackedTrains)) {
    useTrainStore.getState().setTrains({
      ...trackedTrains,
      [tl.trainNumber]: {
        departureDate: tl.departureDate,
      },
    });
  }

  const oldVehicles = useVehicleStore.getState().vehicles;

  useVehicleStore.getState().setVehicles({
    ...oldVehicles,
    [tl.trainNumber]: {
      position: tl.location.coordinates,
      prevPosition:
        oldVehicles[tl.trainNumber]?.position ?? tl.location.coordinates,
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
      timestamp: performance.now(),
    },
  });
};

export function getTopic(train: TrainByStationFragment) {
  if (!train.timeTableRows) return null;
  const departureRow = getDepartureTimeTableRow(train);
  if (!departureRow) return null;
  const departureDate = parseISO(departureRow.scheduledTime);
  const topic = `train-locations/${formatEET(departureDate, 'yyyy-MM-dd')}/${
    train.trainNumber
  }/#`;
  return topic;
}

export const mqttDigitraffic = {
  endpointUrl: digitrafficEndpointUrl,
  getTopic: getTopic,
  handleMessage: handleTrainLocationMessage,
};
