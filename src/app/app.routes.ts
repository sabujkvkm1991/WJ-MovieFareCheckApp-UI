import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth/auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/compare-price/compare-price.component').then(
        (c) => c.ComparePriceComponent
      ),
    canActivate: [authGuard],
  },
  { path: 'login', component: LoginComponent },
];
