import { useMemo } from 'react';

import { Timeline, TimelineContent, TimelineItem } from '@mui/lab';
import { Box, Grid2 as Grid, Skeleton } from '@mui/material';
import { parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { Wagon } from '../graphql/generated/digitraffic/graphql';
import { TrainExtendedDetails } from '../types';
import getTrainCurrentStation from '../utils/getTrainCurrentStation';
import getTrainLatestArrivalRow from '../utils/getTrainLatestArrivalRow';
import getTrainLatestDepartureTimeTableRow from '../utils/getTrainLatestDepartureTimeTableRow';
import getTrainPreviousStation from '../utils/getTrainPreviousStation';
import { PassengerInformationMessage } from '../utils/passengerInformationMessages';

import TrainStationTimelineItem from './TrainStationTimelineItem';

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

  const {
    trainCurrentStation,
    trainPreviousStation,
    trainLatestArrivalRow,
    trainLatestDepartureRow,
    timeTableRows,
  } = useMemo(() => {
    if (!train) return {};
    return {
      trainCurrentStation: getTrainCurrentStation(train),
      trainPreviousStation: getTrainPreviousStation(train),
      trainLatestArrivalRow: getTrainLatestArrivalRow(train),
      trainLatestDepartureRow: getTrainLatestDepartureTimeTableRow(train),
      timeTableRows: (realTimeTrain ?? train).timeTableGroups,
    };
  }, [train, realTimeTrain]);

  const getStops = () => {
    if (!timeTableRows) return null;

    return timeTableRows.map((ttGroup, index, { length }) => {
      const row = ttGroup.departure ?? ttGroup.arrival;
      if (!row) return null;
      const station = row.station;

      const stationPassed =
        (row.actualTime && parseISO(row.actualTime) < new Date()) ||
        (trainLatestDepartureRow &&
          row.scheduledTime < trainLatestDepartureRow?.scheduledTime);

      const isVehicleAtStation =
        trainCurrentStation?.shortCode === station.shortCode &&
        trainLatestArrivalRow?.scheduledTime === ttGroup.arrival?.scheduledTime;

      const wasVehicleAtStation =
        !trainCurrentStation &&
        trainPreviousStation?.shortCode === station.shortCode &&
        trainLatestDepartureRow?.scheduledTime ===
          ttGroup.departure?.scheduledTime;

      return (
        <TrainStationTimelineItem
          key={station.shortCode + row.type + row.scheduledTime}
          timeTableGroup={ttGroup}
          stationPassed={stationPassed}
          isVehicleAtStation={isVehicleAtStation}
          wasVehicleAtStation={wasVehicleAtStation}
          isFirstStop={index === 0}
          isFinalStop={index === length - 1}
          realTimeTrain={realTimeTrain}
          passengerInformationMessages={stationMessages?.[station.shortCode]}
          onWagonClick={onWagonClick}
          onStationAlertClick={onStationAlertClick}
        />
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
          // Negate parent padding to span whole horizontal space
          marginX: '-16px',
          padding: '0.4rem',
          // Original parent padding + chevron button width + chevron button padding
          paddingRight: 'calc(16px + 24px + 10px)',
          // Original parent padding + timeline dot width
          paddingLeft: 'calc(16px + 12px)',
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
