import {
  TimeTableRowType,
  TrainDetailsFragment,
} from '../../graphql/generated/digitraffic/graphql';
import getTimeTableRowForStation from '../getTimeTableRowForStation';
import getTrainJourneySectionForTimeTableRow from '../getTrainJourneySectionForTimeTableRow';

import trainR2Units2AdditionalUnitsFromRi from './__fixtures__/train-R-2-units-TPE-RI-2-additional-units-RI-HKI.json';

describe('getTrainJourneySectionForTimeTableRow', () => {
  const getTimeTableRow = (
    train: TrainDetailsFragment,
    stationCode: string,
    timeTableRowType: TimeTableRowType
  ) => {
    const ttRow = getTimeTableRowForStation(
      stationCode,
      train,
      timeTableRowType
    );
    expectToBeDefined(ttRow);
    return ttRow;
  };

  describe('R train 2 units TPE-RI and 2 additional units RI-HKI', () => {
    const train = trainR2Units2AdditionalUnitsFromRi as TrainDetailsFragment;

    it('should be journey section TPE-RI on TPE', () => {
      const journeySection = getTrainJourneySectionForTimeTableRow(
        train,
        getTimeTableRow(train, 'TPE', TimeTableRowType.Departure)
      );

      expect(journeySection?.startTimeTableRow?.station.shortCode).toBe('TPE');
      expect(journeySection?.endTimeTableRow?.station.shortCode).toBe('RI');
    });

    it('should be journey section TPE-RI on HL start', () => {
      const journeySection = getTrainJourneySectionForTimeTableRow(
        train,
        getTimeTableRow(train, 'HL', TimeTableRowType.Departure)
      );

      expect(journeySection?.startTimeTableRow?.station.shortCode).toBe('TPE');
      expect(journeySection?.endTimeTableRow?.station.shortCode).toBe('RI');
    });

    it('should should be journey section TPE-RI on HL end', () => {
      const journeySection = getTrainJourneySectionForTimeTableRow(
        train,
        getTimeTableRow(train, 'HL', TimeTableRowType.Arrival)
      );

      expect(journeySection?.startTimeTableRow?.station.shortCode).toBe('TPE');
      expect(journeySection?.endTimeTableRow?.station.shortCode).toBe('RI');
    });

    it('should be journey section RI-HKI on RI', () => {
      const journeySection = getTrainJourneySectionForTimeTableRow(
        train,
        getTimeTableRow(train, 'RI', TimeTableRowType.Departure)
      );

      expect(journeySection?.startTimeTableRow?.station.shortCode).toBe('RI');
      expect(journeySection?.endTimeTableRow?.station.shortCode).toBe('HKI');
    });
  });
});
