import { forwardRef, ReactElement, Ref, useEffect, useState } from 'react';

import {
  Box,
  alpha,
  DialogContent,
  DialogContentText,
  InputBase,
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

const filterOptions = (options: SearchItem[], inputValue: string) => {
  if (!inputValue) return options;
  const input = inputValue.trim().toLowerCase();
  return options.filter((o) => {
    if (o.type === 'station') {
      return o.station.stationName.toLowerCase().includes(input);
    } else {
      return getTrainDisplayName(o.train).toLowerCase().includes(input);
    }
  });
};

type SearchItem =
  | { type: 'station'; station: TrainStation }
  | { type: 'train'; train: TrainByStationFragment };

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

  const allOptions = [
    ...trainStationsWithPassengerTraffic.map(
      (s): SearchItem => ({
        type: 'station',
        station: s,
      })
    ),
    ...(currentlyRunningTrains
      ?.filter(isDefined)
      .map((t): SearchItem => ({ type: 'train', train: t })) || []),
  ];

  const filteredOptions = filterOptions(allOptions, inputValue).sort((a, b) => {
    if (a.type !== b.type) return -1;
    if (a.type === 'station' && b.type === 'station') {
      return a.station.stationName.localeCompare(b.station.stationName);
    } else if (a.type === 'train' && b.type === 'train') {
      return a.train.trainNumber - b.train.trainNumber;
    } else {
      return 0;
    }
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
        {filteredOptions.length > 0 && (
          <OptionList
            items={filteredOptions}
            keyExtractor={(o) =>
              o.type === 'station'
                ? o.station.stationShortCode
                : o.train.trainNumber.toString()
            }
            getAvatarContent={(o) =>
              o.type === 'station'
                ? o.station.stationShortCode
                : getTrainDisplayName(o.train)
            }
            getPrimaryText={(o) =>
              o.type === 'station'
                ? o.station.stationName
                : `${getTrainDepartureStationName(
                    o.train
                  )} - ${getTrainDestinationStationName(o.train)}`
            }
            navigateTo={(o) => {
              if (o.type === 'station') {
                router.replace(`/${o.station.stationName}`);
              } else {
                router.replace(
                  `/train/${o.train.trainNumber}/${o.train.departureDate}`
                );
              }
            }}
          />
        )}
        {filteredOptions.length === 0 && (
          <DialogContent>
            <DialogContentText>{t('no_results')}</DialogContentText>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
