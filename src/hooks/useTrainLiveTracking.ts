import { useCallback } from 'react';

import { vehiclesVar } from '../graphql/client';
import { TrainByStationFragment } from '../graphql/generated/digitraffic';
import canTrainBeTrackedByHsl from '../utils/canTrainBeTrackedByHsl';
import { mqttDigitraffic } from '../utils/mqttDigitraffic';
import { mqttDigitransit } from '../utils/mqttDigitransit';

import useTrainLiveTrackingWithEndpoint from './useTrainLiveTrackingWithEndpoint';

function useTrainLiveTracking(trains?: TrainByStationFragment[]) {
  const hslTrains = trains?.filter((t) => canTrainBeTrackedByHsl(t));
  const nonHslTrains = trains?.filter((t) => !canTrainBeTrackedByHsl(t));


  const { unsubscribeAll: unsubscribeAllHsl } =
    useTrainLiveTrackingWithEndpoint(mqttDigitransit, hslTrains);
  const { unsubscribeAll: unsubscribeAllDigitraffic } =
    useTrainLiveTrackingWithEndpoint(mqttDigitraffic, nonHslTrains);

  const unsubscribeAll = useCallback(() => {
    unsubscribeAllHsl(() => vehiclesVar({}));
    unsubscribeAllDigitraffic(() => vehiclesVar({}));
  }, [unsubscribeAllDigitraffic, unsubscribeAllHsl]);

  return { unsubscribeAll };
}

export default useTrainLiveTracking;
