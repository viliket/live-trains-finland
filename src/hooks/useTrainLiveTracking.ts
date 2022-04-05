import { TrainByStationFragment } from '../graphql/generated/digitraffic';
import {
  getTrainDepartureStation,
  getTrainDestinationStation,
} from '../utils/train';
import useTrainLiveTrackingWithDigitraffic from './useTrainLiveTrackingWithDigitraffic';
import useTrainLiveTrackingWithHsl from './useTrainLiveTrackingWithHsl';

export function canTrainBeTrackedByHsl(train: TrainByStationFragment): boolean {
  const isCommuterTrain = train.commuterLineid;
  if (isCommuterTrain) {
    const depStation = getTrainDepartureStation(train);
    const destStation = getTrainDestinationStation(train);

    // Train cannot be tracked if both dep and dest stations are outside HSL area
    if (depStation?.shortCode === 'TPE' && destStation?.shortCode === 'RI') {
      return false;
    }
    return true;
  } else {
    return false;
  }
}

function useTrainLiveTracking(trains?: TrainByStationFragment[]) {
  const hslTrains = trains?.filter((t) => canTrainBeTrackedByHsl(t));
  const nonHslTrains = trains?.filter((t) => !canTrainBeTrackedByHsl(t));

  useTrainLiveTrackingWithHsl(hslTrains);
  useTrainLiveTrackingWithDigitraffic(nonHslTrains);
}

export default useTrainLiveTracking;
