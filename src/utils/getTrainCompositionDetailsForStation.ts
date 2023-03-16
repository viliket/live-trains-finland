import { concat, differenceBy, orderBy } from 'lodash';

import { TrainDetailsFragment, Wagon } from '../graphql/generated/digitraffic';
import getTrainJourneySectionForStation from './getTrainJourneySectionForStation';

/**
 * Finds the longest common subsequence (LCS).
 */
function lcs<T>(a: T[], b: T[], selector: (x: T) => keyof T | string | null) {
  let m = a.length,
    n = b.length,
    C = [],
    i,
    j;
  for (i = 0; i <= m; i++) C.push([0]);
  for (j = 0; j < n; j++) C[0].push(0);
  for (i = 0; i < m; i++)
    for (j = 0; j < n; j++)
      C[i + 1][j + 1] =
        selector(a[i]) === selector(b[j])
          ? C[i][j] + 1
          : Math.max(C[i + 1][j], C[i][j + 1]);
  return (function bt(i: number, j: number): T[] {
    if (i * j === 0) {
      return [];
    }
    if (selector(a[i - 1]) === selector(b[j - 1])) {
      return [...bt(i - 1, j - 1), a[i - 1]];
    }
    return C[i][j - 1] > C[i - 1][j] ? bt(i, j - 1) : bt(i - 1, j);
  })(m, n);
}

type WagonStatus = 'unchanged' | 'removed' | 'added';

type WagonCompositionDetails = {
  wagon?: Wagon | null;
  status: WagonStatus;
  wagonLocInPrevComposition?: number;
};

const getWagonLoc = (w?: Wagon | null) => w?.location ?? w?.salesNumber;
const getWagonNo = (w?: Wagon | null) =>
  w?.vehicleNumber ?? w?.salesNumber.toString() ?? null;

export default function getTrainCompositionDetailsForStation(
  station: string,
  train: TrainDetailsFragment
): WagonCompositionDetails[] | null {
  const prevSection = getTrainJourneySectionForStation(train, station, 'end');
  let prevWagons = orderBy(prevSection?.wagons, getWagonLoc, 'desc');

  const nextSection = getTrainJourneySectionForStation(train, station, 'start');
  let nextWagons = orderBy(nextSection?.wagons, getWagonLoc, 'desc');

  if (!prevWagons.length || !nextWagons.length) return null;

  let commonWagons = lcs(nextWagons, prevWagons, getWagonNo);
  let commonWagonsReversed = lcs(nextWagons.reverse(), prevWagons, getWagonNo);
  let isDirectionReversed = false;
  if (commonWagonsReversed.length > commonWagons.length) {
    commonWagons = commonWagonsReversed;
    isDirectionReversed = true;
  }

  const removedWagons = differenceBy(prevWagons, commonWagons, getWagonNo).map(
    (w): WagonCompositionDetails => ({
      status: 'removed',
      wagon: w,
      wagonLocInPrevComposition: getWagonLoc(
        prevWagons.find((pw) => getWagonNo(pw) === getWagonNo(w))
      ),
    })
  );

  const addedWagons = differenceBy(nextWagons, commonWagons, getWagonNo).map(
    (w): WagonCompositionDetails => ({
      status: 'added',
      wagon: w,
    })
  );

  const allWagons = concat(
    commonWagons.map(
      (w): WagonCompositionDetails => ({
        status: 'unchanged',
        wagon: w,
        wagonLocInPrevComposition: getWagonLoc(
          prevWagons.find((pw) => getWagonNo(pw) === getWagonNo(w))
        ),
      })
    ),
    removedWagons,
    addedWagons
  );

  const sortOrder = !isDirectionReversed ? 'asc' : 'desc';

  return orderBy(
    allWagons,
    ['wagonLocInPrevComposition', 'wagon.location'],
    [sortOrder, sortOrder]
  );
}
