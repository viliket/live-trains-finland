import { TimelineConnector, TimelineDot, TimelineSeparator } from '@mui/lab';
import { Train } from 'mdi-material-ui';

type TimelineRouteStopSeparatorProps = {
  passed: boolean;
  isVehicleAtStation: boolean;
  wasVehicleAtStation: boolean;
  isFinalStop: boolean;
};

const TimelineRouteStopSeparator = ({
  passed,
  isVehicleAtStation,
  wasVehicleAtStation,
  isFinalStop,
}: TimelineRouteStopSeparatorProps) => {
  return (
    <TimelineSeparator>
      {(isVehicleAtStation || wasVehicleAtStation) && (
        <TimelineDot
          color="secondary"
          sx={{
            position: 'absolute',
            top: wasVehicleAtStation ? '50%' : 'auto',
            marginTop: '0.2rem',
            marginLeft: '-0.5rem',
          }}
        >
          <Train sx={{ fontSize: '1rem' }} />
        </TimelineDot>
      )}
      <TimelineDot
        color={!passed ? 'secondary' : 'grey'}
        sx={
          passed
            ? {
                borderColor: 'divider',
              }
            : undefined
        }
        variant="outlined"
      />
      {!isFinalStop && (
        <TimelineConnector
          sx={{
            bgcolor:
              !passed || wasVehicleAtStation ? 'secondary.main' : 'divider',
          }}
        />
      )}
    </TimelineSeparator>
  );
};

export default TimelineRouteStopSeparator;
