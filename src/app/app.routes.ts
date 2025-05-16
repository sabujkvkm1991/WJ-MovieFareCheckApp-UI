import { Router, Routes } from '@angular/router';
import { ComparePriceComponent } from './pages/compare-price/compare-price.component';
import { LoginComponent } from './pages/login/login.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth/auth.service';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'dashboard',
    component: ComparePriceComponent,
    canActivate: [
      () => {
        const isLoggedIn = inject(AuthService).isLoggedIn();
        const router: Router = inject(Router);

        if (!isLoggedIn) {
          router.navigate(['login']);
          return false;
        }

        return true;
      },
    ],
  },
  { path: 'login', component: LoginComponent },
];
