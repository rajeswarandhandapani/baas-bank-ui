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
import { DestroyRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, timer } from 'rxjs';
import { Account } from '../accounts/data-access/account.service';
import { Payment, PaymentService } from './data-access/payment.service';
@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [
    NavbarComponent,
    PageStateComponent,
    CurrencyPipe,
    DatePipe,
    ReactiveFormsModule,
  ],
  templateUrl: './payments.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentsComponent {
  private readonly service = inject(PaymentService);
  private readonly destroy = inject(DestroyRef);
  readonly accounts = httpResource<Account[]>(
    () => '/api/accounts/my-accounts',
    { defaultValue: [] },
  );
  readonly payments = httpResource<Payment[]>(
    () => '/api/payments/my-payments',
    { defaultValue: [] },
  );
  readonly sorted = computed(() =>
    [...this.payments.value()].sort((a, b) =>
      b.timestamp.localeCompare(a.timestamp),
    ),
  );
  readonly sending = signal(false);
  readonly message = signal('');
  readonly error = signal('');
  readonly form = inject(FormBuilder).nonNullable.group({
    sourceAccountNumber: ['', Validators.required],
    destinationAccountNumber: [
      '',
      [Validators.required, Validators.pattern(/^\d+$/)],
    ],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    description: ['', [Validators.required, Validators.maxLength(255)]],
  });
  constructor() {
    timer(5000, 5000)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        if (
          this.payments.hasValue() &&
          this.payments
            .value()
            .some((p) => ['PENDING', 'PROCESSING'].includes(p.status))
        ) {
          this.payments.reload();
          this.accounts.reload();
        }
      });
  }
  submit(): void {
    if (this.sending()) return;
    this.form.markAllAsTouched();
    this.error.set('');
    this.message.set('');
    if (this.form.invalid) return;
    const request = this.form.getRawValue();
    if (request.sourceAccountNumber === request.destinationAccountNumber) {
      this.error.set('Choose a different destination account.');
      return;
    }
    const source = this.accounts
      .value()
      .find((a) => a.accountNumber === request.sourceAccountNumber);
    if (
      !source ||
      source.status !== 'ACTIVE' ||
      request.amount > source.balance
    ) {
      this.error.set('Choose an active account with enough available funds.');
      return;
    }
    this.sending.set(true);
    this.service
      .createPayment(request)
      .pipe(
        takeUntilDestroyed(this.destroy),
        finalize(() => this.sending.set(false)),
      )
      .subscribe({
        next: () => {
          this.message.set(
            'Payment submitted. We’re processing your transfer — check its status below.',
          );
          this.form.reset();
          this.payments.reload();
          timer(2000)
            .pipe(takeUntilDestroyed(this.destroy))
            .subscribe(() => {
              this.payments.reload();
              this.accounts.reload();
            });
        },
        error: () =>
          this.error.set(
            'Your payment could not be submitted. Please try again.',
          ),
      });
  }
}
