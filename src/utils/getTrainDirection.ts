import {
  TrainDetailsFragment,
  TrainDirection,
  TrainTimeTableRowFragment,
} from '../graphql/generated/digitraffic';
import { isIn } from './common';
import lineKmLocationByStationCode from './generated/line-km-location-by-station-code.json';
import { StationTimeTableRowGroup } from './getTimeTableRowsGroupedByStation';

type LineKmLocation = {
  trackNumber: string | null;
  linekm: number | null;
  distance: number | null;
};

function getLineKmLocation(timeTableRow: TrainTimeTableRowFragment) {
  const stationCode = timeTableRow.station.shortCode;
  if (isIn(stationCode, lineKmLocationByStationCode)) {
    return lineKmLocationByStationCode[stationCode];
  } else {
    return null;
  }
}

/**
 * Retrieves the line kilometers of the given line kilometer locations based
 * on a common track between both locations.
 */
function getLineKmsOnCommonTrack(
  lineKmLocation1: LineKmLocation & { otherLinekmLocations: LineKmLocation[] },
  lineKmLocation2: LineKmLocation & { otherLinekmLocations: LineKmLocation[] }
): [number | null, number | null] {
  const lineKmLocs1 = [
    lineKmLocation1,
    ...lineKmLocation1.otherLinekmLocations,
  ];
  const lineKmLocs2 = [
    lineKmLocation2,
    ...lineKmLocation2.otherLinekmLocations,
  ];
  for (const linekmLoc1 of lineKmLocs1) {
    // Find line km location from line km loc 2 that has the same track number
    const linekmLoc2 = lineKmLocs2.find(
      (l2) => l2.trackNumber === linekmLoc1.trackNumber
    );
    if (linekmLoc2) {
      return [linekmLoc1.linekm, linekmLoc2.linekm];
    }
  }

  return [null, null];
}

/**
 * Returns whether the train direction at the given station (based on the time table group) is
 * increasing (nouseva) or decreasing (laskeva) on the track network based on the line kilometer system
 * (ratakilometrijärjestelmä).
 *
 * In Finland, the line kilometer system works so that the "zero" line km
 * reference point is at Helsinki main railway station and line kilometers increase from that point
 * further. Hence, the stations with the furthest line kilometers are up north in Lapland.
 *
 * @see https://fi.wikipedia.org/wiki/Ratakilometrij%C3%A4rjestelm%C3%A4
 *
 * Note also: On each train station (not all yet though) there are sectoring markers (sektorimerkki) A-D.
 * Sectoring markers start from sector A (according to increasing line kilometers) and continue up to sector D.
 * Source: Rautatieasemien staattiset opasteet – Suunnitteluohje - 7.2 Junien sektorointi-, runko- ja
 * pysähdyspaikkamerkkien sijoitussuunnitelmat
 */
export default function getTrainDirection(
  train: TrainDetailsFragment,
  stationTimeTableRowGroup: StationTimeTableRowGroup
) {
  const timeTableGroups = train.timeTableGroups;
  if (!timeTableGroups) return null;

  const stationDepartureRow = stationTimeTableRowGroup.departure;
  const stationArrivalRow = stationTimeTableRowGroup.arrival;

  if (stationArrivalRow) {
    // There is previous station before this station as this station has arrival row

    // Find the index of the given station
    const index = timeTableGroups.findIndex(
      (g) => g.arrival?.scheduledTime === stationArrivalRow.scheduledTime
    );

    // Get the departure row of the previous station
    let prevStationDepartureRow = timeTableGroups[index - 1]?.departure;
    if (!prevStationDepartureRow) return null;

    const stationLineKmLoc = getLineKmLocation(stationArrivalRow);
    const prevStationLineKmLoc = getLineKmLocation(prevStationDepartureRow);

    if (stationLineKmLoc == null || prevStationLineKmLoc == null) return null;

    const [stationLineKm, prevStationLineKm] = getLineKmsOnCommonTrack(
      stationLineKmLoc,
      prevStationLineKmLoc
    );

    if (stationLineKm == null || prevStationLineKm == null) return null;

    return stationLineKm < prevStationLineKm
      ? TrainDirection.Decreasing
      : TrainDirection.Increasing;
  } else if (stationDepartureRow) {
    // There is going to be next station after the given station because this station has departure row

    // Find the index of the given station
    const index = timeTableGroups.findIndex(
      (g) => g.departure?.scheduledTime === stationDepartureRow.scheduledTime
    );

    // Get the arrival row of the next station
    const nextStationArrivalRow = timeTableGroups[index + 1]?.arrival;
    if (!nextStationArrivalRow) return null;

    const stationLineKmLoc = getLineKmLocation(stationDepartureRow);
    const nextStationLineKmLoc = getLineKmLocation(nextStationArrivalRow);

    if (stationLineKmLoc == null || nextStationLineKmLoc == null) return null;

    const [stationLineKm, nextStationLineKm] = getLineKmsOnCommonTrack(
      stationLineKmLoc,
      nextStationLineKmLoc
    );

    if (stationLineKm == null || nextStationLineKm == null) return null;

    return stationLineKm < nextStationLineKm
      ? TrainDirection.Increasing
      : TrainDirection.Decreasing;
  }
  return null;
}
