'use client';

import { forwardRef, ReactElement, Ref, useEffect, useState } from 'react';

import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  IconButton,
  Skeleton,
  Slide,
  Snackbar,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import distance from '@turf/distance';
import { ChevronLeft, HomeClockOutline, Train } from 'mdi-material-ui';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import { gqlClients } from '../graphql/client';
import { useRunningTrainsQuery } from '../graphql/generated/digitraffic';
import { isDefined } from '../utils/common';
import { trainStations } from '../utils/stations';
import {
  getTrainDepartureStationName,
  getTrainDestinationStationName,
  getTrainDisplayName,
} from '../utils/train';

import OptionList from './OptionList';

const isSSR = typeof navigator === 'undefined';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const findNearestDialogUrlHash = '#nearest';

function getDistancesToPosition<T>(
  items: T[],
  position: GeolocationPosition | null,
  getCoordinates: (item: T) => [number, number] | null
): { item: T; distance: number }[] | null {
  if (!position) return null;
  const toPos = [position.coords.longitude, position.coords.latitude];
  const distances = items.map((item) => {
    const itemPos = getCoordinates(item);

    if (itemPos === null) {
      return { item, distance: Infinity };
    }

    const distanceToPos = distance(itemPos, toPos, { units: 'kilometers' });

    return { item, distance: distanceToPos };
  });

  return distances.sort((a, b) => a.distance - b.distance);
}

function NearestTrainsList({ position }: { position: GeolocationPosition }) {
  const router = useRouter();
  const { loading, error, data } = useRunningTrainsQuery({
    context: { clientName: gqlClients.digitraffic },
    pollInterval: 10000,
    fetchPolicy: 'no-cache',
  });

  const trainsByDistance = data?.currentlyRunningTrains
    ? getDistancesToPosition(
        data.currentlyRunningTrains.filter(isDefined),
        position,
        (train) => {
          if (!train) return null;
          const trainLocation = train.trainLocations?.[0]?.location as
            | [number, number]
            | undefined;
          return trainLocation || [0, 0];
        }
      )
    : null;
  return (
    <>
      <OptionList
        items={trainsByDistance}
        getAvatarContent={({ item: train }) => getTrainDisplayName(train)}
        getPrimaryText={({ item: train }) =>
          `${getTrainDepartureStationName(
            train
          )} - ${getTrainDestinationStationName(train)}`
        }
        getSecondaryText={({ distance }) => `${distance.toFixed(2)} km`}
        navigateTo={({ item: train }) =>
          router.replace(`/train/${train.trainNumber}/${train.departureDate}`)
        }
      />
      {loading && (
        <DialogContent>
          {Array.from(Array(7).keys()).map((i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              width="100%"
              height={50}
              sx={{ marginTop: '1rem' }}
            />
          ))}
        </DialogContent>
      )}
      {error && (
        <DialogContent>
          <DialogContentText>{error.message}</DialogContentText>
        </DialogContent>
      )}
    </>
  );
}

function NearestStationsList({ position }: { position: GeolocationPosition }) {
  const router = useRouter();

  const stationsByDistance = getDistancesToPosition(
    trainStations,
    position,
    (station) => [station.longitude, station.latitude]
  )?.slice(0, 10);

  return (
    <OptionList
      items={stationsByDistance}
      getAvatarContent={({ item: station }) => station.stationShortCode}
      getPrimaryText={({ item: station }) => station.stationName}
      getSecondaryText={({ distance }) => `${distance.toFixed(2)} km`}
      navigateTo={({ item: station }) =>
        router.replace(`/${station.stationName}`)
      }
    />
  );
}

function FindNearest() {
  const [geoLocationErrorOpen, setGeoLocationErrorOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [nearestType, setNearestType] = useState<'trains' | 'stations'>();
  const [position, setPosition] = useState<GeolocationPosition>();
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    const onHashChange = () => {
      const isSearchDialogOpen =
        window.location.hash === findNearestDialogUrlHash;
      setOpen(isSearchDialogOpen);
    };
    window.addEventListener('hashchange', onHashChange);
    setOpen(window.location.hash === findNearestDialogUrlHash);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (!isSSR && !navigator.geolocation) return null;

  const findNearest = (nearestType: 'stations' | 'trains') => {
    setNearestType(nearestType);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition(position);
        window.location.hash = findNearestDialogUrlHash;
      },
      (error) => {
        console.error('geolocation error', error);
        setGeoLocationErrorOpen(true);
      }
    );
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <>
      <Stack spacing={1} direction="row" justifyContent="center" mt={2}>
        <Button
          variant="contained"
          onClick={() => findNearest('stations')}
          sx={{
            bgcolor: 'primary.light',
          }}
          startIcon={<HomeClockOutline />}
        >
          {t('nearest_station')}
        </Button>
        <Button
          variant="contained"
          onClick={() => findNearest('trains')}
          sx={{
            bgcolor: 'primary.light',
          }}
          startIcon={<Train />}
        >
          {t('nearest_train')}
        </Button>
      </Stack>
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
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {nearestType === 'trains'
                ? t('nearest_train')
                : t('nearest_station')}
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={(theme) => ({ ...theme.mixins.toolbar })} />
        {nearestType === 'trains' && position && (
          <NearestTrainsList position={position} />
        )}
        {nearestType === 'stations' && position && (
          <NearestStationsList position={position} />
        )}
      </Dialog>
      <Snackbar
        open={geoLocationErrorOpen}
        autoHideDuration={3000}
        onClose={(_e, reason) => {
          if (reason !== 'clickaway') {
            setGeoLocationErrorOpen(false);
          }
        }}
        message={t('no_location_permission')}
      />
    </>
  );
}

export default FindNearest;
