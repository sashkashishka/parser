import { merge, Observable } from 'rxjs';
import { iParseUnit } from 'src/types';
import { createPolling$, iPollingOptions } from '../polling$';
import { iPollingEvent } from '../utils/events';

export function createPollingPool$(
  parseUnits: iParseUnit[],
  options: iPollingOptions,
): Observable<iPollingEvent> {
  return merge(...parseUnits.map((unit) => createPolling$(unit, options)));
}
