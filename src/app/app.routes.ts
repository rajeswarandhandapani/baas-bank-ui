import {Routes} from '@angular/router';
import {WelcomeComponent} from './welcome.component';
import {AuthCallbackComponent} from './auth-callback.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {authGuard} from './auth.guard';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'auth/callback', component: AuthCallbackComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]  // Protected by auth guard
  },
  // Wildcard route for handling undefined routes
  { path: '**', redirectTo: '' }
];
