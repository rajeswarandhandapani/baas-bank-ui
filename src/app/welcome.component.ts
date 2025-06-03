import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {KEYCLOAK_BASE_URL, KEYCLOAK_CLIENT_ID} from './app.constants';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent implements OnInit {
  keycloakBaseUrl = KEYCLOAK_BASE_URL;
  clientId = KEYCLOAK_CLIENT_ID;

  ngOnInit(): void {}

  login() {
    window.location.href = `${this.keycloakBaseUrl}/protocol/openid-connect/auth?client_id=${this.clientId}&response_type=code&scope=openid&redirect_uri=${encodeURIComponent(window.location.origin + '/auth/callback')}`;
  }

  register() {
    // Registration is not allowed; redirect to login instead
    this.login();
  }
}
