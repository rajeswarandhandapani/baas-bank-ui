import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuditLog {
  id?: string;
  timestamp: string;
  userId: string;
  action: string;
  resource: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuditService {

  constructor(private http: HttpClient) { }

  /**
   * Get audit logs (BAAS_ADMIN only)
   */
  getAuditLogs(): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>('/api/audit-logs');
  }
}
