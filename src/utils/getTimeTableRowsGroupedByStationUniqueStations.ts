import { addMinutes } from 'date-fns';

import { TrainByStationFragment } from '../graphql/generated/digitraffic/graphql';
import { TrainExtendedDetails } from '../types';

import getTimeTableRowsGroupedByStation, {
  StationTimeTableRowGroup,
} from './getTimeTableRowsGroupedByStation';
import { getTimeTableRowRealTime } from './train';

export default function getTimeTableRowsGroupedByStationUniqueStations(
  train: TrainExtendedDetails | TrainByStationFragment
) {
  let trainTimeTableRows: StationTimeTableRowGroup[] | undefined | null;
  if ('timeTableGroups' in train) {
    trainTimeTableRows = train.timeTableGroups;
  } else {
    trainTimeTableRows = getTimeTableRowsGroupedByStation(train);
  }
  if (!trainTimeTableRows) return null;

  // Date used when encountering time table row groups with duplicate station,
  // (e.g. Pasila & Helsinki on the Ring Rail Line that occur twice). This date
  // is used to choose the earliest group among the duplicates that has its time
  // table row (departure / arrival) time after this time.
  const dateForComparison = addMinutes(new Date(), -10);

  const trainTimeTableRowsWithUniqueStations = trainTimeTableRows?.reduce(
    (groups, timeTableRowGroup) => {
      const row = timeTableRowGroup.departure ?? timeTableRowGroup.arrival;
      if (!row) return groups;

      const stationName = row.station.name;

      if (!(stationName in groups)) {
        groups[stationName] = timeTableRowGroup;
        return groups;
      }

      const existingRow =
        groups[stationName].departure ?? groups[stationName].arrival;
      if (!existingRow) return groups;

      if (dateForComparison > getTimeTableRowRealTime(existingRow)) {
        // Replace existing time table row group with this group if the time of the existing row
        // has already been passed recently
        groups[stationName] = timeTableRowGroup;
      }
      return groups;
    },
    {} as Record<string, StationTimeTableRowGroup>
  );
  return Object.values(trainTimeTableRowsWithUniqueStations);
}
