import { render, screen } from '@testing-library/react';

import { trainsVar } from '../../graphql/client';
import VehicleTrackingIcon from '../VehicleTrackingIcon';

describe('VehicleTrackingIcon', () => {
  it('should not render tracking icon when vehicle is not tracked', () => {
    trainsVar({});

    render(
      <VehicleTrackingIcon trainNumber={123} departureDate={'2023-03-07'} />
    );

    expect(screen.queryByTestId('SignalVariantIcon')).toBeNull();
  });

  it('should render tracking icon when train number exists but departure date does not match', () => {
    trainsVar({
      123: { departureDate: '2023-03-07' },
    });

    render(
      <VehicleTrackingIcon trainNumber={123} departureDate={'2023-03-08'} />
    );

    expect(screen.queryByTestId('SignalVariantIcon')).toBeNull();
  });

  it('should render tracking icon when vehicle is tracked', () => {
    trainsVar({
      123: { departureDate: '2023-03-07' },
    });

    render(
      <VehicleTrackingIcon trainNumber={123} departureDate={'2023-03-07'} />
    );

    expect(screen.queryByTestId('SignalVariantIcon')).not.toBeNull();
  });
});
