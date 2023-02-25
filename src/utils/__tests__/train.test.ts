import { parseISO } from 'date-fns';

import { getTimeTableRowRealTime } from '../train';

describe('getTimeTableRowRealTime', () => {
  it('should be the scheduled time of the row when neither actual time or live estimate time is defined', () => {
    expect(
      getTimeTableRowRealTime({
        scheduledTime: '2023-01-25T10:00:00Z',
      })
    ).toStrictEqual(parseISO('2023-01-25T10:00:00Z'));
  });

  it('should be the live estimate time of the row when actual time is not defined', () => {
    expect(
      getTimeTableRowRealTime({
        scheduledTime: '2023-01-25T10:00:00Z',
        liveEstimateTime: '2023-01-25T10:00:10Z',
      })
    ).toStrictEqual(parseISO('2023-01-25T10:00:10Z'));
  });

  it('should be the actual time of the row when actual time is defined', () => {
    expect(
      getTimeTableRowRealTime({
        scheduledTime: '2023-01-25T10:00:00Z',
        liveEstimateTime: '2023-01-25T10:00:10Z',
        actualTime: '2023-01-25T10:00:20Z',
      })
    ).toStrictEqual(parseISO('2023-01-25T10:00:20Z'));
  });
});
