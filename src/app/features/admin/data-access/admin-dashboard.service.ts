import { AuditLog } from './audit.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../../accounts/data-access/account.service';
import { Payment } from '../../payments/data-access/payment.service';
import { Transaction } from '../../transactions/data-access/transaction.service';
import { Notification } from './notification.service';
import { User } from '../../profile/data-access/user.service';
import { SagaInstance } from './saga.service';

export interface AdminDashboardData {
  users: User[];
  payments: Payment[];
  sagaInstances?: SagaInstance[];
  auditLogs?: AuditLog[];
  transactions: Transaction[];
  notifications: Notification[];
  accounts: Account[];
}

@Injectable({
  providedIn: 'root',
})
export class AdminDashboardService {
  constructor(private http: HttpClient) {}

  /**
   * Get all admin dashboard data using the API composition pattern
   * @returns Observable of AdminDashboardData containing all admin dashboard information
   */
  getAdminDashboard(): Observable<AdminDashboardData> {
    return this.http.get<AdminDashboardData>('/api/admin-dashboard');
  }
}
