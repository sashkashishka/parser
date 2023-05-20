import {
  catchError,
  delay,
  Observable,
  of,
  map,
  repeat,
  takeWhile,
} from 'rxjs';
import { iParseUnit } from 'src/types';
import { ERROR_CODES, stringifyErrorCode } from 'src/utils/errorCodes';
import { Parser } from '../parser';
import { MaxConsecutiveError } from '../utils/errors';
import {
  AdPollingEvent,
  ErrorPollingEvent,
  iPollingEvent,
} from '../utils/events';

export interface iPollingOptions {
  signal: AbortSignal;
  endTime: Date;
}

const MAX_CONSECUTIVE_ERRORS = 10;
const DEFAULT_FREQUENCY = 1000;

export function createPolling$(
  parseUnit: iParseUnit,
  { signal, endTime }: iPollingOptions,
): Observable<iPollingEvent> {
  const { frequency } = parseUnit;

  let consecutiveErrorCount = 1;

  const parser = new Parser({ parseUnit, signal });

  return parser.parse().pipe(
    catchError((err) => {
      consecutiveErrorCount += 1;

      if (consecutiveErrorCount >= MAX_CONSECUTIVE_ERRORS) {
        throw new ErrorPollingEvent(
          new MaxConsecutiveError(
            err.message,
            stringifyErrorCode(ERROR_CODES.MAX_CONSECUTIVE_ERROR),
          ),
        );
      }

      return of(new ErrorPollingEvent(err));
    }),
    map((data) => {
      if (data instanceof ErrorPollingEvent) return data;

      consecutiveErrorCount = 0;

      return new AdPollingEvent(data);
    }),
    delay(frequency || DEFAULT_FREQUENCY),
    repeat(),
    takeWhile(() => endTime.getTime() >= Date.now()),
  );
}
