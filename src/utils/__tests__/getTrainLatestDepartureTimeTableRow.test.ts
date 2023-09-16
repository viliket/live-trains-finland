import { parseISO } from 'date-fns';

import {
  TimeTableRowType,
  TrainDetailsFragment,
} from '../../graphql/generated/digitraffic';
import getTrainLatestDepartureTimeTableRow from '../getTrainLatestDepartureTimeTableRow';

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

const timeTableRowDepartureBase = {
  cancelled: false,
  trainStopping: true,
  type: TimeTableRowType.Departure,
};

describe('getTrainLatestDepartureTimeTableRow', () => {
  describe('train from HKI 09:00 -> PSL 10:00 -> Turenki 11:00 -> TPE', () => {
    const hkiDepartureRow = {
      ...timeTableRowDepartureBase,
      scheduledTime: '2023-01-25T09:00:00Z',
      station: {
        name: 'Helsinki',
        shortCode: 'HKI',
      },
    };
    const pslDepartureRow = {
      ...timeTableRowDepartureBase,
      scheduledTime: '2023-01-25T10:00:00Z',
      station: {
        name: 'Pasila',
        shortCode: 'PSL',
      },
    };
    const tuDepartureRow = {
      ...timeTableRowDepartureBase,
      scheduledTime: '2023-01-25T11:00:00Z',
      station: {
        name: 'Turenki',
        shortCode: 'TU',
      },
    };

    beforeAll(() => {
      jest.useFakeTimers();
    });

    it('should be the undefined when none of the train departure rows has actual time defined', () => {
      const train: TrainDetailsFragment = {
        ...trainBase,
        timeTableRows: [pslDepartureRow, hkiDepartureRow, tuDepartureRow],
      };

      const latestDepartureRow = getTrainLatestDepartureTimeTableRow(train);

      expect(latestDepartureRow).toBeUndefined();
    });

    it('should be the the departure row with latest scheduled time having actual time defined and actual time not in future', () => {
      jest.setSystemTime(parseISO('2023-01-25T10:00:00Z'));
      const train: TrainDetailsFragment = {
        ...trainBase,
        timeTableRows: [
          { ...pslDepartureRow, actualTime: '2023-01-25T10:01:00Z' },
          { ...hkiDepartureRow, actualTime: '2023-01-25T09:01:00Z' },
          tuDepartureRow,
        ],
      };

      const latestDepartureRow = getTrainLatestDepartureTimeTableRow(train);

      expectToBeDefined(latestDepartureRow);
      expect(latestDepartureRow.station.name).toBe('Helsinki');
    });
  });
});
