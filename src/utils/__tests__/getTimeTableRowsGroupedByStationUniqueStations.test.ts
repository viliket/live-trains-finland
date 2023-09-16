import { parseISO } from 'date-fns';

import {
  TimeTableRowType,
  TrainDetailsFragment,
} from '../../graphql/generated/digitraffic';
import getTimeTableRowsGroupedByStationUniqueStations from '../getTimeTableRowsGroupedByStationUniqueStations';

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

const timeTableRowBase = {
  cancelled: false,
  trainStopping: true,
};

describe('getTimeTableRowsGroupedByStation', () => {
  it('should be null when the train has no time table rows', () => {
    const rows = getTimeTableRowsGroupedByStationUniqueStations(trainBase);

    expect(rows).toBeNull();
  });

  describe('train with multiple time table rows with same station', () => {
    const train: TrainDetailsFragment = {
      ...trainBase,
      timeTableRows: [
        {
          ...timeTableRowBase,
          type: TimeTableRowType.Departure,
          scheduledTime: '2023-01-25T08:55:00Z',
          station: {
            name: 'Helsinki',
            shortCode: 'HKI',
          },
        },
        {
          ...timeTableRowBase,
          type: TimeTableRowType.Arrival,
          scheduledTime: '2023-01-25T09:00:00Z',
          station: {
            name: 'Pasila',
            shortCode: 'PSL',
          },
        },
        {
          ...timeTableRowBase,
          type: TimeTableRowType.Departure,
          scheduledTime: '2023-01-25T10:55:00Z',
          station: {
            name: 'Pasila',
            shortCode: 'PSL',
          },
        },
        {
          ...timeTableRowBase,
          type: TimeTableRowType.Arrival,
          scheduledTime: '2023-01-25T11:00:00Z',
          station: {
            name: 'Lentoasema',
            shortCode: 'LEN',
          },
        },
        {
          ...timeTableRowBase,
          type: TimeTableRowType.Departure,
          scheduledTime: '2023-01-25T11:05:00Z',
          station: {
            name: 'Lentoasema',
            shortCode: 'LEN',
          },
        },
        {
          ...timeTableRowBase,
          type: TimeTableRowType.Arrival,
          scheduledTime: '2023-01-25T11:30:00Z',
          station: {
            name: 'Pasila',
            shortCode: 'PSL',
          },
        },
        {
          ...timeTableRowBase,
          type: TimeTableRowType.Departure,
          scheduledTime: '2023-01-25T11:35:00Z',
          station: {
            name: 'Pasila',
            shortCode: 'PSL',
          },
        },
        {
          ...timeTableRowBase,
          type: TimeTableRowType.Arrival,
          scheduledTime: '2023-01-25T11:40:00Z',
          station: {
            name: 'Helsinki',
            shortCode: 'HKI',
          },
        },
      ],
    };

    beforeAll(() => {
      jest.useFakeTimers();
    });

    it('should return correctly grouped time table rows by station and correct group for duplicate stations at 2023-01-25T08:55:00Z', () => {
      jest.setSystemTime(parseISO('2023-01-25T08:55:00Z'));

      const rows = getTimeTableRowsGroupedByStationUniqueStations(train);

      expectToBeDefined(rows);
      expect(rows.length).toBe(3);

      expect(rows[0].arrival).toBeNull();
      expectToBeDefined(rows[0].departure);
      expect(rows[0].departure.station.name).toBe('Helsinki');
      expect(rows[0].departure.scheduledTime).toBe('2023-01-25T08:55:00Z');

      expectToBeDefined(rows[1].arrival);
      expect(rows[1].arrival.station.name).toBe('Pasila');
      expect(rows[1].arrival.scheduledTime).toBe('2023-01-25T09:00:00Z');
      expectToBeDefined(rows[1].departure);
      expect(rows[1].departure.station.name).toBe('Pasila');
      expect(rows[1].departure.scheduledTime).toBe('2023-01-25T10:55:00Z');

      expectToBeDefined(rows[2].arrival);
      expect(rows[2].arrival.station.name).toBe('Lentoasema');
      expect(rows[2].departure).toBeDefined();
    });

    it('should return correctly grouped time table rows by station and correct group for duplicate stations at 2023-01-25T09:04:59Z', () => {
      jest.setSystemTime(parseISO('2023-01-25T09:05:00Z'));

      const rows = getTimeTableRowsGroupedByStationUniqueStations(train);

      expectToBeDefined(rows);
      expect(rows.length).toBe(3);

      expect(rows[0].arrival).toBeNull();
      expectToBeDefined(rows[0].departure);
      expect(rows[0].departure.station.name).toBe('Helsinki');
      expect(rows[0].departure.scheduledTime).toBe('2023-01-25T08:55:00Z');

      expectToBeDefined(rows[1].arrival);
      expect(rows[1].arrival.station.name).toBe('Pasila');
      expect(rows[1].arrival.scheduledTime).toBe('2023-01-25T09:00:00Z');
      expectToBeDefined(rows[1].departure);
      expect(rows[1].departure.station.name).toBe('Pasila');
      expect(rows[1].departure.scheduledTime).toBe('2023-01-25T10:55:00Z');

      expectToBeDefined(rows[2].arrival);
      expect(rows[2].arrival.station.name).toBe('Lentoasema');
      expect(rows[2].departure).toBeDefined();
    });

    it('should return correctly grouped time table rows by station and correct group for duplicate stations at 2023-01-25T09:05:01Z', () => {
      jest.setSystemTime(parseISO('2023-01-25T09:05:01Z'));

      const rows = getTimeTableRowsGroupedByStationUniqueStations(train);

      expectToBeDefined(rows);
      expect(rows.length).toBe(3);

      expectToBeDefined(rows[0].arrival);
      expect(rows[0].arrival.station.name).toBe('Helsinki');
      expect(rows[0].arrival.scheduledTime).toBe('2023-01-25T11:40:00Z');
      expect(rows[0].departure).toBeNull();

      expectToBeDefined(rows[1].arrival);
      expect(rows[1].arrival.station.name).toBe('Pasila');
      expect(rows[1].arrival.scheduledTime).toBe('2023-01-25T09:00:00Z');
      expectToBeDefined(rows[1].departure);
      expect(rows[1].departure.station.name).toBe('Pasila');
      expect(rows[1].departure.scheduledTime).toBe('2023-01-25T10:55:00Z');

      expectToBeDefined(rows[2].arrival);
      expect(rows[2].arrival.station.name).toBe('Lentoasema');
      expect(rows[2].departure).toBeDefined();
    });

    it('should return correctly grouped time table rows by station and correct group for duplicate stations at 2023-01-25T11:50:00Z', () => {
      jest.setSystemTime(parseISO('2023-01-25T11:50:00Z'));

      const rows = getTimeTableRowsGroupedByStationUniqueStations(train);

      expectToBeDefined(rows);
      expect(rows.length).toBe(3);

      expectToBeDefined(rows[0].arrival);
      expect(rows[0].arrival.station.name).toBe('Helsinki');
      expect(rows[0].arrival.scheduledTime).toBe('2023-01-25T11:40:00Z');
      expect(rows[0].departure).toBeNull();

      expectToBeDefined(rows[1].arrival);
      expect(rows[1].arrival.station.name).toBe('Pasila');
      expect(rows[1].arrival.scheduledTime).toBe('2023-01-25T11:30:00Z');
      expectToBeDefined(rows[1].departure);
      expect(rows[1].departure.station.name).toBe('Pasila');
      expect(rows[1].departure.scheduledTime).toBe('2023-01-25T11:35:00Z');

      expectToBeDefined(rows[2].arrival);
      expect(rows[2].arrival.station.name).toBe('Lentoasema');
      expect(rows[2].departure).toBeDefined();
    });
  });
});
