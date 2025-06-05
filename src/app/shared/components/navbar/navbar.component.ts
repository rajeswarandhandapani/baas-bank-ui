import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {AuthService} from "../../../auth.service";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  logout() {
    this.authService.logout();
  }

  isAdmin(): boolean {
    return this.userService.isAdmin();
  }
}
