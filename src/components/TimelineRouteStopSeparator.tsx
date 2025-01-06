import { TimelineConnector, TimelineDot, TimelineSeparator } from '@mui/lab';
import { alpha, useTheme } from '@mui/material';
import { ArrowDown, ChevronLeft, ChevronRight } from 'mdi-material-ui';

import { StationPlatformSide } from '../graphql/generated/digitraffic/graphql';

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
  const theme = useTheme();
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
  const secondaryPaleColor = alpha(theme.palette.secondary.main, 0.6);

  return (
    <TimelineSeparator>
      {(isVehicleAtStation || wasVehicleAtStation) && (
        <TimelineDot
          color="secondary"
          sx={[
            {
              position: 'absolute',
              padding: '3px',
              marginTop: '7.5px',
              marginLeft: '-4px',
              zIndex: 1,
            },
            wasVehicleAtStation
              ? {
                  top: '50%',
                }
              : {
                  top: 'auto',
                },
          ]}
        >
          <ArrowDown sx={{ fontSize: '1rem' }} />
        </TimelineDot>
      )}
      <TimelineDot
        sx={{
          position: 'relative',
          padding: '2px',
          borderColor: !passed ? secondaryPaleColor : 'divider',
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
              !passed || wasVehicleAtStation ? secondaryPaleColor : 'divider',
          }}
        />
      )}
    </TimelineSeparator>
  );
};

export default TimelineRouteStopSeparator;
