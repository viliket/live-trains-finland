import { differenceInMinutes, format, parseISO, startOfDay } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { orderBy } from 'lodash';

import {
  TimeTableRowType,
  TrainByStationFragment,
} from '../graphql/generated/digitraffic/graphql';
import { getTimeTableRowRealTime } from '../utils/train';

export type PassengerInformationMessage = {
  id: string;
  version: number;
  creationDateTime: string;
  startValidity: string;
  endValidity: string;
  stations: string[];
  trainNumber?: number;
  trainDepartureDate?: string;
  audio?: {
    text?: PassengerInformationTextContent;
    deliveryRules?: AudioDeliveryRules;
  };
  video?: {
    text?: PassengerInformationTextContent;
    deliveryRules?: VideoDeliveryRules;
  };
};

type PassengerInformationTextContent = {
  fi?: string;
  sv?: string;
  en?: string;
};

type DeliveryRulesBase = {
  /**
   * ISO date in format yyyy-MM-ddTHH:mm:ssZ
   */
  startDateTime?: string;
  weekDays?: Weekday[];
  /**
   * Time component in format H:mm
   */
  startTime?: string;
  endTime?: string;
  endDateTime?: string;
};

type AudioDeliveryRules = DeliveryRulesBase & {
  deliveryType?:
    | 'NOW'
    | 'DELIVERY_AT'
    | 'REPEAT_EVERY'
    | 'ON_SCHEDULE'
    | 'ON_EVENT';
  deliveryAt?: string;
  repeatEvery?: number;
  eventType?: 'ARRIVING' | 'DEPARTING';
  repetitions?: number;
};

type VideoDeliveryRules = DeliveryRulesBase & {
  deliveryType?: 'WHEN' | 'CONTINUOS_VISUALIZATION';
};

type Weekday =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export function getPassengerInformationMessageForLanguage(
  message: PassengerInformationMessage,
  languageCode: string
) {
  const textContent: Record<string, string> | undefined = (
    message.video ?? message.audio
  )?.text;

  if (!textContent) {
    return '';
  }

  let text: string;
  if (languageCode in textContent) {
    text = textContent[languageCode];
  } else {
    text = textContent.fi;
  }
  return getImprovedText(text);
}

export function getPassengerInformationMessagesByStation(
  passengerInformationMessages: PassengerInformationMessage[] | undefined
) {
  return passengerInformationMessages?.reduce((acc, message) => {
    // When there are more than one stations, only add this message to the first
    // and last station in the array (which are ordered according to the train
    // schedule).
    const stationsToAdd =
      message.stations.length > 1
        ? [message.stations[0], message.stations[message.stations.length - 1]]
        : message.stations;

    stationsToAdd.forEach((station) => {
      acc[station] = acc[station] || [];
      acc[station].push(message);
    });
    return acc;
  }, {} as Record<string, PassengerInformationMessage[]>);
}

export function getPassengerInformationMessagesCurrentlyRelevant(
  passengerInformationMessages: PassengerInformationMessage[],
  train?: TrainByStationFragment
): PassengerInformationMessage[] {
  const now = new Date();
  const relevantMessages = passengerInformationMessages.filter((message) =>
    isMessageRelevant(message, now, train)
  );
  return relevantMessages;
}

function getImprovedText(text: string | undefined): string | undefined {
  if (text) {
    const idx = text.indexOf('junalahdot.fi');

    if (idx !== -1) {
      return text.slice(0, idx) + 'junaan.fi / ' + text.slice(idx);
    }
  }
  return text;
}

function isMessageRelevant(
  message: PassengerInformationMessage,
  now: Date,
  train?: TrainByStationFragment
): boolean {
  if (
    !isWithinTimeSpan(
      {
        startDateTime: message.startValidity,
        endDateTime: message.endValidity,
      },
      now
    )
  ) {
    return false;
  }
  if (message.video && isVideoMessageRelevant(message, now)) {
    return true;
  }
  if (message.audio && isAudioMessageRelevant(message, now, train)) {
    return true;
  }
  return false;
}

function isAudioMessageRelevant(
  message: PassengerInformationMessage,
  now: Date,
  train?: TrainByStationFragment
): boolean {
  if (!message.audio) return false;

  const { deliveryRules } = message.audio;

  if (!deliveryRules) return true;

  switch (deliveryRules.deliveryType) {
    case 'NOW': {
      const diffInMinutes = differenceInMinutes(
        now,
        parseISO(message.creationDateTime)
      );
      return diffInMinutes <= 15 && diffInMinutes >= 0;
    }
    case 'DELIVERY_AT': {
      const diffInMinutes = differenceInMinutes(
        now,
        parseISO(deliveryRules.deliveryAt ?? message.creationDateTime)
      );
      return diffInMinutes <= 15 && diffInMinutes >= 0;
    }
    case 'REPEAT_EVERY':
      return isWithinTimeSpan(deliveryRules, now);
    case 'ON_SCHEDULE':
      return isMessageRelevantBasedOnTrainSchedule(
        train,
        now,
        message.stations
      );
    case 'ON_EVENT':
      // TODO: Not yet supported
      return false;
    default:
      return false;
  }
}

function isVideoMessageRelevant(
  message: PassengerInformationMessage,
  now: Date
): boolean {
  if (!message.video) return false;

  const { deliveryRules } = message.video;

  if (!deliveryRules) return true;

  switch (deliveryRules.deliveryType) {
    case 'WHEN':
      return isWithinTimeSpanAndHours(deliveryRules, now);
    case 'CONTINUOS_VISUALIZATION':
      return isWithinTimeSpan(deliveryRules, now);
    default:
      return false;
  }
}

/**
 * Determines whether the messages is relevant based on train schedule and given stations.
 *
 * @param train The train with time table rows describing scheduled arrival times.
 * @param now The current date and time to check whether the station arrival time is within threshold.
 * @param stations The stations to check against.
 * @returns `true` if the message is determined to be relevant.
 */
function isMessageRelevantBasedOnTrainSchedule(
  train: TrainByStationFragment | undefined,
  now: Date,
  stations: string[]
) {
  if (!train) return false;

  // Get train latest arrival row by scheduled times
  const latestArrivalRow = orderBy(
    train.timeTableRows?.filter(
      (r) =>
        r &&
        r.type === TimeTableRowType.Arrival &&
        r.scheduledTime &&
        parseISO(r.scheduledTime) <= now
    ),
    (r) => r?.scheduledTime,
    'desc'
  )[0];

  if (!latestArrivalRow) return false;
  if (!stations.includes(latestArrivalRow.station.shortCode)) return false;
  const latestArrivalRowTime = getTimeTableRowRealTime(latestArrivalRow);
  const diffInMinutes = differenceInMinutes(now, latestArrivalRowTime);
  return diffInMinutes <= 1 && diffInMinutes >= 0;
}

/**
 * Determines whether the current date and time fall within a specified time span and weekdays.
 *
 * @param deliveryRules - The rules that define the time span and weekdays.
 * @param now - The current date and time to check.
 * @returns `true` if the current date and time are within the specified time span and weekdays; otherwise, `false`.
 */
const isWithinTimeSpan = (
  {
    startDateTime,
    startTime,
    endDateTime,
    endTime,
    weekDays,
  }: DeliveryRulesBase,
  now: Date
): boolean => {
  if (!startDateTime || !endDateTime) return true;
  const startDateAdjusted = getDateTime(startDateTime, startTime);
  const endDateAdjusted = getDateTime(endDateTime, endTime);

  const isWithinStartAndEnd =
    startDateAdjusted <= now && now <= endDateAdjusted;
  if (!isWithinStartAndEnd) return false;

  if (!weekDays) return true;

  return weekDays.includes(getCurrentWeekdayInEET(now));
};

/**
 * Determines whether the current date and time fall within specified date span
 * and the specified time on the specified weekdays.
 *
 * @param deliveryRules - The rules that define the date span and the time span on given  weekdays.
 * @param now - The current date and time to check.
 * @returns `true` if the current date and time are within the specified rules.
 */
const isWithinTimeSpanAndHours = (
  {
    startDateTime,
    startTime,
    endDateTime,
    endTime,
    weekDays,
  }: DeliveryRulesBase,
  now: Date
): boolean => {
  if (!startDateTime || !endDateTime) return true;
  const startDateAdjusted = parseISO(startDateTime);
  const endDateAdjusted = parseISO(endDateTime);

  const isWithinStartAndEnd =
    startDateAdjusted <= now && now <= endDateAdjusted;
  if (!isWithinStartAndEnd) return false;

  if (!weekDays?.includes(getCurrentWeekdayInEET(now))) return false;

  const sameDayStartDateTime = getDateTime(now, startTime);
  const sameDayEndDateTime = getDateTime(now, endTime);
  return sameDayStartDateTime <= now && now <= sameDayEndDateTime;
};

const getCurrentWeekdayInEET = (date: Date): Weekday => {
  const dateEET = utcToZonedTime(date, 'Europe/Helsinki');
  return format(dateEET, 'EEEE').toUpperCase() as Weekday;
};

/**
 * Converts a date and an optional time string to a new Date object with both date and time components.
 *
 * The time part represents time in Europe/Helsinki time zone, and if given,
 * it overrides the time part of the date parameter.
 *
 * @param dateTimeISO - The date time in ISO format.
 * @param time - The optional time part (format: "H:mm") in Europe/Helsinki (EET) time zone.
 * @returns A new Date constructed from the given parameters.
 */
const getDateTime = (
  dateTimeISO: string | Date,
  timeISOinEET?: string
): Date => {
  let dateTime: Date;
  if (dateTimeISO instanceof Date) {
    dateTime = dateTimeISO;
  } else {
    dateTime = parseISO(dateTimeISO);
  }
  if (timeISOinEET) {
    dateTime = utcToZonedTime(dateTime, 'Europe/Helsinki');
    const [hours, minutes] = timeISOinEET.split(':').map(Number);
    dateTime = startOfDay(dateTime);
    dateTime.setHours(hours);
    dateTime.setMinutes(minutes);
    dateTime = zonedTimeToUtc(dateTime, 'Europe/Helsinki');
  }
  return dateTime;
};
