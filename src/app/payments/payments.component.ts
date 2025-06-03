import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavbarComponent} from '../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './payments.component.html'
})
export class PaymentsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log('Payments component initialized');
  }
}
