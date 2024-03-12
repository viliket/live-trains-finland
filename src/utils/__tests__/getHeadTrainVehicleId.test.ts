import {
  JourneySection,
  Maybe,
  TrainDetailsFragment,
} from '../../graphql/generated/digitraffic/graphql';
import * as canTrainBeTrackedByHslModule from '../canTrainBeTrackedByHsl';
import getHeadTrainVehicleId from '../getHeadTrainVehicleId';
import * as getTrainCurrentJourneySectionModule from '../getTrainCurrentJourneySection';

// Workaround for https://github.com/aelbore/esbuild-jest/issues/26
jest.mock('../canTrainBeTrackedByHsl', () => ({
  __esModule: true,
  ...jest.requireActual('../canTrainBeTrackedByHsl'),
}));
jest.mock('../getTrainCurrentJourneySection', () => ({
  __esModule: true,
  ...jest.requireActual('../getTrainCurrentJourneySection'),
}));

const train: TrainDetailsFragment = {
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

const setTrainCurrentJourneySection = (
  trainJourneySection: Maybe<JourneySection>
) => {
  jest
    .spyOn(getTrainCurrentJourneySectionModule, 'default')
    .mockReturnValue(trainJourneySection);
};

const setCanTrainBeTrackedByHsl = (canBeTracked: boolean) => {
  jest
    .spyOn(canTrainBeTrackedByHslModule, 'default')
    .mockReturnValue(canBeTracked);
};

describe('getHeadTrainVehicleId', () => {
  describe('train cannot be tracked by HSL', () => {
    beforeEach(() => {
      setCanTrainBeTrackedByHsl(false);
    });

    it('should be the train number of the train when the train has no current journey section', () => {
      setTrainCurrentJourneySection(null);

      const vehicleId = getHeadTrainVehicleId(train);

      expect(vehicleId).toBe(123);
    });

    it('should be the train number of the train even when train has locomotives', () => {
      setTrainCurrentJourneySection({
        maximumSpeed: 0,
        totalLength: 0,
        locomotives: [
          {
            vehicleId: 1234,
            location: 0,
            locomotiveType: 'Sm4',
            powerTypeAbbreviation: 'S',
          },
        ],
      });

      const vehicleId = getHeadTrainVehicleId(train);

      expect(vehicleId).toBe(123);
    });
  });

  describe('train can be tracked by HSL', () => {
    beforeEach(() => {
      setCanTrainBeTrackedByHsl(true);
    });

    it('should be the null when the train has no current journey section', () => {
      setTrainCurrentJourneySection(null);

      const vehicleId = getHeadTrainVehicleId(train);

      expect(vehicleId).toBe(null);
    });

    it('should be the null if the train current journey section has no locomotives', () => {
      setTrainCurrentJourneySection({
        maximumSpeed: 0,
        totalLength: 0,
        locomotives: null,
      });

      const vehicleId = getHeadTrainVehicleId(train);

      expect(vehicleId).toBe(null);
    });

    it('should be the null if the train current journey section has null locomotive', () => {
      setTrainCurrentJourneySection({
        maximumSpeed: 0,
        totalLength: 0,
        locomotives: [null],
      });

      const vehicleId = getHeadTrainVehicleId(train);

      expect(vehicleId).toBe(null);
    });

    it('should be the vehicleId of the only locomotive the train has when train has single locomotive', () => {
      setTrainCurrentJourneySection({
        maximumSpeed: 0,
        totalLength: 0,
        locomotives: [
          {
            vehicleId: 1234,
            location: 0,
            locomotiveType: 'Sm4',
            powerTypeAbbreviation: 'S',
          },
        ],
      });

      const vehicleId = getHeadTrainVehicleId(train);

      expect(vehicleId).toBe(1234);
    });

    it('should be the train number of the train when the first locomotive has no vehicleId', () => {
      setTrainCurrentJourneySection({
        maximumSpeed: 0,
        totalLength: 0,
        locomotives: [
          {
            vehicleId: null,
            location: 0,
            locomotiveType: 'Sm4',
            powerTypeAbbreviation: 'S',
          },
        ],
      });

      const vehicleId = getHeadTrainVehicleId(train);

      expect(vehicleId).toBe(123);
    });

    it('should be the vehicleId of the first locomotive when train has multiple locomotives', () => {
      setTrainCurrentJourneySection({
        maximumSpeed: 0,
        totalLength: 0,
        locomotives: [
          {
            vehicleId: 4321,
            location: 1,
            locomotiveType: 'Sm4',
            powerTypeAbbreviation: 'S',
          },
          {
            vehicleId: 1234,
            location: 0,
            locomotiveType: 'Sm4',
            powerTypeAbbreviation: 'S',
          },
          {
            vehicleId: 7890,
            location: 2,
            locomotiveType: 'Sm4',
            powerTypeAbbreviation: 'S',
          },
        ],
      });

      const vehicleId = getHeadTrainVehicleId(train);

      expect(vehicleId).toBe(1234);
    });
  });
});
