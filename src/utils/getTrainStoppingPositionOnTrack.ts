import { sortBy } from 'lodash';

import {
  JourneySection,
  TrainDirection,
} from '../graphql/generated/digitraffic/graphql';

import trackSignByStationPlatformIdRaw from './generated/track-sign-data-by-station-platform-id.json';

type TrackSignDetails = { pos: GeoJSON.Position };

type TrackSignText = string;

// Directional track signs, separated into those applicable for trains with direction
// increasing (up) and decreasing (down) track line kilometers
type DirectionalTrackSigns = {
  // Track signs that apply to trains facing increasing track line km (ratakm) direction
  i?: Record<TrackSignText, TrackSignDetails>;
  // Track signs that apply to trains facing decreasing track line km (ratakm) direction
  d?: Record<TrackSignText, TrackSignDetails>;
};

const trackSignByStationPlatformId = trackSignByStationPlatformIdRaw as Partial<
  Record<
    string,
    {
      // Rail coordinates in increasing track line km (ratakm) direction
      trackCoords?: GeoJSON.Position[];
      /**
       * Runkomerkki - track signs that apply to the commuter line trains
       */
      R?: DirectionalTrackSigns;
      /**
       * Pysähdyspaikkamerkki - track signs that apply to the long distance trains
       */
      P?: DirectionalTrackSigns;
    }
  >
>;

/**
 * Returns whether the train stop sign with the given text is applicable to the given train composition.
 *
 * For more details on train stop signs (Pysähdyspaikkamerkki & Runkomerkki) and their interpretation, refer to:
 *
 * @see {@link https://ava.vaylapilvi.fi/ava/Julkaisut/Vaylavirasto/vo_2023-10_rato17_web.pdf|Ratatekniset ohjeet (RATO) 17 - Radan merkit ja merkinnät}
 * @see {@link https://ava.vaylapilvi.fi/ava/Julkaisut/Vaylavirasto/vo_2022-18_rautatieasemien_staattiset_opasteet_web.pdf|Rautatieasemien staattiset opasteet - Suunnitteluohje}
 *
 * @param stopSignText The train stop sign text, e.g. "P", "1", "1/2", "2/4" etc.
 * @param trainJourneySection The train journey section that holds the composition details.
 * @param isCommuterLine Whether the train is a commuter line (e.g. R, E, A, I, P trains).
 * @returns `true` if the train stop sign is applicable, `false` otherwise.
 */
const isTrainStopSignApplicable = (
  stopSignText: string,
  trainJourneySection: Pick<JourneySection, 'wagons' | 'totalLength'>,
  isCommuterLine: boolean
) => {
  if (isCommuterLine) {
    return isCommuterLineStopSignApplicable(stopSignText, trainJourneySection);
  } else {
    return isLongDistanceStopSignApplicable(
      stopSignText,
      trainJourneySection.totalLength
    );
  }
};

/**
 * The following rules, which specify the "train composition" that each track
 * sign applies to, were established in collaboration with Väylävirasto, VR,
 * and HSL in the past.
 */
const isCommuterLineStopSignApplicable = (
  stopSignText: string,
  trainJourneySection: Pick<JourneySection, 'wagons'>
): boolean => {
  if (stopSignText === 'P') return true;

  const wagons = trainJourneySection.wagons ?? [];
  const isSm2Or4 = wagons.some(
    (w) => w?.wagonType && ['Sm2', 'Sm4'].includes(w.wagonType)
  );
  const isSm5 = wagons.some((w) => w?.wagonType === 'Sm5');
  const numUnits = wagons.length;

  const isApplicable = (sign: string): boolean => {
    switch (sign) {
      case '1':
        return numUnits === 1 && (isSm2Or4 || isSm5);
      case '2':
        return numUnits === 2 && isSm2Or4;
      case '3':
        return numUnits === 3 && isSm2Or4;
      case '4':
        return numUnits === 2 && isSm5;
      default:
        return false;
    }
  };

  // E.g. a stop sign "2/4" means that it covers any composition in the
  // range from 2 to 4, i.e., 2, 3 or 4.
  if (stopSignText.includes('/')) {
    const [lowerLimit, upperLimit] = stopSignText.split('/').map(Number);
    for (let i = lowerLimit; i <= upperLimit; i++) {
      if (isApplicable(i.toString(10))) return true;
    }
    return false;
  }

  return isApplicable(stopSignText);
};

const isLongDistanceStopSignApplicable = (
  stopSignText: string,
  trainLength: number
): boolean => {
  if (stopSignText === 'P') return true;

  const metersPerUnit = 100;

  // E.g. a stop sign "1/2" applies to a train with a total length between 100 to 200 meters
  if (stopSignText.includes('/')) {
    const [lowerLimit, upperLimit] = stopSignText
      .split('/')
      .map((n) => Number(n) * metersPerUnit);
    return trainLength >= lowerLimit && trainLength <= upperLimit;
  }

  const upperLimit = Number(stopSignText) * metersPerUnit;
  return trainLength <= upperLimit;
};

const getMaxTrainLengthLimitFromStopSign = (stopSignText: string) => {
  // P stop sign is always applicable no matter the train length / composition
  if (stopSignText === 'P') return Infinity;
  if (stopSignText.includes('/')) {
    const limits = stopSignText.split('/');
    const upperLimit = Number(limits[1]) * 100;
    return upperLimit;
  }
  return Number(stopSignText) * 100;
};

/**
 * Gets the exact train stopping position at the given track of the given station.
 */
const getTrainStoppingPositionOnTrack = (
  stationShortCode: string,
  commercialTrack: string,
  trainDirection: TrainDirection | null | undefined,
  isCommuterLine: boolean,
  journeySection: Pick<JourneySection, 'wagons' | 'totalLength'>
) => {
  const stationTrackNumberKey = `${stationShortCode} L${commercialTrack}`;

  const stationPlatformTrackSignData =
    trackSignByStationPlatformId[stationTrackNumberKey];

  if (!stationPlatformTrackSignData?.trackCoords) return null;

  const trackCoords = stationPlatformTrackSignData.trackCoords;

  // Special case: stations like Helsinki (HKI) and Turku Satama (TUS) have no
  // track signs at all - on such platforms trains align themselves either at the
  // start (HKI) or at the end of the platform (others)
  if (!stationPlatformTrackSignData.R && !stationPlatformTrackSignData.P) {
    const isHki = stationShortCode === 'HKI';
    return {
      headPos: isHki ? trackCoords[0] : trackCoords[trackCoords.length - 1],
      headFirst: isHki
        ? trainDirection === TrainDirection.Decreasing
        : trainDirection === TrainDirection.Increasing,
      trackCoords: isHki ? trackCoords : trackCoords.toReversed(),
    };
  }

  const stopSignsForTrainType = isCommuterLine
    ? stationPlatformTrackSignData.R
    : stationPlatformTrackSignData.P;
  if (stopSignsForTrainType == null) return null;

  const stopSignsForTrainDirection =
    stopSignsForTrainType[
      trainDirection === TrainDirection.Increasing ? 'i' : 'd'
    ];
  if (stopSignsForTrainDirection == null) return null;

  const relevantStopSigns = sortBy(
    Object.entries(stopSignsForTrainDirection).filter(([k, _]) =>
      isTrainStopSignApplicable(k, journeySection, isCommuterLine)
    ),
    (sign) => getMaxTrainLengthLimitFromStopSign(sign[0])
  );

  if (relevantStopSigns.length == 0) return null;
  const mostRelevantStopSign = relevantStopSigns[0];

  return {
    headPos: mostRelevantStopSign[1].pos,
    headFirst: true,
    trackCoords:
      trainDirection === TrainDirection.Increasing
        ? stationPlatformTrackSignData.trackCoords.toReversed()
        : stationPlatformTrackSignData.trackCoords,
  };
};

export default getTrainStoppingPositionOnTrack;
