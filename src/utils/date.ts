import moment from 'moment';
import 'moment-timezone';
import { unit } from './const';

export const toUnitTimezoneDate = (dateStr: string): string => {
  const unitTimezone = unit.timezone || 'UTC';
  const currentZ = moment(dateStr).format('Z');
  const unitZ = moment.tz(unitTimezone).format('Z');
  return dateStr.replace(currentZ, unitZ);
};

export const zeroISOTime = '0001-01-01T00:00:00+00:00';
export const unlimitedISOTime = '9999-12-31T23:59:59+00:00';
export const isZeroDate = (dateStr: string): boolean =>
  dateStr === '' || moment(dateStr).isSame(zeroISOTime);

export const isUnlimitedDate = (dateStr: string): boolean =>
  moment(dateStr).isSame(unlimitedISOTime);

const isISOTimeString = (d: string) =>
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}$/.test(d);

export const formatDate = (str: string, timezone = 'UTC'): string => {
  if (str === '' || isZeroDate(str)) {
    return '';
  }

  const d = moment.tz(str, timezone);
  return d.format('YYYY-MM-DD HH:mm');
};

export const getISONow = (): string => moment(new Date()).format();

export const toISOTimeString = (str: string): string => {
  if (isISOTimeString(str)) {
    return str;
  }
  return moment(str).format();
};
