import { Timeline, TimelineContent, TimelineItem } from '@mui/lab';
import { Box, Link, Grid2 as Grid, Skeleton, Divider } from '@mui/material';
import { parseISO } from 'date-fns';
import RouterLink from 'next/link';
import { useTranslation } from 'react-i18next';

import { Wagon } from '../graphql/generated/digitraffic/graphql';
import { TrainExtendedDetails } from '../types';
import getTrainCurrentStation from '../utils/getTrainCurrentStation';
import getTrainLatestArrivalRow from '../utils/getTrainLatestArrivalRow';
import getTrainLatestDepartureTimeTableRow from '../utils/getTrainLatestDepartureTimeTableRow';
import getTrainPreviousStation from '../utils/getTrainPreviousStation';
import { PassengerInformationMessage } from '../utils/passengerInformationMessages';
import { getTrainStationName } from '../utils/train';

import PassengerInformationMessageAlert from './PassengerInformationMessageAlert';
import TimelineRouteStopSeparator from './TimelineRouteStopSeparator';
import TimeTableRowTime from './TimeTableRowTime';
import TrainComposition from './TrainComposition';

type TrainStationTimelineProps = {
  train?: TrainExtendedDetails | null;
  realTimeTrain?: TrainExtendedDetails | null;
  onWagonClick: (w: Wagon) => void;
  onStationAlertClick: (stationCode: string) => void;
  stationMessages?: Record<string, PassengerInformationMessage[]>;
};

const TrainStationTimeline = ({
  train,
  realTimeTrain,
  onWagonClick,
  onStationAlertClick,
  stationMessages,
}: TrainStationTimelineProps) => {
  const { t } = useTranslation();

  const getStops = () => {
    if (!train) return null;
    const trainCurrentStation = getTrainCurrentStation(train);
    const trainPreviousStation = getTrainPreviousStation(train);
    const trainLatestArrivalRow = getTrainLatestArrivalRow(train);
    const trainLatestDepartureRow = getTrainLatestDepartureTimeTableRow(train);

    const timeTableRows = (realTimeTrain ?? train).timeTableGroups;

    return timeTableRows?.map((g, i, { length }) => {
      const r = g.departure ?? g.arrival;
      if (!r) return <></>;
      const station = r.station;
      const stationPassed =
        (r.actualTime != null && parseISO(r.actualTime) < new Date()) ||
        (trainLatestDepartureRow != null &&
          r.scheduledTime < trainLatestDepartureRow?.scheduledTime);
      return (
        <TimelineItem
          key={station.name + r.type + r.scheduledTime}
          sx={{
            '&:before': {
              display: 'none',
            },
          }}
        >
          <TimelineRouteStopSeparator
            passed={stationPassed}
            isVehicleAtStation={
              trainCurrentStation?.shortCode === station.shortCode &&
              trainLatestArrivalRow?.scheduledTime === g.arrival?.scheduledTime
            }
            wasVehicleAtStation={
              trainCurrentStation == null &&
              trainPreviousStation?.shortCode === station.shortCode &&
              trainLatestDepartureRow?.scheduledTime ===
                g.departure?.scheduledTime
            }
            isFinalStop={i === length - 1}
            platformSide={g.stationPlatformSide}
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
                  {t('track')} {r.commercialTrack}
                </Box>
              </Grid>
              <Grid size={3} sx={{ marginTop: '1rem' }}>
                {g.arrival ? <TimeTableRowTime row={g.arrival} /> : '-'}
              </Grid>
              <Grid size={3} sx={{ marginTop: '1rem' }}>
                {g.departure ? <TimeTableRowTime row={g.departure} /> : '-'}
              </Grid>
              <Grid size={12}>
                {realTimeTrain && (
                  <div style={{ textAlign: 'center' }}>
                    <TrainComposition
                      train={realTimeTrain}
                      stationTimeTableRowGroup={g}
                      onWagonClick={onWagonClick}
                    />
                  </div>
                )}
                {stationMessages &&
                  stationMessages[station.shortCode]?.length > 0 && (
                    <PassengerInformationMessageAlert
                      onClick={() => onStationAlertClick(station.shortCode)}
                      passengerInformationMessages={
                        stationMessages[station.shortCode]
                      }
                    />
                  )}
                <Divider />
              </Grid>
            </Grid>
          </TimelineContent>
        </TimelineItem>
      );
    });
  };

  const getLoadingSkeleton = () => {
    return (
      <Box sx={{ padding: '1rem' }}>
        {Array.from(Array(7).keys()).map((i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            width="100%"
            height={50}
            sx={{ marginTop: '1rem' }}
          />
        ))}
      </Box>
    );
  };

  return (
    <Timeline
      sx={(theme) => ({
        marginTop: 0,
        paddingTop: 0,
        '.MuiTimelineContent-root': {
          ...theme.typography.body2,
          paddingRight: 0,
        },
      })}
    >
      <TimelineItem
        sx={(theme) => ({
          position: 'sticky',
          top: '3.5rem',
          zIndex: 1002,
          backgroundColor:
            theme.vars.palette.common.secondaryBackground.default,
          boxShadow: `inset 0px -1px 1px ${theme.vars.palette.divider}`,
          minHeight: 'auto',
          marginX: '-16px', // Negate parent padding to span whole horizontal space
          padding: '0.4rem',
          paddingRight: '16px', // Original parent padding
          paddingLeft: 'calc(16px + 12px)', // Original parent padding + timeline dot width
          marginBottom: '0.4rem',
          '&:before': {
            display: 'none',
          },
        })}
      >
        <TimelineContent>
          <Grid
            container
            spacing={2}
            sx={(theme) => ({
              fontWeight: theme.typography.fontWeightMedium,
            })}
          >
            <Grid size={6}>{t('station')}</Grid>
            <Grid size={3}>{t('arrival')}</Grid>
            <Grid size={3}>{t('departure')}</Grid>
          </Grid>
        </TimelineContent>
      </TimelineItem>
      {getStops()}
      {!train && getLoadingSkeleton()}
    </Timeline>
  );
};

export default TrainStationTimeline;
