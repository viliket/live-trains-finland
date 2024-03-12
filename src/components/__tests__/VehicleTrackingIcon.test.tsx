import { render, screen } from '@testing-library/react';

import useTrainStore from '../../hooks/useTrainStore';
import VehicleTrackingIcon from '../VehicleTrackingIcon';

describe('VehicleTrackingIcon', () => {
  it('should not render tracking icon when vehicle is not tracked', () => {
    useTrainStore.getState().setTrains({});

    render(
      <VehicleTrackingIcon trainNumber={123} departureDate={'2023-03-07'} />
    );

    expect(screen.queryByTestId('SignalVariantIcon')).toBeNull();
  });

  it('should render tracking icon when train number exists but departure date does not match', () => {
    useTrainStore.getState().setTrains({
      123: { departureDate: '2023-03-07' },
    });

    render(
      <VehicleTrackingIcon trainNumber={123} departureDate={'2023-03-08'} />
    );

    expect(screen.queryByTestId('SignalVariantIcon')).toBeNull();
  });

  it('should render tracking icon when vehicle is tracked', () => {
    useTrainStore.getState().setTrains({
      123: { departureDate: '2023-03-07' },
    });

    render(
      <VehicleTrackingIcon trainNumber={123} departureDate={'2023-03-07'} />
    );

    expect(screen.queryByTestId('SignalVariantIcon')).not.toBeNull();
  });
});
