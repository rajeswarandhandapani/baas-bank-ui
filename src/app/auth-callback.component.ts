import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from './auth.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  template: `<div class="d-flex justify-content-center align-items-center min-vh-100">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <span class="ms-3">Signing you in...</span>
  </div>`
})
export class AuthCallbackComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    console.log('AuthCallbackComponent initialized');
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      this.auth.exchangeCodeForToken(code).subscribe({
        next: (res: any) => {
          this.auth.storeTokens(res);
          // TODO: Fetch user profile and redirect based on role
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.router.navigate(['/']);
        }
      });
    } else {
      this.router.navigate(['/']);
    }
  }
}

