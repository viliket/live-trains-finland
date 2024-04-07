import { parseISO } from 'date-fns';

import { TrainDetailsFragment } from '../../graphql/generated/digitraffic/graphql';
import getTrainCurrentJourneySection from '../getTrainCurrentJourneySection';

const trainBase: TrainDetailsFragment = {
  trainNumber: 123,
  departureDate: '2023-01-25',
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

describe('getTrainCurrentJourneySection', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  describe('train with one journey section with scheduled start time at 10:00', () => {
    const train: TrainDetailsFragment = {
      ...trainBase,
      compositions: [
        {
          journeySections: [
            {
              maximumSpeed: 0,
              totalLength: 0,
              startTimeTableRow: {
                scheduledTime: '2023-01-25T10:00:00Z',
                station: {
                  name: 'Helsinki',
                },
              },
            },
          ],
        },
      ],
    };

    it('should return journey section with scheduled start time at 10:00 when current time is 09:00', () => {
      jest.setSystemTime(parseISO('2023-01-25T09:00:00Z'));
      const journeySection = getTrainCurrentJourneySection(train);
      expectToBeDefined(journeySection?.startTimeTableRow);
      expect(journeySection.startTimeTableRow.scheduledTime).toBe(
        '2023-01-25T10:00:00Z'
      );
    });

    it('should return journey section with scheduled start time at 10:00 when current time is 10:00', () => {
      jest.setSystemTime(parseISO('2023-01-25T10:00:00Z'));
      const journeySection = getTrainCurrentJourneySection(train);
      expectToBeDefined(journeySection?.startTimeTableRow);
      expect(journeySection.startTimeTableRow.scheduledTime).toBe(
        '2023-01-25T10:00:00Z'
      );
    });

    it('should return journey section with scheduled start time at 10:00 when current time is 11:00', () => {
      jest.setSystemTime(parseISO('2023-01-25T11:00:00Z'));
      const journeySection = getTrainCurrentJourneySection(train);
      expectToBeDefined(journeySection?.startTimeTableRow);
      expect(journeySection.startTimeTableRow.scheduledTime).toBe(
        '2023-01-25T10:00:00Z'
      );
    });
  });

  describe('train with two journey sections - first scheduled to start at 10:00 and second at 11:00', () => {
    const train: TrainDetailsFragment = {
      ...trainBase,
      compositions: [
        {
          journeySections: [
            {
              maximumSpeed: 0,
              totalLength: 0,
              startTimeTableRow: {
                scheduledTime: '2023-01-25T10:00:00Z',
                station: {
                  name: 'Helsinki',
                },
              },
            },
            {
              maximumSpeed: 0,
              totalLength: 0,
              startTimeTableRow: {
                scheduledTime: '2023-01-25T11:00:00Z',
                station: {
                  name: 'Riihimäki',
                },
              },
            },
          ],
        },
      ],
    };

    it('should return 1st journey section with scheduled time at 10:00 when current time is 10:30', () => {
      jest.setSystemTime(parseISO('2023-01-25T10:30:00Z'));
      const journeySection = getTrainCurrentJourneySection(train);
      expectToBeDefined(journeySection?.startTimeTableRow);
      expect(journeySection.startTimeTableRow.scheduledTime).toBe(
        '2023-01-25T10:00:00Z'
      );
    });

    it('should return 2nd journey section with scheduled time at 11:00 when current time is 11:00', () => {
      jest.setSystemTime(parseISO('2023-01-25T11:00:00Z'));
      const journeySection = getTrainCurrentJourneySection(train);
      expectToBeDefined(journeySection?.startTimeTableRow);
      expect(journeySection.startTimeTableRow.scheduledTime).toBe(
        '2023-01-25T11:00:00Z'
      );
    });

    it('should return 2nd journey section with scheduled time at 11:00 when current time is 11:30', () => {
      jest.setSystemTime(parseISO('2023-01-25T11:30:00Z'));
      const journeySection = getTrainCurrentJourneySection(train);
      expectToBeDefined(journeySection?.startTimeTableRow);
      expect(journeySection.startTimeTableRow.scheduledTime).toBe(
        '2023-01-25T11:00:00Z'
      );
    });
  });

  describe('train with two journey sections with no scheduled start time table row', () => {
    const train: TrainDetailsFragment = {
      ...trainBase,
      compositions: [
        {
          journeySections: [
            {
              maximumSpeed: 10,
              totalLength: 0,
            },
            {
              maximumSpeed: 20,
              totalLength: 0,
            },
          ],
        },
      ],
    };

    it('should return the last journey section in array due to descending sorting order', () => {
      const journeySection = getTrainCurrentJourneySection(train);
      expectToBeDefined(journeySection);
      expect(journeySection.maximumSpeed).toBe(20);
    });
  });
});
