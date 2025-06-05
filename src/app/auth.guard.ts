import {inject, Injectable} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from './auth.service';
import {UserService} from './shared/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor(
    private router: Router, 
    private authService: AuthService,
    private userService: UserService
  ) {}

  canActivate(requireAuth: boolean = true, allowAdmin: boolean = true): boolean {
    const isAuthenticated = this.authService.isAuthenticated();

    if (requireAuth) {
      // For protected routes - require authentication
      if (isAuthenticated) {
        // Check if user is admin and route doesn't allow admin
        if (!allowAdmin && this.userService.isAdmin()) {
          // Admin trying to access regular user route, redirect to admin dashboard
          this.router.navigate(['/admin']);
          return false;
        }
        return true;
      }
      // User is not authenticated, redirect to welcome page
      this.router.navigate(['']);
      return false;
    } else {
      // For guest routes - redirect if already authenticated
      if (isAuthenticated) {
        // User is authenticated, redirect based on role
        if (this.userService.isAdmin()) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/dashboard']);
        }
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

// Guard for regular user routes (requires authentication, redirects admin to admin dashboard)
export const userGuard: CanActivateFn = () => {
  return inject(AuthGuardService).canActivate(true, false);
};

// Guard for guest routes (redirects authenticated users)
export const guestGuard: CanActivateFn = () => {
  return inject(AuthGuardService).canActivate(false);
};
