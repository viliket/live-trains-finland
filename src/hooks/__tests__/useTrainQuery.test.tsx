import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import {
  StationPlatformSide,
  TrainDirection,
} from '../../graphql/generated/digitraffic/graphql';
import trainR4Units2FirstUnitsContinueFromRi from '../../utils/__tests__/__fixtures__/train-R-4-units-HKI-RI-2-first-units-continue-RI-TPE.json';
import useTrainQuery from '../useTrainQuery';

jest.mock('../../graphql/client', () => ({
  digitrafficClient: {
    request: jest.fn().mockResolvedValue({
      train: [
        {
          ...trainR4Units2FirstUnitsContinueFromRi,
        },
      ],
    }),
  },
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useTrainQuery', () => {
  it('should return undefined if no data is available', async () => {
    const { result } = renderHook(() => useTrainQuery(undefined, undefined), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toBeUndefined();
  });

  it('should return train data when provided with train number and departure date', async () => {
    const { result } = renderHook(() => useTrainQuery(9705, '2023-02-24'), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const train = result.current.data;
    expect(train).toBeDefined();

    expect(train?.trainNumber).toEqual(9705);
    expect(train?.departureDate).toEqual('2023-02-24');

    const locomotives =
      train?.compositions?.[0]?.journeySections?.[0]?.locomotives;
    expect(locomotives).toHaveLength(4);
    expect(locomotives?.[0]?.vehicleId).toBe(6317);
    expect(locomotives?.[1]?.vehicleId).toBe(6310);
    expect(locomotives?.[2]?.vehicleId).toBe(6328);
    expect(locomotives?.[3]?.vehicleId).toBe(6321);

    const wagons = train?.compositions?.[0]?.journeySections?.[0]?.wagons;
    expect(wagons).toHaveLength(4);
    expect(wagons?.[0]?.vehicleId).toBe(6328);
    expect(wagons?.[1]?.vehicleId).toBe(6317);
    expect(wagons?.[2]?.vehicleId).toBe(6310);
    expect(wagons?.[3]?.vehicleId).toBe(6321);

    expect(train?.timeTableGroups).toHaveLength(19);

    expect(train?.timeTableGroups?.[0]?.arrival).toBeFalsy();
    expect(train?.timeTableGroups?.[0]?.departure?.scheduledTime).toBe(
      '2023-02-24T15:10:00.000Z'
    );
    expect(train?.timeTableGroups?.[0]?.stationPlatformSide).toBe(
      StationPlatformSide.Left
    );
    expect(train?.timeTableGroups?.[0]?.trainDirection).toBe(
      TrainDirection.Increasing
    );

    expect(train?.timeTableGroups?.[1]?.arrival?.scheduledTime).toBe(
      '2023-02-24T15:14:00.000Z'
    );
    expect(train?.timeTableGroups?.[1]?.departure?.scheduledTime).toBe(
      '2023-02-24T15:15:00.000Z'
    );
    expect(train?.timeTableGroups?.[1]?.stationPlatformSide).toBe(
      StationPlatformSide.Right
    );
    expect(train?.timeTableGroups?.[1]?.trainDirection).toBe(
      TrainDirection.Increasing
    );
  });
});
