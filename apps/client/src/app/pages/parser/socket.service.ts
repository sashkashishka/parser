import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Socket, io } from 'socket.io-client';
import { AuthService } from 'src/app/services/auth.service';

@Injectable()
export class SocketService {
  private io: Socket;

  constructor(private authService: AuthService, private router: Router) {}

  public connect() {
    const url = `ws://${window.location.host}`;

    this.io = io(url, {
      transports: ['websocket'],
      withCredentials: true,
    });

    this.io.connect();

    this.io.on('disconnect', this.handleDisconnect.bind(this));
  }

  public disconnect() {
    this.io.removeAllListeners();
    this.io.disconnect();
  }

  public get socket() {
    return this.io;
  }

  private handleDisconnect() {
    this.router.navigate(['/']);
    this.authService.clearUser();
  }
}
