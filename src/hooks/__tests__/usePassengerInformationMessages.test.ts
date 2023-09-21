import { act, renderHook, waitFor } from '@testing-library/react';
import { parseISO } from 'date-fns';

import { PassengerInformationMessage } from '../../utils/passengerInformationMessages';
import usePassengerInformationMessages from '../usePassengerInformationMessages';

jest.mock('../../utils/passengerInformationMessages', () => ({
  getPassengerInformationMessagesCurrentlyRelevant: (
    msgs: PassengerInformationMessage[]
  ) => msgs,
}));

describe('usePassengerInformationMessages', () => {
  const baseUrl = 'https://rata.digitraffic.fi/api/v1/passenger-information';
  const defaultRefetchIntervalMs = 10000;

  const getMockFetchResponse = (
    mockResponse: Partial<PassengerInformationMessage>[]
  ) =>
    ({
      json: async () => mockResponse,
      ok: true,
    } as Response);

  afterEach(() => {
    jest.useRealTimers();
    jest.resetAllMocks();
  });

  it('should construct the correct URL and call fetch after each refetch interval', async () => {
    jest.useFakeTimers().setSystemTime(parseISO('2023-09-12T00:00:00+03:00'));

    const queryParameters = {
      stationCode: 'HKI',
      trainNumber: 123,
      trainDepartureDate: '2023-09-20',
      onlyGeneral: true,
    };

    const fetchMock = jest
      .spyOn(window, 'fetch')
      .mockResolvedValue(getMockFetchResponse([]));

    renderHook(() => usePassengerInformationMessages(queryParameters));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenNthCalledWith(
        1,
        `${baseUrl}/active?station=HKI&train_number=123&train_departure_date=2023-09-20&only_general=true`
      );
    });

    act(() => {
      jest.advanceTimersByTime(defaultRefetchIntervalMs);
    });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenNthCalledWith(
        2,
        `${baseUrl}/updated-after/2023-09-12T00:00:00+03:00?station=HKI&train_number=123&train_departure_date=2023-09-20&only_general=true`
      );
    });

    act(() => {
      jest.advanceTimersByTime(defaultRefetchIntervalMs);
    });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenNthCalledWith(
        3,
        `${baseUrl}/updated-after/2023-09-12T00:00:10+03:00?station=HKI&train_number=123&train_departure_date=2023-09-20&only_general=true`
      );
    });
  });

  it('should fetch and return messages', async () => {
    const mockResponse = [{ id: '1', text: 'Message 1' }];
    jest
      .spyOn(window, 'fetch')
      .mockResolvedValueOnce(getMockFetchResponse(mockResponse));

    const { result } = renderHook(() =>
      usePassengerInformationMessages({ skip: false })
    );

    await waitFor(() => {
      expect(result.current.messages).toEqual(mockResponse);
      expect(result.current.error).toBeUndefined();
    });
  });

  it('should fetch again based on the interval', async () => {
    const refetchIntervalMs = 5000;
    const mockResponse1 = [{ id: '1', text: 'Message 1' }];
    const mockResponse2 = [{ id: '2', text: 'Message 2' }];
    const mockResponse3 = [{ id: '2', text: 'Message 2 updated' }];
    jest
      .spyOn(window, 'fetch')
      .mockResolvedValueOnce(getMockFetchResponse(mockResponse1))
      .mockResolvedValueOnce(getMockFetchResponse(mockResponse2))
      .mockResolvedValueOnce(getMockFetchResponse(mockResponse3));
    jest.useFakeTimers();

    const { result } = renderHook(() =>
      usePassengerInformationMessages({ skip: false, refetchIntervalMs })
    );

    await waitFor(() => {
      expect(result.current.messages).toEqual(mockResponse1);
      expect(result.current.error).toBeUndefined();
    });

    act(() => {
      jest.advanceTimersByTime(refetchIntervalMs);
    });

    await waitFor(() => {
      expect(result.current.messages?.length).toBe(2);
      expect(result.current.messages).toEqual([
        ...mockResponse2,
        ...mockResponse1,
      ]);
      expect(result.current.error).toBeUndefined();
    });

    act(() => {
      jest.advanceTimersByTime(refetchIntervalMs);
    });

    await waitFor(() => {
      expect(result.current.messages?.length).toBe(2);
      expect(result.current.messages).toEqual([
        ...mockResponse3,
        ...mockResponse1,
      ]);
      expect(result.current.error).toBeUndefined();
    });
  });

  it('should handle fetch error and return it', async () => {
    jest.spyOn(window, 'fetch').mockRejectedValueOnce(new Error('Fetch error'));

    const { result } = renderHook(() =>
      usePassengerInformationMessages({ skip: false })
    );

    await waitFor(() => {
      expect(result.current.messages).toBeUndefined();
      expect(result.current.error).toBeDefined();
    });
  });

  it('should handle non-ok fetch response and return it', async () => {
    jest.spyOn(window, 'fetch').mockResolvedValueOnce({
      ok: false,
    } as Response);

    const { result } = renderHook(() =>
      usePassengerInformationMessages({ skip: false })
    );

    await waitFor(() => {
      expect(result.current.messages).toBeUndefined();
      expect(result.current.error).toBeDefined();
    });
  });

  it('should not fetch when skip is true', () => {
    jest.spyOn(window, 'fetch').mockImplementation(() => {
      throw new Error('Fetch should not be called');
    });

    const { result } = renderHook(() =>
      usePassengerInformationMessages({ skip: true })
    );

    expect(result.current.messages).toBeUndefined();
    expect(result.current.error).toBeUndefined();
  });

  it('should clear messages and use api path /active on first fetch when props change', async () => {
    jest.useFakeTimers().setSystemTime(parseISO('2023-09-12T00:00:00+03:00'));
    const mockResponse1 = [{ id: '1', text: 'Message 1 HKI' }];
    const mockResponse2 = [{ id: '1', text: 'Message 1 PSL' }];
    const fetchSpy = jest
      .spyOn(window, 'fetch')
      .mockResolvedValueOnce(getMockFetchResponse(mockResponse1))
      .mockResolvedValueOnce(getMockFetchResponse(mockResponse2))
      .mockResolvedValueOnce(getMockFetchResponse(mockResponse2))
      .mockResolvedValueOnce(getMockFetchResponse(mockResponse1));

    const { result, rerender } = renderHook(
      (stationCode: string) =>
        usePassengerInformationMessages({ skip: false, stationCode }),
      { initialProps: 'HKI' }
    );

    await waitFor(() => {
      expect(result.current.messages).toEqual(mockResponse1);
      expect(fetchSpy).toHaveBeenNthCalledWith(
        1,
        `${baseUrl}/active?station=HKI`
      );
    });

    rerender('PSL');

    await waitFor(() => {
      expect(result.current.messages).toEqual(mockResponse2);
      expect(fetchSpy).toHaveBeenNthCalledWith(
        2,
        `${baseUrl}/active?station=PSL`
      );
    });

    act(() => {
      jest.advanceTimersByTime(defaultRefetchIntervalMs);
    });

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenNthCalledWith(
        3,
        `${baseUrl}/updated-after/2023-09-12T00:00:00+03:00?station=PSL`
      );
    });

    rerender('HKI');

    await waitFor(() => {
      expect(result.current.messages).toEqual(mockResponse1);
      expect(fetchSpy).toHaveBeenNthCalledWith(
        4,
        `${baseUrl}/active?station=HKI`
      );
    });
  });
});
