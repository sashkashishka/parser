import { Observable } from 'rxjs';
import { parserLogger } from 'src/utils/logger';

export function createFetch$<T = unknown>(url: URL, options?: RequestInit) {
  const fetch$ = new Observable<T>((subscriber) => {
    const abortController = new AbortController();

    parserLogger.info(`Start parsing url: ${url}`);

    fetch(url, {
      signal: abortController.signal,
      ...options,
    })
      .then((res) => {
        parserLogger.info(
          `fetch result: ${JSON.stringify({
            url,
            status: res.status,
            type: res.type,
            redirected: res.redirected,
          })}`,
        );

        return res.json();
      })
      .then((data) => {
        subscriber.next(data);
        subscriber.complete();
      })
      .catch((err) => {
        parserLogger.error(err);
        subscriber.error(err);
      });

    return () => abortController.abort();
  });

  return fetch$;
}
