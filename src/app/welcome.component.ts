import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Ensure Bootstrap icons are properly loaded
    // You might need to add Bootstrap icons to your project if not already installed
    // npm install bootstrap-icons
    // And import in your main styles.scss: @import 'bootstrap-icons/font/bootstrap-icons.css';
  }
}
