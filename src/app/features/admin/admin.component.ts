import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { PageStateComponent } from '../../shared/components/page-state.component';
import { BACKEND_MODE } from '../../core/config/app.constants';
import { AdminDashboardData } from './data-access/admin-dashboard.service';
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [NavbarComponent, PageStateComponent, CurrencyPipe, DatePipe],
  templateUrl: './admin.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {
  readonly dashboard = httpResource<AdminDashboardData>(
    () => '/api/admin-dashboard',
  );
  readonly tab = signal('Accounts');
  readonly tabs = [
    'Accounts',
    'Payments',
    'Transactions',
    BACKEND_MODE === 'choreographed' ? 'Audit trail' : 'Sagas',
    'Customers',
    'Notifications',
  ];
  readonly stats = computed(() => {
    const d = this.dashboard.value();
    return [
      { label: 'Accounts', value: d?.accounts.length ?? 0 },
      { label: 'Customers', value: d?.users.length ?? 0 },
      { label: 'Payments', value: d?.payments.length ?? 0 },
      { label: BACKEND_MODE === 'choreographed' ? 'Audit events' : 'Sagas', value: BACKEND_MODE === 'choreographed' ? (d?.auditLogs?.length ?? 0) : (d?.sagaInstances?.length ?? 0) },
    ];
  });
}
