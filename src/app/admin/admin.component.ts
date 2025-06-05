import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { AccountService, Account } from '../shared/services/account.service';
import { PaymentService, Payment } from '../shared/services/payment.service';
import { TransactionService, Transaction } from '../shared/services/transaction.service';
import { AuditService, AuditLog } from '../shared/services/audit.service';
import { UserService, User } from '../shared/services/user.service';
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
    accounts: false,
    payments: false,
    transactions: false,
    audits: false,
    users: false
  };

  // Error states
  errors = {
    accounts: false,
    payments: false,
    transactions: false,
    audits: false,
    users: false
  };

  // Data
  accounts: Account[] = [];
  payments: Payment[] = [];
  transactions: Transaction[] = [];
  auditLogs: AuditLog[] = [];
  users: User[] = [];

  // Summary stats
  stats = {
    totalAccounts: 0,
    totalUsers: 0,
    totalPayments: 0,
    totalTransactions: 0
  };

  constructor(
    private accountService: AccountService,
    private paymentService: PaymentService,
    private transactionService: TransactionService,
    private auditService: AuditService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadAdminData();
  }

  loadAdminData(): void {
    this.loadAccounts();
    this.loadPayments();
    this.loadTransactions();
    this.loadAuditLogs();
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
        this.loading.audits = false;
      },
      error: (err) => {
        console.error('Error loading audit logs:', err);
        this.errors.audits = true;
        this.loading.audits = false;
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
      case 'users':
        this.loadUsers();
        break;
    }
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
}
