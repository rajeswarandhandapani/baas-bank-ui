import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavbarComponent} from '../shared/components/navbar/navbar.component';
import {Account, AccountService} from '../shared/services/account.service';
import {CurrencyFormatPipe} from '../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, NavbarComponent, CurrencyFormatPipe],
  templateUrl: './accounts.component.html'
})
export class AccountsComponent implements OnInit {
  accounts: Account[] = [];
  loading = true;
  error = false;

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.loading = true;
    this.error = false;

    this.accountService.getMyAccounts().subscribe({
      next: (data) => {
        this.accounts = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading accounts:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }
}
