import { useEffect, useState } from 'react';

import { TrainDetailsFragment } from '../graphql/generated/digitraffic/graphql';
import getHeadTrainVehicleId from '../utils/getHeadTrainVehicleId';

import useVehicleStore from './useVehicleStore';

export const useTrainSpeed = (train?: TrainDetailsFragment | null) => {
  const [speed, setSpeed] = useState<number | null>(null);
  const vehicles = useVehicleStore((state) => state.vehicles);

  const headTrainVehicleId = train ? getHeadTrainVehicleId(train) : null;
  const vehicle = headTrainVehicleId ? vehicles[headTrainVehicleId] : null;

  useEffect(() => {
    if (vehicle) {
      setSpeed(vehicle.spd);
    }
  }, [vehicle]);

  return speed;
};
