import { SignalVariant } from 'mdi-material-ui';

import { vehiclesVar } from '../graphql/client';
import useReactiveVarWithSelector from '../hooks/useReactiveVarWithSelector';

type VehicleTrackingIconProps = {
  trainNumber: number;
};

const VehicleTrackingIcon = ({ trainNumber }: VehicleTrackingIconProps) => {
  const vehicleId = useReactiveVarWithSelector(
    vehiclesVar,
    (v) =>
      // TODO: Should also compare scheduled time as the train number may appear multiple times in time table
      Object.values(v).find((v) => v.jrn === trainNumber)?.veh
  );

  const isTracked = vehicleId != null;

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
