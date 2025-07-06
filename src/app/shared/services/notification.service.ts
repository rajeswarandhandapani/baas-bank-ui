import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Notification {
  id: number;
  userName: string;
  subject: string;
  message: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly API_BASE = '/api/notifications';

  constructor(private http: HttpClient) {}

  /**
   * Get all notifications (BAAS_ADMIN only)
   */
  getAllNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.API_BASE);
  }
}
