import { useEffect, useState } from 'react';

import { useReactiveVar } from '@apollo/client';

import { vehiclesVar } from '../graphql/client';
import { TrainDetailsFragment } from '../graphql/generated/digitraffic';
import getHeadTrainVehicleId from '../utils/getHeadTrainVehicleId';

export const useTrainSpeed = (train?: TrainDetailsFragment | null) => {
  const [speed, setSpeed] = useState<number | null>(null);
  const vehicles = useReactiveVar(vehiclesVar);

  const headTrainVehicleId = train ? getHeadTrainVehicleId(train) : null;
  const vehicle = headTrainVehicleId ? vehicles[headTrainVehicleId] : null;

  useEffect(() => {
    if (vehicle) {
      setSpeed(vehicle.spd);
    }
  }, [vehicle]);

  return speed;
};
