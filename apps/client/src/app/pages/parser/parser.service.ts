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
} from 'rxjs';
import { SocketService } from './socket.service';
import { PARSE_STATUS, SOCKET_EVENTS } from './constants';
import { AuthService } from 'src/app/services/auth.service';
import { API } from 'src/app/constants';
import {
  iAdsEvent,
  iCommonEvent,
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

    this.status$ = new Subject<tStatusEvent>();
    this.ads$ = this.createSocketStream<iAdsEvent>(SOCKET_EVENTS.ADS);
    this.config$ = this.createSocketStream<iConfigEvent>(SOCKET_EVENTS.CONFIG);
    this.refetchParseUnit$ = new Subject<void>();
    this.parseUnits$ = this.createParseUnitsStream();

    this.socketService.socket.on(
      SOCKET_EVENTS.STOP,
      this.handleStop.bind(this),
    );
    this.socketService.socket.on(
      SOCKET_EVENTS.COMPLETE,
      this.handleComplete.bind(this),
    );
    this.socketService.socket.on(
      SOCKET_EVENTS.ERROR,
      this.handleError.bind(this),
    );

    this.emitStatus();
    this.emitConfig({});
    this.refetchParseUnit$.next();
  }

  public disconnect() {
    this.socketService.disconnect();
  }

  // **********************
  // **********************
  // CRUD
  // **********************
  // **********************
  public getParseUnits() {
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
  public status$: Subject<tStatusEvent>;

  public ads$: Observable<iAdsEvent>;

  public config$: Observable<iConfigEvent>;

  public parseUnits$: Observable<iParseUnit[]>;

  private refetchParseUnit$: Subject<void>;

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

  // **********************
  // **********************
  // Handlers
  // **********************
  // **********************
  private handleError(event: iErrorEvent) {
    let message = '';

    try {
      message = event.code || event.message || JSON.stringify(event);
    } catch (e) {}

    this.snackbar.open(message);
  }

  private handleStop() {
    this.snackbar.open('Parsing stopped', 'Got it', { duration: 5000 });
  }

  private handleComplete() {
    this.snackbar.open('Parsing completed', 'Got it', { duration: 5000 });
  }

  // **********************
  // **********************
  // Stream creator
  // **********************
  // **********************
  private createSocketStream<T extends iCommonEvent>(eventName: SOCKET_EVENTS) {
    return new Observable<T>((observer) => {
      const handler = (data: T) => {
        observer.next(data);

        if (data.status) {
          this.status$.next(data.status);
        }
      };

      this.socketService.socket.on(eventName, handler);

      return () => this.socketService.socket.off(eventName, handler);
    });
  }

  private createParseUnitsStream() {
    return this.refetchParseUnit$.pipe(
      switchMap(this.getParseUnits.bind(this)),
      catchError((err) => {
        this.snackbar.open(err.message, 'Got it', {
          duration: 4000,
        });

        return of([]);
      }),
    );
  }
}
