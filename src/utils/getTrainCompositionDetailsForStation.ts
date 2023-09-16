import { orderBy } from 'lodash';

import { TrainDetailsFragment, Wagon } from '../graphql/generated/digitraffic';

import getTrainJourneySectionForStation from './getTrainJourneySectionForStation';

type DiffStatus = 'unchanged' | 'removed' | 'added';

type DiffElement<T> = {
  element: T;
  status: DiffStatus;
};

type KeyOrStringOrNull<K> = K | string | null;

/**
 * Returns the difference between two sequences in terms of the status of each
 * element between the sequences being "added", "removed" or "unchanged" when
 * comparing the elements of second sequence to the first sequence.
 * @example
 * // returns
 * // [
 * //   { element: 'A', status: 'added' },
 * //   { element: 'B', status: 'unchanged' },
 * //   { element: 'C', status: 'unchanged' },
 * //   { element: 'D', status: 'unchanged' },
 * //   { element: 'E', status: 'unchanged' },
 * //   { element: 'F', status: 'added' }
 * // ]
 * diff(['B', 'C', 'D', 'E'], ['A', 'B', 'C', 'D', 'E', 'F'], (a) => a)
 * @example
 * // returns
 * // [
 * //   { element: 'A', status: 'removed' },
 * //   { element: 'B', status: 'unchanged' },
 * //   { element: 'C', status: 'added' },
 * //   { element: 'D', status: 'removed' },
 * //   { element: 'E', status: 'unchanged' },
 * //   { element: 'B', status: 'removed' },
 * //   { element: 'A', status: 'unchanged' }
 * // ]
 * diff(['A', 'B', 'D', 'E', 'B', 'A'], ['B', 'C', 'E', 'A'], (a) => a)
 * @example
 * // returns
 * [
 *   { element: 'C', status: 'added' },
 *   { element: 'A', status: 'unchanged' },
 *   { element: 'B', status: 'unchanged' },
 *   { element: 'A', status: 'added' },
 *   { element: 'B', status: 'added' }
 * ]
 * diff(['A', 'B'], ['C', 'A', 'B', 'A', 'B'], (a) => a)
 */
function diff<T, K extends keyof T>(
  seq1: T[],
  seq2: T[],
  selector: (x: T) => KeyOrStringOrNull<K>
): DiffElement<T>[] {
  const indices = lcs(seq1, seq2, selector);
  return computeDelta(indices, seq1, seq2, selector);
}

/**
 * Computes the delta (or changes) between two sequences.
 *
 * @param indices - Indices representing the longest common subsequence between the sequences.
 * @param X - The first sequence.
 * @param Y - The second sequence.
 * @param selector - A function to select a key or property from the elements for comparison.
 * @returns An array representing the differences (or changes) between the sequences.
 */
function computeDelta<T, K extends keyof T>(
  indices: number[],
  X: T[],
  Y: T[],
  selector: (x: T) => KeyOrStringOrNull<K>
): DiffElement<T>[] {
  let i = 0; // Current index in X
  let j = 0; // Current index in Y
  const delta: DiffElement<T>[] = [];

  // Iterate over the indices representing the longest common subsequence
  indices.forEach((idx) => {
    const c = X[idx]; // Current element in X
    // Find the corresponding index in Y for the current element
    const j2 = Y.findIndex((el, y) => y >= j && selector(el) === selector(c));

    // Add 'added' elements from Y until the current element corresponding index in Y
    for (let y = j; y < j2; y++) {
      delta.push({
        element: Y[y],
        status: 'added',
      });
    }
    j = j2 + 1;

    // Add 'removed' elements from X until the current common element index in X
    for (let x = i; x < idx; x++) {
      delta.push({
        element: X[x],
        status: 'removed',
      });
    }
    i = idx + 1;

    // Add the 'unchanged' element
    delta.push({
      element: Y[j2],
      status: 'unchanged',
    });
  });

  // Add remaining 'added' elements from Y
  for (let y = j; y < Y.length; y++) {
    delta.push({
      element: Y[y],
      status: 'added',
    });
  }

  // Add remaining 'removed' elements from X
  for (let x = i; x < X.length; x++) {
    delta.push({
      element: X[x],
      status: 'removed',
    });
  }

  return delta;
}

/**
 * Finds the longest common subsequence (LCS).
 * @returns The longest common subsequence as indices of the first sequence.
 */
function lcs<T, K extends keyof T>(
  a: T[],
  b: T[],
  selector: (x: T) => KeyOrStringOrNull<K>
): number[] {
  let m = a.length,
    n = b.length,
    C: number[][] = [],
    i: number,
    j: number;
  for (i = 0; i <= m; i++) C.push([0]);
  for (j = 0; j < n; j++) C[0].push(0);
  for (i = 0; i < m; i++)
    for (j = 0; j < n; j++)
      C[i + 1][j + 1] =
        selector(a[i]) === selector(b[j])
          ? C[i][j] + 1
          : Math.max(C[i + 1][j], C[i][j + 1]);
  return (function bt(i: number, j: number): number[] {
    if (i * j === 0) {
      return [];
    }
    if (selector(a[i - 1]) === selector(b[j - 1])) {
      return [...bt(i - 1, j - 1), i - 1];
    }
    return C[i][j - 1] > C[i - 1][j] ? bt(i, j - 1) : bt(i - 1, j);
  })(m, n);
}

type JourneySection = NonNullable<
  NonNullable<
    NonNullable<
      NonNullable<TrainDetailsFragment['compositions']>[number]
    >['journeySections']
  >[number]
>;

function isTrainCompositionReversed(
  sectionBefore: JourneySection,
  sectionAfter: JourneySection
) {
  const locomotivesBefore = orderBy(
    sectionBefore.locomotives,
    (l) => l?.location,
    'asc'
  );
  const locomotivesAfter = orderBy(
    sectionAfter.locomotives,
    (l) => l?.location,
    'asc'
  );

  if (!locomotivesBefore || !locomotivesAfter) return false;

  return locomotivesBefore[0]?.location !== locomotivesAfter[0]?.location;
}

type WagonCompositionDetails = {
  wagon?: Wagon | null;
  status: DiffStatus;
};

const getWagonLoc = (w?: Wagon | null) => w?.location ?? w?.salesNumber;
const getWagonNo = (w?: Wagon | null) =>
  w?.vehicleNumber ?? w?.salesNumber.toString() ?? null;

export default function getTrainCompositionDetailsForStation(
  station: string,
  train: TrainDetailsFragment
): WagonCompositionDetails[] | null {
  const sectionBefore = getTrainJourneySectionForStation(train, station, 'end');
  const sectionAfter = getTrainJourneySectionForStation(
    train,
    station,
    'start'
  );

  if (!sectionBefore || !sectionAfter) return null;

  const wagonsBefore = orderBy(sectionBefore.wagons, getWagonLoc, 'desc');
  const wagonsAfter = orderBy(sectionAfter.wagons, getWagonLoc, 'desc');

  if (wagonsBefore.length === 0 || wagonsAfter.length === 0) return null;

  const isReversed = isTrainCompositionReversed(sectionBefore, sectionAfter);
  if (isReversed) {
    wagonsAfter.reverse();
  }

  const wagonDiff = diff(wagonsBefore, wagonsAfter, getWagonNo);
  if (!isReversed) {
    wagonDiff.reverse();
  }

  return wagonDiff.map((w) => ({
    wagon: w.element,
    status: w.status,
  }));
}
