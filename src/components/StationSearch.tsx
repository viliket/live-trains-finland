import { forwardRef, ReactElement, Ref, useEffect, useState } from 'react';

import {
  Box,
  alpha,
  DialogContent,
  DialogContentText,
  InputBase,
  ListItemButton,
} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import { TransitionProps } from '@mui/material/transitions';
import { ChevronLeft, Magnify } from 'mdi-material-ui';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { TrainStation, trainStations } from '../utils/stations';

const trainStationsWithPassengerTraffic = trainStations.filter(
  (s) => s.passengerTraffic
);

const filterOptions = (options: TrainStation[], inputValue: string) => {
  if (!inputValue) return options;
  const input = inputValue.trim().toLowerCase();
  return options.filter((o) => o.stationName.toLowerCase().indexOf(input) > -1);
};

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
  const navigate = useNavigate();
  const { hash } = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const isSearchDialogOpen = hash === searchDialogUrlHash;
    if (!isSearchDialogOpen) {
      setInputValue('');
    }
    setOpen(isSearchDialogOpen);
  }, [hash]);

  const handleClickOpen = () => {
    window.location.hash = searchDialogUrlHash;
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handleClickStation = (station: TrainStation) => {
    navigate(`/${station.stationName}`, { replace: true });
  };

  const filteredOptions = filterOptions(
    trainStationsWithPassengerTraffic,
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
          {t('search_station_by_name')}
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
              placeholder={t('search_station_by_name') ?? undefined}
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
          <List>
            {filteredOptions.map((s) => (
              <ListItemButton
                key={s.stationShortCode}
                onClick={() => handleClickStation(s)}
              >
                <ListItemText primary={s.stationName} />
              </ListItemButton>
            ))}
          </List>
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