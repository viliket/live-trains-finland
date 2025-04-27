import { PaletteMode } from '@mui/material';
import {
  bearing,
  buffer,
  centroid,
  circle,
  combine,
  destination,
  distance,
  featureCollection,
  lineIntersect,
  lineSliceAlong,
  lineString,
  nearestPointOnLine,
  point,
} from '@turf/turf';
import { generateStyle, Options } from 'hsl-map-style';
import { orderBy } from 'lodash';
import { MapGeoJSONFeature, VectorSourceSpecification } from 'maplibre-gl';
import { MapRef } from 'react-map-gl/maplibre';

import { TrainByStationFragment } from '../graphql/generated/digitraffic/graphql';
import { TrainExtendedDetails } from '../types';
import { VehicleDetails } from '../types/vehicles';

import { isDefined } from './common';
import getTrainLatestDepartureTimeTableRowIndex from './getTrainLatestDepartureTimeTableRowIndex';
import { toRadians } from './math';

let canvas: HTMLCanvasElement;

type VehicleMarkerIconImageProps = {
  id: string;
  mapBearing: number;
  width?: number;
  height?: number;
  colorPrimary?: string;
  colorSecondary?: string;
  colorShadow?: string;
  drawText?: boolean;
};

export const getVehicleMarkerIconImage = ({
  id,
  mapBearing,
  width = 80,
  height = 80,
  colorPrimary = '#00A651',
  colorSecondary = '#eee',
  colorShadow = '#aaa',
  drawText = false,
}: VehicleMarkerIconImageProps) => {
  // Check whether we can generate an image from this icon ID
  if (!id.startsWith('vehiclemarker')) return;

  if (!canvas) {
    canvas = document.createElement('canvas');
  }

  canvas.width = width;
  canvas.height = height;

  // Extract details from the icon ID
  const idDetails = id.split('-');
  const route = idDetails[1];
  const heading = idDetails[2] !== 'null' ? parseInt(idDetails[2]) : null;

  // Get rendering context
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  // Clear canvas (as we are reusing existing)
  ctx.save();
  ctx.fillStyle = '#fff';
  ctx.clearRect(0, 0, width, height);

  // Prepare for drawing
  const radius = (width / 2) * 0.6;
  ctx.translate(width / 2, height / 2);

  // Draw base (circle)
  ctx.shadowColor = colorShadow;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.lineWidth = 4;
  ctx.strokeStyle = colorSecondary;
  ctx.fillStyle = colorPrimary;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.stroke();

  // Draw heading angle
  if (heading != null) {
    ctx.rotate(toRadians(heading));
    ctx.shadowColor = 'rgba(0, 0, 0, 0.05)';
    ctx.shadowBlur = 3;
    ctx.shadowOffsetY = -3;
    ctx.beginPath();
    ctx.fillStyle = colorSecondary;
    const height = 15;
    const width = 18;
    ctx.moveTo(0, 0 - radius - height);
    ctx.lineTo(0 - width / 2, 0 - radius);
    ctx.lineTo(0 + width / 2, 0 - radius);
    ctx.closePath();
    ctx.fill();
    ctx.rotate(toRadians(-heading));
  }

  if (drawText) {
    // Draw text (route)
    ctx.fillStyle = '#eee';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.rotate(toRadians(mapBearing));
    ctx.fillText(route, 0, 0);
  }

  ctx.restore();

  // Extract data
  return canvas.toDataURL();
};

export function getVehiclesGeoJsonData(
  vehicles: Record<number, VehicleDetails>,
  interpolatedPositions: Record<number, GeoJSON.Position>
): GeoJSON.FeatureCollection<GeoJSON.Geometry> {
  return {
    type: 'FeatureCollection',
    features: Object.entries(vehicles).map(([id, message], idx) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates:
          interpolatedPositions[Number.parseInt(id)] ?? message.position,
      },
      properties: {
        title: 'Car',
        'marker-symbol': 'car',
        idx,
        vehicleId: id,
        vehicleNumber: message.routeShortName
          ? message.routeShortName
          : message.jrn?.toString() ?? '?',
        bearing: message.heading ?? null,
      },
    })),
  };
}

const baseAttribution =
  '<a href="https://digitransit.fi/" target="_blank">&copy; Digitransit</a> ' +
  '<a href="https://www.openmaptiles.org/" target="_blank">&copy; OpenMapTiles</a> ' +
  '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap</a>';

const generateMapStyle = (options?: Options) => {
  let mapStyle = generateStyle({
    ...options,
    sourcesUrl: 'https://cdn.digitransit.fi/',
    queryParams: [
      {
        url: 'https://cdn.digitransit.fi/',
        name: 'digitransit-subscription-key',
        value: process.env.NEXT_PUBLIC_DIGITRANSIT_SUBSCRIPTION_KEY ?? '',
      },
    ],
  });
  (mapStyle.sources['vector'] as VectorSourceSpecification).attribution =
    baseAttribution;

  if (options?.components?.greyscale?.enabled) {
    // Patch wrong fill color on the road_bridge_area layer
    // due to https://github.com/HSLdevcom/hsl-map-style/blob/master/style/hsl-map-theme-greyscale.json
    // not having the style of the base theme overridden.
    mapStyle = {
      ...mapStyle,
      layers: mapStyle.layers.map((layer) => {
        if (layer.id == 'road_bridge_area' && layer.type === 'fill') {
          return {
            ...layer,
            paint: {
              ...layer.paint,
              'fill-color': '#0a0a0a',
            },
          };
        } else {
          return layer;
        }
      }),
    };
  }

  return mapStyle;
};

function getRasterMapSource(isDarkMode: boolean, languageCode: string) {
  if (isDarkMode) return 'hsl-map-greyscale';
  if (languageCode == 'sv') return 'hsl-map-sv';
  if (languageCode == 'en') return 'hsl-map-en';
  return 'hsl-map';
}

const getRasterMapStyle = (
  isDarkMode: boolean,
  languageCode: string
): maplibregl.StyleSpecification => ({
  version: 8,
  sources: {
    'raster-tiles': {
      type: 'raster',
      tiles: [
        `https://cdn.digitransit.fi/map/v3/${getRasterMapSource(
          isDarkMode,
          languageCode
        )}/{z}/{x}/{y}.png`,
      ],
      tileSize: 512,
      attribution: baseAttribution,
    },
  },
  glyphs:
    'https://hslstoragestatic.azureedge.net/mapfonts/{fontstack}/{range}.pbf',
  layers: [
    {
      id: 'simple-tiles',
      type: 'raster',
      source: 'raster-tiles',
      minzoom: 0,
      maxzoom: 23,
    },
  ],
});

const mapStyleCache = new Map<string, maplibregl.StyleSpecification>();

export function getMapStyle(
  useVectorBaseTiles: boolean,
  mode: PaletteMode,
  languageCode: string
) {
  const cacheKey = `${useVectorBaseTiles}_${mode}_${languageCode}`;

  if (mapStyleCache.has(cacheKey)) {
    return mapStyleCache.get(cacheKey);
  }

  let mapStyle: maplibregl.StyleSpecification;

  if (useVectorBaseTiles) {
    mapStyle = generateMapStyle({
      components: {
        greyscale: {
          enabled: mode === 'dark',
        },
        text_en: {
          enabled: languageCode === 'en',
        },
        text_sv: {
          enabled: languageCode === 'sv',
        },
      },
    });
  } else {
    mapStyle = getRasterMapStyle(mode === 'dark', languageCode);
  }

  // Create empty base layers for dynamically changing the layer order
  // https://github.com/visgl/react-map-gl/issues/939#issuecomment-625290200
  for (let i = 0; i < 11; i++) {
    mapStyle.layers.push({
      id: 'z' + i,
      type: 'background',
      layout: { visibility: 'none' },
      paint: {},
    });
  }

  // Store the computed map style in the cache
  mapStyleCache.set(cacheKey, mapStyle);

  return mapStyle;
}

const WAGON_POLYGON_BUFFER_RADIUS_IN_METERS = 3;
const MAX_ACCEPTED_START_POINT_DISTANCE_TO_TRACK_IN_METERS = 50;

function getWagonSegmentPlacedAlongRail(
  track: GeoJSON.Feature<GeoJSON.MultiLineString | GeoJSON.LineString>,
  wagonLength: number,
  wagonStartPoint: GeoJSON.Position,
  readjustWagonStartPoint: boolean,
  placementDirection: 'forward' | 'backward' = 'backward'
): GeoJSON.Feature<GeoJSON.LineString, { startPointDistanceToTrack: number }> {
  const startPointOnRail = nearestPointOnLine(track, point(wagonStartPoint), {
    units: 'meters',
  });

  if (readjustWagonStartPoint) {
    wagonStartPoint = startPointOnRail.geometry.coordinates;
  }

  const multiFeatureIndex = startPointOnRail.properties.multiFeatureIndex;
  let railCoordinates =
    track.geometry.type === 'MultiLineString'
      ? track.geometry.coordinates[multiFeatureIndex]
      : track.geometry.coordinates;

  let railSegmentIdx = startPointOnRail.properties.index;
  if (railSegmentIdx === railCoordinates.length - 1) {
    railSegmentIdx -= 1;
  }

  if (placementDirection === 'backward') {
    railCoordinates = railCoordinates.toReversed();
    railSegmentIdx = railCoordinates.length - 2 - railSegmentIdx;
  }

  let wagonEndPoint: GeoJSON.Position | null = findWagonEndPointByCircleMethod(
    lineString(railCoordinates),
    wagonStartPoint,
    startPointOnRail,
    railSegmentIdx,
    wagonLength
  );

  if (wagonEndPoint) {
    return lineString([wagonStartPoint, wagonEndPoint], {
      startPointDistanceToTrack: startPointOnRail.properties.dist,
    });
  }

  // If we could not find an end point and we have a MultiLineString with multiple parts,
  // try again without the current line string
  if (
    track.geometry.type === 'MultiLineString' &&
    track.geometry.coordinates.length > 1
  ) {
    const alternative = getWagonSegmentPlacedAlongRail(
      {
        ...track,
        geometry: {
          ...track.geometry,
          coordinates: [
            ...track.geometry.coordinates.slice(0, multiFeatureIndex),
            ...track.geometry.coordinates.slice(multiFeatureIndex + 1),
          ],
        },
      },
      wagonLength,
      wagonStartPoint,
      readjustWagonStartPoint,
      placementDirection
    );
    // Sanity check that the alternative placement's start point's distance to the track
    // is similar to the original start point's distance to the track
    // This is to ensure that we are not placing the wagon on a different track
    // or in a completely different location
    if (
      Math.abs(
        alternative.properties.startPointDistanceToTrack -
          startPointOnRail.properties.dist
      ) < 5
    ) {
      return alternative;
    }
  }

  // Fallback to using the bearing method to determine the end point of the wagon
  const wagonBearing = bearing(
    railCoordinates[
      // If we are at the end of the rail segment, we need to use the previous segment
      // to calculate the bearing
      railSegmentIdx !== railCoordinates.length - 1
        ? railSegmentIdx
        : railCoordinates.length - 2
    ],
    railCoordinates[railCoordinates.length - 1]
  );
  wagonEndPoint = destination(wagonStartPoint, wagonLength, wagonBearing, {
    units: 'meters',
  }).geometry.coordinates;
  return lineString([wagonStartPoint, wagonEndPoint], {
    startPointDistanceToTrack: startPointOnRail.properties.dist,
  });
}

/**
 * Attempts to find wagon end point using circle intersection method
 */
function findWagonEndPointByCircleMethod(
  railLine: GeoJSON.Feature<GeoJSON.LineString>,
  wagonStartPoint: GeoJSON.Position,
  startPointOnRail: any,
  railSegmentIdx: number,
  wagonLength: number
): GeoJSON.Position | null {
  // Create a circle around start point with radius = wagon length
  const circleSweep = circle(wagonStartPoint, wagonLength, {
    units: 'meters',
    steps: 16,
  });

  // Find where this circle intersects with the rail
  const intersections = lineIntersect(railLine, circleSweep);

  // Filter intersections to find valid end points
  const potentialEndPoints = intersections.features
    .map((f) => nearestPointOnLine(railLine, f))
    .filter(
      (f) =>
        // Keep only points further along the rail than our starting point
        f.properties.index > railSegmentIdx ||
        (f.properties.index === railSegmentIdx &&
          distance(railLine.geometry.coordinates[0], startPointOnRail) <
            distance(railLine.geometry.coordinates[0], f))
    );

  // Select the furthest valid point along the rail
  const furthestPoint = orderBy(
    potentialEndPoints,
    (f) => f.properties.location,
    'desc'
  ).at(0);

  return furthestPoint?.geometry.coordinates ?? null;
}

type JourneySectionFragment = NonNullable<
  NonNullable<
    NonNullable<TrainExtendedDetails['compositions']>[number]
  >['journeySections']
>[number];

export const getTrainCompositionGeometryAlongTrack = (
  journeySection: JourneySectionFragment,
  startPoint: GeoJSON.Position,
  track: GeoJSON.Feature<GeoJSON.MultiLineString | GeoJSON.LineString>
): GeoJSON.FeatureCollection | null => {
  if (!journeySection) return null;

  const headPos = startPoint;
  const headFirst = true;

  const wagonPolygons: GeoJSON.Feature<
    GeoJSON.Polygon | GeoJSON.MultiPolygon
  >[] = [];

  const orderedWagons = orderBy(
    journeySection.wagons?.filter(isDefined),
    (w) => w.location,
    headFirst ? 'asc' : 'desc'
  );

  let wagonHeadPos = headPos;

  for (let i = 0; i < orderedWagons.length; i++) {
    const wagon = orderedWagons[i];
    const wagonLengthInMeters = wagon.length / 100;

    let wagonLineString: GeoJSON.LineString;
    try {
      const wagonPlacement = getWagonSegmentPlacedAlongRail(
        track,
        wagonLengthInMeters,
        wagonHeadPos,
        i === 0
      );

      // Exit early if first wagon is too far from the track
      if (
        i === 0 &&
        wagonPlacement.properties.startPointDistanceToTrack >
          MAX_ACCEPTED_START_POINT_DISTANCE_TO_TRACK_IN_METERS
      ) {
        return null;
      }

      wagonLineString = wagonPlacement.geometry;
    } catch (e) {
      // Turf.js may throw an error from its nearestPointOnLine function
      // if the start point is too far from the track
      return null;
    }

    // Determine head position for next wagon
    wagonHeadPos =
      wagonLineString.coordinates[wagonLineString.coordinates.length - 1];

    const wagonPolygon = buffer(
      // Shorten the wagon lineString from both ends by WAGON_POLYGON_BUFFER_RADIUS_IN_METERS
      // to account for the added buffer
      lineSliceAlong(
        wagonLineString,
        WAGON_POLYGON_BUFFER_RADIUS_IN_METERS,
        wagonLengthInMeters - WAGON_POLYGON_BUFFER_RADIUS_IN_METERS,
        { units: 'meters' }
      ),
      WAGON_POLYGON_BUFFER_RADIUS_IN_METERS,
      {
        units: 'meters',
      }
    );

    if (wagonPolygon) {
      wagonPolygon.properties = {
        wagonSalesNumber:
          wagon.salesNumber !== 0 ? wagon.salesNumber : wagon.location,
        vehicleId: wagon.vehicleId,
      };
      wagonPolygons.push(wagonPolygon);
    }
  }

  return {
    type: 'FeatureCollection',
    features: [
      ...wagonPolygons,
      ...wagonPolygons.map((f) => centroid(f, { properties: f.properties })),
    ],
  };
};

export function getVehicleRouteFragment(
  map: MapRef,
  train: TrainByStationFragment
) {
  // Query currently visible vehicle route features from the map
  const routeFeatures = map.querySourceFeatures('vehicle_route', {
    validate: false,
  });

  const latestDepartureTimeTableRowIndex =
    getTrainLatestDepartureTimeTableRowIndex(train);

  const routeLines = routeFeatures.filter(
    (f): f is MapGeoJSONFeature & GeoJSON.Feature<GeoJSON.LineString> => {
      if (f.geometry.type !== 'LineString') return false;

      const { startTimeTableRowIndex, endTimeTableRowIndex } = f.properties;

      // Include route segments that are unbounded (null indices) or whose time
      // table row bounds contain the latest time table row index of the train
      return (
        startTimeTableRowIndex == null ||
        endTimeTableRowIndex == null ||
        (startTimeTableRowIndex <= latestDepartureTimeTableRowIndex &&
          endTimeTableRowIndex >= latestDepartureTimeTableRowIndex)
      );
    }
  );

  const combinedFeatures = combine(featureCollection(routeLines)).features;
  if (combinedFeatures.length > 0) {
    return combinedFeatures[0] as GeoJSON.Feature<GeoJSON.MultiLineString>;
  } else {
    return null;
  }
}
