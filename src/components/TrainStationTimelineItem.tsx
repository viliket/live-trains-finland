import { TimelineContent, TimelineItem } from '@mui/lab';
import { Box, Link, Grid2 as Grid, Divider } from '@mui/material';
import RouterLink from 'next/link';
import { useTranslation } from 'react-i18next';

import {
  TrainTimeTableGroupFragment,
  Wagon,
} from '../graphql/generated/digitraffic/graphql';
import { TrainExtendedDetails } from '../types';
import { PassengerInformationMessage } from '../utils/passengerInformationMessages';
import { getTrainStationName } from '../utils/train';

import PassengerInformationMessageAlert from './PassengerInformationMessageAlert';
import TimelineRouteStopSeparator from './TimelineRouteStopSeparator';
import TimeTableRowTime from './TimeTableRowTime';
import TrainComposition from './TrainComposition';

type TrainStationTimelineItemProps = {
  timeTableGroup: TrainTimeTableGroupFragment;
  stationPassed: boolean;
  isVehicleAtStation: boolean;
  wasVehicleAtStation: boolean;
  isFinalStop: boolean;
  realTimeTrain?: TrainExtendedDetails | null;
  onWagonClick: (w: Wagon) => void;
  passengerInformationMessages?: PassengerInformationMessage[];
  onStationAlertClick: (stationCode: string) => void;
};

export default function TrainStationTimelineItem({
  timeTableGroup,
  stationPassed,
  isVehicleAtStation,
  wasVehicleAtStation,
  isFinalStop,
  realTimeTrain,
  onWagonClick,
  passengerInformationMessages,
  onStationAlertClick,
}: TrainStationTimelineItemProps) {
  const { t } = useTranslation();

  const row = timeTableGroup.departure ?? timeTableGroup.arrival;
  if (!row) return null;
  const station = row.station;

  return (
    <TimelineItem
      sx={{
        '&:before': {
          display: 'none',
        },
      }}
    >
      <TimelineRouteStopSeparator
        passed={stationPassed}
        isVehicleAtStation={isVehicleAtStation}
        wasVehicleAtStation={wasVehicleAtStation}
        isFinalStop={isFinalStop}
        platformSide={timeTableGroup.stationPlatformSide}
      />
      <TimelineContent>
        <Grid container spacing={2}>
          <Grid size={6}>
            <Link
              component={RouterLink}
              href={`/${getTrainStationName(station)}`}
              underline="none"
              sx={{
                color: 'inherit',
                fontWeight: 500,
              }}
            >
              {getTrainStationName(station)}
            </Link>
            <Box sx={{ color: 'text.secondary' }}>
              {t('track')} {row.commercialTrack}
            </Box>
          </Grid>
          <Grid size={3} sx={{ marginTop: '1rem' }}>
            {timeTableGroup.arrival ? (
              <TimeTableRowTime row={timeTableGroup.arrival} />
            ) : (
              '-'
            )}
          </Grid>
          <Grid size={3} sx={{ marginTop: '1rem' }}>
            {timeTableGroup.departure ? (
              <TimeTableRowTime row={timeTableGroup.departure} />
            ) : (
              '-'
            )}
          </Grid>
          <Grid size={12}>
            {realTimeTrain && (
              <Box sx={{ textAlign: 'center' }}>
                <TrainComposition
                  train={realTimeTrain}
                  stationTimeTableRowGroup={timeTableGroup}
                  onWagonClick={onWagonClick}
                />
              </Box>
            )}
            {passengerInformationMessages &&
              passengerInformationMessages.length > 0 && (
                <PassengerInformationMessageAlert
                  onClick={() => onStationAlertClick(station.shortCode)}
                  passengerInformationMessages={passengerInformationMessages}
                />
              )}
            <Divider />
          </Grid>
        </Grid>
      </TimelineContent>
    </TimelineItem>
  );
}
