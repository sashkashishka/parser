import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { iAuthFormValues } from '../types';
import { API } from 'src/app/constants';
import { iUser } from 'src/app/types';

@Injectable()
export class FormService {
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private snackback: MatSnackBar,
    private router: Router
  ) {}

  public submitting = false;

  public submit(values: iAuthFormValues) {
    if (this.submitting) return;

    this.submitting = true;

    return this.httpClient.post<iUser>(API.LOGIN, values).subscribe({
      next: (data) => {
        this.authService.setUser(data);
        this.submitting = false;

        this.router.navigate(['/parser']);
      },
      error: (error) => {
        let message = error.message;

        if (error instanceof HttpErrorResponse) {
          message = error?.error?.message || error?.message;
        }

        this.snackback.open(message, 'Got it', {
          duration: 3000,
        });
        this.submitting = false;
      },
    });
  }
}
