import {inject, Injectable} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor(private router: Router) {}

  canActivate(): boolean {
    // Check if there's an access token in localStorage
    const token = localStorage.getItem('access_token');

    if (token) {
      // User is authenticated
      return true;
    }

    // User is not authenticated, redirect to welcome page
    this.router.navigate(['']);
    return false;
  }
}

// Guard factory function for use with Angular routes
export const authGuard: CanActivateFn = () => {
  return inject(AuthGuardService).canActivate();
};
