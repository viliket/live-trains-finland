import {
  TimeTableRowType,
  TrainDetailsFragment,
} from '../../graphql/generated/digitraffic/graphql';
import canTrainBeTrackedByHsl from '../canTrainBeTrackedByHsl';

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

describe('canTrainBeTrackedByHsl', () => {
  const timeTableRowBase = {
    cancelled: false,
    trainStopping: true,
    type: TimeTableRowType.Departure,
    scheduledTime: '2023-03-11T10:01:00Z',
  };

  it('should be false when train is not commuter train', () => {
    expect(canTrainBeTrackedByHsl(trainBase)).toBe(false);
  });

  it('should be false when commuter train has no departure row', () => {
    expect(
      canTrainBeTrackedByHsl({
        ...trainBase,
        commuterLineid: 'U',
      })
    ).toBe(false);
  });

  it('should be false when commuter train has both departure and destination station outside HSL area', () => {
    expect(
      canTrainBeTrackedByHsl({
        ...trainBase,
        commuterLineid: 'R',
        timeTableRows: [
          {
            ...timeTableRowBase,
            station: { name: 'Tampere', shortCode: 'TPE' },
          },
          {
            ...timeTableRowBase,
            station: { name: 'Riihimäki', shortCode: 'RI' },
          },
        ],
      })
    ).toBe(false);

    expect(
      canTrainBeTrackedByHsl({
        ...trainBase,
        commuterLineid: 'R',
        timeTableRows: [
          {
            ...timeTableRowBase,
            station: { name: 'Riihimäki', shortCode: 'RI' },
          },
          {
            ...timeTableRowBase,
            station: { name: 'Nokia', shortCode: 'NOA' },
          },
        ],
      })
    ).toBe(false);
  });

  it('should be true when commuter train has departure station or destination station inside HSL area', () => {
    expect(
      canTrainBeTrackedByHsl({
        ...trainBase,
        commuterLineid: 'U',
        timeTableRows: [
          {
            ...timeTableRowBase,
            station: { name: 'Helsinki', shortCode: 'HKI' },
          },
          {
            ...timeTableRowBase,
            station: { name: 'Riihimäki', shortCode: 'RI' },
          },
        ],
      })
    ).toBe(true);
  });
});
