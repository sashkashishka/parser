import {
  catchError,
  delay,
  Observable,
  of,
  EMPTY,
  map,
  expand,
  startWith,
} from 'rxjs';
import { iParseUnit } from 'src/types';
import { iAd } from 'src/types/ad';
import { ERROR_CODES, stringifyErrorCode } from 'src/utils/errorCodes';
import { ParseFetchError, MaxConsecutiveError } from '../utils/errors';
import {
  AdPollingEvent,
  ErrorPollingEvent,
  FinishPollingEvent,
  iPollingEvent,
} from '../utils/events';

interface iPollingOptions {
  signal: AbortSignal;
  endTime: Date;
}

const MAX_CONSECUTIVE_ERROS = 15;

export function createPolling$(
  parseUnit: iParseUnit,
  { signal, endTime }: iPollingOptions,
): Observable<iPollingEvent> {
  const { frequency } = parseUnit;

  let consecutiveErrorCount = 0;

  const query$ = of({}).pipe(
    catchError((err) => {
      consecutiveErrorCount += 1;

      if (consecutiveErrorCount >= MAX_CONSECUTIVE_ERROS) {
        throw new ErrorPollingEvent(
          new MaxConsecutiveError(
            stringifyErrorCode(ERROR_CODES.MAX_CONSECUTIVE_ERROR),
          ),
        );
      }

      return of(
        new ErrorPollingEvent(
          new ParseFetchError(
            `${stringifyErrorCode(ERROR_CODES.PARSE_FETCH_ERROR)}: ${
              err.message
            }`,
          ),
        ),
      );
    }),
    map((data) => {
      if (data instanceof ErrorPollingEvent) return data;

      consecutiveErrorCount = 0;
      // TODO: pass right types
      // @ts-ignore
      return new AdPollingEvent(data);
    }),
    delay(frequency),
  );

  return query$.pipe(
    expand(() => {
      if (Date.now() >= endTime.getTime()) {
        return EMPTY.pipe(startWith(new FinishPollingEvent()));
      }

      return query$;
    }),
  );
}
