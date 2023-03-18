import {
  TimeTableRowType,
  TrainByStationFragment,
  TrainTimeTableRowFragment,
} from '../graphql/generated/digitraffic';

export default function getTimeTableRowsGroupedByStation(
  train: TrainByStationFragment
) {
  // Group time table rows by station when consecutive rows have same station
  const grouped = train.timeTableRows?.reduce((arr, cur, i, a) => {
    if (!i || cur?.station.shortCode !== a[i - 1]?.station.shortCode) {
      arr.push([]);
    }
    if (cur) {
      arr[arr.length - 1].push(cur);
    }
    return arr;
  }, [] as TrainTimeTableRowFragment[][]);

  const timeTableRows = grouped?.map((rows) => {
    return {
      arrival: rows.find((r) => r?.type === TimeTableRowType.Arrival),
      departure: rows.find((r) => r?.type === TimeTableRowType.Departure),
    };
  });

  return timeTableRows;
}
