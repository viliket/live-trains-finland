import { TrainDetailsFragment } from '../graphql/generated/digitraffic/graphql';

type JourneySectionFragment = NonNullable<
  NonNullable<
    NonNullable<TrainDetailsFragment['compositions']>[number]
  >['journeySections']
>[number];

export default function getTrainJourneySectionForStation(
  train: TrainDetailsFragment,
  stationCode: string,
  stationLocationAtSection: 'start' | 'end' = 'start'
) {
  // Note that train has only single composition for specific depature date
  const composition = train.compositions?.[0];

  const ttRowSelector =
    stationLocationAtSection === 'start'
      ? (s: JourneySectionFragment) => s?.startTimeTableRow
      : (s: JourneySectionFragment) => s?.endTimeTableRow;

  return composition?.journeySections?.find(
    (section) => ttRowSelector(section)?.station.shortCode === stationCode
  );
}
