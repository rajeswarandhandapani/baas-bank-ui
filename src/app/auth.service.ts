import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';
import {KEYCLOAK_BASE_URL, KEYCLOAK_CLIENT_ID, KEYCLOAK_TOKEN_ENDPOINT} from './app.constants';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private keycloakBaseUrl = KEYCLOAK_BASE_URL;
  private clientId = KEYCLOAK_CLIENT_ID;
  private tokenEndpoint = KEYCLOAK_TOKEN_ENDPOINT;

  constructor(private http: HttpClient, private router: Router) {}

  exchangeCodeForToken(code: string) {
    const body = new HttpParams()
      .set('grant_type', 'authorization_code')
      .set('code', code)
      .set('client_id', this.clientId)
      .set('redirect_uri', window.location.origin + '/auth/callback');
    return this.http.post(this.tokenEndpoint, body);
  }
  storeTokens(tokenResponse: any) {
    localStorage.setItem('access_token', tokenResponse.access_token);
    localStorage.setItem('refresh_token', tokenResponse.refresh_token);
    // Optionally store id_token, expires_in, etc.
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}

