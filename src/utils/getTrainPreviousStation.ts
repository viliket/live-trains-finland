import { TrainByStationFragment } from '../graphql/generated/digitraffic';

import getTrainLatestDepartureTimeTableRow from './getTrainLatestDepartureTimeTableRow';

export default function getTrainPreviousStation(train: TrainByStationFragment) {
  return getTrainLatestDepartureTimeTableRow(train)?.station;
}
