import { parseISO } from 'date-fns';

import {
  TimeTableRowType,
  TrainDetailsFragment,
} from '../../graphql/generated/digitraffic';
import {
  getTimeTableRowRealTime,
  getDepartureTimeTableRow,
  getTrainScheduledDepartureTime,
  getDestinationTimeTableRow,
  getTrainDepartureStation,
  getTrainDestinationStation,
  getTrainDepartureStationName,
  getTrainDestinationStationName,
} from '../train';

const trainBase: TrainDetailsFragment = {
  trainNumber: 123,
  departureDate: '2023-01-25',
  operator: {
    name: 'VR-Yhtymä Oyj',
    __typename: 'Operator',
    shortCode: 'vr',
    uicCode: 10,
  },
  runningCurrently: false,
  trainType: {
    name: 'HL',
    trainCategory: {
      name: 'Commuter',
      __typename: 'TrainCategory',
    },
    __typename: 'TrainType',
  },
  version: '1',
};

const departureTimeTableRowBase = {
  cancelled: false,
  trainStopping: true,
  type: TimeTableRowType.Departure,
};

const arrivalTimeTableRowBase = {
  cancelled: false,
  trainStopping: true,
  type: TimeTableRowType.Arrival,
};

/**
 * Train HKI 09:00 -> 09:57 PSL 10:00 -> 10:55 TU 11:00 -> 12:00 TPE
 */
const train: TrainDetailsFragment = {
  ...trainBase,
  timeTableRows: [
    {
      ...departureTimeTableRowBase,
      scheduledTime: '2023-01-25T10:00:00Z',
      station: {
        name: 'Pasila',
        shortCode: 'PSL',
      },
    },
    {
      ...departureTimeTableRowBase,
      scheduledTime: '2023-01-25T09:57:00Z',
      station: {
        name: 'Pasila',
        shortCode: 'PSL',
      },
    },
    {
      ...arrivalTimeTableRowBase,
      scheduledTime: '2023-01-25T12:00:00Z',
      station: {
        name: 'Tampere',
        shortCode: 'TPE',
      },
    },
    {
      ...departureTimeTableRowBase,
      scheduledTime: '2023-01-25T09:00:00Z',
      station: {
        name: 'Helsinki',
        shortCode: 'HKI',
      },
    },
    {
      ...departureTimeTableRowBase,
      scheduledTime: '2023-01-25T11:00:00Z',
      station: {
        name: 'Turenki',
        shortCode: 'TU',
      },
    },
    {
      ...arrivalTimeTableRowBase,
      scheduledTime: '2023-01-25T10:55:00Z',
      station: {
        name: 'Turenki',
        shortCode: 'TU',
      },
    },
  ],
};

describe('getTimeTableRowRealTime', () => {
  it('should be the scheduled time of the row when neither actual time or live estimate time is defined', () => {
    expect(
      getTimeTableRowRealTime({
        scheduledTime: '2023-01-25T10:00:00Z',
      })
    ).toStrictEqual(parseISO('2023-01-25T10:00:00Z'));
  });

  it('should be the live estimate time of the row when actual time is not defined', () => {
    expect(
      getTimeTableRowRealTime({
        scheduledTime: '2023-01-25T10:00:00Z',
        liveEstimateTime: '2023-01-25T10:00:10Z',
      })
    ).toStrictEqual(parseISO('2023-01-25T10:00:10Z'));
  });

  it('should be the actual time of the row when actual time is defined', () => {
    expect(
      getTimeTableRowRealTime({
        scheduledTime: '2023-01-25T10:00:00Z',
        liveEstimateTime: '2023-01-25T10:00:10Z',
        actualTime: '2023-01-25T10:00:20Z',
      })
    ).toStrictEqual(parseISO('2023-01-25T10:00:20Z'));
  });
});

describe('getTrainScheduledDepartureTime', () => {
  it('should return correct scheduled departure time', () => {
    expect(getTrainScheduledDepartureTime(train)).toStrictEqual(
      parseISO('2023-01-25T09:00:00Z')
    );
  });
});

describe('getDepartureTimeTableRow', () => {
  it('should be the departure row with the earliest scheduled time', () => {
    const row = getDepartureTimeTableRow(train);

    expect(row).toBeDefined();
    expect(row!.station.name).toBe('Helsinki');
  });
});

describe('getDestinationTimeTableRow', () => {
  it('should be the arrival row with the latest scheduled time', () => {
    const row = getDestinationTimeTableRow(train);

    expect(row).toBeDefined();
    expect(row!.station.name).toBe('Tampere');
  });
});

describe('getTrainDepartureStation', () => {
  it('should be the station of the departure time table row', () => {
    const station = getTrainDepartureStation(train);

    expect(station).toBeDefined();
    expect(station!.name).toBe('Helsinki');
  });
});

describe('getTrainDestinationStation', () => {
  it('should be the station of the destination time table row', () => {
    const station = getTrainDestinationStation(train);

    expect(station).toBeDefined();
    expect(station!.name).toBe('Tampere');
  });
});

describe('getTrainDepartureStationName', () => {
  it('should be the station name of the departure time table row', () => {
    const stationName = getTrainDepartureStationName(train);

    expect(stationName).toBe('Helsinki');
  });
});

describe('getTrainDestinationStationName', () => {
  it('should be the station name of the destination time table row', () => {
    const stationName = getTrainDestinationStationName(train);

    expect(stationName).toBe('Tampere');
  });
});
