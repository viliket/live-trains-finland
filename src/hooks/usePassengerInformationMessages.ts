import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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

function createSearchParams(params: Partial<Record<string, string>>) {
  const filteredParams: Record<string, string> = {};

  for (const key in params) {
    const paramValue = params[key];
    if (paramValue != null) {
      filteredParams[key] = paramValue;
    }
  }

  return new URLSearchParams(filteredParams);
}

export default function usePassengerInformationMessages({
  skip,
  stationCode,
  trainNumber,
  trainDepartureDate,
  onlyGeneral,
  refetchIntervalMs = 20000,
}: PassengerInformationMessageQuery) {
  const [messages, setMessages] = useState<PassengerInformationMessage[]>();
  const lastFetchTimeRef = useRef<Date>();
  const [error, setError] = useState<unknown>();

  const params = useMemo(
    () =>
      createSearchParams({
        station: stationCode,
        train_number: trainNumber?.toString(),
        train_departure_date: trainDepartureDate,
        only_general: onlyGeneral?.toString(),
      }),
    [onlyGeneral, stationCode, trainDepartureDate, trainNumber]
  );

  const fetchData = useCallback(async () => {
    try {
      let url: string;
      if (!lastFetchTimeRef.current) {
        url = `${apiBaseUrl}/active?${params}`;
      } else {
        url = `${apiBaseUrl}/updated-after/${
          lastFetchTimeRef.current.toISOString().split('.')[0] + 'Z'
        }?${params}`;
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
  }, [params]);

  useEffect(() => {
    let interval: NodeJS.Timer | null = null;
    if (!skip) {
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
  }, [fetchData, refetchIntervalMs, skip]);

  const relevantMessages = messages
    ? getPassengerInformationMessagesCurrentlyRelevant(messages)
    : undefined;

  return { messages: relevantMessages, error };
}
