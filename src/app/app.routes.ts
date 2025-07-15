import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'pricing',
    loadComponent: () => import('./features/pricing/pricing.component').then(m => m.PricingComponent)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'portfolio-builder',
    loadChildren: () => import('./features/portfolio-builder/portfolio-builder.routes').then(m => m.portfolioBuilderRoutes),
    canActivate: [AuthGuard]
  },
  {
    path: 'subscription',
    loadComponent: () => import('./features/subscription-management/subscription-management.component').then(m => m.SubscriptionManagementComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'themes',
    loadComponent: () => import('./features/theme-management/theme-management.component').then(m => m.ThemeManagementComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes),
    canActivate: [AdminGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];