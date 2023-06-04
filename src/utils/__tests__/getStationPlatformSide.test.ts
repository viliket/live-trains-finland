import { TrainDetailsFragment } from '../../graphql/generated/digitraffic';
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
  expect(timeTableGroups).toBeDefined();
  train.timeTableGroups = timeTableGroups;

  timeTableGroups!
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
      'right', // Helsinki - 14
      'right', // Pasila - 8
      'left', // Huopalahti - 1
      'right', // Leppävaara - 1
      'right', // Kilo - 1
      'right', // Kera - 1
      'right', // Kauniainen - 1
      'right', // Koivuhovi - 1
      'right', // Tuomarila - 1
      'right', // Espoo - 1
      'right', // Kauklahti - 1
      'right', // Masala - 1
      'right', // Jorvas - 1
      'right', // Tolsa - 1
      'right', // Kirkkunummi - 1
    ];

    testStationPlatformSides(train, expectedPlatformSides);
  });

  describe('U train KKN-HKI', () => {
    const train = trainUKknHkiSingleUnit as TrainDetailsFragment;
    const expectedPlatformSides = [
      'left', // Kirkkonummi - 3
      'right', // Tolsa - 2
      'right', // Jorvas - 2
      'right', // Masala - 2
      'right', // Kauklahti - 2
      'right', // Espoo - 2
      'right', // Tuomarila - 2
      'right', // Koivuhovi - 2
      'right', // Kauniainen - 2
      'right', // Kera - 2
      'right', // Kilo - 2
      'right', // Leppävaara - 2
      'left', // Huopalahti - 2
      'right', // Pasila - 9
      'left', // Helsinki - 14
    ];

    testStationPlatformSides(train, expectedPlatformSides);
  });

  describe('R train HKI-TPE', () => {
    const train = trainR4Units2FirstUnitsContinueFromRi as TrainDetailsFragment;
    const expectedPlatformSides = [
      'left', // Helsinki - 5
      'right', // Pasila - 4
      'right', // Tikkurila - 2
      'right', // Kerava - 4
      'right', // Ainola - 2
      'left', // Järvenpää - 4
      'left', // Saunakallio - 4
      'right', // Jokela - 2
      'right', // Hyvinkää - 4
      'right', // Riihimäki - 4
      'right', // Ryttylä - 2
      'right', // Turenki - 3
      'left', // Hämeenlinna - 3
      'left', // Parola - 3
      'right', // Iittala - 2
      'left', // Toijala - 4
      'right', // Viiala - 2
      'right', // Lempäälä - 3
      'right', // Tampere - 2
    ];

    testStationPlatformSides(train, expectedPlatformSides);
  });

  describe('R train TPE-HKI', () => {
    const train = trainR2Units2AdditionalUnitsFromRi as TrainDetailsFragment;
    const expectedPlatformSides = [
      'right', // Tampere - 3
      'right', // Lempäälä - 1
      'right', // Viiala - 1
      'left', // Toijala - 3
      'right', // Iittala - 1
      'right', // Parola - 1
      'right', // Hämeenlinna - 1
      'right', // Turenki - 1
      'right', // Ryttylä - 1
      'right', // Riihimäki - 1
      'right', // Hyvinkää - 1
      'right', // Jokela - 1
      'right', // Saunakallio - 1
      'right', // Järvenpää - 1
      'right', // Ainola - 1
      'right', // Kerava - 1
      'right', // Tikkurila - 3
      'right', // Pasila - 5
      'right', // Helsinki - 5
    ];

    testStationPlatformSides(train, expectedPlatformSides);
  });

  describe('IC 43 train HKI-PM', () => {
    const train = trainIc143DirectionReversesAfterTpe as TrainDetailsFragment;
    const expectedPlatformSides = [
      'right', // Helsinki - 8
      'left', // Pasila - 3
      'right', // Tikkurila - 2
      'left', // Tampere - 3
      'right', // Orivesi - 2
      'right', // Jämsä - 2
      'left', // Jyväskylä - 1
      'right', // Hankasalmi - 2
      'right', // Pieksämäki - 3
    ];

    testStationPlatformSides(train, expectedPlatformSides);
  });

  describe('PYO 276 HLI-HKI', () => {
    const train = trainPyo276KliHki as TrainDetailsFragment;
    const expectedPlatformSides = [
      'right', // Kolari - 1
      'right', // Pello - 1
      'right', // Ylitornio - 1
      'right', // Tornio-Itäinen - 1
      null, // Laurila - 621 - TODO: No data
      'right', // Kemi - 1
      null, // Simo - 421 - TODO: No data
      'right', // Oulu - 3
      'right', // Kempele - 1
      null, // Hirvineva - 601 - TODO: No data
      'right', // Ylivieska - 1
      'left', // Kokkola - 2
      'right', // Pännäinen - 1
      null, // Kauhava - 002 - TODO: No data
      null, // Seinäjoki - 1 - TODO: No data
      null, // Ratikylä - 602 - TODO: No data
      'right', // Tampere - 1
      'left', // Toijala - 3
      'left', // Hämeenlinna - 2
      'right', // Riihimäki - 1
      'right', // Tikkurila - 1
      null, // Pasila tavara - 101 - TODO: No data
      'left', // Pasila - 6
      'left', // Helsinki - 8
    ];

    testStationPlatformSides(train, expectedPlatformSides);
  });

  describe('IC 266 ROI-HKI', () => {
    const train = trainIc266RoiHki as TrainDetailsFragment;
    const expectedPlatformSides = [
      'right', // Rovaniemi - 1
      'left', // Muurola - 1
      'left', // Tervola - 1
      'right', // Kemi - 1
      'right', // Oulu - 3
      'right', // Kempele - 1
      null, // Hirvineva - 601 - TODO: No data
      'right', // Ruukki - 1
      'right', // Vihanti - 2
      'left', // Oulainen - 2 - Note: Verified. The map shows track numbers in slightly wrong position.
      'right', // Ylivieska - 1
      'right', // Kannus - 1
      'left', // Kokkola - 2
      'left', // Pännäinen - 2
      'left', // Kauhava - 1
      'right', // Lapua - 1
      null, // Seinäjoki - 2 - TODO: No data
      'right', // Parkano - 1
      'right', // Tampere - 3
      'left', // Toijala - 3
      'left', // Hämeenlinna - 2
      'right', // Riihimäki - 1
      'right', // Tikkurila - 1
      null, // Pasila tavara - 101 - TODO: No data
      'left', // Pasila - 6
      'left', // Helsinki - 8
    ];

    testStationPlatformSides(train, expectedPlatformSides);
  });
});
