import {
  TimeTableRowType,
  TrainByStationFragment,
} from '../../graphql/generated/digitraffic';
import * as getTrainLatestDepartureTimeTableRowModule from '../getTrainLatestDepartureTimeTableRow';
import getTrainPreviousStation from '../getTrainPreviousStation';

// Workaround for https://github.com/aelbore/esbuild-jest/issues/26
jest.mock('../getTrainLatestDepartureTimeTableRow', () => ({
  __esModule: true,
  ...jest.requireActual('../getTrainLatestDepartureTimeTableRow'),
}));

describe('getTrainPreviousStation', () => {
  it('should be null when the train latest departure time table row is null', () => {
    jest
      .spyOn(getTrainLatestDepartureTimeTableRowModule, 'default')
      .mockReturnValue(null);

    const station = getTrainPreviousStation({} as TrainByStationFragment);

    expect(station).toBeUndefined();
  });

  it('should be the station of the train latest departure time table row', () => {
    jest
      .spyOn(getTrainLatestDepartureTimeTableRowModule, 'default')
      .mockReturnValue({
        cancelled: false,
        scheduledTime: '',
        trainStopping: false,
        type: TimeTableRowType.Departure,
        station: {
          name: 'Helsinki',
          shortCode: 'HKI',
        },
      });

    const station = getTrainPreviousStation({} as TrainByStationFragment);

    expect(station).toBeDefined();
    expect(station!.name).toBe('Helsinki');
  });
});
