import { useEffect, useState } from 'react';

import { TimelineContent, TimelineItem } from '@mui/lab';
import {
  Box,
  Link,
  Grid2 as Grid,
  Collapse,
  IconButton,
  Button,
} from '@mui/material';
import { ChevronDown, ChevronUp, MapMarkerRadius } from 'mdi-material-ui';
import RouterLink from 'next/link';
import { useTranslation } from 'react-i18next';
import { useMap } from 'react-map-gl';

import {
  TrainTimeTableGroupFragment,
  Wagon,
} from '../graphql/generated/digitraffic/graphql';
import { TrainExtendedDetails } from '../types';
import getTrainCompositionDetailsForStation from '../utils/getTrainCompositionDetailsForStation';
import { PassengerInformationMessage } from '../utils/passengerInformationMessages';
import { trainStations } from '../utils/stations';
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
  isFirstStop: boolean;
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
  isFirstStop,
  isFinalStop,
  realTimeTrain,
  onWagonClick,
  passengerInformationMessages,
  onStationAlertClick,
}: TrainStationTimelineItemProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(
    Boolean(
      (realTimeTrain &&
        getTrainCompositionDetailsForStation(timeTableGroup, realTimeTrain)
          .status === 'changed') ||
        (isFirstStop &&
          realTimeTrain?.compositions?.[0]?.journeySections &&
          realTimeTrain.compositions[0].journeySections.length > 1)
    )
  );
  const { vehicleMap: map } = useMap();
  useEffect(() => {
    setOpen((open) => open || Boolean(passengerInformationMessages?.length));
  }, [passengerInformationMessages?.length]);

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
      <TimelineContent sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            display: 'flex',
            cursor: 'pointer',
            flex: 1,
          }}
          onClick={() => setOpen(!open)}
        >
          <Grid container spacing={2} sx={{ flex: '1' }}>
            <Grid size={6}>
              <Link
                component={RouterLink}
                href={`/${getTrainStationName(station)}`}
                onClick={(e) => e.stopPropagation()}
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
          </Grid>
          <IconButton
            sx={{
              alignSelf: 'flex-start',
              marginTop: '0.4rem',
              color: 'grey.400',
            }}
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <ChevronUp /> : <ChevronDown />}
          </IconButton>
        </Box>
        <Grid
          container
          spacing={2}
          sx={(theme) => ({
            borderBottom: `1px solid ${theme.vars.palette.divider}`,
          })}
        >
          <Grid size={12}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ paddingY: 1 }}>
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
                      passengerInformationMessages={
                        passengerInformationMessages
                      }
                    />
                  )}
                <Button
                  size="small"
                  variant="text"
                  sx={{
                    borderColor: 'divider',
                    color: 'text.secondary',
                    marginTop: 1,
                  }}
                  onClick={() => {
                    if (!map) return;

                    const trainStation = trainStations.find(
                      (s) => s.stationShortCode === station.shortCode
                    );
                    if (!trainStation) return;

                    map.flyTo(
                      {
                        duration: 1000,
                        center: [trainStation.longitude, trainStation.latitude],
                        zoom: 15.5,
                      },
                      {
                        triggerSource: 'TrainStationTimelineItem',
                      }
                    );
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  startIcon={<MapMarkerRadius />}
                >
                  {t('show_train_stopping_position_on_map')}
                </Button>
              </Box>
            </Collapse>
          </Grid>
        </Grid>
      </TimelineContent>
    </TimelineItem>
  );
}
