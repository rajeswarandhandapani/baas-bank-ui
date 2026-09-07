import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return (
    (auth.isAuthenticated() && auth.isAdmin()) ||
    inject(Router).createUrlTree([auth.isAuthenticated() ? '/dashboard' : '/'])
  );
};
