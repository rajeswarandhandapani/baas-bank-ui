import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavbarComponent} from '../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './transactions.component.html'
})
export class TransactionsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log('Transactions component initialized');
  }
}
