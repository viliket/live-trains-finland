import { ReactNode, useEffect, useState } from 'react';

import {
  Box,
  alpha,
  DialogContentText,
  InputBase,
  ListSubheader,
} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import { format, parseISO } from 'date-fns';
import { ChevronLeft, Magnify } from 'mdi-material-ui';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { useRunningTrainsQuery } from '../hooks/useRunningTrainsQuery';
import { useUrlHashState } from '../hooks/useUrlHashState';
import { isDefined } from '../utils/common';
import { trainStations } from '../utils/stations';
import {
  getDepartureTimeTableRow,
  getDestinationTimeTableRow,
  getTrainDepartureStationName,
  getTrainDestinationStationName,
  getTrainDisplayName,
} from '../utils/train';

import OptionList from './OptionList';
import SlideUpTransition from './SlideUpTransition';

const trainStationsWithPassengerTraffic = trainStations.filter(
  (s) => s.passengerTraffic
);

const OptionListSubHeader = ({ children }: { children: ReactNode }) => (
  <ListSubheader
    component="div"
    sx={(theme) => ({
      top: '56px',
      [theme.breakpoints.up('sm')]: {
        top: '64px',
      },
    })}
  >
    {children}
  </ListSubheader>
);

function filterBySearchQuery<T>(
  items: T[],
  keyExtractor: (item: T) => string,
  searchQuery: string
): T[] {
  const queryLowerCase = searchQuery.toLowerCase();
  return items.filter((item) =>
    keyExtractor(item).toLowerCase().includes(queryLowerCase)
  );
}

export default function StationAndTrainSearch() {
  const [open, setOpen] = useUrlHashState('#search');
  const [inputValue, setInputValue] = useState('');
  const router = useRouter();
  const { t } = useTranslation();
  const { isLoading, error, data } = useRunningTrainsQuery();
  const currentlyRunningTrains = data?.currentlyRunningTrains;

  useEffect(() => {
    if (!open) {
      setInputValue('');
    }
  }, [open]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const filteredStations = filterBySearchQuery(
    trainStationsWithPassengerTraffic,
    (s) => s.stationName,
    inputValue
  );

  const filteredTrains = filterBySearchQuery(
    currentlyRunningTrains?.filter(isDefined) ?? [],
    (t) => getTrainDisplayName(t),
    inputValue
  );

  return (
    <div>
      <Box
        component="button"
        onClick={handleClickOpen}
        sx={(theme) => ({
          bgcolor: theme.palette.action.selected,
          color: theme.palette.text.secondary,
          border: 'none',
          '&:hover': {
            bgcolor: alpha(
              theme.palette.action.selected,
              theme.palette.action.selectedOpacity +
                theme.palette.action.hoverOpacity
            ),
          },
          fontSize: theme.typography.pxToRem(14),
          borderRadius: 10,
          cursor: 'pointer',
          p: '6px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        })}
      >
        <Magnify sx={{ m: '6px' }} />
        <Box
          component="span"
          sx={{ ml: 1, flex: 1, textAlign: 'left', opacity: 0.7 }}
        >
          {t('search_station_or_train_by_name')}
        </Box>
      </Box>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={SlideUpTransition}
      >
        <AppBar position="fixed" elevation={0}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose}>
              <ChevronLeft />
            </IconButton>
            <InputBase
              autoFocus
              placeholder={t('search_station_or_train_by_name') ?? undefined}
              fullWidth
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
            />
          </Toolbar>
        </AppBar>
        <Box sx={(theme) => ({ ...theme.mixins.toolbar })} />
        <>
          <OptionList
            subheader={
              <OptionListSubHeader>{t('station')}</OptionListSubHeader>
            }
            items={filteredStations}
            keyExtractor={(s) => s.stationShortCode}
            getPrimaryText={(s) => s.stationName}
            navigateTo={(s) => router.replace(`/${s.stationName}`)}
          />
          {filteredStations.length === 0 && (
            <DialogContentText sx={{ paddingLeft: 2 }}>
              {t('no_results')}
            </DialogContentText>
          )}
          <OptionList
            subheader={<OptionListSubHeader>{t('train')}</OptionListSubHeader>}
            items={filteredTrains}
            keyExtractor={(t) => t.trainNumber.toString()}
            getAvatarContent={(t) => getTrainDisplayName(t)}
            getPrimaryText={(t) =>
              `${getTrainDepartureStationName(
                t
              )} - ${getTrainDestinationStationName(t)}`
            }
            getSecondaryText={(t) => {
              const deptRow = getDepartureTimeTableRow(t);
              const destRow = getDestinationTimeTableRow(t);
              if (!deptRow || !destRow) return '';
              const deptTime = parseISO(deptRow.scheduledTime);
              const destTime = parseISO(destRow.scheduledTime);
              return `${format(deptTime, 'HH:mm')} - ${format(
                destTime,
                'HH:mm'
              )}`;
            }}
            navigateTo={(t) =>
              router.replace(`/train/${t.trainNumber}/${t.departureDate}`)
            }
          />
          <DialogContentText sx={{ paddingLeft: 2 }}>
            {filteredTrains?.length === 0 && t('no_results')}
            {isLoading && '...'}
            {error?.message}
          </DialogContentText>
        </>
      </Dialog>
    </div>
  );
}
