import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

export function authGuard(): boolean {
  const isLoggedIn = inject(AuthService).isLoggedIn();
  const router: Router = inject(Router);

  if (!isLoggedIn) {
    router.navigate(['login']);
    return false;
  }

  return true;
}
