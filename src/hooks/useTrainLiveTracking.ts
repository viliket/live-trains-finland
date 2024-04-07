import { useCallback } from 'react';

import { TrainByStationFragment } from '../graphql/generated/digitraffic/graphql';
import canTrainBeTrackedByHsl from '../utils/canTrainBeTrackedByHsl';
import { mqttDigitraffic } from '../utils/mqttDigitraffic';
import { mqttDigitransit } from '../utils/mqttDigitransit';

import useTrainLiveTrackingWithEndpoint from './useTrainLiveTrackingWithEndpoint';
import useVehicleStore from './useVehicleStore';

function useTrainLiveTracking(trains?: TrainByStationFragment[]) {
  const hslTrains = trains?.filter((t) => canTrainBeTrackedByHsl(t));
  const nonHslTrains = trains?.filter((t) => !canTrainBeTrackedByHsl(t));
  const removeAllVehicles = useVehicleStore((state) => state.removeAllVehicles);


  const { unsubscribeAll: unsubscribeAllHsl } =
    useTrainLiveTrackingWithEndpoint(mqttDigitransit, hslTrains);
  const { unsubscribeAll: unsubscribeAllDigitraffic } =
    useTrainLiveTrackingWithEndpoint(mqttDigitraffic, nonHslTrains);

  const unsubscribeAll = useCallback(() => {
    unsubscribeAllHsl(() => removeAllVehicles());
    unsubscribeAllDigitraffic(() => removeAllVehicles());
  }, [unsubscribeAllDigitraffic, unsubscribeAllHsl, removeAllVehicles]);

  return { unsubscribeAll };
}

export default useTrainLiveTracking;
