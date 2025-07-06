import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { Account } from '../shared/services/account.service';
import { Payment } from '../shared/services/payment.service';
import { Transaction } from '../shared/services/transaction.service';
import { Notification } from '../shared/services/notification.service';
import { User } from '../shared/services/user.service';
import { SagaInstance } from '../shared/services/saga.service';
import { AdminDashboardService } from '../shared/services/admin-dashboard.service';
import { CurrencyFormatPipe } from '../shared/pipes/currency-format.pipe';
import { StatusBadgePipe } from '../shared/pipes/status-badge.pipe';
import { TransactionTypeClassPipe } from '../shared/pipes/transaction-type-class.pipe';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, CurrencyFormatPipe, StatusBadgePipe, TransactionTypeClassPipe],
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
  sagaInstances: SagaInstance[] = [];
  notifications: Notification[] = [];
  users: User[] = [];

  // Summary stats
  stats = {
    totalAccounts: 0,
    totalUsers: 0,
    totalPayments: 0,
    totalTransactions: 0,
    totalSagaInstances: 0,
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
        this.sagaInstances = data.sagaInstances || [];
        this.notifications = data.notifications || [];
        this.users = data.users || [];

        // Update statistics
        this.stats.totalAccounts = this.accounts.length;
        this.stats.totalPayments = this.payments.length;
        this.stats.totalTransactions = this.transactions.length;
        this.stats.totalSagaInstances = this.sagaInstances.length;
        this.stats.totalNotifications = this.notifications.length;
        this.stats.totalUsers = this.users.length;

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
}
