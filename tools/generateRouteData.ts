#!/usr/bin/env node

import fs from 'fs';
import { writeFile } from 'fs/promises';
import { parseArgs } from 'util';

import distance from '@turf/distance';
import { UndirectedGraph } from 'data-structure-typed';
import { parse } from 'date-fns';
import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';
import GeoJSON from 'geojson';

import { TimeTableRowType } from '../src/graphql/generated/digitraffic/graphql';
import { isDefined } from '../src/utils/common';
import { getTrainRoutePatternId } from '../src/utils/train';

const INFRA_API_BASE_URL = 'https://rata.digitraffic.fi/infra-api/0.8';
const RATA_API_BASE_URL = 'https://rata.digitraffic.fi/api/v1';

type Train = {
  trainNumber: number;
  departureDate: string;
  operatorShortCode: string;
  operatorUICCode: number;
  trainType: string;
  trainCategory: string;
  commuterLineID: string;
  timeTableRows: TimeTableRow[];
};

type TimeTableRowBase = {
  stationShortCode: string;
  stationUICCode: number;
  countryCode: string;
  type: 'ARRIVAL' | 'DEPARTURE';
  scheduledTime: string;
};

type JourneySection = {
  beginTimeTableRow: TimeTableRowBase;
  endTimeTableRow: TimeTableRowBase;
};

type Composition = {
  trainNumber: number;
  departureDate: string;
  journeySections: JourneySection[];
};

type TimeTableRow = TimeTableRowBase & {
  trainStopping: boolean;
  commercialStop: boolean;
  commercialTrack: string;
  cancelled: boolean;
};

type Platform = {
  /**
   * Digitraffic Infra API object identifier
   */
  oid: string;
  /**
   * Track identifier in format "stationShortCode commercialTrackNumber" (e.g. "HKI 1")
   */
  trackId: string;
  geometry: GeoJSON.Position[][];
};

type Track = {
  /**
   * Digitraffic Infra API object identifier
   */
  oid: string;
  /**
   * Track identifier in format "stationShortCode commercialTrackNumber" (e.g. "HKI 1")
   */
  trackId: string;
  /**
   * Commercial track number (e.g. "1")
   */
  commercialTrack: string;
  geometry: GeoJSON.Position[][];
};

type TmTrack = {
  /**
   * Digitraffic Infra API object identifier
   */
  oid: string;
  geometry: GeoJSON.Position[][];
};

const getVertexName = (node: GeoJSON.Position): string => {
  return `${node[1]}_${node[0]}`;
};

function getPathEndpointAtEndpointLeg(
  graph: UndirectedGraph<GeoJSON.Position>,
  legTrack: Track
): GeoJSON.Position {
  const firstPoint = legTrack.geometry[0][0];
  const lastPoint = legTrack.geometry[0].at(-1);

  if (!firstPoint || !lastPoint) {
    throw new Error('Invalid platform geometry');
  }

  return graph.degreeOf(getVertexName(firstPoint)) === 1
    ? firstPoint
    : lastPoint;
}

function getShortestPath(
  allPathsData: GeoJSON.Feature<GeoJSON.MultiLineString, {}>,
  routeLegs: Track[]
): GeoJSON.Feature<GeoJSON.LineString, {}> | null {
  const graph = buildGraph(allPathsData);

  const startLeg = routeLegs[0];
  const endLeg = routeLegs.at(-1);

  if (!startLeg || !endLeg) {
    console.warn('Missing leg data');
    return null;
  }

  const startPoint = getPathEndpointAtEndpointLeg(graph, startLeg);
  const endPoint = getPathEndpointAtEndpointLeg(graph, endLeg);

  const findPathBetweenLegs = (
    fromPoint: GeoJSON.Position,
    toPoint: GeoJSON.Position
  ) => {
    const dijkstraResult = graph.dijkstra(
      getVertexName(fromPoint),
      getVertexName(toPoint),
      false,
      true
    );

    if (!dijkstraResult) {
      return null;
    }

    return dijkstraResult.minPath
      .map((vertex) => vertex.value)
      .filter((pos): pos is GeoJSON.Position => pos !== undefined);
  };

  let shortestPathCoordinates: GeoJSON.Position[];

  if (startLeg.trackId.split(' ')[0] === endLeg.trackId.split(' ')[0]) {
    // Special case: Circular route where start and end legs are at the same station

    // Define waypoints to ensure we follow the complete circular path
    const waypoints = [0.25, 0.5, 0.75].map((ratio) => {
      const leg = routeLegs[Math.floor(routeLegs.length * ratio)];
      // Get the middle coordinate of this leg
      return leg.geometry[0][Math.floor(leg.geometry[0].length / 2)];
    });

    // Add start and end points to create the full sequence
    const allPathPoints = [startPoint, ...waypoints, endPoint];

    // Find paths between each consecutive pair of points
    const shortestPathSegments: GeoJSON.Position[][] = [];
    for (let i = 0; i < allPathPoints.length - 1; i++) {
      const segment = findPathBetweenLegs(
        allPathPoints[i],
        allPathPoints[i + 1]
      );
      if (!segment) {
        console.warn(`Failed to find path segment ${i} for circular route`);
        return null;
      }
      shortestPathSegments.push(segment);
    }

    // Combine all segments, removing duplicate connection points
    shortestPathCoordinates = shortestPathSegments.reduce(
      (fullPath, segment, index) =>
        index === 0 ? segment : [...fullPath, ...segment.slice(1)],
      [] as GeoJSON.Position[]
    );
  } else {
    // Basic case
    const shortestPath = findPathBetweenLegs(startPoint, endPoint);
    if (!shortestPath) {
      console.warn('Failed to find path between legs');
      return null;
    }
    shortestPathCoordinates = shortestPath;
  }

  const shortestPathGeoJson: GeoJSON.Feature<GeoJSON.LineString, {}> = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: shortestPathCoordinates,
    },
  };

  return shortestPathGeoJson;
}

function buildGraph(
  allPathsData: GeoJSON.Feature<GeoJSON.MultiLineString, {}>
) {
  const graph = new UndirectedGraph<GeoJSON.Position>();
  for (const line of allPathsData.geometry.coordinates) {
    for (let i = 0; i < line.length - 1; i++) {
      const startNode = line[i];
      const endNode = line[i + 1];

      const startVertexName = getVertexName(startNode);
      const endVertexName = getVertexName(endNode);

      graph.addVertex(startVertexName, startNode);
      graph.addVertex(endVertexName, endNode);

      const weight = distance(startNode, endNode, { units: 'kilometers' });
      graph.addEdge(startVertexName, endVertexName, weight);
    }
  }
  return graph;
}

function getTrackId(timeTableRow: {
  stationShortCode: string;
  commercialTrack: string;
}): string {
  return `${timeTableRow.stationShortCode} ${timeTableRow.commercialTrack}`;
}

function getRoutePatternId(train: Train) {
  return getTrainRoutePatternId({
    trainType: {
      name: train.trainType,
      trainCategory: { name: train.trainCategory },
    },
    timeTableRows: train.timeTableRows.map((r) => ({
      station: { shortCode: r.stationShortCode, name: '' },
      commercialTrack: r.commercialTrack,
      trainStopping: r.trainStopping,
      scheduledTime: r.scheduledTime,
      cancelled: r.cancelled,
      type: r.type as TimeTableRowType,
    })),
  });
}

async function generateRouteDataForJourneySection(
  train: Train,
  journeySection: JourneySection,
  trackDataById: Partial<Record<string, Track>>,
  timeTableRowsWithStopping: TimeTableRowBase[],
  startOfDayIsoString: string,
  fetchOptions?: RequestInit
) {
  const findTimeTableRowIndex = (
    rows: TimeTableRowBase[],
    targetRow: TimeTableRowBase
  ) =>
    rows.findIndex(
      (r) =>
        r.type === targetRow.type && r.scheduledTime === targetRow.scheduledTime
    );

  const startIdx = findTimeTableRowIndex(
    train.timeTableRows,
    journeySection.beginTimeTableRow
  );
  const endIdx = findTimeTableRowIndex(
    train.timeTableRows,
    journeySection.endTimeTableRow
  );
  const timeTableRowsForSection = train.timeTableRows.slice(
    startIdx,
    endIdx + 1
  );

  const trainRouteTrackIds = Array.from(
    new Set(
      timeTableRowsForSection
        .filter((r) => r.commercialTrack)
        .map((r) => getTrackId(r))
    )
  );

  trainRouteTrackIds.forEach((trackId) => {
    if (!trackDataById[trackId]) {
      console.warn('Missing track data for track', trackId);
    }
  });

  const trainRouteLegs = trainRouteTrackIds
    .map((trackId) => trackDataById[trackId])
    .filter(isDefined);

  console.log(
    `Train ${train.trainNumber} route legs`,
    `${journeySection.beginTimeTableRow.stationShortCode} - ${journeySection.endTimeTableRow.stationShortCode}:`,
    trainRouteLegs.map(
      (p, i) => `${i}: ${p.oid} (${p.trackId}, track ${p.commercialTrack})`
    )
  );

  if (!trainRouteLegs?.length || trainRouteLegs.length < 2) {
    throw new Error('Not enough legs to create route');
  }

  const trainRouteOids = trainRouteLegs.map((r) => r.oid);

  const url = new URL(`${INFRA_API_BASE_URL}/reitit/kaikki`);

  url.pathname += `/${trainRouteOids[0]}/${trainRouteOids
    .slice(1, -1)
    .join(',')}/${trainRouteOids.at(-1)}.geojson`;

  url.searchParams.set('propertyName', 'geometria');
  url.searchParams.set('srsName', 'crs:84');
  url.searchParams.set('time', `${startOfDayIsoString}/${startOfDayIsoString}`);
  url.searchParams.set('vaihdekasittely', 'eirajoituksia');

  const response = await fetch(url.toString(), fetchOptions);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch route data (${url.toString()}): ${
        response.statusText
      } ${await response.text()}`
    );
  }

  const allPathsData: GeoJSON.Feature<GeoJSON.MultiLineString, {}> =
    await response.json();

  const shortestPathData = getShortestPath(allPathsData, trainRouteLegs);
  if (!shortestPathData) {
    throw new Error('Failed to get shortest path for train');
  }

  const properties = {
    startTimeTableRowIndex: findTimeTableRowIndex(
      timeTableRowsWithStopping,
      journeySection.beginTimeTableRow
    ),
    endTimeTableRowIndex: findTimeTableRowIndex(
      timeTableRowsWithStopping,
      journeySection.endTimeTableRow
    ),
  };

  return {
    allPaths: {
      ...allPathsData,
      properties,
    },
    shortestPath: {
      ...shortestPathData,
      properties,
    },
  };
}

async function processTrainRoute(
  train: Train,
  composition: Composition,
  trackDataById: Partial<Record<string, Track>>,
  skipFetchingTrainIfRouteExists: boolean,
  startOfDayIsoString: string,
  outputPath: string,
  fetchOptions?: RequestInit
): Promise<void> {
  const trainRoutePatternId = getRoutePatternId(train);
  const filePath = `${outputPath}/${trainRoutePatternId}.json`;

  if (fs.existsSync(filePath) && skipFetchingTrainIfRouteExists) {
    console.log(
      `Route ${trainRoutePatternId} for train ${train.trainNumber} already exists`
    );
    return;
  }

  console.log(`Fetching route for train ${train.trainNumber}`);

  const timeTableRowsWithStopping = train.timeTableRows.filter(
    (r) => r.trainStopping
  );

  try {
    const pathsPerSection = await Promise.all(
      composition.journeySections.map((section) =>
        generateRouteDataForJourneySection(
          train,
          section,
          trackDataById,
          timeTableRowsWithStopping,
          startOfDayIsoString,
          fetchOptions
        )
      )
    );

    let shortestPathGeoJSON:
      | GeoJSON.FeatureCollection<GeoJSON.LineString, {}>
      | GeoJSON.Feature<GeoJSON.LineString, {}>;
    let allPathsGeoJSON:
      | GeoJSON.FeatureCollection<GeoJSON.MultiLineString, {}>
      | GeoJSON.Feature<GeoJSON.MultiLineString, {}>;

    if (pathsPerSection.length === 1) {
      // Use the single feature directly if there is only one section
      shortestPathGeoJSON = {
        ...pathsPerSection[0].shortestPath,
        properties: {},
      };
      allPathsGeoJSON = { ...pathsPerSection[0].allPaths, properties: {} };
    } else {
      // Otherwise create a FeatureCollection
      shortestPathGeoJSON = {
        type: 'FeatureCollection',
        features: pathsPerSection.map((f) => f.shortestPath),
      };

      allPathsGeoJSON = {
        type: 'FeatureCollection',
        features: pathsPerSection.map((f) => f.allPaths),
      };
    }

    await writeFile(filePath, JSON.stringify(shortestPathGeoJSON));
    await writeFile(
      `${outputPath}/${trainRoutePatternId}_all.json`,
      JSON.stringify(allPathsGeoJSON)
    );
    console.log(`Route for train ${train.trainNumber} saved to ${filePath}`);
  } catch (e) {
    console.error(`Fetching route for train ${train.trainNumber} failed`, e);
  }
}

interface PlatformResponse {
  [oid: string]: [
    {
      tunnus: string;
      geometria: GeoJSON.Position[][];
    }
  ];
}

async function fetchPlatformData(
  startOfDayIsoString: string,
  fetchOptions?: RequestInit
): Promise<Partial<Record<string, Platform>>> {
  const url = new URL(`${INFRA_API_BASE_URL}/laiturit.json`);
  url.searchParams.set('propertyName', 'tunnus,geometria');
  url.searchParams.set('srsName', 'crs:84');
  url.searchParams.set('time', `${startOfDayIsoString}/${startOfDayIsoString}`);

  const response = await fetch(url.toString(), fetchOptions);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const platforms: PlatformResponse = await response.json();

  return Object.entries(platforms).reduce<Partial<Record<string, Platform>>>(
    (acc, [oid, [{ tunnus, geometria }]]) => {
      const trackId = tunnus.replace(/Laituri (.*) L(\S*).*/, '$1 $2');
      acc[trackId] = { oid, geometry: geometria, trackId: trackId };
      return acc;
    },
    {} as Partial<Record<string, Platform>>
  );
}

interface TmTrackResponse {
  [oid: string]: [
    {
      tunnus: string;
      raiteet: string[];
      geometria: GeoJSON.Position[][];
    }
  ];
}

async function fetchTmTrackData(
  startOfDayIsoString: string,
  fetchOptions?: RequestInit
): Promise<Partial<Record<string, TmTrack>>> {
  const url = new URL(`${INFRA_API_BASE_URL}/lhraiteet.json`);
  url.searchParams.set('propertyName', 'geometria,tunnus,raiteet');
  url.searchParams.set('srsName', 'crs:84');
  url.searchParams.set('time', `${startOfDayIsoString}/${startOfDayIsoString}`);

  const response = await fetch(url.toString(), fetchOptions);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const tracks: TmTrackResponse = await response.json();

  return Object.entries(tracks).reduce<Partial<Record<string, TmTrack>>>(
    (acc, [oid, [{ tunnus, raiteet, geometria }]]) => {
      acc[`${raiteet[0]} ${tunnus}`] = {
        oid,
        geometry: geometria,
      };
      return acc;
    },
    {} as Partial<Record<string, TmTrack>>
  );
}

interface TrackResponse {
  [oid: string]: [
    {
      tunnus: string;
      kaupallinenNumero?: string;
    }
  ];
}

async function fetchTrackData(
  startOfDayIsoString: string,
  fetchOptions?: RequestInit
): Promise<Partial<Record<string, Track>>> {
  const url = new URL(`${INFRA_API_BASE_URL}/raiteet.json`);
  url.searchParams.set('propertyName', 'geometria,kaupallinenNumero,tunnus');
  url.searchParams.set('srsName', 'crs:84');
  url.searchParams.set('time', `${startOfDayIsoString}/${startOfDayIsoString}`);

  const response = await fetch(url.toString(), fetchOptions);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const platforms = await fetchPlatformData(startOfDayIsoString, fetchOptions);
  const platformTracks = Object.values(platforms).reduce<
    Partial<Record<string, Track>>
  >((acc, platform) => {
    if (platform) {
      acc[platform.trackId] = {
        oid: platform.oid,
        trackId: platform.trackId,
        commercialTrack: platform.trackId.split(' ')[1],
        geometry: platform.geometry,
      };
    }

    return acc;
  }, {} as Partial<Record<string, Track>>);

  const infraTracks: TrackResponse = await response.json();
  const tmTracks = await fetchTmTrackData(startOfDayIsoString, fetchOptions);
  const tracks = Object.entries(infraTracks).reduce<
    Partial<Record<string, Track>>
  >((acc, [oid, [{ tunnus, kaupallinenNumero }]]) => {
    const [stationCode, trackNumber] = tunnus.split(' ');
    // Note: we use TmTrack OID instead of Track OID because TmTrack is more accurate
    // when performing route search using Digitraffic Infra API
    const tmTrack = tmTracks[`${oid} ${trackNumber}`];

    if (!tmTrack || !kaupallinenNumero) return acc;

    // Add main track entry
    acc[`${stationCode} ${kaupallinenNumero}`] = {
      oid: tmTrack.oid,
      trackId: tunnus,
      commercialTrack: kaupallinenNumero,
      geometry: tmTrack.geometry,
    };

    // Some station tracks can be referenced in two different ways:
    // 1. Simple track number (e.g., "Kempele 2")
    // 2. Three-digit format where station prefix + track number (e.g., "Kempele 772")
    // Both formats refer to the same physical track and need to be handled equivalently
    const alternativeTrackNumber = kaupallinenNumero.at(-1);
    if (
      trackNumber === kaupallinenNumero &&
      kaupallinenNumero.length === 3 &&
      alternativeTrackNumber &&
      !acc[`${stationCode} ${alternativeTrackNumber}`]
    ) {
      acc[`${stationCode} ${alternativeTrackNumber}`] = {
        oid: tmTrack.oid,
        trackId: tunnus,
        commercialTrack: alternativeTrackNumber,
        geometry: tmTrack.geometry,
      };
    }

    return acc;
  }, {} as Partial<Record<string, Track>>);

  return { ...tracks, ...platformTracks };
}

async function fetchTrains(
  dateString: string,
  fetchOptions?: RequestInit
): Promise<Train[]> {
  const response = await fetch(
    `${RATA_API_BASE_URL}/trains/${dateString}`,
    fetchOptions
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch trains: ${response.statusText}`);
  }

  return await response.json();
}

async function fetchCompositions(
  dateString: string,
  fetchOptions?: RequestInit
): Promise<Record<number, Composition>> {
  const response = await fetch(
    `${RATA_API_BASE_URL}/compositions/${dateString}`,
    fetchOptions
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch compositions: ${response.statusText}`);
  }

  const compositions: Composition[] = await response.json();
  return compositions.reduce((acc, composition) => {
    acc[composition.trainNumber] = composition;
    return acc;
  }, {} as Record<number, Composition>);
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchAndSaveData({
  date,
  shouldFetchTrain,
  skipFetchingTrainIfRouteExists,
  batchSize,
  delayInMsBetweenBatches,
  outputPath,
  fetchOptions = {},
}: {
  date: Date;
  shouldFetchTrain: (train: Train) => boolean;
  skipFetchingTrainIfRouteExists: boolean;
  batchSize: number;
  delayInMsBetweenBatches?: number;
  outputPath: string;
  fetchOptions?: RequestInit;
}): Promise<void> {
  const dateUtcIsoString = formatInTimeZone(
    date,
    'UTC',
    "yyyy-MM-dd'T'HH:mm:ss'Z'"
  );
  const dateString = formatInTimeZone(date, 'Europe/Helsinki', 'yyyy-MM-dd');

  console.info('Fetching data for date', dateString, dateUtcIsoString);

  try {
    const [trackDataById, trains, compositions] = await Promise.all([
      fetchTrackData(dateUtcIsoString, fetchOptions),
      fetchTrains(dateString, fetchOptions).then((trains) =>
        trains.filter(shouldFetchTrain)
      ),
      fetchCompositions(dateString, fetchOptions),
    ]);

    console.info(`Processing ${trains.length} trains...`);

    const allResults: PromiseSettledResult<void>[] = [];

    for (let i = 0; i < trains.length; i += batchSize) {
      const batch = trains.slice(i, i + batchSize);
      console.info(
        `Processing batch ${i / batchSize + 1} of ${Math.ceil(
          trains.length / batchSize
        )}`
      );
      const batchResults = await Promise.allSettled(
        batch.map((train) =>
          processTrainRoute(
            train,
            compositions[train.trainNumber],
            trackDataById,
            skipFetchingTrainIfRouteExists,
            dateUtcIsoString,
            outputPath,
            fetchOptions
          )
        )
      );
      allResults.push(...batchResults);
      if (delayInMsBetweenBatches) {
        await sleep(delayInMsBetweenBatches);
      }
    }

    const failureCount = allResults.filter(
      (r) => r.status === 'rejected'
    ).length;
    if (failureCount) {
      console.error(`Failed to process ${failureCount} trains`);
    }
  } catch (error) {
    console.error('Failed to fetch and save data:', error);
    throw error;
  }
}

const { values } = parseArgs({
  options: {
    output: {
      type: 'string',
      short: 'o',
      default: 'public/routes',
    },
    date: {
      type: 'string',
      short: 'd',
      default: formatInTimeZone(new Date(), 'Europe/Helsinki', 'yyyy-MM-dd'),
    },
    'overwrite-if-exists': {
      type: 'boolean',
      short: 'f',
      default: true,
    },
    'batch-size': {
      type: 'string',
      short: 'b',
      default: '5',
    },
    'wait-after-batch': {
      type: 'string',
      short: 'w',
      default: '0',
    },
    'train-number': {
      type: 'string',
      multiple: true,
      default: [],
    },
    'train-category': {
      type: 'string',
      multiple: true,
      // Only interested in commercial trains
      default: ['Long-distance', 'Commuter'],
    },
  },
});
console.log('Generating route data with arguments', values);

fetchAndSaveData({
  date: fromZonedTime(
    parse(values.date, 'yyyy-MM-dd', new Date()),
    'Europe/Helsinki'
  ),
  shouldFetchTrain: (train) => {
    if (
      values['train-category'].length > 0 &&
      !values['train-category'].includes(train.trainCategory)
    ) {
      return false;
    }

    if (
      values['train-number'].length > 0 &&
      !values['train-number'].includes(train.trainNumber.toString())
    ) {
      return false;
    }

    return true;
  },
  skipFetchingTrainIfRouteExists: !values['overwrite-if-exists'],
  batchSize: Number.parseInt(values['batch-size']),
  // See rate limits at https://www.digitraffic.fi/en/support/instructions/#restricting-requests
  delayInMsBetweenBatches: Number.parseInt(values['wait-after-batch']),
  outputPath: values.output,
  fetchOptions: {
    headers: {
      'Digitraffic-User': 'Junaan.fi-Static-Data-Extractor',
    },
  },
});
