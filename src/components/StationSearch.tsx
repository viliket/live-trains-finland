import { forwardRef, ReactElement, Ref, useState } from 'react';

import { Box, InputBase, ListItemButton } from '@mui/material';
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
import { useNavigate } from 'react-router-dom';

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

export default function StationSearch() {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setInputValue('');
  };

  const handleClickStation = (station: TrainStation) => {
    navigate(`/${station.stationName}`);
  };

  return (
    <div>
      <Box
        component="form"
        sx={{
          bgcolor: 'divider',
          borderRadius: 10,
          p: '6px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <IconButton sx={{ p: '10px' }} aria-label="menu">
          <Magnify />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder={t('search_station_by_name') ?? undefined}
          inputProps={{
            'aria-label': t('search_station_by_name') ?? undefined,
          }}
          onClick={handleClickOpen}
        />
      </Box>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar position="sticky" elevation={0}>
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
        <List>
          {filterOptions(trainStationsWithPassengerTraffic, inputValue).map(
            (s) => (
              <ListItemButton
                key={s.stationShortCode}
                onClick={() => handleClickStation(s)}
              >
                <ListItemText primary={s.stationName} />
              </ListItemButton>
            )
          )}
        </List>
      </Dialog>
    </div>
  );
}
