import { TrainDetailsFragment } from '../graphql/generated/digitraffic/graphql';
import getHeadTrainVehicleId from '../utils/getHeadTrainVehicleId';

import useVehicleStore from './useVehicleStore';

export const useTrainSpeed = (train?: TrainDetailsFragment | null) => {
  const vehicles = useVehicleStore((state) => state.vehicles);

  const headTrainVehicleId = train ? getHeadTrainVehicleId(train) : null;
  const vehicle = headTrainVehicleId ? vehicles[headTrainVehicleId] : null;

  return vehicle?.spd ?? null;
};
