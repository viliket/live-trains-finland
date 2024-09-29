import { useTheme } from '@mui/material';
import {
  bearing,
  buffer,
  centroid,
  destination,
  distance,
  lineString,
  lineSliceAlong,
  point,
  nearestPointOnLine,
} from '@turf/turf';
import { orderBy } from 'lodash';
import { Layer, Source } from 'react-map-gl';

import { TrainByStationFragment } from '../../graphql/generated/digitraffic/graphql';
import useTrainQuery from '../../hooks/useTrainQuery';
import { TrainExtendedDetails } from '../../types';
import { isDefined } from '../../utils/common';
import getTrainJourneySectionForTimeTableRow from '../../utils/getTrainJourneySectionForTimeTableRow';
import getTrainStoppingPositionOnTrack from '../../utils/getTrainStoppingPositionOnTrack';

const WAGON_POLYGON_BUFFER_RADIUS_IN_METERS = 3;

function getWagonSegmentPlacedAlongRail(
  railCoordinates: GeoJSON.Position[],
  wagonLength: number,
  wagonStartPoint: GeoJSON.Position
): GeoJSON.LineString {
  if (railCoordinates.length < 2) {
    throw new Error('Insufficient rail coordinates to form a valid rail.');
  }

  const startPointOnRail = nearestPointOnLine(
    lineString(railCoordinates),
    point(wagonStartPoint)
  );
  let railSegmentIdx = startPointOnRail.properties.index;
  if (railSegmentIdx === railCoordinates.length - 1) {
    railSegmentIdx -= 1;
  }

  let wagonEndPoint: GeoJSON.Position | null = null;

  for (let i = railSegmentIdx; i < railCoordinates.length - 1; i++) {
    const segmentEnd = railCoordinates[i + 1];

    // Calculate the straight-line distance from the wagonStartPoint to the end of this segment
    const distanceToSegmentEnd = distance(wagonStartPoint, point(segmentEnd), {
      units: 'meters',
    });

    if (
      distanceToSegmentEnd >= wagonLength ||
      // Handle case where we are already at the last rail segment but is too short for the wagon length
      i === railCoordinates.length - 2
    ) {
      // Find the exact point on this rail segment that is "wagon length" meters away from the wagonStartPoint
      const wagonBearing = bearing(wagonStartPoint, segmentEnd);
      wagonEndPoint = destination(wagonStartPoint, wagonLength, wagonBearing, {
        units: 'meters',
      }).geometry.coordinates;
      break;
    }
  }

  if (!wagonEndPoint) {
    throw new Error('Could not determine the end point for wagon on rail.');
  }

  // Create the wagon line segment (which is exactly wagonLength meters long)
  const wagonLineSegment = lineString([wagonStartPoint, wagonEndPoint]);

  return wagonLineSegment.geometry;
}

const generateTrainCompositionForEachStationAsGeoJSON = (
  realTimeTrain: TrainExtendedDetails | null | undefined
) => {
  const wagonPolygons = realTimeTrain?.timeTableGroups
    ?.flatMap((ttRowGroup) => {
      const ttRow = ttRowGroup.departure ?? ttRowGroup.arrival;
      if (ttRow?.commercialTrack == null) return null;

      const journeySection = getTrainJourneySectionForTimeTableRow(
        realTimeTrain,
        ttRow
      );
      if (!journeySection) return null;

      const trainStoppingPosition = getTrainStoppingPositionOnTrack(
        ttRow.station.shortCode,
        ttRow.commercialTrack,
        ttRowGroup.trainDirection,
        !!realTimeTrain.commuterLineid,
        journeySection
      );
      if (!trainStoppingPosition) return null;

      const { headPos, trackCoords, headFirst } = trainStoppingPosition;

      let wagonHeadPos = headPos;

      const wagonPolygons = orderBy(
        journeySection.wagons?.filter(isDefined),
        (w) => w.location,
        headFirst ? 'asc' : 'desc'
      ).map((w) => {
        const wagonLengthInMeters = w.length / 100;

        const wagonLineString = getWagonSegmentPlacedAlongRail(
          trackCoords,
          wagonLengthInMeters,
          wagonHeadPos
        );

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
              w?.salesNumber !== 0 ? w?.salesNumber : w?.location,
          };
        }

        return wagonPolygon;
      });
      return wagonPolygons;
    })
    .filter(isDefined);

  return {
    type: 'FeatureCollection',
    features: wagonPolygons ?? [],
  } as GeoJSON.FeatureCollection;
};

type TrainCompositionByStationLayerProps = {
  train?: TrainByStationFragment | null;
};

const TrainCompositionByStationLayer = ({
  train,
}: TrainCompositionByStationLayerProps) => {
  const { data: realTimeTrain } = useTrainQuery(
    train?.trainNumber,
    train?.departureDate
  );
  const theme = useTheme();

  const trainCompositionCollection =
    generateTrainCompositionForEachStationAsGeoJSON(realTimeTrain);
  const wagonPositionCollection: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: trainCompositionCollection.features.map((f) =>
      centroid(f, { properties: f.properties })
    ),
  };

  return (
    <>
      <Source type="geojson" data={trainCompositionCollection}>
        <Layer
          {...{
            id: 'train_composition_by_station',
            beforeId: 'z6',
            type: 'fill-extrusion',
            source: 'train_composition_by_station',
            minzoom: 14,
            paint: {
              'fill-extrusion-height': 4,
              'fill-extrusion-color': '#007cbf',
              'fill-extrusion-base': 0,
              'fill-extrusion-opacity': 0.5,
            },
          }}
        />
      </Source>
      <Source type="geojson" data={wagonPositionCollection}>
        <Layer
          {...{
            id: 'train_composition_by_station_wagon_numbers',
            beforeId: 'z6',
            type: 'symbol',
            source: 'train_composition_by_station_wagon_numbers',
            minzoom: 15,
            layout: {
              'text-size': 10,
              'text-font': ['Gotham Rounded Medium'],
              'text-field': '{wagonSalesNumber}',
              'text-allow-overlap': true,
            },
            paint: {
              'text-halo-width': 2,
              'text-color': theme.palette.text.primary,
              'text-halo-color': theme.palette.getContrastText(
                theme.palette.text.primary
              ),
            },
          }}
        />
      </Source>
    </>
  );
};

export default TrainCompositionByStationLayer;
