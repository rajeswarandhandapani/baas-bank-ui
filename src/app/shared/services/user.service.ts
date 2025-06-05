import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id?: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
  enabled?: boolean;
  createdAt?: string;
}

export interface UserProfile {
  sub: string;
  username: string;
  email: string;
  given_name?: string;
  family_name?: string;
  roles?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  /**
   * Get current user profile
   */
  getMyProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>('/api/users/me');
  }

  /**
   * Get all users (BAAS_ADMIN only)
   */
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }

  /**
   * Check if current user has admin role
   * This method parses the JWT token to check roles
   */
  isAdmin(): boolean {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return false;
    }

    try {
      // Parse JWT token payload
      const payload = JSON.parse(atob(token.split('.')[1]));
      const roles = payload.realm_access?.roles || payload.roles || [];
      return roles.includes('BAAS_ADMIN');
    } catch (error) {
      console.error('Error parsing token:', error);
      return false;
    }
  }
}
