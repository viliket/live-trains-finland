import { act, renderHook, waitFor } from '@testing-library/react';
import { parseISO } from 'date-fns';

import { PassengerInformationMessage } from '../../utils/passengerInformationMessages';
import usePassengerInformationMessages from '../usePassengerInformationMessages';

const mockPassengerInformationMessages: PassengerInformationMessage[] = [
  {
    id: 'SHM20230727799106000',
    version: 7,
    creationDateTime: '2023-09-08T04:16:00Z',
    startValidity: '2023-09-10T21:00:00Z',
    endValidity: '2023-09-15T20:59:00Z',
    stations: ['AVP', 'VEH', 'KTÖ'],
    video: {
      text: {
        fi: 'Suomeksi',
        sv: 'På svenska',
        en: 'In English',
      },
      deliveryRules: {
        startDateTime: '2023-09-11T00:00:00+03:00',
        endDateTime: '2023-09-15T23:59:00+03:00',
        startTime: '0:01',
        endTime: '4:20',
        weekDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
        deliveryType: 'CONTINUOS_VISUALIZATION',
      },
    },
  },
];

describe('usePassengerInformationMessages', () => {
  const mockFetchPromise = Promise.resolve({
    json: () => Promise.resolve(mockPassengerInformationMessages),
  });

  describe.each([undefined, 5000])(
    'using different refresh cycles',
    (refreshCycle) => {
      const advanceByTime = refreshCycle ?? 10000;

      beforeEach(() => {
        jest
          .spyOn(global, 'fetch')
          .mockImplementation(() => mockFetchPromise as any);
      });

      afterEach(() => {
        jest.useRealTimers();
        jest.resetAllMocks();
      });

      it('should return relevant messages immediately before first refresh cycle', async () => {
        jest
          .useFakeTimers()
          .setSystemTime(parseISO('2023-09-15T04:19:55+03:00'));

        const { result } = renderHook(() =>
          usePassengerInformationMessages({
            skip: false,
            refetchIntervalMs: refreshCycle,
          })
        );

        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(result.current.messages).toBeDefined());

        expect(result.current.messages!.length).toStrictEqual(1);

        act(() => {
          jest.advanceTimersByTime(advanceByTime);
        });

        await waitFor(() =>
          expect(result.current.messages!.length).toStrictEqual(0)
        );
      });

      it('should update the relevant messages after each refresh cycle', async () => {
        jest
          .useFakeTimers()
          .setSystemTime(parseISO('2023-09-11T00:00:55+03:00'));

        const { result } = renderHook(() =>
          usePassengerInformationMessages({
            skip: false,
            refetchIntervalMs: refreshCycle,
          })
        );

        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(result.current.messages).toBeDefined());

        expect(result.current.messages!.length).toStrictEqual(0);

        act(() => {
          jest.advanceTimersByTime(advanceByTime);
        });

        await waitFor(() =>
          expect(result.current.messages!.length).toStrictEqual(1)
        );
      });

      it('should return error and previously fetched messages if fetching fails', async () => {
        jest
          .useFakeTimers()
          .setSystemTime(parseISO('2023-09-15T04:19:55+03:00'));

        const { result } = renderHook(() =>
          usePassengerInformationMessages({
            skip: false,
            refetchIntervalMs: refreshCycle,
          })
        );

        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(result.current.messages).toBeDefined());

        expect(result.current.messages!.length).toStrictEqual(1);

        jest
          .spyOn(global, 'fetch')
          .mockImplementation(() => Promise.reject(new Error('error')));

        act(() => {
          jest.advanceTimersByTime(advanceByTime);
        });

        await waitFor(() => expect(result.current.error).toBeDefined());

        expect(result.current.messages).toBeDefined();
        expect(result.current.messages!.length).toStrictEqual(1);
      });
    }
  );
});
