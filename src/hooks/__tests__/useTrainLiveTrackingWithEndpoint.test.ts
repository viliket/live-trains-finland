import { act, renderHook } from '@testing-library/react';

import { TrainDetailsFragment } from '../../graphql/generated/digitraffic';
import MqttClient from '../__mocks__/mqttClient';
import useTrainLiveTrackingWithEndpoint from '../useTrainLiveTrackingWithEndpoint';

const trainBase: TrainDetailsFragment = {
  trainNumber: 123,
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

const mockMqttClient = new MqttClient();

jest.mock('mqtt', () => ({
  connect: () => mockMqttClient,
}));

describe('useTrainLiveTrackingWithEndpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call getTopic function of the MQTT config for each train after MQTT client has connected', () => {
    const mqttConfig = {
      endpointUrl: '',
      getTopic: jest.fn(),
      handleMessage: jest.fn(),
    };

    const trains = [trainBase];

    renderHook(() => useTrainLiveTrackingWithEndpoint(mqttConfig, trains));

    expect(mqttConfig.getTopic).not.toBeCalled();

    act(() => {
      mockMqttClient.emit('connect');
    });

    expect(mqttConfig.getTopic).toBeCalledWith(trainBase);
  });

  it('should call handleMessage function of the MQTT config when MQTT client receives new message', () => {
    const mqttConfig = {
      endpointUrl: '',
      getTopic: jest.fn(),
      handleMessage: jest.fn(),
    };
    const trains = [trainBase];

    renderHook(() => useTrainLiveTrackingWithEndpoint(mqttConfig, trains));

    expect(mockMqttClient.subscriptions).toHaveLength(0);

    act(() => {
      mockMqttClient.emit('connect');
    });

    act(() => {
      mockMqttClient.emit('message', 'topic', 'test msg');
    });

    expect(mqttConfig.handleMessage).toBeCalledWith(
      'topic',
      'test msg',
      expect.any(Map)
    );
  });

  it('should handle subscription and unsubscription correctly', () => {
    const mqttConfig = {
      endpointUrl: '',
      getTopic: jest.fn((t) => t.trainNumber.toString()),
      handleMessage: jest.fn(),
    };
    const trains = [trainBase];

    const { result } = renderHook(() =>
      useTrainLiveTrackingWithEndpoint(mqttConfig, trains)
    );

    expect(mockMqttClient.subscriptions).toHaveLength(0);

    act(() => {
      mockMqttClient.emit('connect');
    });

    expect(mockMqttClient.subscriptions).toHaveLength(1);
    expect(mockMqttClient.subscriptions[0]).toBe('123');

    const unsubscribeCb = jest.fn();

    act(() => {
      result.current.unsubscribeAll(unsubscribeCb);
    });

    expect(unsubscribeCb).toBeCalledTimes(1);
    expect(mockMqttClient.subscriptions).toHaveLength(0);
  });

  it('should call callback function when calling unsubscribeAll even when MQTT client is not connected', () => {
    const mqttConfig = {
      endpointUrl: '',
      getTopic: jest.fn(),
      handleMessage: jest.fn(),
    };
    const trains = [trainBase];

    const { result } = renderHook(() =>
      useTrainLiveTrackingWithEndpoint(mqttConfig, trains)
    );

    const unsubscribeCb = jest.fn();

    act(() => {
      result.current.unsubscribeAll(unsubscribeCb);
    });

    expect(unsubscribeCb).toBeCalledTimes(1);
  });

  it('should return error when the MQTT client emits an error event', () => {
    const mqttConfig = {
      endpointUrl: '',
      getTopic: jest.fn(),
      handleMessage: jest.fn(),
    };

    const { result } = renderHook(() =>
      useTrainLiveTrackingWithEndpoint(mqttConfig, [])
    );

    expect(result.current.error).toBeUndefined();

    act(() => {
      mockMqttClient.emit('error', 'some error');
    });

    expect(result.current.error).toBe('some error');
  });
});
