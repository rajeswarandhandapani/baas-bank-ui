import { Routes } from '@angular/router';
import { guestGuard, userGuard } from './core/auth/auth.guard';
import { adminGuard } from './core/auth/admin.guard';
export const routes: Routes = [
  {
    path: '',
    title: 'BaaS Bank · Banking, thoughtfully simple',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/welcome/welcome.component').then(
        (m) => m.WelcomeComponent,
      ),
  },
  {
    path: 'auth/callback',
    title: 'Signing in · BaaS Bank',
    loadComponent: () =>
      import('./core/auth/auth-callback.component').then(
        (m) => m.AuthCallbackComponent,
      ),
  },
  ...(['dashboard', 'accounts', 'payments', 'transactions'] as const).map(
    (path) => ({
      path,
      canActivate: [userGuard],
      title: `${path.charAt(0).toUpperCase() + path.slice(1)} · BaaS Bank`,
      loadComponent: {
        dashboard: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
        accounts: () =>
          import('./features/accounts/accounts.component').then(
            (m) => m.AccountsComponent,
          ),
        payments: () =>
          import('./features/payments/payments.component').then(
            (m) => m.PaymentsComponent,
          ),
        transactions: () =>
          import('./features/transactions/transactions.component').then(
            (m) => m.TransactionsComponent,
          ),
      }[path],
    }),
  ),
  {
    path: 'admin',
    title: 'Operations · BaaS Bank',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/admin.component').then((m) => m.AdminComponent),
  },
  { path: '**', redirectTo: '' },
];
