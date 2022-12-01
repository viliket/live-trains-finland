import { Box, Typography } from '@mui/material';
import { orderBy } from 'lodash';
import {
  BagChecked,
  BunkBed,
  CarSide,
  CloseOctagon,
  Paw,
  PlusCircle,
  Seesaw,
  SilverwareForkKnife,
  WheelchairAccessibility,
} from 'mdi-material-ui';
import { useTranslation } from 'react-i18next';

import { TrainDetailsFragment, Wagon } from '../graphql/generated/digitraffic';
import getTrainCompositionDetailsForStation from '../utils/getTrainCompositionDetailsForStation';
import getTrainCurrentJourneySection from '../utils/getTrainCurrentJourneySection';
import getTrainJourneySectionForStation from '../utils/getTrainJourneySectionForStation';
import { getTrainDepartureStation, getTrainStationName } from '../utils/train';
import TrainWagonSm2And4 from './TrainWagonSm2And4';
import TrainWagonSm5 from './TrainWagonSm5';

type TrainCompositionProps = {
  train: TrainDetailsFragment;
  stationName?: string;
  onWagonClick: (w: Wagon | null | undefined) => void;
};

function TrainComposition({
  train,
  stationName,
  onWagonClick,
}: TrainCompositionProps) {
  const { t } = useTranslation();

  const journeySection = stationName
    ? getTrainJourneySectionForStation(train, stationName)
    : getTrainCurrentJourneySection(train);
  const compositionChangeDetailsForStation = stationName
    ? getTrainCompositionDetailsForStation(stationName, train)
    : null;

  let wagons: (Wagon | undefined | null)[] | undefined | null =
    compositionChangeDetailsForStation?.map((w) => w.wagon);

  const wagonStatuses = compositionChangeDetailsForStation?.map(
    (w) => w.status
  );

  if (!wagons) {
    if (stationName) {
      // Composition does not change at this station
      const isFirstStationInJourney =
        getTrainDepartureStation(train)?.name === stationName;
      const numJourneySections =
        train.compositions?.[0]?.journeySections?.length;
      if (
        isFirstStationInJourney &&
        numJourneySections &&
        numJourneySections > 1
      ) {
        // Display composition for first station on journey if there are more than 1 section
        wagons = journeySection?.wagons;
      } else {
        return <></>;
      }
    } else {
      // No station given, use wagons from current journey section
      wagons = journeySection?.wagons;
    }
  }

  const getWagonElementWidth = (wagonType?: string | null) => {
    // Total length of train stopping area (A=200, B=160, C=160, D=200) = 720
    const stoppingAreaLength = 720;
    const standardWagonLength = 40; // Length of long distance train wagons
    const sm2And4WagonLength = 158;
    const sm5WagonLength = 236;
    let wagonLength: number;
    if (wagonType === 'Sm2' || wagonType === 'Sm4') {
      wagonLength = sm2And4WagonLength;
    } else if (wagonType === 'Sm5') {
      wagonLength = sm5WagonLength;
    } else {
      wagonLength = standardWagonLength;
    }
    return `${(wagonLength / stoppingAreaLength) * 100}%`;
  };

  const getWagonType = (wagonType?: string | null) => {
    if (wagonType != null) {
      return wagonType;
    }

    if (!train.commuterLineid) {
      return null;
    }

    const sm4WagonCommuterLines = ['R', 'Z'];

    if (sm4WagonCommuterLines.includes(train.commuterLineid)) {
      return 'Sm4';
    }

    if (!sm4WagonCommuterLines.includes(train.commuterLineid)) {
      return 'Sm5';
    }
  };

  const getWagonElement = (w?: Wagon | null) => {
    const wagonType = getWagonType(w?.wagonType);
    return (
      <>
        {(wagonType === 'Sm2' || wagonType === 'Sm4') && (
          <TrainWagonSm2And4 vehicleId={w?.vehicleId} />
        )}
        {wagonType === 'Sm5' && <TrainWagonSm5 vehicleId={w?.vehicleId} />}
        {!train.commuterLineid && (
          <Box
            sx={{
              background: '#e5e5e5',
              width: 'calc(100% - 2px)',
              borderRadius: '4px',
              color: 'black',
              fontSize: 'x-small',
            }}
          >
            {w?.salesNumber}
          </Box>
        )}
      </>
    );
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
          alignItems: 'end',
          justifyContent: 'center',
        }}
      >
        {wagons &&
          orderBy(wagons, (w) => w?.location, 'desc').map((w, i) => (
            <span
              key={`${w?.location}-${wagonStatuses?.[i]}`}
              onClick={() => onWagonClick(w)}
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                opacity: wagonStatuses?.[i] === 'removed' ? '0.3' : '1.0',
                width: !stationName
                  ? train.commuterLineid
                    ? 'auto'
                    : '2rem'
                  : getWagonElementWidth(getWagonType(w?.wagonType)),
                borderBottom: '2px solid transparent',
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
              {w?.catering && <SilverwareForkKnife />}
              {w?.pet && <Paw />}
              {w?.disabled && <WheelchairAccessibility />}
              {w?.playground && <Seesaw />}
              {w?.luggage && <BagChecked />}
              {w?.wagonType === 'Gfot' && (
                <CarSide titleAccess="Kattamaton autovaunu" />
              )}
              {w?.wagonType === 'Gd' && (
                <CarSide titleAccess="Katettu autovaunu" />
              )}
              {w?.wagonType === 'Edm' && <BunkBed titleAccess="Makuuvaunu" />}
              <Box
                sx={(theme) => ({
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'center',
                  color:
                    theme.palette.mode === 'dark'
                      ? theme.palette.grey[300]
                      : theme.palette.primary.main,
                  'svg path.door': {
                    fill:
                      theme.palette.mode === 'dark'
                        ? theme.palette.grey[400]
                        : theme.palette.primary.light,
                    stroke:
                      theme.palette.mode === 'dark'
                        ? theme.palette.grey[400]
                        : theme.palette.primary.light,
                    strokeWidth: '0.5px',
                  },
                })}
              >
                {getWagonElement(w)}
              </Box>
            </span>
          ))}
      </div>
      {stationName && (
        <Box
          className="stopping-sectors"
          sx={{
            display: 'flex',
            div: {
              border: '1px solid transparent',
              backgroundColor: '#e5e5e5',
              color: 'black',
              backgroundClip: 'padding-box',
            },
          }}
        >
          <Box sx={{ flex: 1 }}>A</Box>
          <Box sx={{ flex: 0.8 }}>B</Box>
          <Box sx={{ flex: 0.8 }}>C</Box>
          <Box sx={{ flex: 1 }}>D</Box>
        </Box>
      )}
      <Typography variant="body2" color="text.secondary">
        {!stationName && (
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
        {stationName && (
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
