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

/**
 * Holds the identification details of trains that are currently being tracked in real-time.
 */
export const trainsVar = makeVar<Record<number, { departureDate: string }>>({});

export const gqlClients = {
  digitraffic: 'digitraffic',
  digitransit: 'digitransit',
  vr: 'vr',
};

// Digitransit: HSL
const digitransitLink = new HttpLink({
  uri: 'https://api.digitransit.fi/routing/v1/routers/finland/index/graphql',
  headers: {
    'digitransit-subscription-key':
      process.env.REACT_APP_DIGITRANSIT_SUBSCRIPTION_KEY ?? '',
  },
});

// Digitraffic / Fintraffic
const digitrafficLink = new HttpLink({
  uri: 'https://rata.digitraffic.fi/api/v2/graphql/graphql',
  headers: {
    'Digitraffic-User': 'Junaan.fi',
  },
});

// VR
const vrLink = new HttpLink({
  uri: '/vr-api',
});

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
const getTrainVehicleIdFromTrainEuropeanVehicleNumber = (
  vehicleNumber: string,
  wagonType: string
): number | null => {
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
    const matches = vehicleNumber.match(/9410\d{4}(\d{3})-\d/);
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
    const matches = vehicleNumber.match(/9410\d{5}(\d{2})-\d/);
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
    const matches = vehicleNumber.match(/9410\d{3}(\d{4})-\d/);
    if (matches !== null && matches.length === 2) {
      return Number.parseInt(matches[1], 10);
    }
  }

  return null;
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
              const locomotiveType = readField<string>('locomotiveType');
              if (!vehicleNumber || !locomotiveType) return null;
              const vehicleId = getTrainVehicleIdFromTrainEuropeanVehicleNumber(
                vehicleNumber,
                locomotiveType
              );
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
              const wagonType = readField<string>('wagonType');
              if (!vehicleNumber || !wagonType) return null;
              const vehicleId = getTrainVehicleIdFromTrainEuropeanVehicleNumber(
                vehicleNumber,
                wagonType
              );
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
