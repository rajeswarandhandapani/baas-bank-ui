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
import { Transaction } from './data-access/transaction.service';
@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [NavbarComponent, PageStateComponent, CurrencyPipe, DatePipe],
  templateUrl: './transactions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsComponent {
  readonly transactions = httpResource<Transaction[]>(
    () => '/api/transactions/my-transactions',
    { defaultValue: [] },
  );
  readonly query = signal('');
  readonly filter = signal('ALL');
  readonly filtered = computed(() =>
    [...this.transactions.value()]
      .filter(
        (t) =>
          (this.filter() === 'ALL' || t.type === this.filter()) &&
          `${t.description} ${t.accountNumber} ${t.reference}`
            .toLowerCase()
            .includes(this.query().toLowerCase()),
      )
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp)),
  );
}
