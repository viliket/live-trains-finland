import { parseISO } from 'date-fns';

import { formatEET } from '../date';

describe('formatEET', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('should format given date in Europe/Helsinki time zone', () => {
    jest.setSystemTime(parseISO('2023-01-25T10:00:00Z'));
    expect(formatEET(new Date(), 'yyyy-MM-dd HH:mm:ss')).toBe(
      '2023-01-25 12:00:00'
    );
  });
});
