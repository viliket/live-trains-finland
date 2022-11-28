import { useState } from 'react';

import { Timeline, TimelineContent, TimelineItem } from '@mui/lab';
import { Box, Link, Grid } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { gqlClients } from '../graphql/client';
import {
  TimeTableRowType,
  TrainByStationFragment,
  TrainTimeTableRowFragment,
  useTrainQuery,
  Wagon,
} from '../graphql/generated/digitraffic';
import getTrainCurrentStation from '../utils/getTrainCurrentStation';
import getTrainLatestArrivalRow from '../utils/getTrainLatestArrivalRow';
import getTrainLatestDepartureTimeTableRow from '../utils/getTrainLatestDepartureTimeTableRow';
import getTrainPreviousStation from '../utils/getTrainPreviousStation';
import {
  getTrainScheduledDepartureTime,
  getTrainStationName,
} from '../utils/train';
import TimelineRouteStopSeparator from './TimelineRouteStopSeparator';
import TimeTableRowTime from './TimeTableRowTime';
import TrainComposition from './TrainComposition';
import TrainWagonDetailsDialog from './TrainWagonDetailsDialog';

type TrainInfoContainerProps = {
  train: TrainByStationFragment;
};

function TrainInfoContainer({ train }: TrainInfoContainerProps) {
  const { t } = useTranslation();
  const [wagonDialogOpen, setWagonDialogOpen] = useState(false);
  const [selectedWagon, setSelectedWagon] = useState<Wagon | null>(null);
  const departureDate = getTrainScheduledDepartureTime(train);
  const { error, data: realTimeData } = useTrainQuery(
    departureDate
      ? {
          variables: {
            trainNumber: train.trainNumber,
            departureDate: format(departureDate, 'yyyy-MM-dd'),
          },
          context: { clientName: gqlClients.digitraffic },
          pollInterval: 10000,
          fetchPolicy: 'network-only',
        }
      : { skip: true }
  );

  const realTimeTrain = realTimeData?.train?.[0];

  const handleWagonDialogClose = () => {
    setWagonDialogOpen(false);
  };

  const handleWagonClick = (w: Wagon | null | undefined) => {
    setSelectedWagon(w ?? null);
    setWagonDialogOpen(true);
  };

  const getStops = () => {
    const trainCurrentStation = getTrainCurrentStation(train);
    const trainPreviousStation = getTrainPreviousStation(train);
    const trainLatestArrivalRow = getTrainLatestArrivalRow(train);
    const trainLatestDepartureRow = getTrainLatestDepartureTimeTableRow(train);

    // Group time table rows by station when consecutive rows have same station
    const grouped = (realTimeTrain ?? train).timeTableRows?.reduce(
      (arr, cur, i, a) => {
        if (!i || cur?.station.shortCode !== a[i - 1]?.station.shortCode) {
          arr.push([]);
        }
        if (cur) {
          arr[arr.length - 1].push(cur);
        }
        return arr;
      },
      [] as TrainTimeTableRowFragment[][]
    );

    const timeTableRows = grouped?.map((rows) => {
      return {
        arrival: rows.find((r) => r?.type === TimeTableRowType.Arrival),
        departure: rows.find((r) => r?.type === TimeTableRowType.Departure),
      };
    });

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
          />
          <TimelineContent>
            <Grid
              container
              spacing={2}
              sx={(theme) => ({
                borderBottom: `solid 1px ${theme.palette.divider}`,
              })}
            >
              <Grid item xs={4}>
                <Link
                  component={RouterLink}
                  to={`/${getTrainStationName(station)}`}
                  color="inherit"
                  underline="none"
                >
                  {getTrainStationName(station)}
                </Link>
              </Grid>
              <Grid item xs={3}>
                {g.arrival ? <TimeTableRowTime row={g.arrival} /> : '-'}
              </Grid>
              <Grid item xs={3}>
                {g.departure ? <TimeTableRowTime row={g.departure} /> : '-'}
              </Grid>
              <Grid item xs={2}>
                {r.commercialTrack}
              </Grid>
              <Grid item xs={12}>
                {realTimeTrain && (
                  <div style={{ textAlign: 'center' }}>
                    <TrainComposition
                      train={realTimeTrain}
                      stationName={station.name}
                      onWagonClick={handleWagonClick}
                    />
                  </div>
                )}
              </Grid>
            </Grid>
          </TimelineContent>
        </TimelineItem>
      );
    });
  };

  return (
    <>
      <Box
        sx={(theme) => ({
          textAlign: 'center',
          paddingTop: 2,
          paddingX: 1,
          backgroundColor: theme.palette.common.secondaryBackground.default,
          borderTop: `solid 1px ${theme.palette.divider}`,
        })}
      >
        {error && (
          <Box sx={{ width: '100%', textAlign: 'center' }}>{error.message}</Box>
        )}
        {realTimeTrain && (
          <TrainComposition
            train={realTimeTrain}
            onWagonClick={handleWagonClick}
          />
        )}
      </Box>
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
            backgroundColor: theme.palette.common.secondaryBackground.default,
            boxShadow: `inset 0px -1px 1px ${theme.palette.divider}`,
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
              <Grid item xs={4}>
                {t('station')}
              </Grid>
              <Grid item xs={3}>
                {t('arrival')}
              </Grid>
              <Grid item xs={3}>
                {t('departure')}
              </Grid>
              <Grid item xs={2}>
                {t('track')}
              </Grid>
            </Grid>
          </TimelineContent>
        </TimelineItem>
        {getStops()}
      </Timeline>
      <TrainWagonDetailsDialog
        train={train}
        selectedWagon={selectedWagon}
        open={wagonDialogOpen}
        onClose={handleWagonDialogClose}
      />
    </>
  );
}

export default TrainInfoContainer;
