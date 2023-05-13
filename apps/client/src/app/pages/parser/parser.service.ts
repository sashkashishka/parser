import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  Observable,
  Subject,
  catchError,
  combineLatest,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { SocketService } from './socket.service';
import { SOCKET_EVENTS } from './constants';
import { AuthService } from 'src/app/services/auth.service';
import { API } from 'src/app/constants';
import {
  iAdsEvent,
  iConfigEvent,
  iErrorEvent,
  iParseUnit,
  iParseUnitSelectable,
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

    this.ads$ = this.createSocketStream<iAdsEvent>(SOCKET_EVENTS.ADS);

    this.config$ = this.createSocketStream<iConfigEvent>(SOCKET_EVENTS.CONFIG);

    this.parseUnits$ = new Subject<void>();

    this.selectableParseUnits$ = this.createSelectableParseUnitsStream();

    this.socketService.socket.on(SOCKET_EVENTS.ERROR, this.handleError);
  }

  public disconnect() {
    this.socketService.disconnect();
  }

  // public toggleActiveParseUnit(v: iParseUnit) {
  //   const arr = this.config.parseUnits.filter((unit) => unit.id !== v.id);

  //   if (arr.length !== this.config.parseUnits.length) {
  //     this.config.parseUnits = arr;
  //   } else {
  //     this.config.parseUnits.push(v);
  //   }
  // }

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

  public addParseUnit({ name, frequency, siteUrl }: Partial<iParseUnit>) {
    return this.httpClient.post<iParseUnit>(
      API.CREATE_PARSE_UNIT,
      { name, frequency, siteUrl },
      {
        headers: this.authService.headers,
      },
    );
  }

  public updateParseUnit(parseUnit: Partial<iParseUnit>) {
    return this.httpClient.patch<iParseUnit>(
      API.UPDATE_PARSE_UNIT.replace(':id', String(parseUnit.id)),
      parseUnit,
      {
        headers: this.authService.headers,
      },
    );
  }

  public deleteParseUnit(id: number) {
    return this.httpClient.delete(
      API.DELETE_PARSE_UNIT.replace(':id', String(id)),
      { headers: this.authService.headers },
    );
  }

  // **********************
  // **********************
  // Streams
  // **********************
  // **********************
  public ads$: Observable<iAdsEvent>;

  public config$: Observable<iConfigEvent>;

  public parseUnits$: Subject<void>;

  public selectableParseUnits$: Observable<iParseUnitSelectable[]>;

  // **********************
  // **********************
  // Event data
  // **********************
  // **********************
  public error: iErrorEvent;

  // **********************
  // **********************
  // Emmiters
  // **********************
  // **********************
  public emitConfig(payload: unknown) {
    this.socketService.socket.emit(
      SOCKET_EVENTS.CONFIG,
      this.authService.createEvent({ payload }),
    );
  }

  public emitStart(payload: unknown) {
    this.socketService.socket.emit(
      SOCKET_EVENTS.START,
      this.authService.createEvent({}),
    );
  }

  // **********************
  // **********************
  // Handlers
  // **********************
  // **********************
  private handleError(event: iErrorEvent) {
    this.error = event;
  }

  // **********************
  // **********************
  // Stream creator
  // **********************
  // **********************
  private createSocketStream<T>(eventName: SOCKET_EVENTS) {
    console.log(this.socketService.socket);
    return new Observable<T>((observer) => {
      const handler = (data: T) => observer.next(data);

      this.socketService.socket.on(eventName, handler);

      return () => this.socketService.socket.off(eventName, handler);
    });
  }

  private createSelectableParseUnitsStream() {
    return combineLatest([
      this.config$,
      this.parseUnits$.pipe(
        switchMap(this.getParseUnits.bind(this)),
        catchError((err) => {
          this.snackbar.open(err.message, 'Got it', {
            duration: 4000,
          });

          return of([]);
        }),
      ),
    ]).pipe(
      switchMap(([config, parseUnit]) =>
        of(
          parseUnit.map((unit) => ({
            ...unit,
            selected: Boolean(config.parseUnits.find((u) => u.id === unit.id)),
          })),
        ),
      ),
    );
  }
}
