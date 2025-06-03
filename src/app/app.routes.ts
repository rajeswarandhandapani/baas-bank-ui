import {Routes} from '@angular/router';
import {WelcomeComponent} from './welcome.component';
import {AuthCallbackComponent} from './auth-callback.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AccountsComponent} from './accounts/accounts.component';
import {PaymentsComponent} from './payments/payments.component';
import {TransactionsComponent} from './transactions/transactions.component';
import {authGuard} from './auth.guard';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'auth/callback', component: AuthCallbackComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'accounts',
    component: AccountsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'payments',
    component: PaymentsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'transactions',
    component: TransactionsComponent,
    canActivate: [authGuard]
  },
  // Wildcard route for handling undefined routes
  { path: '**', redirectTo: '' }
];
