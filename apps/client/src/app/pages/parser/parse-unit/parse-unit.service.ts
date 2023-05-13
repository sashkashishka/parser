import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SocketService } from './socket.service';
import { SOCKET_EVENTS } from '../constants';
import { AuthService } from 'src/app/services/auth.service';
import { iAdsEvent, iErrorEvent, iInitEvent } from './types';

@Injectable()
export class ParseUnitService {
  constructor(
    private socketService: SocketService,
    private authService: AuthService,
  ) {}

  public connect() {
    this.socketService.connect();
    this.socketService.socket.on(SOCKET_EVENTS.INIT, this.handleInit);
    this.socketService.socket.on(SOCKET_EVENTS.ERROR, this.handleError);
  }

  public disconnect() {
    this.socketService.disconnect();
  }

  // Streams
  public ads$: Observable<iAdsEvent>;

  // Event data
  public init: iInitEvent;

  public error: iErrorEvent;


  // Emmiters
  public emitInit() {
    this.socketService.socket.emit(SOCKET_EVENTS.INIT, this.authService.createEvent({}));
  }

  public emitStart(payload: unknown) {
    this.socketService.socket.emit(SOCKET_EVENTS.INIT, this.authService.createEvent({ payload }));
  }


  // Handlers
  private handleInit(event: iInitEvent) {
    this.init = event;
  }

  private handleError(event: iErrorEvent) {
    this.error = event;
  }

  private handleAds(event: iAdsEvent) {

  }
}
