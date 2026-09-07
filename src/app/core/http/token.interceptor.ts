import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
export const tokenInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const api =
    request.url.startsWith('/api/') || request.url.startsWith('/chatbot/');
  const token = auth.token();
  return next(
    api && token
      ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : request,
  ).pipe(
    catchError((error) => {
      if (api && error.status === 401) {
        auth.clear();
        void router.navigate(['/']);
      }
      return throwError(() => error);
    }),
  );
};
