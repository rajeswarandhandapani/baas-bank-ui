import {Routes} from '@angular/router';
import {WelcomeComponent} from './welcome.component';
import {AuthCallbackComponent} from './auth-callback.component';
import {DashboardComponent} from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'auth/callback', component: AuthCallbackComponent },
  { path: 'dashboard', component: DashboardComponent },
  // Wildcard route for handling undefined routes
  { path: '**', redirectTo: '' }
];
