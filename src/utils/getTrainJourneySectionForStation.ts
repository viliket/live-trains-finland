import { TrainDetailsFragment } from '../graphql/generated/digitraffic';

export default function getTrainJourneySectionForStation(
  train: TrainDetailsFragment,
  stationName: string,
  stationLocationAtSection: 'start' | 'end' = 'start'
) {
  // Note that train has only single composition for specific depature date
  const composition = train.compositions?.[0];

  if (stationLocationAtSection === 'start') {
    const journeySection = composition?.journeySections?.find((s) =>
      s?.startTimeTableRow?.station.name
        .toLowerCase()
        .includes(stationName.toLowerCase())
    );
    return journeySection;
  } else {
    const journeySection = composition?.journeySections?.find((s) =>
      s?.endTimeTableRow?.station.name
        .toLowerCase()
        .includes(stationName.toLowerCase())
    );
    return journeySection;
  }
}
