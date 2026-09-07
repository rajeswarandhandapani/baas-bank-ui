import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  KEYCLOAK_BASE_URL,
  KEYCLOAK_CLIENT_ID,
  KEYCLOAK_TOKEN_ENDPOINT,
  KEYCLOAK_LOGOUT_ENDPOINT,
} from '../config/app.constants';

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
}
interface Claims {
  exp?: number;
  preferred_username?: string;
  name?: string;
  realm_access?: { roles: string[] };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  readonly token = signal(localStorage.getItem('access_token'));
  readonly claims = computed<Claims>(() => {
    try {
      const part = this.token()?.split('.')[1] ?? '';
      return JSON.parse(
        atob(part.replace(/-/g, '+').replace(/_/g, '/')),
      ) as Claims;
    } catch {
      return {};
    }
  });
  readonly isAdmin = computed(
    () => this.claims().realm_access?.roles.includes('BAAS_ADMIN') ?? false,
  );
  readonly name = computed(
    () => this.claims().name || this.claims().preferred_username || 'there',
  );
  isAuthenticated(): boolean {
    return !!this.token() && (this.claims().exp ?? 0) > Date.now() / 1000;
  }

  async login(onboard = false): Promise<void> {
    const verifier = this.random();
    const state = this.random();
    sessionStorage.setItem('pkce_verifier', verifier);
    sessionStorage.setItem('oauth_state', state);
    sessionStorage.setItem('onboard', String(onboard));
    const digest = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(verifier),
    );
    const challenge = this.base64(new Uint8Array(digest));
    const query = new URLSearchParams({
      client_id: KEYCLOAK_CLIENT_ID,
      response_type: 'code',
      scope: 'openid profile email',
      redirect_uri: location.origin + '/auth/callback',
      state,
      code_challenge: challenge,
      code_challenge_method: 'S256',
    });
    location.assign(
      `${KEYCLOAK_BASE_URL}/protocol/openid-connect/auth?${query}`,
    );
  }
  exchangeCodeForToken(code: string) {
    const body = new HttpParams()
      .set('grant_type', 'authorization_code')
      .set('code', code)
      .set('client_id', KEYCLOAK_CLIENT_ID)
      .set('redirect_uri', location.origin + '/auth/callback')
      .set('code_verifier', sessionStorage.getItem('pkce_verifier') ?? '');
    return this.http.post<TokenResponse>(KEYCLOAK_TOKEN_ENDPOINT, body);
  }
  storeTokens(response: TokenResponse): void {
    localStorage.setItem('access_token', response.access_token);
    if (response.id_token)
      sessionStorage.setItem('id_token', response.id_token);
    this.token.set(response.access_token);
    sessionStorage.removeItem('pkce_verifier');
    sessionStorage.removeItem('oauth_state');
  }
  clear(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.token.set(null);
  }
  logout(): void {
    const id = sessionStorage.getItem('id_token');
    this.clear();
    sessionStorage.removeItem('id_token');
    const query = new URLSearchParams({
      client_id: KEYCLOAK_CLIENT_ID,
      post_logout_redirect_uri: location.origin,
    });
    if (id) query.set('id_token_hint', id);
    location.assign(`${KEYCLOAK_LOGOUT_ENDPOINT}?${query}`);
  }
  private random(): string {
    return this.base64(crypto.getRandomValues(new Uint8Array(32)));
  }
  private base64(bytes: Uint8Array): string {
    return btoa(String.fromCharCode(...bytes))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}
