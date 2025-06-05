import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from './shared/services/user.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardService {
  constructor(
    private router: Router, 
    private authService: AuthService,
    private userService: UserService
  ) {}

  canActivate(): boolean {
    // First check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['']);
      return false;
    }

    // Then check if user has admin role
    if (this.userService.isAdmin()) {
      return true;
    }

    // User is authenticated but not admin, redirect to dashboard
    this.router.navigate(['/dashboard']);
    return false;
  }
}

// Guard for admin routes (requires BAAS_ADMIN role)
export const adminGuard: CanActivateFn = () => {
  return inject(AdminGuardService).canActivate();
};
