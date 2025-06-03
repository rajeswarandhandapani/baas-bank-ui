import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavbarComponent} from '../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './accounts.component.html'
})
export class AccountsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log('Accounts component initialized');
  }
}
