import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  EMPTY,
  Observable,
  Subject,
  catchError,
  of,
  switchMap,
  tap,
  share,
} from 'rxjs';
import { SocketService } from './socket.service';
import { PARSE_STATUS, SOCKET_EVENTS } from './constants';
import { AuthService } from 'src/app/services/auth.service';
import { API } from 'src/app/constants';
import {
  iAdsEvent,
  iCompleteEvent,
  iConfigEvent,
  iErrorEvent,
  iParseUnit,
  tStatusEvent,
} from './types';

@Injectable({
  providedIn: 'root',
})
export class ParserService {
  constructor(
    private socketService: SocketService,
    private authService: AuthService,
    private httpClient: HttpClient,
    private snackbar: MatSnackBar,
  ) {}

  public connect() {
    this.socketService.connect();

    this.status$ = this.createSocketStream<tStatusEvent>(SOCKET_EVENTS.STATUS);
    this.ads$ = this.createSocketStream<iAdsEvent>(SOCKET_EVENTS.ADS);
    this.start$ = this.createSocketStream<void>(SOCKET_EVENTS.START);
    this.config$ = this.createSocketStream<iConfigEvent>(SOCKET_EVENTS.CONFIG);
    this.complete$ = this.createSocketStream<iCompleteEvent>(
      SOCKET_EVENTS.COMPLETE,
    );
    this.stop$ = this.createSocketStream<void>(SOCKET_EVENTS.STOP);
    this.error$ = this.createSocketStream<iErrorEvent>(SOCKET_EVENTS.ERROR);

    this.refetchParseUnit$ = new Subject<void>();
    this.parseUnits$ = this.createParseUnitsStream();

    this.createPingStatusEffect();
  }

  public disconnect() {
    this.socketService.disconnect();
  }

  // **********************
  // **********************
  // CRUD
  // **********************
  // **********************
  private getParseUnits() {
    return this.httpClient.get<iParseUnit[]>(API.GET_PARSE_UNIT_ALL, {
      headers: this.authService.headers,
    });
  }

  public addParseUnit({
    name,
    frequency,
    siteUrl,
    selected,
  }: Partial<iParseUnit>) {
    return this.httpClient
      .post<iParseUnit>(
        API.CREATE_PARSE_UNIT,
        { name, frequency, siteUrl, selected },
        {
          headers: this.authService.headers,
        },
      )
      .pipe(
        tap(() => this.refetchParseUnit$.next()),
        catchError((err) => {
          this.snackbar.open(err.message, 'Got it', { duration: 3000 });

          return EMPTY;
        }),
      );
  }

  public updateParseUnit(parseUnit: Partial<iParseUnit>) {
    return this.httpClient
      .patch<iParseUnit>(
        API.UPDATE_PARSE_UNIT.replace(':id', String(parseUnit.id)),
        parseUnit,
        {
          headers: this.authService.headers,
        },
      )
      .pipe(
        tap(() => this.refetchParseUnit$.next()),
        catchError((err) => {
          this.snackbar.open(err.message, 'Got it', { duration: 3000 });

          return EMPTY;
        }),
      );
  }

  public deleteParseUnit(id: number) {
    return this.httpClient
      .delete(API.DELETE_PARSE_UNIT.replace(':id', String(id)), {
        headers: this.authService.headers,
      })
      .pipe(
        tap(() => this.refetchParseUnit$.next()),
        catchError((err) => {
          this.snackbar.open(err.message, 'Got it', { duration: 3000 });

          return EMPTY;
        }),
      );
  }

  // **********************
  // **********************
  // Streams
  // **********************
  // **********************
  public status$: Observable<tStatusEvent>;

  public ads$: Observable<iAdsEvent>;

  public config$: Observable<iConfigEvent>;

  public start$: Observable<any>;

  public stop$: Observable<any>;

  public complete$: Observable<iCompleteEvent>;

  public error$: Observable<iErrorEvent>;

  public parseUnits$: Observable<iParseUnit[]>;

  private refetchParseUnit$: Subject<void>;

  public pingStatusEffect$: Observable<any>;

  // **********************
  // **********************
  // Emmiters
  // **********************
  // **********************
  public emitStatus() {
    this.socketService.socket.emit(
      SOCKET_EVENTS.STATUS,
      this.authService.createEvent({}),
    );
  }

  public emitConfig(payload: Partial<iConfigEvent>) {
    this.socketService.socket.emit(
      SOCKET_EVENTS.CONFIG,
      this.authService.createEvent({ payload }),
    );
  }

  public emitStart() {
    this.socketService.socket.emit(
      SOCKET_EVENTS.START,
      this.authService.createEvent({}),
    );
  }

  public emitStop() {
    this.socketService.socket.emit(
      SOCKET_EVENTS.STOP,
      this.authService.createEvent({}),
    );
  }

  public emitResubscribe() {
    this.socketService.socket.emit(
      SOCKET_EVENTS.RESUBSCRIBE,
      this.authService.createEvent({}),
    );
  }

  public refetchParseUnit() {
    this.refetchParseUnit$.next();
  }

  // **********************
  // **********************
  // Stream creator
  // **********************
  // **********************
  private createSocketStream<T>(eventName: SOCKET_EVENTS) {
    return new Observable<T>((observer) => {
      const handler = (data: T) => {
        switch (eventName) {
          case SOCKET_EVENTS.STATUS: {
            if (data === PARSE_STATUS.PARSING) {
              this.emitResubscribe();
            }
            break;
          }

          case SOCKET_EVENTS.STOP: {
            this.snackbar.open('Parsing stopped', 'Got it', { duration: 5000 });
            break;
          }

          case SOCKET_EVENTS.COMPLETE: {
            this.snackbar.open('Parsing completed', 'Got it', {
              duration: 5000,
            });
            break;
          }

          case SOCKET_EVENTS.ERROR: {
            let message = '';

            try {
              // @ts-ignore
              message = data?.code || data?.message || JSON.stringify(data);
            } catch (e) {}

            this.snackbar.open(message);
            break;
          }

          default:
          // noop
        }

        observer.next(data);
      };

      this.socketService.socket.on(eventName, handler);

      return () => this.socketService.socket.off(eventName, handler);
    }).pipe(share());
  }

  private createParseUnitsStream() {
    return this.refetchParseUnit$.pipe(
      switchMap(() => this.getParseUnits()),
      catchError((err) => {
        this.snackbar.open(err.message, 'Got it', {
          duration: 4000,
        });

        return of([]);
      }),
    );
  }

  // **********************
  // **********************
  // Effects
  // **********************
  // **********************
  private createPingStatusEffect() {
    return [
      this.start$,
      this.stop$,
      this.config$,
      this.complete$,
      this.error$,
    ].map((o) => o.subscribe(() => this.emitStatus()));
  }
}
