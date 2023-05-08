import { WsResponse } from '@nestjs/websockets';
import {
  Observable,
  Observer,
  switchMap,
  of,
  distinct,
  map,
  Subject,
  merge,
} from 'rxjs';
import { iAd } from 'src/types/ad';
import { AdPollingEvent } from '../utils/events';

export class CacheMediator {
  private set: Set<AdPollingEvent> = new Set();

  private subject: Subject<WsResponse<iAd>>;

  private send$: Observable<AdPollingEvent>;

  private subscribe: Observer<AdPollingEvent>;

  constructor() {
    this.createSend$();
  }

  private createSend$() {
    this.send$ = new Observable((subscribe) => {
      this.subscribe = subscribe;
    });
    this.subject = new Subject();
  }

  public get adsStream(): Observable<WsResponse<iAd>> {
    return merge(
      this.subject,
      this.send$.pipe(
        switchMap((event) => of(...event.payload)),
        distinct((item) => item.id),
        map((item) => ({ event: 'ads', data: item })),
      ),
    );
  }

  public populate(event: AdPollingEvent) {
    if (this.subject.observed) {
      this.sendCache();

      return this.subscribe.next(event);
    }

    this.set.add(event);
  }

  private sendCache() {
    for (let evt of this.set.values()) {
      this.subscribe.next(evt);
    }

    this.set.clear();
  }
}
