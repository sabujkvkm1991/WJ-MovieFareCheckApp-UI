import {
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const token: string | null = inject(AuthService).getToken();
  const router: Router = inject(Router);
  const snackBar = inject(MatSnackBar);

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(cloned).pipe(
      tap({
        error: (error) => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            snackBar.open('Session expired. Redirecting to login page.');
            router.navigate(['login']);
          }
        },
      })
    );
  }

  return next(req);
}
