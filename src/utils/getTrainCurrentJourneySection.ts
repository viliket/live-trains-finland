import { orderBy } from 'lodash';

import { TrainDetailsFragment } from '../graphql/generated/digitraffic';
import { getTimeTableRowRealTime } from './train';

export default function getTrainCurrentJourneySection(
  train: TrainDetailsFragment
) {
  const journeySectionsSorted = orderBy(
    train.compositions?.[0]?.journeySections,
    (s) =>
      s?.startTimeTableRow
        ? getTimeTableRowRealTime(s.startTimeTableRow)
        : undefined,
    'desc'
  );

  let currentJourneySection = journeySectionsSorted?.find(
    (s) =>
      s?.startTimeTableRow &&
      getTimeTableRowRealTime(s.startTimeTableRow) <= new Date()
  );
  if (!currentJourneySection) {
    currentJourneySection =
      journeySectionsSorted[journeySectionsSorted.length - 1];
  }
  return currentJourneySection;
}
