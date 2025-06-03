import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent implements OnInit {

  // Keycloak base URL and realm (update as needed)
  private keycloakBaseUrl = 'http://localhost:8089/realms/baas';
  private clientId = 'banking-app';

  constructor() { }

  ngOnInit(): void {
    // Ensure Bootstrap icons are properly loaded
    // You might need to add Bootstrap icons to your project if not already installed
    // npm install bootstrap-icons
    // And import in your main styles.scss: @import 'bootstrap-icons/font/bootstrap-icons.css';
  }

  login() {
    window.location.href = `${this.keycloakBaseUrl}/protocol/openid-connect/auth?client_id=${this.clientId}&response_type=code&scope=openid&redirect_uri=${encodeURIComponent(window.location.origin)}`;
  }

  register() {
    window.location.href = `${this.keycloakBaseUrl}/protocol/openid-connect/registrations?client_id=${this.clientId}&response_type=code&scope=openid&redirect_uri=${encodeURIComponent(window.location.origin)}`;
  }
}
