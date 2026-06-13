import {
  Component,
  computed,
  inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import {
  MatIconModule
} from '@angular/material/icon';

import { MenuItem }
  from '../../core/models/menu-item.model';

import {
  UserStateService
} from '../../core/services/user-state/user-state.service';

import {
  LayoutService
} from '../../core/services/layout/layout.service';

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule
  ],
  templateUrl:
    './sidebar.component.html',
  styleUrl:
    './sidebar.component.css'
})
export class SidebarComponent {

  private userStateService =
    inject(UserStateService);

  private layoutService =
    inject(LayoutService);

  menuItems = computed<
    MenuItem[]
  >(() => {

    const role =
      this.userStateService.role();

    switch (role) {

      case 'Admin':

        return [
          {
            label: 'Dashboard',
            icon: 'dashboard',
            route: '/dashboard'
          },
          {
            label: 'Managers',
            icon: 'groups',
            route: '/managers'
          }
        ];

      case 'Manager':

        return [
          {
            label: 'Dashboard',
            icon: 'dashboard',
            route: '/dashboard'
          },
          {
            label: 'Team Leads',
            icon: 'group',
            route: '/team-leads'
          },
          {
            label: 'Tasks',
            icon: 'assignment',
            route: '/tasks'
          }
        ];

      case 'Team Lead':

        return [
          {
            label: 'Dashboard',
            icon: 'dashboard',
            route: '/dashboard'
          },
          {
            label: 'Employees',
            icon: 'badge',
            route: '/employees'
          },
          {
            label: 'Tasks',
            icon: 'assignment',
            route: '/tasks'
          }
        ];

      default:

        return [
          {
            label: 'Dashboard',
            icon: 'dashboard',
            route: '/dashboard'
          },
          {
            label: 'Tasks',
            icon: 'assignment',
            route: '/tasks'
          }
        ];
    }
  });

  get isCollapsed() {
    return this.layoutService
      .isSidebarCollapsed();
  }

  get isMobileOpen() {

    return this.layoutService
      .isMobileSidebarOpen();
  }

  closeSidebar(): void {

    if (
      window.innerWidth <= 768
    ) {

      this.layoutService
        .closeMobileSidebar();
    }
  }
}