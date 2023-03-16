import { useCallback } from 'react';

import { vehiclesVar } from '../graphql/client';
import { TrainByStationFragment } from '../graphql/generated/digitraffic';
import { mqttDigitraffic } from '../utils/mqttDigitraffic';
import { mqttDigitransit } from '../utils/mqttDigitransit';
import {
  getTrainDepartureStation,
  getTrainDestinationStation,
} from '../utils/train';
import useTrainLiveTrackingWithEndpoint from './useTrainLiveTrackingWithEndpoint';

export function canTrainBeTrackedByHsl(train: TrainByStationFragment): boolean {
  const isCommuterTrain = train.commuterLineid;
  if (!isCommuterTrain) {
    return false;
  }
  const deptStation = getTrainDepartureStation(train);
  const destStation = getTrainDestinationStation(train);
  const deptCode = deptStation?.shortCode;
  const destCode = destStation?.shortCode;

  const stationsOutsideHslArea = ['TPE', 'NOA', 'RI'];

  const isOutsideHslArea = (stationCode: string) =>
    stationsOutsideHslArea.includes(stationCode);

  if (!deptCode || !destCode) {
    return false;
  }

  // Train cannot be tracked if both dep and dest stations are outside HSL area
  if (isOutsideHslArea(deptCode) && isOutsideHslArea(destCode)) {
    return false;
  } else {
    return true;
  }
}

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
