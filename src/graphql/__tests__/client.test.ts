import { gql } from '@apollo/client';

import { client } from '../client';
import {
  Locomotive,
  Wagon,
  Train,
  TimeTableRowType,
} from '../generated/digitraffic';

describe('Locomotive field policies', () => {
  beforeEach(() => {
    client.cache.reset();
  });

  describe('vehicleId', () => {
    test.each([
      ['94102081038-3', 'Sm5', 1038],
      ['94102081038-3', null, null],
      [null, 'Sm5', null],
    ])(
      'given vehicleNumber %p and locomotiveType %p should return %p',
      (
        vehicleNumber: string | null,
        locomotiveType: string | null,
        expectedVehicleId: number | null
      ) => {
        client.writeQuery({
          query: gql`
            query WriteLocomotive($id: Int!) {
              locomotive(id: $id) {
                id
                locomotiveType
                vehicleNumber
              }
            }
          `,
          data: {
            locomotive: {
              __typename: 'Locomotive',
              id: 3,
              locomotiveType: locomotiveType,
              vehicleNumber: vehicleNumber,
            },
          },
          variables: {
            id: 3,
          },
        });

        const locomotive = client.readFragment<Pick<Locomotive, 'vehicleId'>>({
          id: 'Locomotive:3',
          fragment: gql`
            fragment Locomotive on Locomotive {
              vehicleId
            }
          `,
        });

        expect(locomotive).toBeTruthy();
        expect(locomotive!.vehicleId).toBe(expectedVehicleId);
      }
    );
  });
});

describe('Wagon field policies', () => {
  beforeEach(() => {
    client.cache.reset();
  });

  describe('vehicleId', () => {
    test.each([
      ['94102081038-3', 'Sm5', 1038],
      ['94102081038-3', null, null],
      [null, 'Sm5', null],
    ])(
      'given vehicleNumber %p and wagonType %p should return %p',
      (
        vehicleNumber: string | null,
        wagonType: string | null,
        expectedVehicleId: number | null
      ) => {
        client.writeQuery({
          query: gql`
            query WriteWagon($id: Int!) {
              wagon(id: $id) {
                id
                wagonType
                vehicleNumber
              }
            }
          `,
          data: {
            wagon: {
              __typename: 'Wagon',
              id: 3,
              wagonType: wagonType,
              vehicleNumber: vehicleNumber,
            },
          },
          variables: {
            id: 3,
          },
        });

        const wagon = client.readFragment<Pick<Wagon, 'vehicleId'>>({
          id: 'Wagon:3',
          fragment: gql`
            fragment WagonWithVehicleId on Wagon {
              vehicleId
            }
          `,
        });

        expect(wagon).toBeTruthy();
        expect(wagon!.vehicleId).toBe(expectedVehicleId);
      }
    );
  });

  describe('wagonType', () => {
    test.each([
      [123, '2023-06-11', 'U', 'Sm5', 'Sm5'],
      [123, '2023-06-11', null, 'Sm5', 'Sm5'],
      [123, '2023-06-11', null, null, null],
      [null, null, null, null, null],
      [123, null, null, 'Sm5', 'Sm5'],
      [null, '2023-06-11', null, 'Sm5', 'Sm5'],
      [null, null, null, 'Sm5', 'Sm5'],
      [123, '2023-06-11', 'U', null, 'Sm5'],
      [123, '2023-06-11', 'X', null, 'Sm5'],
      [123, '2023-06-11', 'R', null, 'Sm4'],
      [123, '2023-06-11', 'Z', null, 'Sm4'],
    ])(
      'given train(%p, %p, %p) and original wagon type %p should return %p',
      (
        trainNumber: number | null,
        departureDate: string | null,
        commuterLineid: string | null,
        wagonType: string | null,
        expectedWagonType: string | null
      ) => {
        client.writeQuery({
          query: gql`
            query WriteTrain($trainNumber: Int!, $departureDate: Date!) {
              train(trainNumber: $trainNumber, departureDate: $departureDate) {
                trainNumber
                departureDate
                commuterLineid
              }
            }
          `,
          data: {
            train: {
              __typename: 'Train',
              trainNumber: trainNumber,
              departureDate: departureDate,
              commuterLineid: commuterLineid,
            },
          },
          variables: {
            trainNumber: trainNumber,
            departureDate: departureDate,
          },
        });

        client.writeQuery({
          query: gql`
            query WriteWagon($id: Int!) {
              wagon(id: $id) {
                id
                wagonType
              }
            }
          `,
          data: {
            wagon: {
              __typename: 'Wagon',
              id: 3,
              wagonType: wagonType,
            },
          },
          variables: {
            id: 3,
          },
        });

        const wagon = client.readFragment<Pick<Wagon, 'wagonType'>>({
          id: 'Wagon:3',
          fragment: gql`
            fragment WagonWithWagonType on Wagon {
              wagonType
            }
          `,
          variables: {
            trainNumber: trainNumber,
            departureDate: departureDate,
          },
        });

        expect(wagon).toBeTruthy();
        expect(wagon!.wagonType).toBe(expectedWagonType);
      }
    );
  });
});

const timeTableRowBase = {
  cancelled: false,
  trainStopping: true,
};

describe('Train field policies', () => {
  beforeEach(() => {
    client.cache.reset();
  });

  describe('timeTableGroups', () => {
    test('should return timeTableGroups based on train timeTableRows', () => {
      const trainNumber = 123;
      const departureDate = '2023-01-25';
      const timeTableRows = [
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
      ];

      client.writeQuery({
        query: gql`
          query WriteTrain($trainNumber: Int!, $departureDate: Date!) {
            train(trainNumber: $trainNumber, departureDate: $departureDate) {
              trainNumber
              departureDate
              # Note: Same args as in the TrainDetails.fragment.graphql
              # which is assumed also in the timeTableGroups field policy in client.ts
              timeTableRows(
                where: { and: [{ trainStopping: { equals: true } }] }
              )
            }
          }
        `,
        data: {
          train: {
            __typename: 'Train',
            trainNumber: trainNumber,
            departureDate: departureDate,
            timeTableRows: timeTableRows,
          },
        },
        variables: {
          trainNumber: trainNumber,
          departureDate: departureDate,
        },
      });

      const train = client.readFragment<Pick<Train, 'timeTableGroups'>>({
        id: client.cache.identify({
          __typename: 'Train',
          departureDate: departureDate,
          trainNumber: trainNumber,
        }),
        fragment: gql`
          fragment Train on Train {
            timeTableGroups
          }
        `,
        variables: {
          trainNumber: trainNumber,
          departureDate: departureDate,
        },
      });

      expect(train).toBeTruthy();
      expect(train!.timeTableGroups).toEqual([
        {
          arrival: null,
          departure: {
            cancelled: false,
            trainStopping: true,
            type: 'DEPARTURE',
            scheduledTime: '2023-01-25T08:55:00Z',
            station: {
              name: 'Helsinki',
              shortCode: 'HKI',
            },
          },
          trainDirection: 'INCREASING',
          stationPlatformSide: null,
        },
        {
          arrival: {
            cancelled: false,
            trainStopping: true,
            type: 'ARRIVAL',
            scheduledTime: '2023-01-25T09:00:00Z',
            station: {
              name: 'Pasila',
              shortCode: 'PSL',
            },
          },
          departure: {
            cancelled: false,
            trainStopping: true,
            type: 'DEPARTURE',
            scheduledTime: '2023-01-25T10:55:00Z',
            station: {
              name: 'Pasila',
              shortCode: 'PSL',
            },
          },
          trainDirection: 'INCREASING',
          stationPlatformSide: null,
        },
        {
          arrival: {
            cancelled: false,
            trainStopping: true,
            type: 'ARRIVAL',
            scheduledTime: '2023-01-25T11:00:00Z',
            station: {
              name: 'Tampere',
              shortCode: 'TPE',
            },
          },
          departure: null,
          trainDirection: 'INCREASING',
          stationPlatformSide: null,
        },
      ]);
    });
  });
});
