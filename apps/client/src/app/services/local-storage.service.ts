import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  public saveData(key: string, value: any, stringify = true) {
    try {
      const v = stringify
        ? JSON.stringify(value)
        : value;

      localStorage.setItem(key, v);
    } catch (e) {}
  }

  public getData(key: string, parse = true) {
    try {
      const data = localStorage.getItem(key);

      if (parse) return JSON.parse(data!);

      return data;
    } catch (e) {
      return null;
    }
  }
  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear();
  }
}
