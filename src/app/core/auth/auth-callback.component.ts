import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { ONBOARDING_ENDPOINT } from '../config/app.constants';
import { AuthService } from './auth.service';
@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<main class="auth-state">
    <div class="brand-mark">b.</div>
    <h1>
      {{ error() ? 'Sign-in needs another try' : 'Getting things ready' }}
    </h1>
    <p role="status">
      {{ error() || 'Securely connecting to your banking workspace…' }}
    </p>
    @if (error()) {
      <a class="button" routerLink="/">Back to sign in</a>
    }
  </main>`,
})
export class AuthCallbackComponent {
  readonly error = signal('');
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  constructor() {
    const params = new URLSearchParams(location.search);
    const state = sessionStorage.getItem('oauth_state');
    const code = params.get('code');
    if (!code || !state || state !== params.get('state')) {
      this.error.set('The sign-in request expired. Please start again.');
      return;
    }
    this.auth.exchangeCodeForToken(code).subscribe({
      next: (response) => {
        this.auth.storeTokens(response);
        if (
          sessionStorage.getItem('onboard') === 'true' &&
          !this.auth.isAdmin()
        ) {
          sessionStorage.removeItem('onboard');
          this.http
            .post(
              ONBOARDING_ENDPOINT,
              {},
              { responseType: 'text' },
            )
            .subscribe({
              next: () => this.home(),
              error: () =>
                this.error.set(
                  'You are signed in, but account setup could not start. Please try again later.',
                ),
            });
        } else {
          this.home();
        }
      },
      error: () =>
        this.error.set('We could not complete sign-in. Please try again.'),
    });
  }
  private home(): void {
    void this.router.navigate([this.auth.isAdmin() ? '/admin' : '/dashboard']);
  }
}
