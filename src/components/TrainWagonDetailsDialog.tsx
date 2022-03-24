import React, { useEffect, useState } from 'react';

import {
  Box,
  DialogActions,
  DialogContent,
  FormControlLabel,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';

import { gqlClients } from '../graphql/client';
import {
  TrainByStationFragment,
  Wagon,
} from '../graphql/generated/digitraffic';
import { useTrainInfoQuery, WagonInfo } from '../graphql/queries/vr';
import {
  getTrainDepartureStation,
  getTrainDestinationStation,
  getTrainScheduledDepartureTime,
} from '../utils/train';
import FloorSwitch from './FloorSwitch';
import TrainWagonMap, { wagonMaps } from './TrainWagonMap';

type TrainWagonDetailsDialogProps = {
  onClose: () => void;
  train: TrainByStationFragment;
  selectedWagon: Wagon | null;
  open: boolean;
};

const updateWagonMapPlaceReservations = (
  wagonSalesNumber: number,
  showUpstairs: boolean,
  wagons: Record<string, WagonInfo>
) => {
  const wagon = wagons[wagonSalesNumber];
  if (wagon) {
    wagon.placeList
      .filter((p) => p.floor === (showUpstairs && wagon.floorCount > 1 ? 2 : 1))
      .forEach((p) => {
        if (p.type === 'SEAT') {
          const seatEl = document.getElementById('seat_' + p.number);
          if (seatEl) {
            const highlightEl = seatEl.firstElementChild as HTMLElement | null;
            if (highlightEl) {
              highlightEl.style.fill = p.bookable ? 'green' : 'red';
              highlightEl.style.stroke = 'white';
            }
            const seatNoEl = document.getElementById('seatnumber_' + p.number);
            if (seatNoEl) {
              seatNoEl.style.fill = 'white';
            }
            const seatLineEl = seatEl.querySelector<HTMLElement>('#Line');
            if (seatLineEl) {
              seatLineEl.style.stroke = 'white';
            }
          }
        } else if (p.type === 'BED') {
          const bedEl = document.getElementById('bed_' + p.number);
          if (bedEl) {
            const highlightEl = bedEl.firstElementChild as HTMLElement | null;
            if (highlightEl) {
              highlightEl.style.fill = p.bookable ? 'green' : 'red';
            }
            let bedNoEl = document.getElementById('bednumber_' + p.number);
            if (!bedNoEl) {
              bedNoEl = document.querySelector<HTMLElement>(
                `[id^="bednumber_${p.number}-"]`
              );
            }
            if (bedNoEl) {
              bedNoEl.style.fill = 'white';
            }
          }
        }
      });
  }
};

const TrainWagonDetailsDialog = (props: TrainWagonDetailsDialogProps) => {
  const { onClose, train, selectedWagon, open } = props;
  const { t } = useTranslation();
  const [showUpstairs, setShowUpstairs] = useState(false);

  const departureDate = getTrainScheduledDepartureTime(train);
  const departureStation = getTrainDepartureStation(train)?.shortCode;
  const destinationStation = getTrainDestinationStation(train)?.shortCode;
  const { data: trainData } = useTrainInfoQuery(
    departureDate && departureStation && destinationStation
      ? {
          variables: {
            legs: [
              {
                trainNumber: train.trainNumber.toString(),
                departureTime: departureDate.toISOString(),
                departureStation: departureStation,
                arrivalStation: destinationStation,
              },
            ],
          },
          context: { clientName: gqlClients.vr },
        }
      : { skip: true }
  );

  const coaches = trainData?.trainInfoForLegs?.[0]?.wagonMap.coaches;
  const wagons: Record<string, WagonInfo> | undefined = coaches
    ? JSON.parse(coaches)
    : undefined;

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

  const wagonMap = selectedWagon?.wagonType
    ? wagonMaps[selectedWagon.wagonType]
    : null;

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
          <Box>
            {t('wagon_class')}: {selectedWagon?.wagonType}
          </Box>
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
