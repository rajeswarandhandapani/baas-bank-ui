import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { AccountService, Account } from '../shared/services/account.service';
import { PaymentService, Payment } from '../shared/services/payment.service';
import { TransactionService, Transaction } from '../shared/services/transaction.service';
import { AuditService, AuditLog } from '../shared/services/audit.service';
import { NotificationService, Notification } from '../shared/services/notification.service';
import { UserService, User } from '../shared/services/user.service';
import { AdminDashboardService } from '../shared/services/admin-dashboard.service';
import { CurrencyFormatPipe } from '../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, CurrencyFormatPipe],
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {
  // Loading states
  loading = {
    dashboard: false,
    accounts: false,
    payments: false,
    transactions: false,
    audits: false,
    users: false,
    notifications: false
  };

  // Error states
  errors = {
    dashboard: false,
    accounts: false,
    payments: false,
    transactions: false,
    audits: false,
    users: false,
    notifications: false
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
    private accountService: AccountService,
    private paymentService: PaymentService,
    private transactionService: TransactionService,
    private auditService: AuditService,
    private notificationService: NotificationService,
    private userService: UserService,
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

  loadAdminData(): void {
    // Keep the original method for backward compatibility with individual loads
    this.loadAccounts();
    this.loadPayments();
    this.loadTransactions();
    this.loadAuditLogs();
    this.loadNotifications();
    this.loadUsers();
  }

  loadAccounts(): void {
    this.loading.accounts = true;
    this.errors.accounts = false;

    this.accountService.getAllAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.stats.totalAccounts = accounts.length;
        this.loading.accounts = false;
      },
      error: (err) => {
        console.error('Error loading accounts:', err);
        this.errors.accounts = true;
        this.loading.accounts = false;
      }
    });
  }

  loadPayments(): void {
    this.loading.payments = true;
    this.errors.payments = false;

    this.paymentService.getAllPayments().subscribe({
      next: (payments) => {
        this.payments = payments;
        this.stats.totalPayments = payments.length;
        this.loading.payments = false;
      },
      error: (err) => {
        console.error('Error loading payments:', err);
        this.errors.payments = true;
        this.loading.payments = false;
      }
    });
  }

  loadTransactions(): void {
    this.loading.transactions = true;
    this.errors.transactions = false;

    this.transactionService.getAllTransactions().subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        this.stats.totalTransactions = transactions.length;
        this.loading.transactions = false;
      },
      error: (err) => {
        console.error('Error loading transactions:', err);
        this.errors.transactions = true;
        this.loading.transactions = false;
      }
    });
  }

  loadAuditLogs(): void {
    this.loading.audits = true;
    this.errors.audits = false;

    this.auditService.getAuditLogs().subscribe({
      next: (logs) => {
        this.auditLogs = logs;
        this.groupAuditLogsByCorrelationId(logs);
        this.loading.audits = false;
      },
      error: (err) => {
        console.error('Error loading audit logs:', err);
        this.errors.audits = true;
        this.loading.audits = false;
      }
    });
  }

  loadNotifications(): void {
    this.loading.notifications = true;
    this.errors.notifications = false;

    this.notificationService.getAllNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.stats.totalNotifications = notifications.length;
        this.loading.notifications = false;
      },
      error: (err) => {
        console.error('Error loading notifications:', err);
        this.errors.notifications = true;
        this.loading.notifications = false;
      }
    });
  }

  loadUsers(): void {
    this.loading.users = true;
    this.errors.users = false;

    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.stats.totalUsers = users.length;
        this.loading.users = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.errors.users = true;
        this.loading.users = false;
      }
    });
  }

  retryLoad(section: string): void {
    switch (section) {
      case 'dashboard':
        this.loadAdminDashboard();
        break;
      case 'accounts':
        this.loadAccounts();
        break;
      case 'payments':
        this.loadPayments();
        break;
      case 'transactions':
        this.loadTransactions();
        break;
      case 'audits':
        this.loadAuditLogs();
        break;
      case 'notifications':
        this.loadNotifications();
        break;
      case 'users':
        this.loadUsers();
        break;
    }
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
