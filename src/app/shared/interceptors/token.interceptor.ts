import {HttpErrorResponse, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {catchError, throwError} from 'rxjs';

// Functional interceptor for Angular 17
export const tokenInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const token = localStorage.getItem('access_token');
  const router = inject(Router);

  if (token) {
    // Clone the request and add the token
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    // Pass the cloned request instead of the original
    return next(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized errors
        if (error.status === 401) {
          localStorage.clear(); // Clear tokens
          router.navigate(['/']);
        }
        return throwError(() => error);
      })
    );
  }

  return next(req);
};
