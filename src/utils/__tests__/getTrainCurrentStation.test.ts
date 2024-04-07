import { parseISO } from 'date-fns';

import {
  Maybe,
  TimeTableRowType,
  TrainDetailsFragment,
  TrainTimeTableRowFragment,
} from '../../graphql/generated/digitraffic/graphql';
import getTrainCurrentStation from '../getTrainCurrentStation';
import * as getTrainLatestArrivalRowModule from '../getTrainLatestArrivalRow';

// Workaround for https://github.com/aelbore/esbuild-jest/issues/26
jest.mock('../getTrainLatestArrivalRow', () => ({
  __esModule: true,
  ...jest.requireActual('../getTrainLatestArrivalRow'),
}));

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

const timeTableRowArrivalBase = {
  cancelled: false,
  trainStopping: true,
  type: TimeTableRowType.Arrival,
};

const setTrainLatestArrivalRow = (
  arrivalTimeRow: Maybe<TrainTimeTableRowFragment>
) => {
  jest
    .spyOn(getTrainLatestArrivalRowModule, 'default')
    .mockReturnValue(arrivalTimeRow);
};

describe('getTrainCurrentStation', () => {
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
    const train: TrainDetailsFragment = {
      ...trainBase,
      timeTableRows: [pslDepartureRow, hkiDepartureRow, tuDepartureRow],
    };

    beforeAll(() => {
      jest.useFakeTimers();
    });

    it('should be the station of the first departure row when the train has no latest arrival row and the first departure row has no actual time', () => {
      setTrainLatestArrivalRow(null);

      const station = getTrainCurrentStation(train);

      expectToBeDefined(station);
      expect(station.name).toBe('Helsinki');
    });

    it('should be the undefined when the train has no latest arrival row and the first departure row has actual time that has passed', () => {
      jest.setSystemTime(parseISO('2023-01-25T09:00:01Z'));
      setTrainLatestArrivalRow(null);

      const station = getTrainCurrentStation({
        ...trainBase,
        timeTableRows: [
          pslDepartureRow,
          { ...hkiDepartureRow, actualTime: '2023-01-25T09:00:00Z' },
          tuDepartureRow,
        ],
      });

      expect(station).toBeUndefined();
    });

    it('should be the station of the latest arrival row when the current time is between the scheduled time of the latest arrival row and next departure row and next departure row has no actual time', () => {
      jest.setSystemTime(parseISO('2023-01-25T09:53:00Z'));
      setTrainLatestArrivalRow({
        ...timeTableRowArrivalBase,
        scheduledTime: '2023-01-25T09:55:00Z',
        station: {
          name: 'Pasila',
          shortCode: 'PSL',
        },
      });

      const station = getTrainCurrentStation(train);

      expectToBeDefined(station);
      expect(station.name).toBe('Pasila');
    });

    it('should be the station of the latest arrival row when the current time is later than the scheduled time of the latest arrival row and next departure row but next departure row has no actual time', () => {
      jest.setSystemTime(parseISO('2023-01-25T10:05:00Z'));
      setTrainLatestArrivalRow({
        ...timeTableRowArrivalBase,
        scheduledTime: '2023-01-25T09:55:00Z',
        station: {
          name: 'Pasila',
          shortCode: 'PSL',
        },
      });

      const station = getTrainCurrentStation(train);

      expectToBeDefined(station);
      expect(station.name).toBe('Pasila');
    });

    it('should be undefined when the current time is between the scheduled time of the latest arrival row and next departure row but next departure row has actual time', () => {
      jest.setSystemTime(parseISO('2023-01-25T09:53:00Z'));
      setTrainLatestArrivalRow({
        ...timeTableRowArrivalBase,
        scheduledTime: '2023-01-25T09:55:00Z',
        station: {
          name: 'Pasila',
          shortCode: 'PSL',
        },
      });

      const station = getTrainCurrentStation({
        ...trainBase,
        timeTableRows: [
          { ...pslDepartureRow, actualTime: '2023-01-25T09:52:00Z' },
          hkiDepartureRow,
          tuDepartureRow,
        ],
      });

      expect(station).toBeUndefined();
    });

    it('should be the station of the latest arrival row when there are no later departure rows after it', () => {
      setTrainLatestArrivalRow({
        ...timeTableRowArrivalBase,
        scheduledTime: '2023-01-25T12:00:00Z',
        station: {
          name: 'Tampere',
          shortCode: 'TPE',
        },
      });

      const station = getTrainCurrentStation(train);

      expectToBeDefined(station);
      expect(station.name).toBe('Tampere');
    });
  });
});
