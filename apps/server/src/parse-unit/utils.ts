import { iSocketError } from './types';

export function getSocketError(error: any): iSocketError {
  return {
    code: error?.payload?.code || error?.message,
    name: error?.payload?.name || error?.name,
    message: error?.payload?.message || error?.message,
  };
}

export function addMinutes(n = 30) {
  const date = new Date();

  date.setMinutes(date.getMinutes() + n);

  return date;
}
