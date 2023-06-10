import { TimelineConnector, TimelineDot, TimelineSeparator } from '@mui/lab';
import { ArrowDown, ChevronLeft, ChevronRight } from 'mdi-material-ui';

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
    zIndex: 2,
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
            padding: '3px',
            marginTop: '7.5px',
            marginLeft: '-4px',
            zIndex: 1,
          }}
        >
          <ArrowDown sx={{ fontSize: '1rem' }} />
        </TimelineDot>
      )}
      <TimelineDot
        sx={{
          position: 'relative',
          padding: '2px',
          borderColor: !passed ? 'secondary.main' : 'divider',
        }}
        variant="outlined"
      >
        {platformSide === StationPlatformSide.Right && (
          <ChevronLeft
            sx={{
              ...sxArrow,
              left: '-0.7rem',
            }}
          />
        )}
        {platformSide === StationPlatformSide.Left && (
          <ChevronRight
            sx={{
              ...sxArrow,
              right: '-0.7rem',
            }}
          />
        )}
        <ArrowDown
          sx={{
            fontSize: '0.65rem',
            color: !passed ? 'secondary.main' : 'text.secondary',
          }}
        />
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
