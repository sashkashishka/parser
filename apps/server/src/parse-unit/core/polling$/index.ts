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
import { iAd } from 'src/types/ad';
import { ERROR_CODES, stringifyErrorCode } from 'src/utils/errorCodes';
import { ParseFetchError, MaxConsecutiveError } from '../utils/errors';
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

  let c = 0;
  let counter = 0;
  let consecutiveErrorCount = 1;

  return of([]).pipe(
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

      return of(
        new ErrorPollingEvent(
          new ParseFetchError(
            err.message,
            stringifyErrorCode(ERROR_CODES.PARSE_FETCH_ERROR),
          ),
        ),
      );
    }),
    map((data) => {
      if (data instanceof ErrorPollingEvent) return data;

      consecutiveErrorCount = 0;

      // TODO: in some way be notified about different data
      // or move it to parser
      const payload = !Array.isArray(data) ? data : [{ id: counter++ }];

      return new AdPollingEvent(payload);
    }),
    delay(frequency || DEFAULT_FREQUENCY),
    repeat(),
    // takeWhile(() => endTime.getTime() >= Date.now()),
    takeWhile(() => {

      c++;
      return c <= 7;
    }),
  );
}
