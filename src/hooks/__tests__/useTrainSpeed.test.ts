import { act, renderHook } from '@testing-library/react';

import { TrainDetailsFragment } from '../../graphql/generated/digitraffic/graphql';
import { VehicleDetails } from '../../types/vehicles';
import { useTrainSpeed } from '../useTrainSpeed';
import useVehicleStore from '../useVehicleStore';

const vehicleBase: VehicleDetails = {
  spd: 0,
  acc: 0,
  drst: null,
  heading: null,
  jrn: null,
  position: [0, 0],
  prevPosition: [0, 0],
  timestamp: 0,
  nextStop: null,
  routeShortName: null,
  startTime: '',
  stop: null,
  transport_mode: '',
  veh: 1234,
};

jest.mock('../../utils/getHeadTrainVehicleId', () => () => 1234);

describe('useTrainSpeed', () => {
  it('should be null when the train is falsy', () => {
    const { result } = renderHook(() => useTrainSpeed(null));

    expect(result.current).toBe(null);
  });

  it('should update when the vehicle speed changes', () => {
    const { result } = renderHook(() =>
      useTrainSpeed({} as TrainDetailsFragment)
    );

    expect(result.current).toBe(null);

    act(() => {
      useVehicleStore.getState().setVehicles({
        1234: {
          ...vehicleBase,
        },
      });
    });

    expect(result.current).toBe(0);

    act(() => {
      useVehicleStore.getState().setVehicles({
        1234: {
          ...vehicleBase,
          spd: 100,
        },
      });
    });

    expect(result.current).toBe(100);
  });
});
