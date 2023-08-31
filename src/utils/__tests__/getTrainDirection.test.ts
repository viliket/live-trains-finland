import {
  TimeTableRowType,
  TrainDetailsFragment,
  TrainDirection,
} from '../../graphql/generated/digitraffic';
import getTimeTableRowsGroupedByStation from '../getTimeTableRowsGroupedByStation';
import getTrainDirection from '../getTrainDirection';

import trainHmd482SkJy from './__fixtures__/train-HMD-482-SK-JY.json';
import trainIc143DirectionReversesAfterTpe from './__fixtures__/train-IC-143-HKI-PM-composition-direction-reverse-after-TPE.json';
import trainIc266RoiHki from './__fixtures__/train-IC-266-ROI-HKI-composition-changes.json';
import trainPyo276KliHki from './__fixtures__/train-PYO-276-KLI-HKI-composition-changes.json';
import trainR2Units2AdditionalUnitsFromRi from './__fixtures__/train-R-2-units-TPE-RI-2-additional-units-RI-HKI.json';
import trainR4Units2FirstUnitsContinueFromRi from './__fixtures__/train-R-4-units-HKI-RI-2-first-units-continue-RI-TPE.json';
import trainR4Units2LastUnitsContinueFromRi from './__fixtures__/train-R-4-units-HKI-RI-2-last-units-continue-RI-TPE.json';

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

function testTrainDirections(
  train: TrainDetailsFragment,
  expectedDirections: string[]
) {
  const timeTableGroups = getTimeTableRowsGroupedByStation(train);
  expect(timeTableGroups).toBeDefined();
  train.timeTableGroups = timeTableGroups;

  timeTableGroups!.forEach((g, i) => {
    const row = g.departure ?? g.arrival;
    it(`should be ${expectedDirections[i]} for station ${row?.station.name} ${row?.station.shortCode} track ${row?.commercialTrack}`, () => {
      expect(getTrainDirection(train, g)).toBe(expectedDirections[i]);
    });
  });
}

describe('getTrainDirection', () => {
  it('should be INCREASING on all stations for a train HKI - PSL - TPE', () => {
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

    const timeTableGroups = getTimeTableRowsGroupedByStation(train);
    expect(timeTableGroups).toBeDefined();
    train.timeTableGroups = timeTableGroups;

    timeTableGroups!.forEach((g) => {
      expect(getTrainDirection(train, g)).toBe(TrainDirection.Increasing);
    });
  });

  it('should be null on the train has no time table rows', () => {
    const train: TrainDetailsFragment = {
      ...trainBase,
    };

    expect(getTrainDirection(train, {})).toBe(null);
  });

  it('should be null on when no line km info exists for the station code', () => {
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
            // There is no line km info available for this station
            name: 'No such station',
            shortCode: 'NOSUCH',
          },
        },
        {
          ...timeTableRowBase,
          type: TimeTableRowType.Departure,
          scheduledTime: '2023-01-25T10:55:00Z',
          station: {
            // There is no line km info available for this station
            name: 'No such station',
            shortCode: 'NOSUCH',
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

    const timeTableGroups = getTimeTableRowsGroupedByStation(train);
    expect(timeTableGroups).toBeDefined();
    train.timeTableGroups = timeTableGroups;

    timeTableGroups!.forEach((g) => {
      expect(getTrainDirection(train, g)).toBe(null);
    });
  });

  it('should be INCREASING on all stations for a 4-unit R train from HKI->RI with only two last units continuing from RI->TPE', () => {
    const train = trainR4Units2LastUnitsContinueFromRi as TrainDetailsFragment;
    const timeTableGroups = getTimeTableRowsGroupedByStation(train);
    expect(timeTableGroups).toBeDefined();
    train.timeTableGroups = timeTableGroups;

    timeTableGroups!.forEach((g) => {
      expect(getTrainDirection(train, g)).toBe(TrainDirection.Increasing);
    });
  });

  it('should be INCREASING on all stations for a 4-unit R train from HKI->RI with only two first units continuing from RI->TPE', () => {
    const train = trainR4Units2FirstUnitsContinueFromRi as TrainDetailsFragment;
    const timeTableGroups = getTimeTableRowsGroupedByStation(train);
    expect(timeTableGroups).toBeDefined();
    train.timeTableGroups = timeTableGroups;

    timeTableGroups!.forEach((g) => {
      expect(getTrainDirection(train, g)).toBe(TrainDirection.Increasing);
    });
  });

  it('should be DECREASING on all stations for a 2-unit R train from TPE->RI with two additional units from RI->HKI', () => {
    const train = trainR2Units2AdditionalUnitsFromRi as TrainDetailsFragment;
    const timeTableGroups = getTimeTableRowsGroupedByStation(train);
    expect(timeTableGroups).toBeDefined();
    train.timeTableGroups = timeTableGroups;

    timeTableGroups!.forEach((g) => {
      expect(getTrainDirection(train, g)).toBe(TrainDirection.Decreasing);
    });
  });

  describe('IC 266 ROI->HKI', () => {
    const train = trainIc266RoiHki as TrainDetailsFragment;
    const expectedDirections = [
      TrainDirection.Decreasing, // Rovaniemi
      TrainDirection.Decreasing, // Muurola
      TrainDirection.Decreasing, // Tervola
      TrainDirection.Decreasing, // Kemi
      TrainDirection.Decreasing, // Oulu
      TrainDirection.Decreasing, // Kempele
      TrainDirection.Decreasing, // Hirvineva
      TrainDirection.Decreasing, // Ruukki
      TrainDirection.Decreasing, // Vihanti
      TrainDirection.Decreasing, // Oulainen
      TrainDirection.Decreasing, // Ylivieska
      TrainDirection.Decreasing, // Kannus
      TrainDirection.Decreasing, // Kokkola
      TrainDirection.Decreasing, // Pännäinen
      TrainDirection.Decreasing, // Kauhava
      TrainDirection.Decreasing, // Lapua
      TrainDirection.Decreasing, // Seinäjoki
      TrainDirection.Decreasing, // Parkano
      TrainDirection.Decreasing, // Tampere
      TrainDirection.Decreasing, // Toijala
      TrainDirection.Decreasing, // Hämeenlinna
      TrainDirection.Decreasing, // Riihimäki
      TrainDirection.Decreasing, // Tikkurila
      TrainDirection.Decreasing, // Pasila tavara
      TrainDirection.Decreasing, // Pasila
      TrainDirection.Decreasing, // Helsinki
    ];

    testTrainDirections(train, expectedDirections);
  });

  describe('PYO 276 KLI->HKI', () => {
    const train = trainPyo276KliHki as TrainDetailsFragment;
    const expectedDirections = [
      TrainDirection.Decreasing, // Kolari
      TrainDirection.Decreasing, // Pello
      TrainDirection.Decreasing, // Ylitornio
      TrainDirection.Decreasing, // Tornio-Itäinen
      TrainDirection.Decreasing, // Laurila
      TrainDirection.Decreasing, // Kemi
      TrainDirection.Decreasing, // Simo
      TrainDirection.Decreasing, // Oulu
      TrainDirection.Decreasing, // Kempele
      TrainDirection.Decreasing, // Hirvineva
      TrainDirection.Decreasing, // Ylivieska
      TrainDirection.Decreasing, // Kokkola
      TrainDirection.Decreasing, // Pännäinen
      TrainDirection.Decreasing, // Kauhava
      TrainDirection.Decreasing, // Seinäjoki
      TrainDirection.Decreasing, // Ratikylä
      TrainDirection.Decreasing, // Tampere
      TrainDirection.Decreasing, // Toijala
      TrainDirection.Decreasing, // Hämeenlinna
      TrainDirection.Decreasing, // Riihimäki
      TrainDirection.Decreasing, // Tikkurila
      TrainDirection.Decreasing, // Pasila tavara
      TrainDirection.Decreasing, // Pasila
      TrainDirection.Decreasing, // Helsinki
    ];

    testTrainDirections(train, expectedDirections);
  });

  describe('IC 143 train HKI-PKI which reverses direction at Tampere', () => {
    const train = trainIc143DirectionReversesAfterTpe as TrainDetailsFragment;
    const expectedDirections = [
      TrainDirection.Increasing, // Helsinki
      TrainDirection.Increasing, // Pasila
      TrainDirection.Increasing, // Tikkurila
      TrainDirection.Increasing, // Tampere
      TrainDirection.Increasing, // Orivesi
      TrainDirection.Increasing, // Jämsä - linekm is 284
      TrainDirection.Increasing, // Jyväskylä - linekm is 340
      TrainDirection.Increasing, // Hankasalmi - linekm is 417
      TrainDirection.Increasing, // Pieksämäki - linekm is 457
    ];

    testTrainDirections(train, expectedDirections);
  });

  describe('HMD 482 train SK-JY', () => {
    const train = trainHmd482SkJy as TrainDetailsFragment;
    const expectedDirections = [
      TrainDirection.Decreasing, // Seinäjoki
      TrainDirection.Decreasing, // Alavus
      TrainDirection.Decreasing, // Tuuri
      TrainDirection.Decreasing, // Ähtäri
      TrainDirection.Decreasing, // Eläinpuisto-Zoo
      TrainDirection.Decreasing, // Myllymäki
      TrainDirection.Decreasing, // Pihlajavesi - linekm 312 for track number 066
      TrainDirection.Decreasing, // Haapamäki - linekm 300 for track number 066 AND linekm 300 for track number 023
      TrainDirection.Increasing, // Keuruu - linekm 316 for track number 023
      TrainDirection.Increasing, // Petäjävesi - linekm 343 for track number 023
      TrainDirection.Increasing, // Jyväskylä - linekm 377  for track number 023
    ];

    testTrainDirections(train, expectedDirections);
  });
});
