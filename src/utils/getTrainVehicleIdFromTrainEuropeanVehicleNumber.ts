/**
 * Gets the train vehicle ID from the given European Vehicle Number (EVN) and the type of the train unit.
 *
 * @remarks
 * In Finland, all train units have European Vehicle Number (EVN) with format
 * 9410xxxxxxx-c where the last digits before the checksum (c) correspond to
 * the unit number.
 *
 * @see https://en.wikipedia.org/wiki/UIC_identification_marking_for_tractive_stock
 *
 * @example
 * // Returns 6088 as the vehicle ID
 * getTrainVehicleIdFromTrainEuropeanVehicleNumber('94106000088-7', 'Sm2')
 *
 * @example
 * // Returns 6324 as the vehicle ID
 * getTrainVehicleIdFromTrainEuropeanVehicleNumber('94106004024-8', 'Sm4')
 *
 * @example
 * // Returns 1038 as the vehicle ID
 * getTrainVehicleIdFromTrainEuropeanVehicleNumber('94102081038-3', 'Sm5')
 *
 * @param vehicleNumber The European Vehicle Number (EVN) of the train unit.
 * @param wagonType The wagon type. E.g. Sm5.
 * @returns The four digit train vehicle ID.
 */
export default function getTrainVehicleIdFromTrainEuropeanVehicleNumber(
  vehicleNumber: string,
  wagonType: string
): number | null {
  if (wagonType === 'Sm1' || wagonType === 'Sm2') {
    // The Sm1 units are numbered from 6001 to 6050 for the motored car.
    // See https://en.wikipedia.org/wiki/VR_Class_Sm1
    // Examples:
    // * 94106000001-0 = 6001
    // * 94106000025-9 = 6025
    // * 94106000050-7 = 6050
    //
    // The Sm2 units are numbered from 6051 to 6100 for the motored car.
    // See https://en.wikipedia.org/wiki/VR_Class_Sm2
    // Examples:
    // * 94106000088-7 = 6088
    // * 94106000066-3 = 6066
    // * 94106000091-1 = 6091
    const matches = /9410\d{4}(\d{3})-\d/.exec(vehicleNumber);
    if (matches !== null && matches.length === 2) {
      return Number.parseInt('6' + matches[1], 10);
    }
  }
  if (wagonType === 'Sm4') {
    // The Sm4 units are in the form of 63xx for the motored car.
    // See https://en.wikipedia.org/wiki/VR_Class_Sm4
    // Examples:
    // 94106004024-8 = 6324
    // 94106004008-1 = 6308
    // 94106004025-5 = 6325
    const matches = /9410\d{5}(\d{2})-\d/.exec(vehicleNumber);
    if (matches !== null && matches.length === 2) {
      return Number.parseInt('63' + matches[1], 10);
    }
  }
  if (wagonType === 'Sm5') {
    // The Sm5 units have vehicle numbers from 94102081 001 to 94102081 081.
    // The last 4 digits before the EVN checksum form the unit number.
    // See https://en.wikipedia.org/wiki/JKOY_Class_Sm5
    // Examples:
    // * 94102081038-3 = 1038
    // * 94102081078-9 = 1078
    // * 94102081069-8 = 1069
    const matches = /9410\d{3}(\d{4})-\d/.exec(vehicleNumber);
    if (matches !== null && matches.length === 2) {
      return Number.parseInt(matches[1], 10);
    }
  }

  return null;
}
