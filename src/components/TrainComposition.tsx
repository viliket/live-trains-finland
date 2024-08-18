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
import getTrainJourneySectionForTimeTableRow from '../utils/getTrainJourneySectionForTimeTableRow';
import { getDepartureTimeTableRow, getTrainStationName } from '../utils/train';

import TrainWagonSm2And4 from './TrainWagonSm2And4';
import TrainWagonSm5 from './TrainWagonSm5';

type JourneySectionFragment = NonNullable<
  NonNullable<
    NonNullable<TrainDetailsFragment['compositions']>[number]
  >['journeySections']
>[number];

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

const getWagonsAndStatusesToDisplay = (
  train: TrainDetailsFragment,
  journeySection?: JourneySectionFragment,
  stationTimeTableRowGroup?: TrainTimeTableGroupFragment
):
  | ((Wagon & { compositionStatus?: string }) | null | undefined)[]
  | undefined => {
  // If no station is provided, return the wagons from the current journey section, ordered by location
  if (!stationTimeTableRowGroup) {
    return journeySection
      ? orderBy(journeySection.wagons, (w) => w?.location, 'desc')
      : undefined;
  }

  const compositionStatus = getTrainCompositionDetailsForStation(
    stationTimeTableRowGroup,
    train
  );

  const isFirstStationOnMultiLegJourney = () => {
    const isFirstStationInJourney =
      getDepartureTimeTableRow(train)?.scheduledTime ===
      stationTimeTableRowGroup.departure?.scheduledTime;
    const hasMultipleJourneySections =
      (train.compositions?.[0]?.journeySections?.length ?? 0) > 1;
    return isFirstStationInJourney && hasMultipleJourneySections;
  };

  // Display composition if it has changed and always for first station of the
  // journey if the train has more than one journey sections
  const shouldDisplayComposition =
    compositionStatus.status === 'changed' || isFirstStationOnMultiLegJourney();

  // Return the wagon statuses if they should be displayed
  return shouldDisplayComposition
    ? compositionStatus.wagonStatuses
        ?.reverse()
        .map((w) =>
          w.wagon ? { ...w.wagon, compositionStatus: w.status } : w.wagon
        )
    : undefined;
};

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

const getJourneySectionToDisplay = (
  train: TrainDetailsFragment,
  stationTimeTableRowGroup?: TrainTimeTableGroupFragment
) => {
  if (!stationTimeTableRowGroup) {
    return getTrainCurrentJourneySection(train);
  }

  if (stationTimeTableRowGroup.departure) {
    return getTrainJourneySectionForTimeTableRow(
      train,
      stationTimeTableRowGroup.departure
    );
  }

  return null;
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
  const hasStationRow = !!stationTimeTableRowGroup;

  const journeySection = getJourneySectionToDisplay(
    train,
    stationTimeTableRowGroup
  );

  const wagons = getWagonsAndStatusesToDisplay(
    train,
    journeySection,
    stationTimeTableRowGroup
  );

  if (!wagons) {
    return !hasStationRow ? (
      <Typography variant="body2" color="text.secondary">
        {t('train_current_composition')} (?)
      </Typography>
    ) : null;
  }

  const trainDirection = stationTimeTableRowGroup?.trainDirection;

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
              key={`${w.location}-${w.compositionStatus}`}
              onClick={() => onWagonClick(w)}
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                opacity: w.compositionStatus === 'removed' ? '0.3' : '1.0',
                width: !hasStationRow
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
                {w.compositionStatus === 'removed' && (
                  <CloseOctagon color="warning" />
                )}
                {w.compositionStatus === 'added' && (
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
      {hasStationRow && (
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
        {!hasStationRow && (
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
        {hasStationRow && (
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
