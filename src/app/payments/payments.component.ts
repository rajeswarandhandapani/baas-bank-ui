import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NavbarComponent} from '../shared/components/navbar/navbar.component';
import {PaymentService, Payment, CreatePaymentRequest} from '../shared/services/payment.service';
import {AccountService, Account} from '../shared/services/account.service';
import {CurrencyFormatPipe} from '../shared/pipes/currency-format.pipe';
import {StatusBadgePipe} from '../shared/pipes/status-badge.pipe';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, CurrencyFormatPipe, StatusBadgePipe],
  templateUrl: './payments.component.html'
})
export class PaymentsComponent implements OnInit {
  paymentForm: FormGroup;
  userAccounts: Account[] = [];
  payments: Payment[] = [];
  loadingAccounts = true;
  loadingPayments = true;
  loadingForm = false;
  error = false;
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private accountService: AccountService
  ) { 
    this.paymentForm = this.fb.group({
      sourceAccountNumber: ['', Validators.required],
      destinationAccountNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.maxLength(255)]]
    });
  }

  ngOnInit(): void {
    this.loadUserAccounts();
    this.loadPaymentHistory();
  }

  loadUserAccounts(): void {
    this.loadingAccounts = true;
    this.accountService.getMyAccounts().subscribe({
      next: (accounts) => {
        this.userAccounts = accounts;
        this.loadingAccounts = false;
      },
      error: (err) => {
        console.error('Error loading accounts:', err);
        this.loadingAccounts = false;
      }
    });
  }

  loadPaymentHistory(): void {
    this.loadingPayments = true;
    this.error = false;

    this.paymentService.getMyPayments().subscribe({
      next: (payments) => {
        this.payments = payments;
        this.loadingPayments = false;
      },
      error: (err) => {
        console.error('Error loading payments:', err);
        this.error = true;
        this.loadingPayments = false;
      }
    });
  }

  onSubmitPayment(): void {
    if (this.paymentForm.valid) {
      this.loadingForm = true;
      this.successMessage = '';
      this.error = false;

      const paymentRequest: CreatePaymentRequest = this.paymentForm.value;

      this.paymentService.createPayment(paymentRequest).subscribe({
        next: (payment) => {
          this.successMessage = 'Payment created successfully!';
          this.paymentForm.reset();
          this.loadingForm = false;
          // Refresh payment history
          this.loadPaymentHistory();
        },
        error: (err) => {
          console.error('Error creating payment:', err);
          this.error = true;
          this.loadingForm = false;
        }
      });
    }
  }

  retryLoadPayments(): void {
    this.loadPaymentHistory();
  }
}
