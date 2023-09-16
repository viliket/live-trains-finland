import {
  StationPlatformSide,
  TrainDetailsFragment,
} from '../../graphql/generated/digitraffic';
import getStationPlatformSide from '../getStationPlatformSide';
import getTimeTableRowsGroupedByStation from '../getTimeTableRowsGroupedByStation';
import getTrainDirection from '../getTrainDirection';

import trainIc143DirectionReversesAfterTpe from './__fixtures__/train-IC-143-HKI-PM-composition-direction-reverse-after-TPE.json';
import trainIc266RoiHki from './__fixtures__/train-IC-266-ROI-HKI-composition-changes.json';
import trainPyo276KliHki from './__fixtures__/train-PYO-276-KLI-HKI-composition-changes.json';
import trainR2Units2AdditionalUnitsFromRi from './__fixtures__/train-R-2-units-TPE-RI-2-additional-units-RI-HKI.json';
import trainR4Units2FirstUnitsContinueFromRi from './__fixtures__/train-R-4-units-HKI-RI-2-first-units-continue-RI-TPE.json';
import trainUHkiKknSingleUnit from './__fixtures__/train-U-HKI-KKN-single-unit.json';
import trainUKknHkiSingleUnit from './__fixtures__/train-U-KKN-HKI-single-unit.json';

function testStationPlatformSides(
  train: TrainDetailsFragment,
  expectedPlatformSides: (string | null)[]
) {
  const timeTableGroups = getTimeTableRowsGroupedByStation(train);
  expectToBeDefined(timeTableGroups);
  train.timeTableGroups = timeTableGroups;

  timeTableGroups
    .map((g) => ({
      ...g,
      trainDirection: getTrainDirection(train, g),
    }))
    .forEach((g, i) => {
      const row = g.departure ?? g.arrival;
      it(`should be ${expectedPlatformSides[i]} for station ${row?.station.name} ${row?.station.shortCode} track ${row?.commercialTrack}`, () => {
        expect(getStationPlatformSide(g)).toBe(expectedPlatformSides[i]);
      });
    });
}

describe('getTrainPlatformSide', () => {
  describe('U train HKI-KKN', () => {
    const train = trainUHkiKknSingleUnit as TrainDetailsFragment;
    const expectedPlatformSides = [
      StationPlatformSide.Right, // Helsinki - 14
      StationPlatformSide.Right, // Pasila - 8
      StationPlatformSide.Left, // Huopalahti - 1
      StationPlatformSide.Right, // Leppävaara - 1
      StationPlatformSide.Right, // Kilo - 1
      StationPlatformSide.Right, // Kera - 1
      StationPlatformSide.Right, // Kauniainen - 1
      StationPlatformSide.Right, // Koivuhovi - 1
      StationPlatformSide.Right, // Tuomarila - 1
      StationPlatformSide.Right, // Espoo - 1
      StationPlatformSide.Right, // Kauklahti - 1
      StationPlatformSide.Right, // Masala - 1
      StationPlatformSide.Right, // Jorvas - 1
      StationPlatformSide.Right, // Tolsa - 1
      StationPlatformSide.Right, // Kirkkunummi - 1
    ];

    testStationPlatformSides(train, expectedPlatformSides);
  });

  describe('U train KKN-HKI', () => {
    const train = trainUKknHkiSingleUnit as TrainDetailsFragment;
    const expectedPlatformSides = [
      StationPlatformSide.Left, // Kirkkonummi - 3
      StationPlatformSide.Right, // Tolsa - 2
      StationPlatformSide.Right, // Jorvas - 2
      StationPlatformSide.Right, // Masala - 2
      StationPlatformSide.Right, // Kauklahti - 2
      StationPlatformSide.Right, // Espoo - 2
      StationPlatformSide.Right, // Tuomarila - 2
      StationPlatformSide.Right, // Koivuhovi - 2
      StationPlatformSide.Right, // Kauniainen - 2
      StationPlatformSide.Right, // Kera - 2
      StationPlatformSide.Right, // Kilo - 2
      StationPlatformSide.Right, // Leppävaara - 2
      StationPlatformSide.Left, // Huopalahti - 2
      StationPlatformSide.Right, // Pasila - 9
      StationPlatformSide.Left, // Helsinki - 14
    ];

    testStationPlatformSides(train, expectedPlatformSides);
  });

  describe('R train HKI-TPE', () => {
    const train = trainR4Units2FirstUnitsContinueFromRi as TrainDetailsFragment;
    const expectedPlatformSides = [
      StationPlatformSide.Left, // Helsinki - 5
      StationPlatformSide.Right, // Pasila - 4
      StationPlatformSide.Right, // Tikkurila - 2
      StationPlatformSide.Right, // Kerava - 4
      StationPlatformSide.Right, // Ainola - 2
      StationPlatformSide.Left, // Järvenpää - 4
      StationPlatformSide.Left, // Saunakallio - 4
      StationPlatformSide.Right, // Jokela - 2
      StationPlatformSide.Right, // Hyvinkää - 4
      StationPlatformSide.Right, // Riihimäki - 4
      StationPlatformSide.Right, // Ryttylä - 2
      StationPlatformSide.Right, // Turenki - 3
      StationPlatformSide.Left, // Hämeenlinna - 3
      StationPlatformSide.Left, // Parola - 3
      StationPlatformSide.Right, // Iittala - 2
      StationPlatformSide.Left, // Toijala - 4
      StationPlatformSide.Right, // Viiala - 2
      StationPlatformSide.Right, // Lempäälä - 3
      StationPlatformSide.Right, // Tampere - 2
    ];

    testStationPlatformSides(train, expectedPlatformSides);
  });

  describe('R train TPE-HKI', () => {
    const train = trainR2Units2AdditionalUnitsFromRi as TrainDetailsFragment;
    const expectedPlatformSides = [
      StationPlatformSide.Right, // Tampere - 3
      StationPlatformSide.Right, // Lempäälä - 1
      StationPlatformSide.Right, // Viiala - 1
      StationPlatformSide.Left, // Toijala - 3
      StationPlatformSide.Right, // Iittala - 1
      StationPlatformSide.Right, // Parola - 1
      StationPlatformSide.Right, // Hämeenlinna - 1
      StationPlatformSide.Right, // Turenki - 1
      StationPlatformSide.Right, // Ryttylä - 1
      StationPlatformSide.Right, // Riihimäki - 1
      StationPlatformSide.Right, // Hyvinkää - 1
      StationPlatformSide.Right, // Jokela - 1
      StationPlatformSide.Right, // Saunakallio - 1
      StationPlatformSide.Right, // Järvenpää - 1
      StationPlatformSide.Right, // Ainola - 1
      StationPlatformSide.Right, // Kerava - 1
      StationPlatformSide.Right, // Tikkurila - 3
      StationPlatformSide.Right, // Pasila - 5
      StationPlatformSide.Right, // Helsinki - 5
    ];

    testStationPlatformSides(train, expectedPlatformSides);
  });

  describe('IC 43 train HKI-PM', () => {
    const train = trainIc143DirectionReversesAfterTpe as TrainDetailsFragment;
    const expectedPlatformSides = [
      StationPlatformSide.Right, // Helsinki - 8
      StationPlatformSide.Left, // Pasila - 3
      StationPlatformSide.Right, // Tikkurila - 2
      StationPlatformSide.Left, // Tampere - 3
      StationPlatformSide.Right, // Orivesi - 2
      StationPlatformSide.Right, // Jämsä - 2
      StationPlatformSide.Left, // Jyväskylä - 1
      StationPlatformSide.Right, // Hankasalmi - 2
      StationPlatformSide.Right, // Pieksämäki - 3
    ];

    testStationPlatformSides(train, expectedPlatformSides);
  });

  describe('PYO 276 HLI-HKI', () => {
    const train = trainPyo276KliHki as TrainDetailsFragment;
    const expectedPlatformSides = [
      StationPlatformSide.Right, // Kolari - 1
      StationPlatformSide.Right, // Pello - 1
      StationPlatformSide.Right, // Ylitornio - 1
      StationPlatformSide.Right, // Tornio-Itäinen - 1
      null, // Laurila - 621 - TODO: No data
      StationPlatformSide.Right, // Kemi - 1
      null, // Simo - 421 - TODO: No data
      StationPlatformSide.Right, // Oulu - 3
      StationPlatformSide.Right, // Kempele - 1
      null, // Hirvineva - 601 - TODO: No data
      StationPlatformSide.Right, // Ylivieska - 1
      StationPlatformSide.Left, // Kokkola - 2
      StationPlatformSide.Right, // Pännäinen - 1
      null, // Kauhava - 002 - TODO: No data
      null, // Seinäjoki - 1 - TODO: No data
      null, // Ratikylä - 602 - TODO: No data
      StationPlatformSide.Right, // Tampere - 1
      StationPlatformSide.Left, // Toijala - 3
      StationPlatformSide.Left, // Hämeenlinna - 2
      StationPlatformSide.Right, // Riihimäki - 1
      StationPlatformSide.Right, // Tikkurila - 1
      null, // Pasila tavara - 101 - TODO: No data
      StationPlatformSide.Left, // Pasila - 6
      StationPlatformSide.Left, // Helsinki - 8
    ];

    testStationPlatformSides(train, expectedPlatformSides);
  });

  describe('IC 266 ROI-HKI', () => {
    const train = trainIc266RoiHki as TrainDetailsFragment;
    const expectedPlatformSides = [
      StationPlatformSide.Right, // Rovaniemi - 1
      StationPlatformSide.Left, // Muurola - 1
      StationPlatformSide.Left, // Tervola - 1
      StationPlatformSide.Right, // Kemi - 1
      StationPlatformSide.Right, // Oulu - 3
      StationPlatformSide.Right, // Kempele - 1
      null, // Hirvineva - 601 - TODO: No data
      StationPlatformSide.Right, // Ruukki - 1
      StationPlatformSide.Right, // Vihanti - 2
      StationPlatformSide.Left, // Oulainen - 2 - Note: Verified. The map shows track numbers in slightly wrong position.
      StationPlatformSide.Right, // Ylivieska - 1
      StationPlatformSide.Right, // Kannus - 1
      StationPlatformSide.Left, // Kokkola - 2
      StationPlatformSide.Left, // Pännäinen - 2
      StationPlatformSide.Left, // Kauhava - 1
      StationPlatformSide.Right, // Lapua - 1
      null, // Seinäjoki - 2 - TODO: No data
      StationPlatformSide.Right, // Parkano - 1
      StationPlatformSide.Right, // Tampere - 3
      StationPlatformSide.Left, // Toijala - 3
      StationPlatformSide.Left, // Hämeenlinna - 2
      StationPlatformSide.Right, // Riihimäki - 1
      StationPlatformSide.Right, // Tikkurila - 1
      null, // Pasila tavara - 101 - TODO: No data
      StationPlatformSide.Left, // Pasila - 6
      StationPlatformSide.Left, // Helsinki - 8
    ];

    testStationPlatformSides(train, expectedPlatformSides);
  });
});
