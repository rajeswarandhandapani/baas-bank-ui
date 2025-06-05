import {inject, Injectable} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(requireAuth: boolean = true): boolean {
    const isAuthenticated = this.authService.isAuthenticated();

    if (requireAuth) {
      // For protected routes - require authentication
      if (isAuthenticated) {
        return true;
      }
      // User is not authenticated, redirect to welcome page
      this.router.navigate(['']);
      return false;
    } else {
      // For guest routes - redirect if already authenticated
      if (isAuthenticated) {
        // User is authenticated, redirect to dashboard
        this.router.navigate(['/dashboard']);
        return false;
      }
      // User is not authenticated, allow access to guest pages
      return true;
    }
  }
}

// Guard for protected routes (requires authentication)
export const authGuard: CanActivateFn = () => {
  return inject(AuthGuardService).canActivate(true);
};

// Guard for guest routes (redirects authenticated users)
export const guestGuard: CanActivateFn = () => {
  return inject(AuthGuardService).canActivate(false);
};
