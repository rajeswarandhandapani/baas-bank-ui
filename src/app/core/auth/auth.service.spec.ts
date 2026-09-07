import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
describe('Authentication state', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
  });
  it('rejects malformed and expired tokens', () => {
    const auth = TestBed.inject(AuthService);
    auth.token.set('invalid');
    expect(auth.isAuthenticated()).toBe(false);
    auth.token.set('x.' + btoa(JSON.stringify({ exp: 1 })) + '.x');
    expect(auth.isAuthenticated()).toBe(false);
  });
  it('derives role and name reactively and clears only banking credentials', () => {
    const auth = TestBed.inject(AuthService);
    localStorage.setItem('unrelated-preference', 'keep');
    auth.storeTokens({
      access_token:
        'x.' +
        btoa(
          JSON.stringify({
            exp: Date.now() / 1000 + 300,
            name: 'Alex',
            realm_access: { roles: ['BAAS_ADMIN'] },
          }),
        ) +
        '.x',
    });
    expect(auth.isAuthenticated()).toBe(true);
    expect(auth.isAdmin()).toBe(true);
    expect(auth.name()).toBe('Alex');
    auth.clear();
    expect(auth.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('unrelated-preference')).toBe('keep');
  });
});
