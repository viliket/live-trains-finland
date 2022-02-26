import { concat, differenceBy, orderBy } from 'lodash';

import { TrainDetailsFragment, Wagon } from '../graphql/generated/digitraffic';

function longestCommonSubsequence<T>(
  a: T[],
  b: T[],
  selector: (x: T) => keyof T | string
) {
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
};

export default function getTrainCompositionDetailsForStation(
  stationName: string,
  train: TrainDetailsFragment
): WagonCompositionDetails[] | null {
  // Note that train has only single composition for specific depature date
  const composition = train.compositions?.[0];

  const prevSection = composition?.journeySections?.find((s) =>
    s?.endTimeTableRow?.station.name
      .toLowerCase()
      .includes(stationName.toLowerCase())
  );

  let prevWagons = orderBy(
    prevSection?.wagons,
    (w) => w?.salesNumber || w?.location,
    'desc'
  );

  const nextSection = composition?.journeySections?.find((s) =>
    s?.startTimeTableRow?.station.name
      .toLowerCase()
      .includes(stationName.toLowerCase())
  );

  let nextWagons = orderBy(
    nextSection?.wagons,
    (w) => w?.salesNumber || w?.location,
    'desc'
  );

  if (!prevWagons.length || !nextWagons.length) return null;

  const commonWagons = longestCommonSubsequence(
    prevWagons as Wagon[],
    nextWagons as Wagon[],
    (w: Wagon) => w.vehicleNumber ?? w.salesNumber.toString()
  );

  const removedWagons = differenceBy(
    prevWagons,
    commonWagons,
    (w) => w?.vehicleNumber ?? w?.salesNumber.toString()
  ).map(
    (w): WagonCompositionDetails => ({
      status: 'removed',
      wagon: w,
    })
  );

  const addedWagons = differenceBy(
    nextWagons,
    commonWagons,
    (w) => w?.vehicleNumber ?? w?.salesNumber.toString()
  ).map(
    (w): WagonCompositionDetails => ({
      status: 'added',
      wagon: w,
    })
  );

  const allWagons = concat(
    commonWagons.map(
      (w): WagonCompositionDetails => ({ status: 'unchanged', wagon: w })
    ),
    removedWagons,
    addedWagons
  );

  return orderBy(allWagons, (w) => w.wagon?.location, 'desc');
}
