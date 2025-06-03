import {Routes} from '@angular/router';
import {WelcomeComponent} from './welcome.component';
import {AuthCallbackComponent} from './auth-callback.component';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'auth/callback', component: AuthCallbackComponent },
];
