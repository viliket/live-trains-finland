import { SignalVariant } from 'mdi-material-ui';

import { trainsVar } from '../graphql/client';
import useReactiveVarWithSelector from '../hooks/useReactiveVarWithSelector';

type VehicleTrackingIconProps = {
  trainNumber: number;
  departureDate?: string;
};

const VehicleTrackingIcon = ({
  trainNumber,
  departureDate,
}: VehicleTrackingIconProps) => {
  const isTracked = useReactiveVarWithSelector(trainsVar, (v) => {
    return v[trainNumber] && v[trainNumber].departureDate === departureDate;
  });

  return (
    <>
      {isTracked && (
        <SignalVariant
          sx={{
            color: 'success.main',
            position: 'absolute',
            width: '0.5em',
            height: '0.5em',
            top: '-0.25em',
            right: '-0.5em',
          }}
        />
      )}
    </>
  );
};

export default VehicleTrackingIcon;
