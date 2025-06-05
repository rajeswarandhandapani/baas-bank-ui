import {Routes} from '@angular/router';
import {WelcomeComponent} from './welcome.component';
import {AuthCallbackComponent} from './auth-callback.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AccountsComponent} from './accounts/accounts.component';
import {PaymentsComponent} from './payments/payments.component';
import {TransactionsComponent} from './transactions/transactions.component';
import {AdminComponent} from './admin/admin.component';
import {authGuard, guestGuard, userGuard} from './auth.guard';
import {adminGuard} from './admin.guard';

export const routes: Routes = [
  { path: '', component: WelcomeComponent, canActivate: [guestGuard] },
  { path: 'auth/callback', component: AuthCallbackComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [userGuard]
  },
  {
    path: 'accounts',
    component: AccountsComponent,
    canActivate: [userGuard]
  },
  {
    path: 'payments',
    component: PaymentsComponent,
    canActivate: [userGuard]
  },  {
    path: 'transactions',
    component: TransactionsComponent,
    canActivate: [userGuard]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [adminGuard]
  },
  // Wildcard route for handling undefined routes
  { path: '**', redirectTo: '' }
];
