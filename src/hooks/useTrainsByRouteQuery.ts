import { queryOptions, useQuery } from '@tanstack/react-query';
import distance from '@turf/distance';
import { addHours } from 'date-fns';

import {
  TimeTableRowType,
  TrainByStationFragment,
} from '../graphql/generated/digitraffic/graphql';
import { trainStations } from '../utils/stations';

const apiBaseUrl = 'https://rata.digitraffic.fi/api/v1';

type SimpleCause = {
  categoryCodeId: string;
  categoryCode: string;
  detailedCategoryCodeId?: string;
  detailedCategoryCode?: string;
  thirdCategoryCodeId?: string;
  thirdCategoryCode?: string;
};

type SimpleTimeTableRow = {
  cancelled: boolean;
  commercialStop?: boolean;
  commercialTrack?: string;
  countryCode: string;
  scheduledTime: string;
  liveEstimateTime?: string;
  unknownDelay?: boolean;
  differenceInMinutes?: number;
  causes: SimpleCause[];
  actualTime?: string;
  stationShortCode: string;
  stationUICCode: number;
  trainStopping: boolean;
  type: TimeTableRowType;
};

type SimpleTrain = {
  cancelled: boolean;
  commuterLineID?: string;
  departureDate: string;
  operatorShortCode: string;
  operatorUICCode: number;
  runningCurrently: boolean;
  timetableAcceptanceDate: string;
  timetableType: string;
  trainCategory: string;
  trainNumber: number;
  trainType: string;
  version: number;
  timeTableRows: SimpleTimeTableRow[];
};

const trainsByRouteQuery = (
  deptOrArrStationCodeFilter: string | null,
  stationCode: string | undefined,
  timeTableType: TimeTableRowType
) => {
  const departureStation =
    timeTableType === TimeTableRowType.Departure
      ? stationCode
      : deptOrArrStationCodeFilter;
  const arrivalStation =
    timeTableType === TimeTableRowType.Departure
      ? deptOrArrStationCodeFilter
      : stationCode;

  return queryOptions({
    queryKey: [
      'trainsByRouteQuery',
      deptOrArrStationCodeFilter,
      stationCode,
      timeTableType,
    ],
    queryFn: () =>
      getTrainsByRoute(departureStation, arrivalStation, timeTableType),
    enabled: Boolean(departureStation && arrivalStation),
    refetchInterval: 10000,
  });
};

export const useTrainsByRouteQuery = (
  deptOrArrStationCodeFilter: string | null,
  stationCode: string | undefined,
  timeTableType: TimeTableRowType
) =>
  useQuery(
    trainsByRouteQuery(deptOrArrStationCodeFilter, stationCode, timeTableType)
  );

async function getTrainsByRoute(
  departureStation: string | null | undefined,
  arrivalStation: string | null | undefined,
  timeTableType: TimeTableRowType
): Promise<TrainByStationFragment[]> {
  if (!departureStation || !arrivalStation) return [];

  const params = createSearchParams({
    limit: '100',
    include_nonstopping: 'false',
    startDate:
      timeTableType === TimeTableRowType.Arrival
        ? addHours(
            new Date(),
            -getEstimatedDurationInHoursBetweenStations(
              departureStation,
              arrivalStation
            ) - 1
          ).toISOString()
        : undefined,
  });

  const res = await fetch(
    `${apiBaseUrl}/live-trains/station/${departureStation}/${arrivalStation}?${params}`
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch data (status ${res.status})`);
  }

  const trains = (await res.json()) as SimpleTrain[];

  return trains.map((t) => ({
    trainNumber: t.trainNumber,
    departureDate: t.departureDate,
    version: t.version.toString(),
    commuterLineid: t.commuterLineID,
    operator: {
      uicCode: t.operatorUICCode,
    },
    trainType: {
      name: t.trainType,
      trainCategory: {
        name: t.trainCategory,
      },
    },
    timeTableRows: t.timeTableRows.map((ttRow) => ({
      trainStopping: ttRow.trainStopping,
      scheduledTime: ttRow.scheduledTime,
      liveEstimateTime: ttRow.liveEstimateTime,
      actualTime: ttRow.actualTime,
      differenceInMinutes: ttRow.differenceInMinutes,
      unknownDelay: ttRow.unknownDelay,
      causes: ttRow.causes.map((ttCause) => ({
        categoryCode: {
          code: ttCause.categoryCodeId,
          name: ttCause.categoryCode,
        },
        detailedCategoryCode:
          ttCause.detailedCategoryCode && ttCause.detailedCategoryCodeId
            ? {
                name: ttCause.detailedCategoryCode,
                code: ttCause.detailedCategoryCodeId,
              }
            : null,
        thirdCategoryCode:
          ttCause.thirdCategoryCode && ttCause.thirdCategoryCodeId
            ? {
                name: ttCause.thirdCategoryCode,
                code: ttCause.thirdCategoryCodeId,
              }
            : null,
      })),
      cancelled: ttRow.cancelled,
      type: ttRow.type,
      commercialTrack: ttRow.commercialTrack,
      station: {
        name:
          trainStations.find(
            (s) => s.stationShortCode === ttRow.stationShortCode
          )?.stationName ?? '?',
        shortCode: ttRow.stationShortCode,
      },
    })),
  }));
}

function getEstimatedDurationInHoursBetweenStations(
  fromStationCode: string,
  toStationCode: string
) {
  const fromStation = trainStations.find(
    (s) => s.stationShortCode === fromStationCode
  );
  const toStation = trainStations.find(
    (s) => s.stationShortCode === toStationCode
  );
  if (!fromStation || !toStation) return 2;
  const fromPos = [fromStation.longitude, fromStation.latitude];
  const toPos = [toStation.longitude, toStation.latitude];
  const distanceInKm = distance(fromPos, toPos, { units: 'kilometers' });
  // t = s / v where we assume average of 60 km / h to take into account stops and delays
  const estimatedDurationInHours = distanceInKm / 60;
  return estimatedDurationInHours;
}

function createSearchParams(params: Partial<Record<string, string>>) {
  const filteredParams: Record<string, string> = {};

  for (const key in params) {
    const paramValue = params[key];
    if (paramValue != null) {
      filteredParams[key] = paramValue;
    }
  }

  return new URLSearchParams(filteredParams);
}
