import { Box, Typography } from '@mui/material';
import { orderBy } from 'lodash';
import {
  BagChecked,
  BunkBed,
  CarSide,
  ChevronLeft,
  ChevronRight,
  CloseOctagon,
  Paw,
  PlusCircle,
  Seesaw,
  SilverwareForkKnife,
  WheelchairAccessibility,
} from 'mdi-material-ui';
import { useTranslation } from 'react-i18next';

import {
  TrainDetailsFragment,
  TrainDirection,
  TrainTimeTableGroupFragment,
  Wagon,
} from '../graphql/generated/digitraffic/graphql';
import getTrainCompositionDetailsForStation from '../utils/getTrainCompositionDetailsForStation';
import getTrainCurrentJourneySection from '../utils/getTrainCurrentJourneySection';
import getTrainJourneySectionForStation from '../utils/getTrainJourneySectionForStation';
import { getTrainDepartureStation, getTrainStationName } from '../utils/train';

import TrainWagonSm2And4 from './TrainWagonSm2And4';
import TrainWagonSm5 from './TrainWagonSm5';

type WagonElementProps = {
  wagon: Wagon;
  isCommuterTrain: boolean;
};

const WagonElement = ({ wagon, isCommuterTrain }: WagonElementProps) => {
  const wagonType = wagon.wagonType;
  return (
    <>
      {(wagonType === 'Sm2' || wagonType === 'Sm4') && (
        <TrainWagonSm2And4 vehicleId={wagon.vehicleId} />
      )}
      {wagonType === 'Sm5' && <TrainWagonSm5 vehicleId={wagon.vehicleId} />}
      {!isCommuterTrain && (
        <Box
          sx={{
            background: '#e5e5e5',
            width: 'calc(100% - 2px)',
            borderRadius: '4px',
            color: 'black',
            fontSize: 'x-small',
          }}
        >
          {wagon.salesNumber}
        </Box>
      )}
    </>
  );
};

type TrainCompositionProps = {
  train: TrainDetailsFragment;
  stationTimeTableRowGroup?: TrainTimeTableGroupFragment;
  onWagonClick: (w: Wagon) => void;
};

function TrainComposition({
  train,
  stationTimeTableRowGroup,
  onWagonClick,
}: TrainCompositionProps) {
  const { t } = useTranslation();
  const stationCode = (
    stationTimeTableRowGroup?.departure ?? stationTimeTableRowGroup?.arrival
  )?.station.shortCode;

  const journeySection = stationCode
    ? getTrainJourneySectionForStation(train, stationCode)
    : getTrainCurrentJourneySection(train);
  const compositionChangeDetailsForStation = stationCode
    ? getTrainCompositionDetailsForStation(stationCode, train)?.reverse()
    : null;

  let wagons = compositionChangeDetailsForStation?.map((w) => w.wagon);

  const wagonStatuses = compositionChangeDetailsForStation?.map(
    (w) => w.status
  );

  if (!wagons) {
    if (stationCode) {
      // Composition does not change at this station
      const isFirstStationInJourney =
        getTrainDepartureStation(train)?.shortCode === stationCode;
      const numJourneySections =
        train.compositions?.[0]?.journeySections?.length;
      if (
        isFirstStationInJourney &&
        numJourneySections &&
        numJourneySections > 1
      ) {
        // Display composition for first station on journey if there are more than 1 section
        wagons = orderBy(journeySection?.wagons, (w) => w?.location, 'desc');
      } else {
        return null;
      }
    } else if (journeySection) {
      // No station given, use wagons from current journey section
      wagons = orderBy(journeySection.wagons, (w) => w?.location, 'desc');
    }
  }

  if (!wagons) {
    return !stationCode ? (
      <Typography variant="body2" color="text.secondary">
        {t('train_current_composition')} (?)
      </Typography>
    ) : null;
  }

  const trainDirection = stationTimeTableRowGroup?.trainDirection;

  const getWagonElementWidth = (wagonType?: string | null) => {
    // Total length of train stopping area (A=200, B=160, C=160, D=200) = 720
    const stoppingAreaLength = 720;
    const standardWagonLength = 40; // Length of long distance train wagons

    const wagonLengths: Record<string, number> = {
      Sm2: 158,
      Sm4: 158,
      Sm5: 236,
    };
    const wagonLength =
      (wagonType && wagonLengths[wagonType]) || standardWagonLength;
    return `${(wagonLength / stoppingAreaLength) * 100}%`;
  };

  return (
    <Box
      sx={{
        display: 'inline-block',
        width: '100%',
        maxWidth: '800px',
        '.MuiSvgIcon-root': {
          fontSize: '1rem',
        },
      }}
    >
      <div
        className="composition"
        style={{
          display: 'flex',
          flexDirection:
            trainDirection === TrainDirection.Decreasing
              ? 'row-reverse'
              : 'row',
          alignItems: 'end',
          justifyContent: 'center',
          // Adjust left padding to counter the train direction icon width when no specific station is given
          paddingLeft: !stationTimeTableRowGroup ? '1rem' : undefined,
        }}
      >
        {wagons.map((w, i) =>
          w == null ? (
            // Note: Should never be null
            <span key={i}>?</span>
          ) : (
            <button
              key={`${w.location}-${wagonStatuses?.[i]}`}
              onClick={() => onWagonClick(w)}
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                opacity: wagonStatuses?.[i] === 'removed' ? '0.3' : '1.0',
                width: !stationCode
                  ? train.commuterLineid
                    ? 'auto'
                    : '2rem'
                  : getWagonElementWidth(w.wagonType),
                border: 'none',
                borderBottom: '2px solid transparent',
                margin: 0,
                padding: 0,
                backgroundColor: 'transparent',
                cursor: 'pointer',
              }}
            >
              <span>
                {wagonStatuses?.[i] === 'removed' && (
                  <CloseOctagon color="warning" />
                )}
                {wagonStatuses?.[i] === 'added' && (
                  <PlusCircle color="success" />
                )}
              </span>
              <Box sx={{ color: 'text.secondary' }}>
                {w.catering && <SilverwareForkKnife />}
                {w.pet && <Paw />}
                {w.disabled && <WheelchairAccessibility />}
                {w.playground && <Seesaw />}
                {w.luggage && <BagChecked />}
                {w.wagonType === 'Gfot' && (
                  <CarSide titleAccess="Kattamaton autovaunu" />
                )}
                {w.wagonType === 'Gd' && (
                  <CarSide titleAccess="Katettu autovaunu" />
                )}
                {w.wagonType === 'Edm' && <BunkBed titleAccess="Makuuvaunu" />}
              </Box>
              <Box
                sx={(theme) => ({
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'center',
                  color:
                    theme.palette.mode === 'dark'
                      ? theme.palette.grey[400]
                      : theme.palette.primary.main,
                  'svg path.door': {
                    fill:
                      theme.palette.mode === 'dark'
                        ? theme.palette.grey[500]
                        : theme.palette.primary.light,
                    stroke:
                      theme.palette.mode === 'dark'
                        ? theme.palette.grey[500]
                        : theme.palette.primary.light,
                    strokeWidth: '0.5px',
                  },
                })}
              >
                <WagonElement
                  wagon={w}
                  isCommuterTrain={!!train.commuterLineid}
                />
              </Box>
            </button>
          )
        )}
        <Box
          sx={{
            display: 'flex',
            marginRight:
              trainDirection === TrainDirection.Increasing
                ? '-1rem'
                : undefined,
            marginLeft:
              trainDirection === TrainDirection.Decreasing
                ? '-1rem'
                : undefined,
            color: 'primary.main',
          }}
        >
          {trainDirection === TrainDirection.Decreasing ? (
            <ChevronLeft />
          ) : (
            <ChevronRight />
          )}
        </Box>
      </div>
      {stationCode && (
        <Box
          className="stopping-sectors"
          sx={(theme) => ({
            display: 'flex',
            div: {
              border: '1px solid transparent',
              backgroundColor:
                theme.palette.mode === 'light'
                  ? 'divider'
                  : theme.palette.grey[400],
              color: 'black',
              backgroundClip: 'padding-box',
            },
          })}
        >
          <Box sx={{ flex: 1 }}>A</Box>
          <Box sx={{ flex: 0.8 }}>B</Box>
          <Box sx={{ flex: 0.8 }}>C</Box>
          <Box sx={{ flex: 1 }}>D</Box>
        </Box>
      )}
      <Typography variant="body2" color="text.secondary">
        {!stationCode && (
          <>
            {t('train_current_composition')} (
            {journeySection?.startTimeTableRow?.station &&
              getTrainStationName(journeySection.startTimeTableRow.station)}
            {' - '}
            {journeySection?.endTimeTableRow?.station &&
              getTrainStationName(journeySection.endTimeTableRow.station)}
            )
          </>
        )}
        {stationCode && (
          <>
            {t('train_composition_change_from_to_station_text', {
              from:
                journeySection?.startTimeTableRow?.station &&
                getTrainStationName(journeySection.startTimeTableRow.station),
              to:
                journeySection?.endTimeTableRow?.station &&
                getTrainStationName(journeySection.endTimeTableRow.station),
            })}
          </>
        )}
      </Typography>
    </Box>
  );
}

export default TrainComposition;
