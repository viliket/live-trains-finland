import { act, renderHook } from '@testing-library/react';

import { useTime } from '../useTime';

describe('useTime', () => {
  const initialTime = new Date('2023-03-04');

  describe.each([undefined, 2000])(
    'using different refresh cycles',
    (refreshCycle) => {
      beforeEach(() => jest.useFakeTimers().setSystemTime(initialTime));

      afterAll(() => jest.useRealTimers());

      it('should initially be the current time', () => {
        const { result } = renderHook(() => useTime(refreshCycle));

        expect(result.current).toStrictEqual(initialTime);
      });

      it('should update the current time after the refresh cycle', () => {
        const { result } = renderHook(() => useTime(refreshCycle));

        const advanceByTime = refreshCycle ?? 1000;

        act(() => {
          jest.advanceTimersByTime(advanceByTime - 1);
        });

        expect(result.current).toStrictEqual(initialTime);

        act(() => {
          jest.advanceTimersByTime(1);
        });

        expect(result.current).toStrictEqual(
          new Date(initialTime.getTime() + advanceByTime)
        );
      });
    }
  );
});
