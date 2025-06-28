import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { Account } from '../shared/services/account.service';
import { Payment } from '../shared/services/payment.service';
import { Transaction } from '../shared/services/transaction.service';
import { AuditLog } from '../shared/services/audit.service';
import { Notification } from '../shared/services/notification.service';
import { User } from '../shared/services/user.service';
import { AdminDashboardService } from '../shared/services/admin-dashboard.service';
import { CurrencyFormatPipe } from '../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, CurrencyFormatPipe],
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {
  // Loading state
  loading = {
    dashboard: false
  };

  // Error state
  errors = {
    dashboard: false
  };

  // Data
  accounts: Account[] = [];
  payments: Payment[] = [];
  transactions: Transaction[] = [];
  auditLogs: AuditLog[] = [];
  groupedAuditLogs: { [correlationId: string]: AuditLog[] } = {};
  notifications: Notification[] = [];
  users: User[] = [];

  // Summary stats
  stats = {
    totalAccounts: 0,
    totalUsers: 0,
    totalPayments: 0,
    totalTransactions: 0,
    totalNotifications: 0
  };

  constructor(
    private adminDashboardService: AdminDashboardService
  ) {}

  ngOnInit(): void {
    this.loadAdminDashboard();
  }

  loadAdminDashboard(): void {
    this.loading.dashboard = true;
    this.errors.dashboard = false;

    this.adminDashboardService.getAdminDashboard().subscribe({
      next: (data) => {
        // Populate all data from the composition API
        this.accounts = data.accounts || [];
        this.payments = data.payments || [];
        this.transactions = data.transactions || [];
        this.auditLogs = data.auditLogs || [];
        this.notifications = data.notifications || [];
        this.users = data.users || [];

        // Update statistics
        this.stats.totalAccounts = this.accounts.length;
        this.stats.totalPayments = this.payments.length;
        this.stats.totalTransactions = this.transactions.length;
        this.stats.totalNotifications = this.notifications.length;
        this.stats.totalUsers = this.users.length;

        // Group audit logs by correlation ID
        this.groupAuditLogsByCorrelationId(this.auditLogs);

        this.loading.dashboard = false;
      },
      error: (err) => {
        console.error('Error loading admin dashboard:', err);
        this.errors.dashboard = true;
        this.loading.dashboard = false;
      }
    });
  }



  retryLoad(section: string): void {
    // Only support dashboard-level refresh - no individual section loading
    this.loadAdminDashboard();
  }

  groupAuditLogsByCorrelationId(logs: AuditLog[]): void {
    this.groupedAuditLogs = {};
    
    logs.forEach(log => {
      const correlationId = log.correlationId || 'no-correlation-id';
      
      if (!this.groupedAuditLogs[correlationId]) {
        this.groupedAuditLogs[correlationId] = [];
      }
      
      this.groupedAuditLogs[correlationId].push(log);
    });

    // Sort each group by timestamp (newest first)
    Object.keys(this.groupedAuditLogs).forEach(correlationId => {
      this.groupedAuditLogs[correlationId].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    });
  }

  getGroupedAuditLogsEntries(): [string, AuditLog[]][] {
    return Object.entries(this.groupedAuditLogs).sort((a, b) => {
      // Sort by the timestamp of the first (newest) log in each group
      const timestampA = a[1][0]?.timestamp || '';
      const timestampB = b[1][0]?.timestamp || '';
      return new Date(timestampB).getTime() - new Date(timestampA).getTime();
    });
  }

  getAccountStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'badge bg-success';
      case 'PENDING':
        return 'badge bg-warning';
      case 'FROZEN':
      case 'SUSPENDED':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  getPaymentStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'SUCCESS':
      case 'COMPLETED':
        return 'badge bg-success';
      case 'PENDING':
        return 'badge bg-warning';
      case 'FAILED':
      case 'REJECTED':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }
  getTransactionTypeClass(type: string): string {
    switch (type?.toUpperCase()) {
      case 'CREDIT':
      case 'DEPOSIT':
        return 'text-success';
      case 'DEBIT':
      case 'WITHDRAWAL':
        return 'text-danger';
      default:
        return 'text-muted';
    }
  }

  getNotificationStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'NEW':
        return 'badge bg-primary';
      case 'SENT':
      case 'DELIVERED':
        return 'badge bg-success';
      case 'PENDING':
        return 'badge bg-warning';
      case 'FAILED':
      case 'ERROR':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  getNotificationTypeClass(type: string): string {
    switch (type?.toUpperCase()) {
      case 'ACCOUNT_OPENED':
      case 'ACCOUNT_CREATED':
      case 'ACCOUNT_ACTIVATED':
        return 'badge bg-success';
      case 'PAYMENT_PROCESSED':
      case 'PAYMENT_SUCCESS':
      case 'TRANSFER_SUCCESS':
        return 'badge bg-success';
      case 'PAYMENT_FAILED':
      case 'TRANSFER_FAILED':
        return 'badge bg-danger';
      case 'SECURITY_ALERT':
      case 'FRAUD_ALERT':
        return 'badge bg-warning';
      default:
        return 'badge bg-info';
    }
  }
}
