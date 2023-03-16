import { formatInTimeZone } from 'date-fns-tz';

export function formatEET(date: number | Date, dateFormat: string): string {
  return formatInTimeZone(date, 'Europe/Helsinki', dateFormat);
}
