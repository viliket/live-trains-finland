import {
  TrainTimeTableRowFragment,
  TrainDetailsFragment,
} from '../graphql/generated/digitraffic/graphql';

export default function getTrainJourneySectionForTimeTableRow(
  train: TrainDetailsFragment,
  ttRow: TrainTimeTableRowFragment
) {
  // Note that train has only single composition for specific depature date
  const composition = train.compositions?.[0];

  return composition?.journeySections?.find(
    (section) =>
      section?.startTimeTableRow?.scheduledTime <= ttRow?.scheduledTime &&
      ttRow?.scheduledTime <= section?.endTimeTableRow?.scheduledTime
  );
}
