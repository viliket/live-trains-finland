import {
  StationPlatformSide,
  TrainDirection,
  TrainTimeTableGroupFragment,
  TrainTimeTableRowFragment,
} from '../graphql/generated/digitraffic';

import _stationPlatformInfoByStationPlatformId from './generated/station-platform-by-station-platform-id.json';

type StationPlatform = {
  /**
   * Platform side relative to the track according to increasing line km (nouseva ratakilometri).
   */
  platformSide: 'right' | 'left' | 'unknown';
  /**
   * Platform type is either "side" (reunalaituri) or "island" (välilaituri).
   * @see https://en.wikipedia.org/wiki/Railway_platform#Types_of_platform
   * @see https://en.wikipedia.org/wiki/Side_platform
   * @see https://en.wikipedia.org/wiki/Island_platform
   */
  platformType?: 'side' | 'island';
};

const stationPlatformInfoByStationPlatformId =
  _stationPlatformInfoByStationPlatformId as Record<string, StationPlatform>;

function getPlatformSide(
  timeTableRow: TrainTimeTableRowFragment,
  trainDirection: TrainDirection
): StationPlatformSide | null {
  const stationTrackNumberKey = `${timeTableRow.station.shortCode} L${timeTableRow.commercialTrack}`;
  const platform =
    stationPlatformInfoByStationPlatformId[stationTrackNumberKey];

  if (!platform) return null;

  const isSidePlatform =
    'platformType' in platform && platform.platformType === 'side';
  const isRightSide = platform.platformSide === 'right';

  if (isSidePlatform) {
    // Platform type is "side" (Reunalaituri)
    if (trainDirection === TrainDirection.Increasing) {
      return isRightSide ? StationPlatformSide.Right : StationPlatformSide.Left;
    } else if (trainDirection === TrainDirection.Decreasing) {
      return isRightSide ? StationPlatformSide.Left : StationPlatformSide.Right;
    }
  } else {
    // Assume that otherwise platform type is "island" (Välilaituri)
    if (trainDirection === TrainDirection.Increasing) {
      return isRightSide ? StationPlatformSide.Left : StationPlatformSide.Right;
    } else if (trainDirection === TrainDirection.Decreasing) {
      return isRightSide ? StationPlatformSide.Right : StationPlatformSide.Left;
    }
  }
  return null;
}

/**
 * Returns whether the station platform is on the right or left side of the train based on the train direction
 * on the track.
 */
export default function getStationPlatformSide(
  stationTimeTableRowGroup: TrainTimeTableGroupFragment
) {
  const trainDirection = stationTimeTableRowGroup.trainDirection;
  if (!trainDirection) return null;

  const row =
    stationTimeTableRowGroup.departure ?? stationTimeTableRowGroup.arrival;
  if (!row) return null;

  const platformSide = getPlatformSide(row, trainDirection);
  return platformSide;
}
