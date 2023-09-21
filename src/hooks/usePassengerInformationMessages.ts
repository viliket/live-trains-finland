import { useEffect, useMemo, useRef, useState } from 'react';

import { formatISO } from 'date-fns';
import { unionBy } from 'lodash';

import {
  getPassengerInformationMessagesCurrentlyRelevant,
  PassengerInformationMessage,
} from '../utils/passengerInformationMessages';

type PassengerInformationMessageQuery = {
  skip?: boolean;
  stationCode?: string;
  trainNumber?: number;
  trainDepartureDate?: string;
  onlyGeneral?: boolean;
  refetchIntervalMs?: number;
};

const apiBaseUrl = 'https://rata.digitraffic.fi/api/v1/passenger-information';

export default function usePassengerInformationMessages({
  skip,
  stationCode,
  trainNumber,
  trainDepartureDate,
  onlyGeneral,
  refetchIntervalMs = 10000,
}: PassengerInformationMessageQuery) {
  const [messages, setMessages] = useState<PassengerInformationMessage[]>();
  const lastFetchTimeRef = useRef<Date>();
  const [error, setError] = useState<unknown>();

  const params = useMemo(() => {
    return new URLSearchParams({
      ...(stationCode && { station: stationCode }),
      ...(trainNumber && { train_number: trainNumber?.toString() }),
      ...(trainDepartureDate && { train_departure_date: trainDepartureDate }),
      ...(onlyGeneral && { only_general: onlyGeneral?.toString() }),
    });
  }, [onlyGeneral, stationCode, trainDepartureDate, trainNumber]);

  useEffect(() => {
    let interval: NodeJS.Timer | null = null;
    if (!skip) {
      const fetchData = async () => {
        try {
          let url: string;
          if (!lastFetchTimeRef.current) {
            url = `${apiBaseUrl}/active?${params}`;
          } else {
            url = `${apiBaseUrl}/updated-after/${formatISO(
              lastFetchTimeRef.current
            )}?${params}`;
          }

          setError(undefined);
          lastFetchTimeRef.current = new Date();

          const res = await fetch(url);

          if (!res.ok) {
            throw new Error(`Failed to fetch data (status ${res.status})`);
          }

          const latestMessages =
            (await res.json()) as PassengerInformationMessage[];

          setMessages((msgs) => unionBy(latestMessages, msgs, 'id'));
        } catch (error) {
          setError(error);
        }
      };
      interval = setInterval(fetchData, refetchIntervalMs);
      fetchData();
    }

    return () => {
      setMessages(undefined);
      lastFetchTimeRef.current = undefined;
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [params, refetchIntervalMs, skip]);

  const relevantMessages = messages
    ? getPassengerInformationMessagesCurrentlyRelevant(messages)
    : undefined;

  return { messages: relevantMessages, error };
}
