import { parseISO } from 'date-fns';

import {
  TimeTableRowType,
  TrainByStationFragment,
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
  getWagonNumberFromVehicleId,
  getTrainDisplayName,
  getTrainRouteGtfsId,
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

/**
 * Ring rail (Kehärata) train HKI to HKI via LEN (airport)
 */
const ringRailTrainBase: TrainDetailsFragment = {
  ...trainBase,
  commuterLineid: 'I',
  timeTableRows: [
    {
      ...departureTimeTableRowBase,
      scheduledTime: '2023-01-25T08:55:00Z',
      station: {
        name: 'Helsinki',
        shortCode: 'HKI',
      },
    },
    {
      ...arrivalTimeTableRowBase,
      scheduledTime: '2023-01-25T09:00:00Z',
      station: {
        name: 'Pasila',
        shortCode: 'PSL',
      },
    },
    {
      ...departureTimeTableRowBase,
      scheduledTime: '2023-01-25T09:05:00Z',
      station: {
        name: 'Pasila',
        shortCode: 'PSL',
      },
    },
    {
      ...arrivalTimeTableRowBase,
      scheduledTime: '2023-01-25T11:00:00Z',
      station: {
        name: 'Lentoasema',
        shortCode: 'LEN',
      },
    },
    {
      ...departureTimeTableRowBase,
      scheduledTime: '2023-01-25T11:05:00Z',
      station: {
        name: 'Lentoasema',
        shortCode: 'LEN',
      },
    },
    {
      ...arrivalTimeTableRowBase,
      scheduledTime: '2023-01-25T11:30:00Z',
      station: {
        name: 'Pasila',
        shortCode: 'PSL',
      },
    },
    {
      ...departureTimeTableRowBase,
      scheduledTime: '2023-01-25T11:35:00Z',
      station: {
        name: 'Pasila',
        shortCode: 'PSL',
      },
    },
    {
      ...arrivalTimeTableRowBase,
      scheduledTime: '2023-01-25T11:40:00Z',
      station: {
        name: 'Helsinki',
        shortCode: 'HKI',
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

    expectToBeDefined(row);
    expect(row.station.name).toBe('Helsinki');
  });
});

describe('getDestinationTimeTableRow', () => {
  it('should be the arrival row with the latest scheduled time', () => {
    const row = getDestinationTimeTableRow(train);

    expectToBeDefined(row);
    expect(row.station.name).toBe('Tampere');
  });
});

describe('getTrainDepartureStation', () => {
  it('should be the station of the departure time table row', () => {
    const station = getTrainDepartureStation(train);

    expectToBeDefined(station);
    expect(station.name).toBe('Helsinki');
  });
});

describe('getTrainDestinationStation', () => {
  it('should be the station of the destination time table row', () => {
    const station = getTrainDestinationStation(train);

    expectToBeDefined(station);
    expect(station.name).toBe('Tampere');
  });
  describe.each(['I', 'P'])('ring rail %s train', (commuterLineid: string) => {
    const ringRailTrain = {
      ...ringRailTrainBase,
      commuterLineid: commuterLineid,
    };

    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should be the LEN (airport) station when the given station is earlier than LEN', () => {
      jest.setSystemTime(parseISO('2023-01-25T08:55:00Z'));

      const destStationAtHki = getTrainDestinationStation(ringRailTrain, 'HKI');
      expectToBeDefined(destStationAtHki);
      expect(destStationAtHki.name).toBe('Lentoasema');

      const destStationAtPsl = getTrainDestinationStation(ringRailTrain, 'PSL');
      expectToBeDefined(destStationAtPsl);
      expect(destStationAtPsl.name).toBe('Lentoasema');
    });

    it('should be the station of the destination time table row when the given station is later than LEN', () => {
      // Train is between section PSL - LEN based on current time and train schedule
      // So train has already passed PSL (first time)
      jest.setSystemTime(parseISO('2023-01-25T10:30:00Z'));

      const destStationAtLen = getTrainDestinationStation(ringRailTrain, 'LEN');
      expectToBeDefined(destStationAtLen);
      expect(destStationAtLen.name).toBe('Helsinki');

      const destStationAtPsl = getTrainDestinationStation(ringRailTrain, 'PSL');
      expectToBeDefined(destStationAtPsl);
      expect(destStationAtPsl.name).toBe('Helsinki');

      const destStationAtHki = getTrainDestinationStation(ringRailTrain, 'HKI');
      expectToBeDefined(destStationAtHki);
      expect(destStationAtHki.name).toBe('Helsinki');
    });
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

describe('getWagonNumberFromVehicleId', () => {
  it('should be the vehicle ID when the wagon type is not Sm5', () => {
    const wagonNumber1 = getWagonNumberFromVehicleId(1111, 'Sm1');
    expect(wagonNumber1).toBe('1111');

    const wagonNumber2 = getWagonNumberFromVehicleId(1234, 'Sm2');
    expect(wagonNumber2).toBe('1234');

    const wagonNumber3 = getWagonNumberFromVehicleId(4321, 'Sm4');
    expect(wagonNumber3).toBe('4321');
  });

  it('should be the last two digits of the vehicle ID when the wagon type is Sm5', () => {
    const wagonNumber1 = getWagonNumberFromVehicleId(1234, 'Sm5');
    expect(wagonNumber1).toBe('34');

    const wagonNumber2 = getWagonNumberFromVehicleId(4321, 'Sm5');
    expect(wagonNumber2).toBe('21');
  });
});

describe('getTrainDisplayName', () => {
  it('should be the commuter line ID when the train has a commuter line ID', () => {
    const train: TrainByStationFragment = {
      ...trainBase,
      commuterLineid: 'U',
      trainNumber: 1234,
    };
    const displayName = getTrainDisplayName(train);
    expect(displayName).toBe('U');
  });

  it('should be the train type name + train number when the train has no commuter line ID', () => {
    const train: TrainByStationFragment = {
      ...trainBase,
      trainType: {
        name: 'IC',
        trainCategory: {
          name: 'InterCity',
        },
      },
      trainNumber: 1234,
    };
    const displayName = getTrainDisplayName(train);
    expect(displayName).toBe('IC 1234');
  });
});

describe('getTrainRouteGtfsId', () => {
  it('should return correct GTFS ID for a commuter train', () => {
    const train: TrainByStationFragment = {
      ...trainBase,
      commuterLineid: 'U',
      trainNumber: 1234,
      trainType: {
        name: '',
        trainCategory: {
          name: 'Commuter',
        },
      },
      timeTableRows: [
        {
          ...departureTimeTableRowBase,
          scheduledTime: '2023-01-25T09:00:00Z',
          station: {
            shortCode: 'HKI',
            name: 'Helsinki',
          },
        },
        {
          ...arrivalTimeTableRowBase,
          scheduledTime: '2023-01-25T10:00:00Z',
          station: {
            shortCode: 'KKN',
            name: 'Kirkkonummi',
          },
        },
      ],
    };
    const displayName = getTrainRouteGtfsId(train);
    expect(displayName).toBe('digitraffic:HKI_KKN_U_109_10');
  });

  it('should return correct GTFS ID for a long distance train', () => {
    const train: TrainByStationFragment = {
      ...trainBase,
      trainNumber: 1234,
      trainType: {
        name: '',
        trainCategory: {
          name: 'Long-distance',
        },
      },
      timeTableRows: [
        {
          ...departureTimeTableRowBase,
          scheduledTime: '2023-01-25T09:00:00Z',
          station: {
            shortCode: 'HKI',
            name: 'Helsinki',
          },
        },
        {
          ...arrivalTimeTableRowBase,
          scheduledTime: '2023-01-25T10:00:00Z',
          station: {
            shortCode: 'TPE',
            name: 'Tampere',
          },
        },
      ],
    };
    const displayName = getTrainRouteGtfsId(train);
    expect(displayName).toBe('digitraffic:HKI_TPE_1234_102_10');
  });
});
