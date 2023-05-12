import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { iFormValues } from '../types';
import { API } from 'src/app/constants';

@Injectable()
export class FormService {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
  ) {}

  public submit(values: iFormValues) {
    return this.httpClient.post(API.LOGIN, values, {
      headers: this.authService.headers,
    });
  }
}
