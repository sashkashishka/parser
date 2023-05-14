import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Observable, Observer, Subscription } from 'rxjs';
import { Socket } from 'socket.io';
import { iParseUnit } from 'src/types';
import { ERROR_CODES, stringifyErrorCode } from 'src/utils/errorCodes';
import { ParseStatus, ParseUnitEvents } from './constants';
import { CacheMediator } from './core/cache-mediator';
import { createPollingPool$ } from './core/polling-pool$';
import {
  AdPollingEvent,
  iPollingEvent,
  PollingEvents,
} from './core/utils/events';
import { ParseUnitService } from './parse-unit.service';
import { iParseOptions } from './types';
import { getSocketError } from './utils';

@Injectable()
export class ParseService implements OnModuleDestroy {
  private socket: Socket;

  private endTime: Date;

  private cacheMediator: CacheMediator;

  private pollingPool$: Observable<iPollingEvent>;

  private pollingSubscription: Subscription;

  private abortController: AbortController;

  constructor(private parseUnitService: ParseUnitService) {}

  onModuleDestroy() {
    this.stop();
  }

  public addSocket(socket: Socket) {
    this.socket = socket;
  }

  public setConfig(endTime: Date) {
    this.endTime = endTime || this.endTime;
  }

  public async start(userId: number) {
    if (this.pollingSubscription) return this.cacheMediator.adsStream;

    const selectedParseUnist =
      await this.parseUnitService.getSelectedParseUnits(Number(userId));

    if (!selectedParseUnist?.length) {
      throw new WsException(
        stringifyErrorCode(ERROR_CODES.EMPTY_PARSE_UNIT_LIST),
      );
    }

    this.abortController = new AbortController();

    this.cacheMediator = new CacheMediator();
    this.pollingPool$ = createPollingPool$(selectedParseUnist, {
      endTime: this.endTime,
      signal: this.abortController.signal,
    });

    this.pollingSubscription = this.pollingPool$.subscribe(this.observer);

    return this.cacheMediator.adsStream;
  }

  public resubscribe() {
    if (this.status() === ParseStatus.IDLE) return undefined;

    return this.cacheMediator.adsStream;
  }

  public stop() {
    this.abortController?.abort?.();
    this.pollingSubscription?.unsubscribe?.();
    this.pollingSubscription = undefined;
  }

  public status() {
    return this.pollingSubscription ? ParseStatus.PARSING : ParseStatus.IDLE;
  }

  public get parseOptions(): iParseOptions {
    return {
      endTime: this.endTime ?? new Date(),
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
            this.socket.emit(
              ParseUnitEvents.error,
              getSocketError(event.payload),
            );
            break;
          }

          default:
          // noop
        }
      },
      error: (error) => {
        this.stop();

        this.socket.emit(ParseUnitEvents.error, getSocketError(error));
      },
      complete: () => {
        this.stop();
        this.socket.emit(ParseUnitEvents.complete, {});
      },
    };
  }
}
