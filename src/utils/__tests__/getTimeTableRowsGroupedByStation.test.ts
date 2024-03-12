import {
  TimeTableRowType,
  TrainDetailsFragment,
} from '../../graphql/generated/digitraffic/graphql';
import getTimeTableRowsGroupedByStation from '../getTimeTableRowsGroupedByStation';

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
  it('should be undefined when the train has no time table rows', () => {
    const rows = getTimeTableRowsGroupedByStation(trainBase);

    expect(rows).toBeUndefined();
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
            name: 'Tampere',
            shortCode: 'TPE',
          },
        },
      ],
    };

    it('should return correctly grouped time table rows by station', () => {
      const rows = getTimeTableRowsGroupedByStation(train);

      expectToBeDefined(rows);
      expect(rows.length).toBe(3);

      expect(rows[0].arrival).toBeNull();
      expectToBeDefined(rows[0].departure);
      expect(rows[0].departure.station.name).toBe('Helsinki');

      expectToBeDefined(rows[1].arrival);
      expect(rows[1].arrival.station.name).toBe('Pasila');
      expectToBeDefined(rows[1].departure);
      expect(rows[1].departure.station.name).toBe('Pasila');

      expectToBeDefined(rows[2].arrival);
      expect(rows[2].arrival.station.name).toBe('Tampere');
      expect(rows[2].departure).toBeNull();
    });
  });
});
