import { act, renderHook } from '@testing-library/react';

import {
  TimeTableRowType,
  TrainDetailsFragment,
} from '../../graphql/generated/digitraffic/graphql';
import {
  TrainLocationMessage,
  VehiclePositionMessage,
} from '../../types/vehicles';
import MqttClient from '../__mocks__/mqttClient';
import useTrainLiveTracking from '../useTrainLiveTracking';
import useVehicleStore from '../useVehicleStore';

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

const mockMqttDigitrafficClient = new MqttClient();
const mockMqttDigitransitClient = new MqttClient();

jest.mock('mqtt', () => ({
  connect: (brokerUrl: string) =>
    brokerUrl === 'wss://rata.digitraffic.fi:443/mqtt'
      ? mockMqttDigitrafficClient
      : mockMqttDigitransitClient,
}));

describe('useTrainLiveTracking', () => {
  const trains = [
    {
      ...trainBase,
      trainNumber: 123,
      timeTableRows: [
        {
          cancelled: false,
          trainStopping: true,
          type: TimeTableRowType.Departure,
          scheduledTime: '2023-03-11T10:01:00Z',
          station: { name: 'Helsinki', shortCode: 'HKI' },
        },
      ],
    },
    {
      ...trainBase,
      commuterLineid: 'U',
      trainNumber: 321,
      timeTableRows: [
        {
          cancelled: false,
          trainStopping: true,
          type: TimeTableRowType.Departure,
          scheduledTime: '2023-03-11T10:01:00Z',
          station: { name: 'Helsinki', shortCode: 'HKI' },
        },
      ],
    },
  ];

  const getMessageDigitraffic = (msg: TrainLocationMessage | null) =>
    Buffer.from(JSON.stringify(msg));

  const getMessageDigitransit = (msg: VehiclePositionMessage | null) =>
    Buffer.from(JSON.stringify({ VP: msg }));

  it('should correctly handle MQTT subscription and unsubscription', () => {
    const { result } = renderHook(() => useTrainLiveTracking(trains));

    expect(mockMqttDigitrafficClient.subscriptions).toHaveLength(0);
    expect(mockMqttDigitransitClient.subscriptions).toHaveLength(0);

    act(() => {
      mockMqttDigitrafficClient.emit('connect');
      mockMqttDigitransitClient.emit('connect');
    });

    expect(mockMqttDigitrafficClient.subscriptions).toHaveLength(1);
    expect(mockMqttDigitrafficClient.subscriptions[0]).toBe(
      'train-locations/2023-03-11/123/#'
    );
    expect(mockMqttDigitransitClient.subscriptions).toHaveLength(1);
    expect(mockMqttDigitransitClient.subscriptions[0]).toBe(
      '/hfp/v2/journey/ongoing/vp/+/+/+/3002U/+/+/12:01/#'
    );

    act(() => {
      result.current.unsubscribeAll();
    });

    expect(mockMqttDigitrafficClient.subscriptions).toHaveLength(0);
    expect(mockMqttDigitransitClient.subscriptions).toHaveLength(0);

    expect(useVehicleStore.getState().vehicles).toEqual({});
  });

  it('should correctly update vehicleVar based on messages received from Digitransit and Digitraffic MQTT', () => {
    renderHook(() => useTrainLiveTracking(trains));

    expect(useVehicleStore.getState().vehicles).toEqual({});

    act(() => {
      mockMqttDigitrafficClient.emit('connect');
      mockMqttDigitransitClient.emit('connect');
    });

    expect(useVehicleStore.getState().vehicles[123]).toBeUndefined();
    expect(useVehicleStore.getState().vehicles[321]).toBeUndefined();

    act(() => {
      mockMqttDigitrafficClient.emit(
        'message',
        'train-locations/2023-03-11/123/#',
        getMessageDigitraffic({
          trainNumber: 123,
          departureDate: '2023-03-11',
          location: { coordinates: [20.5, 22.5], type: 'Point' },
          speed: 87,
          timestamp: '2023-03-11T10:11:00Z',
        })
      );
    });

    expect(useVehicleStore.getState().vehicles[123]).toBeDefined();

    act(() => {
      mockMqttDigitransitClient.emit(
        'message',
        '/hfp/v2/journey/ongoing/vp/+/+/+/3002U/+/+/13:01/#',
        getMessageDigitransit({
          acc: 3.5,
          desi: 'U',
          drst: 1,
          hdg: 12,
          lat: 10.5,
          long: 20.6,
          spd: 105.5,
          veh: 1234,
          jrn: null,
          stop: null,
          transport_mode: 'train',
        })
      );
    });

    expect(useVehicleStore.getState().vehicles[1234]).toBeDefined();
  });
});
