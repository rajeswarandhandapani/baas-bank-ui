import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuditLog {
  id: string;
  username: string;
  timestamp: string;
  details?: string;
  correlationId?: string;
  serviceName?: string;
  eventType: string;
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
