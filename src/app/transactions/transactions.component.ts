import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavbarComponent} from '../shared/components/navbar/navbar.component';
import {TransactionService, Transaction} from '../shared/services/transaction.service';
import {CurrencyFormatPipe} from '../shared/pipes/currency-format.pipe';
import {TransactionTypeClassPipe} from '../shared/pipes/transaction-type-class.pipe';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, NavbarComponent, CurrencyFormatPipe, TransactionTypeClassPipe],
  templateUrl: './transactions.component.html'
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  loading = true;
  error = false;

  constructor(private transactionService: TransactionService) { }

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.loading = true;
    this.error = false;

    this.transactionService.getMyTransactions().subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading transactions:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  retryLoadTransactions(): void {
    this.loadTransactions();
  }
}
