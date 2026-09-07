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
import { Account } from './data-access/account.service';
@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [
    NavbarComponent,
    PageStateComponent,
    CurrencyPipe,
    DatePipe,
    RouterLink,
  ],
  templateUrl: './accounts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsComponent {
  readonly accounts = httpResource<Account[]>(
    () => '/api/accounts/my-accounts',
    { defaultValue: [] },
  );
  readonly total = computed(() =>
    this.accounts.value().reduce((sum, a) => sum + a.balance, 0),
  );
}
