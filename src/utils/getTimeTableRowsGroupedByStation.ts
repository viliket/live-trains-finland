import {
  TimeTableRowType,
  TrainTimeTableRowFragment,
} from '../graphql/generated/digitraffic/graphql';

export type StationTimeTableRowGroup = {
  arrival?: TrainTimeTableRowFragment | null;
  departure?: TrainTimeTableRowFragment | null;
};

export default function getTimeTableRowsGroupedByStation({
  timeTableRows,
}: {
  timeTableRows?: readonly (TrainTimeTableRowFragment | null)[] | null;
}): StationTimeTableRowGroup[] | undefined {
  // Group time table rows by station when consecutive rows have same station
  const grouped = timeTableRows?.reduce((arr, cur, i, a) => {
    if (!i || cur?.station.shortCode !== a[i - 1]?.station.shortCode) {
      arr.push([]);
    }
    if (cur) {
      arr[arr.length - 1].push(cur);
    }
    return arr;
  }, [] as TrainTimeTableRowFragment[][]);

  const timeTableGroups = grouped?.map((rows) => {
    return {
      arrival: rows.find((r) => r?.type === TimeTableRowType.Arrival) ?? null,
      departure:
        rows.find((r) => r?.type === TimeTableRowType.Departure) ?? null,
    };
  });

  return timeTableGroups;
}
