import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./user-management/user-management.component').then(m => m.UserManagementComponent)
  },
  {
    path: 'subscriptions',
    loadComponent: () => import('./subscription-management/subscription-management.component').then(m => m.AdminSubscriptionManagementComponent)
  },
  {
    path: 'themes',
    loadComponent: () => import('./theme-management/theme-management.component').then(m => m.AdminThemeManagementComponent)
  },
  {
    path: 'statistics',
    loadComponent: () => import('./statistics/statistics.component').then(m => m.StatisticsComponent)
  }
];