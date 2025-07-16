import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'verify-email',
    loadComponent: () => import('./verify-email/verify-email.component').then(m => m.VerifyEmailComponent)
  },
  {
    path: 'select-subscription',
    loadComponent: () => import('./select-subscription/select-subscription.component').then(m => m.SelectSubscriptionComponent)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];