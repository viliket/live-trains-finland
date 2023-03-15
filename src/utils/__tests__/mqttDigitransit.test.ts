import { trainsVar, vehiclesVar } from '../../graphql/client';
import {
  TimeTableRowType,
  TrainByStationFragment,
  TrainDetailsFragment,
} from '../../graphql/generated/digitraffic';
import { VehiclePositionMessage } from '../../types/vehicles';
import { getTopic, handleVehiclePositionMessage } from '../mqttDigitransit';

const trainBase: TrainDetailsFragment = {
  trainNumber: 123,
  operator: {
    name: 'VR-Yhtymä Oyj',
    __typename: 'Operator',
    shortCode: 'vr',
    uicCode: 10,
  },
  runningCurrently: false,
  commuterLineid: 'U',
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

const timeTableRowArrivalBase = {
  cancelled: false,
  trainStopping: true,
  type: TimeTableRowType.Arrival,
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

  it('should be null for non-commuter line train with departure row', () => {
    const train: TrainByStationFragment = {
      ...trainBase,
      commuterLineid: null,
      timeTableRows: [
        {
          ...timeTableRowDepartureBase,
          scheduledTime: '2023-03-11T10:01:00Z',
          station: { name: 'Helsinki', shortCode: 'HKI' },
        },
      ],
    };
    expect(getTopic(train)).toBeNull();
  });

  it('should get correct topic for commuter line train with departure row', () => {
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
    expect(getTopic(train)).toEqual(
      '/hfp/v2/journey/ongoing/vp/+/+/+/3002U/+/+/12:01/#'
    );
  });

  it('should get correct topic for R train TPE-HKI with departure time from RI station in topic', () => {
    const train: TrainByStationFragment = {
      ...trainBase,
      commuterLineid: 'R',
      timeTableRows: [
        {
          ...timeTableRowDepartureBase,
          scheduledTime: '2023-03-11T10:01:00Z',
          station: { name: 'Tampere', shortCode: 'TPE' },
        },
        {
          ...timeTableRowDepartureBase,
          scheduledTime: '2023-03-11T11:01:00Z',
          station: { name: 'Riihimäki', shortCode: 'RI' },
        },
        {
          ...timeTableRowArrivalBase,
          scheduledTime: '2023-03-11T12:01:00Z',
          station: { name: 'Helsinki', shortCode: 'HKI' },
        },
      ],
    };
    expect(getTopic(train)).toEqual(
      '/hfp/v2/journey/ongoing/vp/+/+/+/3001R/+/+/13:01/#'
    );
  });
});

describe('handleVehiclePositionMessage', () => {
  const getMessage = (msg: VehiclePositionMessage | null) =>
    Buffer.from(JSON.stringify({ VP: msg }));
  it('should update vehicle position message details to vehiclesVar', () => {
    const topicToTrain = new Map<string, TrainByStationFragment>();
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

    expect(vehiclesVar()).toEqual({});

    handleVehiclePositionMessage(
      '/hfp/v2/journey/ongoing/vp/+/+/+/3002U/+/+/12:01/#',
      getMessage(null),
      topicToTrain
    );

    expect(vehiclesVar()).toEqual({});

    handleVehiclePositionMessage(
      '/hfp/v2/journey/ongoing/vp/+/+/+/3002U/+/+/12:01/#',
      getMessage({
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
      }),
      topicToTrain
    );

    expect(trainsVar()[123]).toBeUndefined();
    expect(vehiclesVar()[1234]).toBeDefined();
    expect(vehiclesVar()[1234].veh).toEqual(1234);
    expect(vehiclesVar()[1234].jrn).toEqual(null);
    expect(vehiclesVar()[1234].heading).toEqual(12);
    expect(vehiclesVar()[1234].lat).toEqual(10.5);
    expect(vehiclesVar()[1234].lng).toEqual(20.6);
    expect(vehiclesVar()[1234].spd).toEqual(380);
    expect(vehiclesVar()[1234].routeShortName).toEqual('U');

    topicToTrain.set(
      '/hfp/v2/journey/ongoing/vp/+/+/+/3002U/+/+/12:01/#',
      train
    );

    handleVehiclePositionMessage(
      '/hfp/v2/journey/ongoing/vp/+/+/+/3002U/+/+/12:01/#',
      getMessage({
        acc: 3.5,
        desi: 'U',
        drst: 1,
        hdg: 14,
        lat: 10.6,
        long: 20.7,
        spd: 105.5,
        veh: 1234,
        jrn: 123,
        stop: null,
        transport_mode: 'train',
      }),
      topicToTrain
    );

    expect(trainsVar()[123]).toBeDefined();
    expect(trainsVar()[123].departureDate).toBe('2023-03-11');
    expect(vehiclesVar()[1234]).toBeDefined();
    expect(vehiclesVar()[1234].veh).toEqual(1234);
    expect(vehiclesVar()[1234].jrn).toEqual(123);
    expect(vehiclesVar()[1234].heading).toEqual(14);
    expect(vehiclesVar()[1234].lat).toEqual(10.6);
    expect(vehiclesVar()[1234].lng).toEqual(20.7);
    expect(vehiclesVar()[1234].spd).toEqual(380);
    expect(vehiclesVar()[1234].routeShortName).toEqual('U');
  });
});
