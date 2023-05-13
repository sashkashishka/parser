import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {} from '@angular/router';
import { API } from 'src/app/constants';
import { AuthService } from 'src/app/services/auth.service';
import { iParseUnit } from '../types';

@Injectable()
export class SidebarService {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
  ) {}

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
}
