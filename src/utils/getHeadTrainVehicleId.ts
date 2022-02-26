import { minBy } from 'lodash';

import { TrainDetailsFragment } from '../graphql/generated/digitraffic';

export default function getHeadTrainVehicleId(train: TrainDetailsFragment) {
  const locomotives =
    train.compositions?.[0]?.journeySections?.[0]?.locomotives;
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
