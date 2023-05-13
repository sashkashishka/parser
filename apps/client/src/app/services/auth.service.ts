import { Injectable } from '@angular/core';
import { TOKEN_KEY } from '../constants';
import { LocalStorageService } from './local-storage.service';
import { iUser } from '../types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string = '';

  private user = {} as iUser;

  constructor(private ls: LocalStorageService) {
    this.token = this.ls.getData(TOKEN_KEY) ?? '';
  }

  public setUser(user: iUser) {
    this.ls.saveData(TOKEN_KEY, user.access_token);
    document.cookie = `token=${user.access_token}; samesite=strict`;
    this.token = user.access_token;
    this.user = user;
  }

  public clearUser() {
    this.ls.removeData(TOKEN_KEY);
    document.cookie = `token=${this.token}; max-age=-1`;
    this.token = '';
    this.user = {} as iUser;
  }

  public getUser() {
    return this.user;
  }

  public get headers() {
    return {
      Authorization: `Token ${this.token}`,
    };
  }

  public createEvent(event: Record<string, any>) {
    return {
      ...event,
      token: this.token,
    };
  }
}
