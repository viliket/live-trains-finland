import React, { useEffect, useState } from 'react';

import {
  Box,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';

import {
  TrainByStationFragment,
  Wagon,
} from '../graphql/generated/digitraffic/graphql';
import {
  PlaceInfo,
  useWagonMapDataQuery,
  WagonInfo,
} from '../hooks/useWagonMapDataQuery';
import {
  getTrainDepartureStation,
  getTrainDestinationStation,
  getTrainScheduledDepartureTime,
  getWagonNumberFromVehicleId,
} from '../utils/train';

import FloorSwitch from './FloorSwitch';
import TrainWagonMap, { wagonMaps } from './TrainWagonMap';

type TrainWagonDetailsDialogProps = {
  onClose: () => void;
  train: TrainByStationFragment;
  selectedWagon: Wagon | null;
  open: boolean;
};

const updateSeatPlaceReservation = (placeInfo: PlaceInfo) => {
  const seatEl = document.getElementById('seat_' + placeInfo.number);
  if (!seatEl) return;

  const highlightEl = seatEl.firstElementChild as HTMLElement | null;
  if (highlightEl) {
    highlightEl.style.fill = placeInfo.bookable ? 'green' : 'red';
    highlightEl.style.stroke = 'white';
  }

  const seatNoEl = document.getElementById('seatnumber_' + placeInfo.number);
  if (placeInfo.services.includes('PETS')) {
    if (seatNoEl) {
      seatNoEl.style.fill = 'none';
    }
    const seatNoElWithServiceIcon = document.getElementById(
      `seatnumber_${placeInfo.number}-with-service-icon`
    );
    if (seatNoElWithServiceIcon) {
      seatNoElWithServiceIcon.style.fill = 'white';
    }
  } else if (seatNoEl) {
    seatNoEl.style.fill = 'white';
  }

  const seatLineEl = seatEl.querySelector<HTMLElement>(`path[id^="Line"]`);
  if (seatLineEl) {
    seatLineEl.style.stroke = 'white';
  }
};

const updateBedPlaceReservation = (placeInfo: PlaceInfo) => {
  const bedEl = document.getElementById('bed_' + placeInfo.number);
  if (!bedEl) return;

  const highlightEl = bedEl.firstElementChild as HTMLElement | null;
  if (highlightEl) {
    highlightEl.style.fill = placeInfo.bookable ? 'green' : 'red';
  }

  let bedNoEl = document.getElementById('bednumber_' + placeInfo.number);
  if (!bedNoEl) {
    bedNoEl = document.querySelector<HTMLElement>(
      `path[id^="bednumber_${placeInfo.number}-"]`
    );
  }

  if (bedNoEl) {
    bedNoEl.style.fill = 'white';
  }
};

const updateWagonMapPlaceReservations = (
  wagonSalesNumber: number,
  showUpstairs: boolean,
  wagons: Record<string, WagonInfo>
) => {
  const wagon = wagons[wagonSalesNumber];

  if (!wagon) return;

  const selectedFloor = showUpstairs && wagon.floorCount > 1 ? 2 : 1;

  wagon.placeList
    .filter((p) => p.floor === selectedFloor)
    .forEach((p) => {
      if (p.type === 'SEAT') {
        updateSeatPlaceReservation(p);
      } else if (p.type === 'BED') {
        updateBedPlaceReservation(p);
      }
    });
};

const DetailsItem = ({
  value,
  caption,
}: {
  value: React.ReactNode;
  caption: React.ReactNode;
}) => (
  <Paper
    sx={(theme) => ({
      ...theme.typography.body2,
      color: theme.palette.text.secondary,
      flexGrow: 1,
    })}
  >
    <Typography variant="caption" display="block">
      {value}
    </Typography>
    <Typography variant="caption" display="block">
      {caption}
    </Typography>
  </Paper>
);

const OccupancyStatusItem = ({
  wagonSalesNumber,
  wagons,
  showUpstairs,
}: {
  wagonSalesNumber: number;
  wagons: Partial<Record<string, WagonInfo>>;
  showUpstairs: boolean;
}) => {
  const { t } = useTranslation();

  const wagonMapWagon = wagons[wagonSalesNumber];
  if (!wagonMapWagon) return null;

  const selectedFloor = showUpstairs && wagonMapWagon.floorCount > 1 ? 2 : 1;
  const isOnSelectedFloor = (p: { floor: number }) => p.floor === selectedFloor;

  const numSeatsTotal =
    wagonMapWagon.placeList.filter(isOnSelectedFloor).length;
  if (numSeatsTotal === 0) return null;

  const numBookedSeats = wagonMapWagon.placeList
    .filter(isOnSelectedFloor)
    .reduce((sum, p) => sum + (p.bookable ? 0 : 1), 0);

  return (
    <DetailsItem
      value={
        <>
          {numBookedSeats} / {numSeatsTotal} (
          {Math.round((numBookedSeats / numSeatsTotal) * 100)}%)
        </>
      }
      caption={t('occupancy')}
    />
  );
};

function getWagonMap(wagon: Wagon | null) {
  if (wagon?.wagonType) {
    if (wagon.wagonType !== 'Sm3') {
      return wagonMaps[wagon.wagonType];
    } else {
      return wagonMaps['Sm3_' + wagon.salesNumber];
    }
  }
  return null;
}

const TrainWagonDetailsDialog = (props: TrainWagonDetailsDialogProps) => {
  const { onClose, train, selectedWagon, open } = props;
  const { t } = useTranslation();
  const [showUpstairs, setShowUpstairs] = useState(false);

  const departureDate = getTrainScheduledDepartureTime(train);
  const departureStation = getTrainDepartureStation(train)?.shortCode;
  const destinationStation = getTrainDestinationStation(train)?.shortCode;
  const { data: wagonMapData } = useWagonMapDataQuery({
    departureStation,
    arrivalStation: destinationStation,
    departureTime: departureDate?.toISOString(),
    trainNumber: train.trainNumber.toString(),
    trainType: train.trainType.name,
    isCommuterLine: !!train.commuterLineid,
  });

  const wagons = wagonMapData?.wagonMapData;

  useEffect(() => {
    if (wagons && selectedWagon) {
      setTimeout(() => {
        updateWagonMapPlaceReservations(
          selectedWagon.salesNumber,
          showUpstairs,
          wagons
        );
      });
    }
  });

  const handleClose = () => {
    setShowUpstairs(false);
    onClose();
  };

  const handleFloorSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShowUpstairs(event.target.checked);
  };

  const handleWagonSvgLoad = () => {
    if (wagons && selectedWagon) {
      updateWagonMapPlaceReservations(
        selectedWagon.salesNumber,
        showUpstairs,
        wagons
      );
    }
  };

  const wagonMap = getWagonMap(selectedWagon);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{t('train_composition')}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              fontWeight: 'bold',
              position: 'sticky',
              top: '-1px',
              backgroundColor: 'background.default',
              width: '100%',
            }}
          >
            {selectedWagon?.salesNumber && selectedWagon?.salesNumber !== 0
              ? `${t('wagon')} ${selectedWagon?.salesNumber}`
              : `${t('train_unit')} ${selectedWagon?.location}`}
          </Box>
          <Stack
            spacing={1}
            direction="row"
            useFlexGap
            flexWrap="wrap"
            marginY={1}
            maxWidth={164}
          >
            <DetailsItem
              value={selectedWagon?.wagonType}
              caption={t('wagon_class')}
            />
            {selectedWagon?.vehicleId && (
              <DetailsItem
                value={getWagonNumberFromVehicleId(
                  selectedWagon.vehicleId,
                  selectedWagon?.wagonType
                )}
                caption={t('number')}
              />
            )}
            {selectedWagon?.vehicleNumber && (
              <DetailsItem
                value={selectedWagon.vehicleNumber}
                caption={t('unit_number')}
              />
            )}
            {wagons && selectedWagon?.salesNumber && (
              <OccupancyStatusItem
                wagonSalesNumber={selectedWagon.salesNumber}
                wagons={wagons}
                showUpstairs={showUpstairs}
              />
            )}
          </Stack>
          {wagonMap && (
            <TrainWagonMap
              wagonType={
                showUpstairs && wagonMap.upstairs
                  ? wagonMap.upstairs
                  : wagonMap.downstairs
              }
              height={wagonMap.height}
              type={wagonMap.type}
              onLoad={handleWagonSvgLoad}
            />
          )}
          {wagonMap && !wagonMap.type && <span>&copy; VR-Yhtymä Oy</span>}
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-evenly' }}>
        <FormControlLabel
          control={
            <FloorSwitch
              sx={{ m: 1 }}
              checked={showUpstairs}
              onChange={handleFloorSwitchChange}
              inputProps={{ 'aria-label': 'controlled' }}
              disabled={!wagonMap?.upstairs}
            />
          }
          label={<>{showUpstairs ? t('upstairs') : t('downstairs')}</>}
        />
      </DialogActions>
    </Dialog>
  );
};

export default TrainWagonDetailsDialog;
