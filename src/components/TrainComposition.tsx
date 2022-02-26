import { useReactiveVar } from '@apollo/client';
import { Box } from '@mui/material';
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

import { vehiclesVar } from '../graphql/client';
import { TrainDetailsFragment, Wagon } from '../graphql/generated/digitraffic';
import getTrainCompositionDetailsForStation from '../utils/getTrainCompositionDetailsForStation';
import getTrainCurrentJourneySection from '../utils/getTrainCurrentJourneySection';
import { getTrainDepartureStation, getTrainStationName } from '../utils/train';
import TrainWagonSm2And4 from './TrainWagonSm2And4';
import TrainWagonSm5 from './TrainWagonSm5';

type TrainCompositionProps = {
  train: TrainDetailsFragment;
  stationName?: string;
};

function TrainComposition({ train, stationName }: TrainCompositionProps) {
  const vehicles = useReactiveVar(vehiclesVar);
  const { t } = useTranslation();

  const getTrainJourneySectionForStation = (stationName: string) => {
    const journeySection = train.compositions?.[0]?.journeySections?.find((s) =>
      s?.startTimeTableRow?.station.name
        .toLowerCase()
        .includes(stationName.toLowerCase())
    );
    return journeySection;
  };

  const journeySection = stationName
    ? getTrainJourneySectionForStation(stationName)
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
    const sm2And4WagonLength = 100;
    const sm5WagonLength = 150;
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
          <TrainWagonSm2And4
            doorsOpen={
              w != null &&
              w.vehicleId != null &&
              vehicles[w.vehicleId]?.drst === 1
            }
          />
        )}
        {wagonType === 'Sm5' && (
          <TrainWagonSm5
            doorsOpen={
              w != null &&
              w.vehicleId != null &&
              vehicles[w.vehicleId]?.drst === 1
            }
          />
        )}
        {!train.commuterLineid && (
          <Box
            sx={{
              background: '#e5e5e5',
              width: 'calc(100% - 2px)',
              borderRadius: '4px',
              color: 'black',
            }}
          >
            {w?.salesNumber}
          </Box>
        )}
      </>
    );
  };

  return (
    <div>
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
              key={w?.location}
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
              {getWagonElement(w)}
            </span>
          ))}
      </div>
      {stationName && (
        <div className="stopping-sectors" style={{ display: 'flex' }}>
          <div style={{ border: '1px solid #ddd', flex: 1 }}>A</div>
          <div style={{ border: '1px solid #ddd', flex: 0.8 }}>B</div>
          <div style={{ border: '1px solid #ddd', flex: 0.8 }}>C</div>
          <div style={{ border: '1px solid #ddd', flex: 1 }}>D</div>
        </div>
      )}
      <div>
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
      </div>
    </div>
  );
}

export default TrainComposition;
