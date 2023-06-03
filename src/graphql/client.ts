import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from '@apollo/client';
import { makeVar } from '@apollo/client';

import { VehicleDetails } from '../types/vehicles';
import getTimeTableRowsGroupedByStation from '../utils/getTimeTableRowsGroupedByStation';
import getTrainVehicleIdFromTrainEuropeanVehicleNumber from '../utils/getTrainVehicleIdFromTrainEuropeanVehicleNumber';
import { TimeTableRow } from './generated/digitraffic';

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
      Train: {
        fields: {
          timeTableGroups: {
            read(_, { readField }) {
              const timeTableRows = readField<TimeTableRow[]>({
                fieldName: 'timeTableRows',
                args: {
                  // Same args as in the TrainDetails.fragment.graphql
                  where: { and: [{ trainStopping: { equals: true } }] },
                },
              });
              return getTimeTableRowsGroupedByStation({
                timeTableRows,
              });
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
