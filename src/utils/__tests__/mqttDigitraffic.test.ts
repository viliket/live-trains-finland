import {
  TimeTableRowType,
  TrainByStationFragment,
  TrainDetailsFragment,
} from '../../graphql/generated/digitraffic/graphql';
import useVehicleStore from '../../hooks/useVehicleStore';
import { TrainLocationMessage } from '../../types/vehicles';
import { getTopic, handleTrainLocationMessage } from '../mqttDigitraffic';

const trainBase: TrainDetailsFragment = {
  trainNumber: 123,
  departureDate: '2023-03-11',
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

const timeTableRowDepartureBase = {
  cancelled: false,
  trainStopping: true,
  type: TimeTableRowType.Departure,
};

describe('getTopic', () => {
  it('should be null for train with no time table rows', () => {
    expect(getTopic(trainBase)).toBeNull();
    expect(
      getTopic({
        ...trainBase,
        timeTableRows: [null],
      })
    ).toBeNull();
  });

  it('should get correct topic for train with departure row', () => {
    const train: TrainByStationFragment = {
      ...trainBase,
      timeTableRows: [
        {
          ...timeTableRowDepartureBase,
          scheduledTime: '2023-03-11T10:01:00Z',
          station: { name: 'Helsinki', shortCode: 'HKI' },
        },
      ],
    };
    expect(getTopic(train)).toEqual('train-locations/2023-03-11/123/#');
  });
});

describe('handleTrainLocationMessage', () => {
  const getMessage = (msg: TrainLocationMessage | null) =>
    Buffer.from(JSON.stringify(msg));
  it('should update train location message details to vehiclesVar', () => {
    const topicToTrain = new Map<string, TrainByStationFragment>();

    expect(useVehicleStore.getState().vehicles).toEqual({});

    handleTrainLocationMessage(
      'train-locations/2023-03-11/123',
      getMessage(null),
      topicToTrain
    );

    expect(useVehicleStore.getState().vehicles).toEqual({});

    handleTrainLocationMessage(
      'train-locations/2023-03-11/123',
      getMessage({
        trainNumber: 123,
        departureDate: '2023-03-11',
        location: { coordinates: [10.5, 20.5], type: 'Point' },
        speed: 67,
        timestamp: '2023-03-11T10:01:00Z',
      }),
      topicToTrain
    );

    expect(useVehicleStore.getState().vehicles[123]).toBeDefined();
    expect(useVehicleStore.getState().vehicles[123].veh).toEqual(123);
    expect(useVehicleStore.getState().vehicles[123].jrn).toEqual(123);
    expect(useVehicleStore.getState().vehicles[123].heading).toEqual(null);
    expect(useVehicleStore.getState().vehicles[123].position[1]).toEqual(20.5);
    expect(useVehicleStore.getState().vehicles[123].position[0]).toEqual(10.5);
    expect(useVehicleStore.getState().vehicles[123].spd).toEqual(67);
    expect(useVehicleStore.getState().vehicles[123].routeShortName).toBeNull();

    topicToTrain.set('train-locations/2023-03-11/123/#', trainBase);

    handleTrainLocationMessage(
      'train-locations/2023-03-11/123',
      getMessage({
        trainNumber: 123,
        departureDate: '2023-03-11',
        location: { coordinates: [20.5, 22.5], type: 'Point' },
        speed: 87,
        timestamp: '2023-03-11T10:11:00Z',
      }),
      topicToTrain
    );

    expect(useVehicleStore.getState().vehicles[123]).toBeDefined();
    expect(useVehicleStore.getState().vehicles[123].veh).toEqual(123);
    expect(useVehicleStore.getState().vehicles[123].jrn).toEqual(123);
    expect(useVehicleStore.getState().vehicles[123].heading).toBeCloseTo(76.06);
    expect(useVehicleStore.getState().vehicles[123].position[1]).toEqual(22.5);
    expect(useVehicleStore.getState().vehicles[123].position[0]).toEqual(20.5);
    expect(useVehicleStore.getState().vehicles[123].spd).toEqual(87);
    expect(useVehicleStore.getState().vehicles[123].routeShortName).toEqual(
      '123'
    );

    topicToTrain.set('train-locations/2023-03-11/123/#', {
      ...trainBase,
      commuterLineid: 'R',
    });

    handleTrainLocationMessage(
      'train-locations/2023-03-11/123',
      getMessage({
        trainNumber: 123,
        departureDate: '2023-03-11',
        location: { coordinates: [20.5, 22.5], type: 'Point' },
        speed: 88,
        timestamp: '2023-03-11T10:15:00Z',
      }),
      topicToTrain
    );

    expect(useVehicleStore.getState().vehicles[123]).toBeDefined();
    expect(useVehicleStore.getState().vehicles[123].veh).toEqual(123);
    expect(useVehicleStore.getState().vehicles[123].jrn).toEqual(123);
    expect(useVehicleStore.getState().vehicles[123].heading).toBeCloseTo(76.06);
    expect(useVehicleStore.getState().vehicles[123].position[1]).toEqual(22.5);
    expect(useVehicleStore.getState().vehicles[123].position[0]).toEqual(20.5);
    expect(useVehicleStore.getState().vehicles[123].spd).toEqual(88);
    expect(useVehicleStore.getState().vehicles[123].routeShortName).toEqual(
      'R'
    );
  });
});
