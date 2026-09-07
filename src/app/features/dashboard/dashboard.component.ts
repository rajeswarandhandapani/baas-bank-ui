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
import { AuthService } from '../../core/auth/auth.service';
import { Account } from '../accounts/data-access/account.service';
import { Transaction } from '../transactions/data-access/transaction.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NavbarComponent,
    PageStateComponent,
    CurrencyPipe,
    DatePipe,
    RouterLink,
  ],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  readonly auth = inject(AuthService);
  readonly accounts = httpResource<Account[]>(
    () => '/api/accounts/my-accounts',
    { defaultValue: [] },
  );
  readonly activity = httpResource<Transaction[]>(
    () => '/api/transactions/my-transactions',
    { defaultValue: [] },
  );
  readonly balance = computed(() =>
    this.accounts.value().reduce((sum, account) => sum + account.balance, 0),
  );
  readonly recent = computed(() =>
    [...this.activity.value()]
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
      .slice(0, 5),
  );
}
