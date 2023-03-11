import { format } from 'date-fns-tz';

export function formatEET(date: number | Date, dateFormat: string): string {
  return format(date, dateFormat, {
    timeZone: 'Europe/Helsinki',
  });
}
