import { TrainByStationFragment } from '../graphql/generated/digitraffic';
import { getTrainDepartureStation, getTrainDestinationStation } from './train';

export default function canTrainBeTrackedByHsl(
  train: TrainByStationFragment
): boolean {
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
