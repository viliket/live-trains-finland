import { parseISO } from 'date-fns';

import {
  TimeTableRowType,
  TrainDetailsFragment,
} from '../../graphql/generated/digitraffic';
import getTrainLatestArrivalRow from '../getTrainLatestArrivalRow';

const trainBase: TrainDetailsFragment = {
  trainNumber: 123,
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

const timeTableRowArrivalBase = {
  cancelled: false,
  trainStopping: true,
  type: TimeTableRowType.Arrival,
};

describe('getTrainLatestArrivalRow', () => {
  describe('train from HKI 09:00 -> PSL 10:00 -> Turenki 11:00 -> TPE', () => {
    const hkiArrivalRow = {
      ...timeTableRowArrivalBase,
      scheduledTime: '2023-01-25T09:00:00Z',
      station: {
        name: 'Helsinki',
        shortCode: 'HKI',
      },
    };
    const pslArrivalRow = {
      ...timeTableRowArrivalBase,
      scheduledTime: '2023-01-25T10:00:00Z',
      station: {
        name: 'Pasila',
        shortCode: 'PSL',
      },
    };
    const tuArrivalRow = {
      ...timeTableRowArrivalBase,
      scheduledTime: '2023-01-25T11:00:00Z',
      station: {
        name: 'Turenki',
        shortCode: 'TU',
      },
    };

    beforeAll(() => {
      jest.useFakeTimers();
    });

    it('should be the undefined when none of the train arrival rows has actual time defined', () => {
      const train: TrainDetailsFragment = {
        ...trainBase,
        timeTableRows: [pslArrivalRow, hkiArrivalRow, tuArrivalRow],
      };

      const latestArrivalRow = getTrainLatestArrivalRow(train);

      expect(latestArrivalRow).toBeUndefined();
    });

    it('should be the the arrival row with latest scheduled time having actual time defined and actual time not in future', () => {
      jest.setSystemTime(parseISO('2023-01-25T10:00:00Z'));
      const train: TrainDetailsFragment = {
        ...trainBase,
        timeTableRows: [
          { ...pslArrivalRow, actualTime: '2023-01-25T10:01:00Z' },
          { ...hkiArrivalRow, actualTime: '2023-01-25T09:01:00Z' },
          tuArrivalRow,
        ],
      };

      const latestArrivalRow = getTrainLatestArrivalRow(train);

      expect(latestArrivalRow).toBeDefined();
      expect(latestArrivalRow!.station.name).toBe('Helsinki');
    });
  });
});
