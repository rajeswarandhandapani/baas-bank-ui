import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from './auth.service';
import {HttpClient} from '@angular/common/http';
import {UserService} from './shared/services/user.service';

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
  constructor(
    private auth: AuthService, 
    private router: Router, 
    private http: HttpClient,
    private userService: UserService
  ) {}
  private redirectToAppropriateHome() {
    if (this.userService.isAdmin()) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit(): void {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const isRegistration = localStorage.getItem('registration_flow') === 'true';
    
    if (code) {
      this.auth.exchangeCodeForToken(code).subscribe({
        next: (res: any) => {
          this.auth.storeTokens(res);
          if (isRegistration) {
            // Registration flow: call POST /api/saga/start/user-onboarding
            this.http.post('/api/saga/start/user-onboarding', {}).subscribe({
              next: () => {
                localStorage.removeItem('registration_flow');
                this.redirectToAppropriateHome();
              },
              error: () => {
                localStorage.removeItem('registration_flow');
                this.router.navigate(['/']);
              }
            });
          } else {
            // Login flow: go to appropriate home page
            this.redirectToAppropriateHome();
          }
        },
        error: () => {
          localStorage.removeItem('registration_flow');
          this.router.navigate(['/']);
        }
      });
    } else {
      localStorage.removeItem('registration_flow');
      this.router.navigate(['/']);
    }
  }
}

