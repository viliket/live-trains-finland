import { minBy } from 'lodash';

import { TrainDetailsFragment } from '../graphql/generated/digitraffic';
import getTrainCurrentJourneySection from './getTrainCurrentJourneySection';

export default function getHeadTrainVehicleId(train: TrainDetailsFragment) {
  const currentJourneySection = getTrainCurrentJourneySection(train);
  const locomotives = currentJourneySection?.locomotives;
  if (locomotives) {
    const headTrain = minBy(locomotives, (l) => l?.location);
    if (headTrain) {
      const headTrainVehicleId = headTrain.vehicleId ?? train.trainNumber;
      if (headTrainVehicleId) {
        return headTrainVehicleId;
      }
    }
  }
  return null;
}
