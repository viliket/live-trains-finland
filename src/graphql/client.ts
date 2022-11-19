import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from '@apollo/client';
import { makeVar } from '@apollo/client';

import { VehicleDetails } from '../types/vehicles';

/**
 * Holds the real-time state information of the vehicles.
 */
export const vehiclesVar = makeVar<Record<number, VehicleDetails>>({});

export const gqlClients = {
  digitraffic: 'digitraffic',
  digitransit: 'digitransit',
  vr: 'vr',
};

// Digitransit: HSL
const digitransitLink = new HttpLink({
  uri: 'https://api.digitransit.fi/routing/v1/routers/finland/index/graphql',
});

// Digitraffic / Fintraffic
const digitrafficLink = new HttpLink({
  uri: 'https://rata.digitraffic.fi/api/v2/graphql/graphql',
});

// VR
const vrLink = new HttpLink({
  uri: 'https://www.vr.fi/api/v4',
});

/**
 * Gets the 2-digit unit's serial number from the given European Vehicle Number (EVN) of a train unit.
 *
 * @remarks
 * In Finland, the all train units have European Vehicle Number (EVN)
 * with format 941060040xx-5 where the last two digits correspond to the unit's serial number.
 *
 * @example
 * For input EVN 94106004006-5 the function returns 06 as the unit's serial number.
 *
 * @param vehicleNumber The European Vehicle Number (EVN) of the train unit.
 * @returns Train unit's serial number as a two digit string.
 */
const getVehicleSerialNumberFromEuropeanVehicleNumber = (
  vehicleNumber: string
): string | null => {
  const regexpUnitNbr = /\d{8}\d(\d{2})-.*/;
  const match = vehicleNumber.match(regexpUnitNbr);
  if (match) {
    return match[1];
  } else {
    return null;
  }
};

/**
 * Gets the 2-digit unit's serial number from the given 4-digit train unit vehicle ID.
 *
 * @remarks
 * In Finland, all train units have 4-digit train unit number printed on the
 * side of the unit where the last two digits correspond to the unit's serial number.
 * For instance the train unit type Sm4 (MT) has number 63xx, and Sm4 (M) has 64xx.
 *
 * @example
 * For input 6306 the function returns 06 as the unit's serial number.
 *
 * @param vehicleNumber The 4 digit vehicle number of the train unit.
 * @returns Train unit number as two digit string.
 */
const getVehicleSerialNumberFromFourDigitVehicleId = (
  vehicleNumber: string
): string => {
  return vehicleNumber.slice(-2);
};

/**
 * Gets the train vehicle ID from state using the given European Vehicle Number (EVN) of the train unit.
 *
 * @remarks
 * In Finland, the all train units have European Vehicle Number (EVN)
 * with format 941060040xx-5 where the last two digits correspond to the unit number.
 *
 * @example
 * For input EVN 94106004006-5 the function returns 6306 as the vehicle ID.
 *
 * @param vehicleNumber The European Vehicle Number (EVN) of the train unit.
 * @returns The four digit train vehicle ID (if found from state).
 */
const getTrainVehicleIdFromTrainEuropeanVehicleNumber = (
  vehicleNumber: string
): number | null => {
  const unitNumber =
    getVehicleSerialNumberFromEuropeanVehicleNumber(vehicleNumber);
  if (vehicleNumber) {
    return (
      Object.values(vehiclesVar()).find((v) => {
        const vehicleId = v.veh.toString();
        const unitNumberB =
          getVehicleSerialNumberFromFourDigitVehicleId(vehicleId);
        return unitNumber === unitNumberB;
      })?.veh ?? null
    );
  } else {
    return null;
  }
};

export const client = new ApolloClient({
  link: ApolloLink.split(
    (operation) => operation.getContext().clientName === gqlClients.digitraffic,
    digitrafficLink,
    ApolloLink.split(
      (operation) => operation.getContext().clientName === gqlClients.vr,
      vrLink,
      digitransitLink
    )
  ),
  assumeImmutableResults: true,
  cache: new InMemoryCache({
    typePolicies: {
      Locomotive: {
        fields: {
          vehicleId: {
            read(_, { readField }) {
              // Note: Vehicle number is only available for unit types Sm1, Sm2, Sm4 and Sm5
              const vehicleNumber = readField<string>('vehicleNumber');
              if (!vehicleNumber) return null;
              const vehicleId =
                getTrainVehicleIdFromTrainEuropeanVehicleNumber(vehicleNumber);
              return vehicleId;
            },
          },
        },
      },
      Wagon: {
        fields: {
          vehicleId: {
            read(_, { readField }) {
              // Note: Vehicle number is only available for unit types Sm1, Sm2, Sm4 and Sm5
              const vehicleNumber = readField<string>('vehicleNumber');
              if (!vehicleNumber) return null;
              const vehicleId =
                getTrainVehicleIdFromTrainEuropeanVehicleNumber(vehicleNumber);
              return vehicleId;
            },
          },
        },
      },
      Query: {
        fields: {
          trainsByStationAndQuantity: {
            merge: false,
          },
        },
      },
    },
  }),
});
