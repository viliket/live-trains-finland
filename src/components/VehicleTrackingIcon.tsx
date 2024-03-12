import { SignalVariant } from 'mdi-material-ui';

import useTrainStore from '../hooks/useTrainStore';

type VehicleTrackingIconProps = {
  trainNumber: number;
  departureDate?: string;
};

const VehicleTrackingIcon = ({
  trainNumber,
  departureDate,
}: VehicleTrackingIconProps) => {
  const isTracked = useTrainStore(
    (state) =>
      trainNumber in state.trains &&
      state.getTrainByVehicleId(trainNumber).departureDate === departureDate
  );

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
