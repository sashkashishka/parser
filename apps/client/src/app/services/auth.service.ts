import { Injectable } from '@angular/core';
import { TOKEN_KEY } from '../constants';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string = '';

  constructor(private ls: LocalStorageService) {
    this.token = this.ls.getData(TOKEN_KEY) ?? '';
  }

  public setToken(t: string) {
    this.ls.saveData(TOKEN_KEY, t);
    this.token = t;
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
