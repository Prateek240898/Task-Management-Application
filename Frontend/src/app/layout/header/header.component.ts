import {
  Component,
  inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Router
} from '@angular/router';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatIconModule
} from '@angular/material/icon';

import {
  AuthService
} from '../../core/services/api/auth.service';

import {
  UserStateService
} from '../../core/services/user-state/user-state.service';

import {
  ToasterService
} from '../../core/services/toaster/toaster.service';

import {
  LayoutService
} from '../../core/services/layout/layout.service';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl:
    './header.component.html',
  styleUrl:
    './header.component.css'
})
export class HeaderComponent {

  private authService =
    inject(AuthService);

  private userStateService =
    inject(UserStateService);

  private toaster =
    inject(ToasterService);

  private router =
    inject(Router);

  private layoutService =
    inject(LayoutService);

  logout(): void {

    this.authService
      .logout()
      .subscribe({

        next: (
          response
        ) => {

          this.userStateService
            .clearUser();

          this.toaster.success(
            response.message
          );

          this.router.navigate([
            '/login'
          ]);
        }
      });
  }

  get fullName() {

    return this.userStateService
      .fullName();
  }

  get role() {

    return this.userStateService
      .role();
  }

  get roleLabel(): string {

    switch (this.role) {

      case 'Admin':
        return 'Administrator';

      case 'Manager':
        return 'Manager';

      case 'Team Lead':
        return 'Team Lead';

      default:
        return 'Employee';
    }
  }

  toggleSidebar(): void {

    this.layoutService
      .toggleSidebar();
  }
}