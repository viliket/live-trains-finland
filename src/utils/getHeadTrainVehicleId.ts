import { minBy } from 'lodash';

import { TrainDetailsFragment } from '../graphql/generated/digitraffic';
import canTrainBeTrackedByHsl from './canTrainBeTrackedByHsl';
import getTrainCurrentJourneySection from './getTrainCurrentJourneySection';

export default function getHeadTrainVehicleId(train: TrainDetailsFragment) {
  if (!canTrainBeTrackedByHsl(train)) {
    // When train is not tracked by HSL (Digitransit) use trainNumber instead
    // of vehicleId because trains tracked by Digitraffic MQTT are identified
    // by their trainNumber in vehiclesVar()
    return train.trainNumber;
  }
  const currentJourneySection = getTrainCurrentJourneySection(train);
  const locomotives = currentJourneySection?.locomotives;
  if (locomotives) {
    const headTrain = minBy(locomotives, (l) => l?.location);
    if (headTrain) {
      return headTrain.vehicleId ?? train.trainNumber;
    }
  }
  return null;
}
