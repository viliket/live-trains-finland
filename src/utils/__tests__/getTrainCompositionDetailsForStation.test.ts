import { TrainDetailsFragment } from '../../graphql/generated/digitraffic/graphql';
import getTrainCompositionDetailsForStation from '../getTrainCompositionDetailsForStation';

import trainIc143DirectionReversesAfterTpe from './__fixtures__/train-IC-143-HKI-PM-composition-direction-reverse-after-TPE.json';
import trainIc266RoiHkiV2 from './__fixtures__/train-IC-266-ROI-HKI-2023-05-20-composition-changes.json';
import trainIc266RoiHki from './__fixtures__/train-IC-266-ROI-HKI-composition-changes.json';
import trainPyo276KliHki from './__fixtures__/train-PYO-276-KLI-HKI-composition-changes.json';
import trainR2Units2AdditionalUnitsFromRi from './__fixtures__/train-R-2-units-TPE-RI-2-additional-units-RI-HKI.json';
import trainR4Units2FirstUnitsContinueFromRi from './__fixtures__/train-R-4-units-HKI-RI-2-first-units-continue-RI-TPE.json';
import trainR4Units2LastUnitsContinueFromRi from './__fixtures__/train-R-4-units-HKI-RI-2-last-units-continue-RI-TPE.json';

describe('getTrainCompositionDetailsForStation', () => {
  it('should return correct details for a 2-unit train from TPE->RI with two new units added in front from RI->HKI', () => {
    /**
     * Composition at journey section Tampere -> Riihimäki:
     * 94106004011-5 94106004021-4 -> (direction)
     *
     * Composition at journey section Riihimäki -> Helsinki:
     * 94106004011-5 94106004021-4 94106004008-1 94106004023-0 -> (direction)
     *
     * Expected composition status at Riihimäki:
     * Unchanged     Unchanged     Added         Added
     * 94106004011-5 94106004021-4 94106004008-1 94106004023-0 -> (direction)
     */
    const wagons = getTrainCompositionDetailsForStation(
      'Riihimäki',
      trainR2Units2AdditionalUnitsFromRi as TrainDetailsFragment
    );
    expectToBeDefined(wagons);
    expect(wagons.length).toBe(4);

    expect(wagons[0].wagon?.vehicleNumber).toBe('94106004023-0');
    expect(wagons[0].wagon?.location).toBe(1);
    expect(wagons[0].status).toBe('added');

    expect(wagons[1].wagon?.vehicleNumber).toBe('94106004008-1');
    expect(wagons[1].wagon?.location).toBe(2);
    expect(wagons[1].status).toBe('added');

    expect(wagons[2].wagon?.vehicleNumber).toBe('94106004021-4');
    expect(wagons[2].wagon?.location).toBe(3);
    expect(wagons[2].status).toBe('unchanged');

    expect(wagons[3].wagon?.vehicleNumber).toBe('94106004011-5');
    expect(wagons[3].wagon?.location).toBe(4);
    expect(wagons[3].status).toBe('unchanged');
  });

  it('should return correct details for a 4-unit train from HKI->RI with only two last units continuing from RI->TPE', () => {
    /**
     * Composition at journey section Helsinki -> Riihimäki:
     * 94106004001-6 94106004028-9 94106004019-8 94106004011-5 -> (direction)
     *
     * Composition at journey section Riihimäki -> Tampere:
     * 94106004001-6 94106004028-9 -> (direction)
     *
     * Expected composition status at Riihimäki:
     * Unchanged     Unchanged     Removed       Removed
     * 94106004001-6 94106004028-9 94106004019-8 94106004011-5 -> (direction)
     */
    const wagons = getTrainCompositionDetailsForStation(
      'Riihimäki',
      trainR4Units2LastUnitsContinueFromRi as TrainDetailsFragment
    );
    expectToBeDefined(wagons);
    expect(wagons.length).toBe(4);

    expect(wagons[0].wagon?.vehicleNumber).toBe('94106004011-5');
    expect(wagons[0].wagon?.location).toBe(1);
    expect(wagons[0].status).toBe('removed');

    expect(wagons[1].wagon?.vehicleNumber).toBe('94106004019-8');
    expect(wagons[1].wagon?.location).toBe(2);
    expect(wagons[1].status).toBe('removed');

    expect(wagons[2].wagon?.vehicleNumber).toBe('94106004028-9');
    expect(wagons[2].wagon?.location).toBe(1);
    expect(wagons[2].status).toBe('unchanged');

    expect(wagons[3].wagon?.vehicleNumber).toBe('94106004001-6');
    expect(wagons[3].wagon?.location).toBe(2);
    expect(wagons[3].status).toBe('unchanged');
  });

  it('should return correct details for a 4-unit train from HKI->RI with only two first units continuing from RI->TPE', () => {
    /**
     * Composition at journey section Helsinki -> Riihimäki:
     * 94106004017-2 94106004021-4 94106004028-9 94106004010-7 -> (direction)
     *
     * Composition at journey section Riihimäki -> Tampere:
     * 94106004028-9 94106004010-7 -> (direction)
     *
     * Expected composition status at Riihimäki:
     * Removed       Removed       Unchanged     Unchanged
     * 94106004017-2 94106004021-4 94106004028-9 94106004010-7 -> (direction)
     */
    const wagons = getTrainCompositionDetailsForStation(
      'Riihimäki',
      trainR4Units2FirstUnitsContinueFromRi as TrainDetailsFragment
    );

    expectToBeDefined(wagons);
    expect(wagons.length).toBe(4);

    expect(wagons[0].wagon?.vehicleNumber).toBe('94106004010-7');
    expect(wagons[0].wagon?.location).toBe(1);
    expect(wagons[0].status).toBe('unchanged');

    expect(wagons[1].wagon?.vehicleNumber).toBe('94106004028-9');
    expect(wagons[1].wagon?.location).toBe(2);
    expect(wagons[1].status).toBe('unchanged');

    expect(wagons[2].wagon?.vehicleNumber).toBe('94106004021-4');
    expect(wagons[2].wagon?.location).toBe(3);
    expect(wagons[2].status).toBe('removed');

    expect(wagons[3].wagon?.vehicleNumber).toBe('94106004017-2');
    expect(wagons[3].wagon?.location).toBe(4);
    expect(wagons[3].status).toBe('removed');
  });

  it('should return correct details for a train IC 266 from ROI->HKI', () => {
    /**
     * Composition at journey section Oulu -> Tampere:
     * 710 731 730 62 61 60 59 58 57 56 55 54 52 51 50 -> (direction)
     *
     * Composition at journey section Tampere -> Pasila tavara:
     * 710 59 58 57 56 55 54 52 51 50 -> (direction)
     *
     * Expected composition status at Tampere:
     * U   R   R   R  R  R  U  U  U  U  U  U  U  U  U
     * 710 731 730 62 61 60 59 58 57 56 55 54 52 51 50 -> (direction)
     */
    const wagons = getTrainCompositionDetailsForStation(
      'Tampere',
      trainIc266RoiHki as TrainDetailsFragment
    );

    expectToBeDefined(wagons);
    expect(wagons.length).toBe(15);

    expect(wagons[0].wagon?.salesNumber).toBe(50);
    expect(wagons[0].wagon?.location).toBe(2);
    expect(wagons[0].status).toBe('unchanged');

    expect(wagons[1].wagon?.salesNumber).toBe(51);
    expect(wagons[1].wagon?.location).toBe(3);
    expect(wagons[1].status).toBe('unchanged');

    expect(wagons[2].wagon?.salesNumber).toBe(52);
    expect(wagons[2].wagon?.location).toBe(4);
    expect(wagons[2].status).toBe('unchanged');

    expect(wagons[3].wagon?.salesNumber).toBe(54);
    expect(wagons[3].wagon?.location).toBe(5);
    expect(wagons[3].status).toBe('unchanged');

    expect(wagons[4].wagon?.salesNumber).toBe(55);
    expect(wagons[4].wagon?.location).toBe(6);
    expect(wagons[4].status).toBe('unchanged');

    expect(wagons[5].wagon?.salesNumber).toBe(56);
    expect(wagons[5].wagon?.location).toBe(7);
    expect(wagons[5].status).toBe('unchanged');

    expect(wagons[6].wagon?.salesNumber).toBe(57);
    expect(wagons[6].wagon?.location).toBe(8);
    expect(wagons[6].status).toBe('unchanged');

    expect(wagons[7].wagon?.salesNumber).toBe(58);
    expect(wagons[7].wagon?.location).toBe(9);
    expect(wagons[7].status).toBe('unchanged');

    expect(wagons[8].wagon?.salesNumber).toBe(59);
    expect(wagons[8].wagon?.location).toBe(10);
    expect(wagons[8].status).toBe('unchanged');

    expect(wagons[9].wagon?.salesNumber).toBe(60);
    expect(wagons[9].wagon?.location).toBe(11);
    expect(wagons[9].status).toBe('removed');

    expect(wagons[10].wagon?.salesNumber).toBe(61);
    expect(wagons[10].wagon?.location).toBe(12);
    expect(wagons[10].status).toBe('removed');

    expect(wagons[11].wagon?.salesNumber).toBe(62);
    expect(wagons[11].wagon?.location).toBe(13);
    expect(wagons[11].status).toBe('removed');

    expect(wagons[12].wagon?.salesNumber).toBe(730);
    expect(wagons[12].wagon?.location).toBe(14);
    expect(wagons[12].status).toBe('removed');

    expect(wagons[13].wagon?.salesNumber).toBe(731);
    expect(wagons[13].wagon?.location).toBe(15);
    expect(wagons[13].status).toBe('removed');

    expect(wagons[14].wagon?.salesNumber).toBe(710);
    expect(wagons[14].wagon?.location).toBe(11);
    expect(wagons[14].status).toBe('unchanged');
  });

  it('should return correct details for a train IC 266 2023-05-20 from ROI->HKI at Tampere', () => {
    /**
     * Composition at journey section Oulu -> Tampere:
     * 999 710 730 62 61 60 59 58 57 56 55 52 51 50 -> (direction)
     *
     * Composition at journey section Tampere -> Pasila tavara:
     * 999 710 52 51 50 55 56 59 58 57 -> (direction)
     *
     * Expected composition status at Tampere:
     * U   U   A  A  A  A  A  R   R  R  R  U  U  U  R  R  R  R  R
     * 999 710 52 51 50 55 56 730 62 61 60 59 58 57 56 55 52 51 50 -> (direction)
     */
    const wagons = getTrainCompositionDetailsForStation(
      'Tampere',
      trainIc266RoiHkiV2 as TrainDetailsFragment
    );

    expectToBeDefined(wagons);
    expect(wagons.length).toBe(19);

    expect(wagons[0].wagon?.salesNumber).toBe(50);
    expect(wagons[0].wagon?.location).toBe(2);
    expect(wagons[0].status).toBe('removed');

    expect(wagons[1].wagon?.salesNumber).toBe(51);
    expect(wagons[1].wagon?.location).toBe(3);
    expect(wagons[1].status).toBe('removed');

    expect(wagons[2].wagon?.salesNumber).toBe(52);
    expect(wagons[2].wagon?.location).toBe(4);
    expect(wagons[2].status).toBe('removed');

    expect(wagons[3].wagon?.salesNumber).toBe(55);
    expect(wagons[3].wagon?.location).toBe(5);
    expect(wagons[3].status).toBe('removed');

    expect(wagons[4].wagon?.salesNumber).toBe(56);
    expect(wagons[4].wagon?.location).toBe(6);
    expect(wagons[4].status).toBe('removed');

    expect(wagons[5].wagon?.salesNumber).toBe(57);
    expect(wagons[5].wagon?.location).toBe(2);
    expect(wagons[5].status).toBe('unchanged');

    expect(wagons[6].wagon?.salesNumber).toBe(58);
    expect(wagons[6].wagon?.location).toBe(3);
    expect(wagons[6].status).toBe('unchanged');

    expect(wagons[7].wagon?.salesNumber).toBe(59);
    expect(wagons[7].wagon?.location).toBe(4);
    expect(wagons[7].status).toBe('unchanged');

    expect(wagons[8].wagon?.salesNumber).toBe(60);
    expect(wagons[8].wagon?.location).toBe(10);
    expect(wagons[8].status).toBe('removed');

    expect(wagons[9].wagon?.salesNumber).toBe(61);
    expect(wagons[9].wagon?.location).toBe(11);
    expect(wagons[9].status).toBe('removed');

    expect(wagons[10].wagon?.salesNumber).toBe(62);
    expect(wagons[10].wagon?.location).toBe(12);
    expect(wagons[10].status).toBe('removed');

    expect(wagons[11].wagon?.salesNumber).toBe(730);
    expect(wagons[11].wagon?.location).toBe(13);
    expect(wagons[11].status).toBe('removed');

    expect(wagons[12].wagon?.salesNumber).toBe(56);
    expect(wagons[12].wagon?.location).toBe(5);
    expect(wagons[12].status).toBe('added');

    expect(wagons[13].wagon?.salesNumber).toBe(55);
    expect(wagons[13].wagon?.location).toBe(6);
    expect(wagons[13].status).toBe('added');

    expect(wagons[14].wagon?.salesNumber).toBe(50);
    expect(wagons[14].wagon?.location).toBe(7);
    expect(wagons[14].status).toBe('added');

    expect(wagons[15].wagon?.salesNumber).toBe(51);
    expect(wagons[15].wagon?.location).toBe(8);
    expect(wagons[15].status).toBe('added');

    expect(wagons[16].wagon?.salesNumber).toBe(52);
    expect(wagons[16].wagon?.location).toBe(9);
    expect(wagons[16].status).toBe('added');

    expect(wagons[17].wagon?.salesNumber).toBe(710);
    expect(wagons[17].wagon?.location).toBe(10);
    expect(wagons[17].status).toBe('unchanged');

    expect(wagons[18].wagon?.salesNumber).toBe(999);
    expect(wagons[18].wagon?.location).toBe(11);
    expect(wagons[18].status).toBe('unchanged');
  });

  it('should return correct details for a train IC 266 2023-05-20 from ROI->HKI at Pasila tavara', () => {
    /**
     * Composition at journey section Tampere -> Pasila tavara:
     * 999 710 52 51 50 55 56 59 58 57 -> (direction)
     *
     * Composition at journey section Pasila tavara -> Helsinki:
     * 59 58 57 56 55 52 51 50 -> (direction)
     *
     * Expected composition status at Pasila tavara:
     * A  A  A  A  A  R   R   U  U  U  R  R  R  R  R
     * 59 58 57 56 55 999 710 52 51 50 55 56 59 58 57 -> (direction)
     */
    const wagons = getTrainCompositionDetailsForStation(
      'Pasila tavara',
      trainIc266RoiHkiV2 as TrainDetailsFragment
    );

    expectToBeDefined(wagons);
    expect(wagons.length).toBe(15);

    expect(wagons[0].wagon?.salesNumber).toBe(57);
    expect(wagons[0].wagon?.location).toBe(2);
    expect(wagons[0].status).toBe('removed');

    expect(wagons[1].wagon?.salesNumber).toBe(58);
    expect(wagons[1].wagon?.location).toBe(3);
    expect(wagons[1].status).toBe('removed');

    expect(wagons[2].wagon?.salesNumber).toBe(59);
    expect(wagons[2].wagon?.location).toBe(4);
    expect(wagons[2].status).toBe('removed');

    expect(wagons[3].wagon?.salesNumber).toBe(56);
    expect(wagons[3].wagon?.location).toBe(5);
    expect(wagons[3].status).toBe('removed');

    expect(wagons[4].wagon?.salesNumber).toBe(55);
    expect(wagons[4].wagon?.location).toBe(6);
    expect(wagons[4].status).toBe('removed');

    expect(wagons[5].wagon?.salesNumber).toBe(50);
    expect(wagons[5].wagon?.location).toBe(2);
    expect(wagons[5].status).toBe('unchanged');

    expect(wagons[6].wagon?.salesNumber).toBe(51);
    expect(wagons[6].wagon?.location).toBe(3);
    expect(wagons[6].status).toBe('unchanged');

    expect(wagons[7].wagon?.salesNumber).toBe(52);
    expect(wagons[7].wagon?.location).toBe(4);
    expect(wagons[7].status).toBe('unchanged');

    expect(wagons[8].wagon?.salesNumber).toBe(710);
    expect(wagons[8].wagon?.location).toBe(10);
    expect(wagons[8].status).toBe('removed');

    expect(wagons[9].wagon?.salesNumber).toBe(999);
    expect(wagons[9].wagon?.location).toBe(11);
    expect(wagons[9].status).toBe('removed');

    expect(wagons[10].wagon?.salesNumber).toBe(55);
    expect(wagons[10].wagon?.location).toBe(5);
    expect(wagons[10].status).toBe('added');

    expect(wagons[11].wagon?.salesNumber).toBe(56);
    expect(wagons[11].wagon?.location).toBe(6);
    expect(wagons[11].status).toBe('added');

    expect(wagons[12].wagon?.salesNumber).toBe(57);
    expect(wagons[12].wagon?.location).toBe(7);
    expect(wagons[12].status).toBe('added');

    expect(wagons[13].wagon?.salesNumber).toBe(58);
    expect(wagons[13].wagon?.location).toBe(8);
    expect(wagons[13].status).toBe('added');

    expect(wagons[14].wagon?.salesNumber).toBe(59);
    expect(wagons[14].wagon?.location).toBe(9);
    expect(wagons[14].status).toBe('added');
  });

  it('should return correct details for a train PYO 276 from KLI->HKI', () => {
    /**
     * Composition at journey section Kolari -> Oulu:
     * 999 55 54 53 52 51 50 49 48 42 41 40 720 721 725 736 737 Dr16 Dr16 -> (direction)
     *
     * Composition at journey section Oulu -> Tampere:
     * 725 737 736 720 721 55 54 53 52 51 50 49 48 42 41 40 Sr1 -> (direction)
     *
     * Expected composition status at Oulu:
     * A   A   A   A   A   R   U  U  U  U  U  U  U  U  U  U  U  R   R   R   R   R
     * 725 737 736 720 721 999 55 54 53 52 51 50 49 48 42 41 40 720 721 725 736 737 -> (direction)
     */
    const wagons = getTrainCompositionDetailsForStation(
      'Oulu',
      trainPyo276KliHki as TrainDetailsFragment
    );

    expectToBeDefined(wagons);
    expect(wagons.length).toBe(22);

    expect(wagons[0].wagon?.salesNumber).toBe(737);
    expect(wagons[0].wagon?.location).toBe(3);
    expect(wagons[0].status).toBe('removed');

    expect(wagons[1].wagon?.salesNumber).toBe(736);
    expect(wagons[1].wagon?.location).toBe(4);
    expect(wagons[1].status).toBe('removed');

    expect(wagons[2].wagon?.salesNumber).toBe(725);
    expect(wagons[2].wagon?.location).toBe(5);
    expect(wagons[2].status).toBe('removed');

    expect(wagons[3].wagon?.salesNumber).toBe(721);
    expect(wagons[3].wagon?.location).toBe(6);
    expect(wagons[3].status).toBe('removed');

    expect(wagons[4].wagon?.salesNumber).toBe(720);
    expect(wagons[4].wagon?.location).toBe(7);
    expect(wagons[4].status).toBe('removed');

    expect(wagons[5].wagon?.salesNumber).toBe(40);
    expect(wagons[5].wagon?.location).toBe(2);
    expect(wagons[5].status).toBe('unchanged');

    expect(wagons[6].wagon?.salesNumber).toBe(41);
    expect(wagons[6].wagon?.location).toBe(3);
    expect(wagons[6].status).toBe('unchanged');

    expect(wagons[7].wagon?.salesNumber).toBe(42);
    expect(wagons[7].wagon?.location).toBe(4);
    expect(wagons[7].status).toBe('unchanged');

    expect(wagons[8].wagon?.salesNumber).toBe(48);
    expect(wagons[8].wagon?.location).toBe(5);
    expect(wagons[8].status).toBe('unchanged');

    expect(wagons[9].wagon?.salesNumber).toBe(49);
    expect(wagons[9].wagon?.location).toBe(6);
    expect(wagons[9].status).toBe('unchanged');

    expect(wagons[10].wagon?.salesNumber).toBe(50);
    expect(wagons[10].wagon?.location).toBe(7);
    expect(wagons[10].status).toBe('unchanged');

    expect(wagons[11].wagon?.salesNumber).toBe(51);
    expect(wagons[11].wagon?.location).toBe(8);
    expect(wagons[11].status).toBe('unchanged');

    expect(wagons[12].wagon?.salesNumber).toBe(52);
    expect(wagons[12].wagon?.location).toBe(9);
    expect(wagons[12].status).toBe('unchanged');

    expect(wagons[13].wagon?.salesNumber).toBe(53);
    expect(wagons[13].wagon?.location).toBe(10);
    expect(wagons[13].status).toBe('unchanged');

    expect(wagons[14].wagon?.salesNumber).toBe(54);
    expect(wagons[14].wagon?.location).toBe(11);
    expect(wagons[14].status).toBe('unchanged');

    expect(wagons[15].wagon?.salesNumber).toBe(55);
    expect(wagons[15].wagon?.location).toBe(12);
    expect(wagons[15].status).toBe('unchanged');

    expect(wagons[16].wagon?.salesNumber).toBe(999);
    expect(wagons[16].wagon?.location).toBe(19);
    expect(wagons[16].status).toBe('removed');

    expect(wagons[17].wagon?.salesNumber).toBe(721);
    expect(wagons[17].wagon?.location).toBe(13);
    expect(wagons[17].status).toBe('added');

    expect(wagons[18].wagon?.salesNumber).toBe(720);
    expect(wagons[18].wagon?.location).toBe(14);
    expect(wagons[18].status).toBe('added');

    expect(wagons[19].wagon?.salesNumber).toBe(736);
    expect(wagons[19].wagon?.location).toBe(15);
    expect(wagons[19].status).toBe('added');

    expect(wagons[20].wagon?.salesNumber).toBe(737);
    expect(wagons[20].wagon?.location).toBe(16);
    expect(wagons[20].status).toBe('added');

    expect(wagons[21].wagon?.salesNumber).toBe(725);
    expect(wagons[21].wagon?.location).toBe(17);
    expect(wagons[21].status).toBe('added');
  });

  it('should return correct details for a train IC 143 from HKI=>PKI which reverses direction at Tampere', () => {
    /**
     * Composition at journey section Helsinki -> Tampere:
     * 1 2 3 4 5 6 -> (direction)
     *
     * Composition at journey section Tampere -> Pieksämäki:
     * 6 5 4 3 2 1 -> (direction)
     *
     * Expected composition status at Tampere:
     * U U U U U U
     * 6 5 4 3 2 1 -> (direction)
     */
    const wagons = getTrainCompositionDetailsForStation(
      'Tampere',
      trainIc143DirectionReversesAfterTpe as TrainDetailsFragment
    );

    expectToBeDefined(wagons);
    expect(wagons.length).toBe(6);

    expect(wagons[0].wagon?.salesNumber).toBe(1);
    expect(wagons[0].wagon?.location).toBe(1);
    expect(wagons[0].status).toBe('unchanged');

    expect(wagons[1].wagon?.salesNumber).toBe(2);
    expect(wagons[1].wagon?.location).toBe(2);
    expect(wagons[1].status).toBe('unchanged');

    expect(wagons[2].wagon?.salesNumber).toBe(3);
    expect(wagons[2].wagon?.location).toBe(3);
    expect(wagons[2].status).toBe('unchanged');

    expect(wagons[3].wagon?.salesNumber).toBe(4);
    expect(wagons[3].wagon?.location).toBe(4);
    expect(wagons[3].status).toBe('unchanged');

    expect(wagons[4].wagon?.salesNumber).toBe(5);
    expect(wagons[4].wagon?.location).toBe(5);
    expect(wagons[4].status).toBe('unchanged');

    expect(wagons[5].wagon?.salesNumber).toBe(6);
    expect(wagons[5].wagon?.location).toBe(6);
    expect(wagons[5].status).toBe('unchanged');
  });
});
