import { parseISO } from 'date-fns';

import {
  TimeTableRowType,
  TrainDetailsFragment,
} from '../../graphql/generated/digitraffic/graphql';
import getTimeTableRowForStation from '../getTimeTableRowForStation';

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

describe('getTimeTableRowForStation', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(parseISO('2023-01-25T10:00:00Z'));
  });

  afterAll(() => jest.useRealTimers());

  it('should be undefined when the train has no time table rows', () => {
    const row = getTimeTableRowForStation(
      'HKI',
      trainBase,
      TimeTableRowType.Arrival
    );

    expect(row).toBeUndefined();
  });

  describe('train with single time table row with Departure type', () => {
    const train: TrainDetailsFragment = {
      ...trainBase,
      timeTableRows: [
        {
          cancelled: false,
          scheduledTime: '2023-01-25T09:00:00Z',
          trainStopping: false,
          type: TimeTableRowType.Departure,
          station: {
            name: 'Helsinki',
            shortCode: 'HKI',
          },
        },
      ],
    };

    it('should return row when train has row matching given station and time table row type', () => {
      const row = getTimeTableRowForStation(
        'HKI',
        train,
        TimeTableRowType.Departure
      );

      expectToBeDefined(row);
      expect(row.station.name).toBe('Helsinki');
    });

    it('should be undefined when the station matches but time table row type does not match', () => {
      const row = getTimeTableRowForStation(
        'HKI',
        train,
        TimeTableRowType.Arrival
      );

      expect(row).toBeUndefined();
    });

    it('should be undefined when train has no row with such station code', () => {
      const row = getTimeTableRowForStation(
        'NO_SUCH_STATION_CODE',
        train,
        TimeTableRowType.Arrival
      );

      expect(row).toBeUndefined();
    });
  });

  describe('train with multiple time table rows with same station', () => {
    const train: TrainDetailsFragment = {
      ...trainBase,
      timeTableRows: [
        {
          cancelled: false,
          scheduledTime: '2023-01-25T08:55:00Z',
          trainStopping: false,
          type: TimeTableRowType.Arrival,
          station: {
            name: 'Pasila',
            shortCode: 'PSL',
          },
        },
        {
          cancelled: false,
          scheduledTime: '2023-01-25T09:00:00Z',
          trainStopping: false,
          type: TimeTableRowType.Departure,
          station: {
            name: 'Pasila',
            shortCode: 'PSL',
          },
        },
        {
          cancelled: false,
          scheduledTime: '2023-01-25T10:55:00Z',
          trainStopping: false,
          type: TimeTableRowType.Arrival,
          station: {
            name: 'Pasila',
            shortCode: 'PSL',
          },
        },
        {
          cancelled: false,
          scheduledTime: '2023-01-25T11:00:00Z',
          trainStopping: false,
          type: TimeTableRowType.Departure,
          station: {
            name: 'Pasila',
            shortCode: 'PSL',
          },
        },
      ],
    };

    const testCases = [
      {
        currentTime: '2023-01-25T08:52:00Z',
        expectedRowTime: '2023-01-25T08:55:00Z',
      },
      {
        currentTime: '2023-01-25T09:04:59Z',
        expectedRowTime: '2023-01-25T08:55:00Z',
      },
      {
        currentTime: '2023-01-25T09:05:00Z',
        expectedRowTime: '2023-01-25T10:55:00Z',
      },
      {
        currentTime: '2023-01-25T15:00:00Z',
        expectedRowTime: '2023-01-25T10:55:00Z',
      },
    ];

    testCases.forEach(({ currentTime, expectedRowTime }) => {
      test(`should return the matching row with nearest scheduled time or live estimate time in the future (${currentTime})`, () => {
        jest.setSystemTime(parseISO(currentTime));

        const row = getTimeTableRowForStation(
          'PSL',
          train,
          TimeTableRowType.Arrival
        );

        expectToBeDefined(row);
        expect(row.scheduledTime).toBe(expectedRowTime);
      });
    });
  });
});
