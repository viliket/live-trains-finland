import { TimelineConnector, TimelineDot, TimelineSeparator } from '@mui/lab';
import { ArrowLeft, ArrowRight, Train } from 'mdi-material-ui';

import { StationPlatformSide } from '../graphql/generated/digitraffic';

type TimelineRouteStopSeparatorProps = {
  passed: boolean;
  isVehicleAtStation: boolean;
  wasVehicleAtStation: boolean;
  isFinalStop: boolean;
  platformSide?: StationPlatformSide | null;
};

const TimelineRouteStopSeparator = ({
  passed,
  isVehicleAtStation,
  wasVehicleAtStation,
  isFinalStop,
  platformSide,
}: TimelineRouteStopSeparatorProps) => {
  const sxArrow = {
    color: !passed ? 'secondary.main' : 'text.secondary',
    fontSize: '0.65rem',
    position: 'absolute',
    top: '0.8rem',
    ...(isVehicleAtStation && {
      bgcolor: 'secondary.main',
      borderRadius: '100%',
      color: '#fff',
    }),
  };

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
      >
        {platformSide === StationPlatformSide.Right && (
          <ArrowLeft
            sx={{
              ...sxArrow,
              left: '-0.8rem',
            }}
          />
        )}
        {platformSide === StationPlatformSide.Left && (
          <ArrowRight
            sx={{
              ...sxArrow,
              left: '0.8rem',
            }}
          />
        )}
      </TimelineDot>
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
