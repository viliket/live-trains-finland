import { forwardRef, ReactElement, Ref, useEffect, useState } from 'react';

import {
  Box,
  alpha,
  DialogContent,
  DialogContentText,
  InputBase,
  ListSubheader,
} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import { TransitionProps } from '@mui/material/transitions';
import { ChevronLeft, Magnify } from 'mdi-material-ui';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { gqlClients } from '../graphql/client';
import {
  TrainByStationFragment,
  useRunningTrainsQuery,
} from '../graphql/generated/digitraffic';
import { isDefined } from '../utils/common';
import { TrainStation, trainStations } from '../utils/stations';
import {
  getTrainDepartureStationName,
  getTrainDestinationStationName,
  getTrainDisplayName,
} from '../utils/train';

import OptionList from './OptionList';

const trainStationsWithPassengerTraffic = trainStations.filter(
  (s) => s.passengerTraffic
);

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const searchDialogUrlHash = '#search';

export default function StationSearch() {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const router = useRouter();
  const { t } = useTranslation();
  const { data } = useRunningTrainsQuery({
    context: { clientName: gqlClients.digitraffic },
    pollInterval: 10000,
    fetchPolicy: 'no-cache',
  });
  const currentlyRunningTrains = data?.currentlyRunningTrains;

  useEffect(() => {
    const onHashChange = () => {
      const isSearchDialogOpen = window.location.hash === searchDialogUrlHash;
      if (!isSearchDialogOpen) {
        setInputValue('');
      }
      setOpen(isSearchDialogOpen);
    };
    window.addEventListener('hashchange', onHashChange);
    setOpen(window.location.hash === searchDialogUrlHash);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleClickOpen = () => {
    window.location.hash = searchDialogUrlHash;
  };

  const handleClose = () => {
    router.back();
  };

  const filteredStations = trainStationsWithPassengerTraffic.filter(
    (station) => {
      return station.stationName
        .toLowerCase()
        .includes(inputValue.toLowerCase());
    }
  );

  const filteredTrains = (
    currentlyRunningTrains?.filter(isDefined) ?? []
  ).filter((train) => {
    return getTrainDisplayName(train)
      .toLowerCase()
      .includes(inputValue.toLowerCase());
  });

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
        TransitionComponent={Transition}
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
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setInputValue(event.target.value);
              }}
            />
          </Toolbar>
        </AppBar>
        <Box sx={(theme) => ({ ...theme.mixins.toolbar })} />
        <>
          <OptionList
            subheader={
              <ListSubheader
                component="div"
                sx={(theme) => ({
                  top: '56px',
                  [theme.breakpoints.up('sm')]: {
                    top: '64px',
                  },
                })}
              >
                {t('station')}
              </ListSubheader>
            }
            items={filteredStations}
            keyExtractor={(s) => s.stationShortCode}
            getAvatarContent={(s) => s.stationShortCode}
            getPrimaryText={(s) => s.stationName}
            navigateTo={(s) => router.replace(`/${s.stationName}`)}
          />
          {filteredStations.length === 0 && (
            <DialogContentText sx={{ paddingLeft: 2 }}>
              {t('no_results')}
            </DialogContentText>
          )}
          <OptionList
            subheader={
              <ListSubheader
                component="div"
                sx={(theme) => ({
                  top: '56px',
                  [theme.breakpoints.up('sm')]: {
                    top: '64px',
                  },
                })}
              >
                {t('train')}
              </ListSubheader>
            }
            items={filteredTrains}
            keyExtractor={(t) => t.trainNumber.toString()}
            getAvatarContent={(t) => getTrainDisplayName(t)}
            getPrimaryText={(t) =>
              `${getTrainDepartureStationName(
                t
              )} - ${getTrainDestinationStationName(t)}`
            }
            navigateTo={(t) =>
              router.replace(`/train/${t.trainNumber}/${t.departureDate}`)
            }
          />
          {filteredTrains.length === 0 && (
            <DialogContentText sx={{ paddingLeft: 2 }}>
              {t('no_results')}
            </DialogContentText>
          )}
        </>
      </Dialog>
    </div>
  );
}
