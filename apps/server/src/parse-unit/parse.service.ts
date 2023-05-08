import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Observable, Observer, Subscription } from 'rxjs';
import { Socket } from 'socket.io';
import { iParseUnit } from 'src/types';
import { ParseUnitEvents } from './constants';
import { CacheMediator } from './core/cache-mediator';
import { createPollingPool$ } from './core/polling-pool$';
import {
  AdPollingEvent,
  iPollingEvent,
  PollingEvents,
} from './core/utils/events';
import { iParseError, iParseOptions } from './types';

@Injectable()
export class ParseService implements OnModuleDestroy {
  private socket: Socket;

  private activeParseUnits: iParseUnit[];

  private endTime: Date;

  private cacheMediator: CacheMediator;

  private pollingPool$: Observable<iPollingEvent>;

  private pollingSubscription: Subscription;

  private abortController: AbortController;

  onModuleDestroy() {
    this.stop();
  }

  public addSocket(socket: Socket) {
    this.socket = socket;
  }

  public start(parseUnits: iParseUnit[], endTime: Date) {
    if (this.pollingSubscription) return this.cacheMediator.adsStream;

    this.activeParseUnits = parseUnits;
    this.endTime = endTime;

    this.abortController = new AbortController();

    this.cacheMediator = new CacheMediator();
    this.pollingPool$ = createPollingPool$(parseUnits, {
      endTime,
      signal: this.abortController.signal,
    });

    this.pollingSubscription = this.pollingPool$.subscribe(this.observer);

    return this.cacheMediator.adsStream;
  }

  public resubscribe() {
    if (this.status() === 'idle') return undefined;

    return this.cacheMediator.adsStream;
  }

  public stop() {
    console.trace('Stop');
    this.abortController?.abort?.();
    this.pollingSubscription?.unsubscribe?.();
    this.pollingSubscription = undefined;
    this.endTime = undefined;
    this.activeParseUnits = undefined;
  }

  public status() {
    return this.pollingSubscription ? 'active' : 'idle';
  }

  public get parseOptions(): iParseOptions {
    return {
      endTime: this.endTime,
      parseUnits: this.activeParseUnits,
    };
  }

  private get observer(): Observer<iPollingEvent> {
    return {
      next: (event: iPollingEvent) => {
        if (!(event instanceof iPollingEvent)) {
          return this.stop();
        }

        switch (event.type) {
          case PollingEvents.AD: {
            this.cacheMediator.populate(event as AdPollingEvent);
            break;
          }

          case PollingEvents.ERROR: {
            // TODO: log such errors to log file
            console.trace(PollingEvents.ERROR, Date.now());
            break;
          }

          default:
          // noop
        }
      },
      error: (error) => {
        this.stop();

        const errorEvent: iParseError = {
          code: error?.payload?.code,
          name: error?.payload?.name || error?.name,
          message: error?.payload?.message || error?.message,
        };

        this.socket.emit(ParseUnitEvents.error, errorEvent);
      },
      complete: () => {
        this.stop();
        this.socket.emit(ParseUnitEvents.complete);
      },
    };
  }
}
