import { Component, OnInit, inject } from '@angular/core';
import {
  CommonModule
} from '@angular/common';

import {
  finalize
} from 'rxjs';

import {
  DashboardService
} from '../../core/services/api/dashboard.service';

import {
  UserStateService
} from '../../core/services/user-state/user-state.service';

import {
  ToasterService
} from '../../core/services/toaster/toaster.service';

import {
  LoaderComponent
} from '../../shared/components/loader/loader.component';

import {
  DashboardData
} from '../../core/models/dashboard.model';

import {
  MatCardModule
} from '@angular/material/card';

import {
  MatIconModule
} from '@angular/material/icon';

import {
  MatProgressBarModule
} from '@angular/material/progress-bar';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    LoaderComponent,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private dashboardService =
    inject(DashboardService);

  private userStateService =
    inject(UserStateService);

  private toaster =
    inject(ToasterService);

  isLoading = false;

  dashboardData:
    DashboardData = {};

  ngOnInit(): void {

    this.loadDashboard();
  }

  loadDashboard(): void {

    this.isLoading = true;

    this.dashboardService
      .getDashboard()
      .pipe(
        finalize(() => {

          this.isLoading = false;
        })
      )
      .subscribe({

        next: (
          response
        ) => {

          if (
            !response.success
          ) {

            this.toaster.error(
              response.message
            );

            return;
          }

          this.dashboardData =
            response.data;
        },

        error: (error) => {

          this.toaster.error(error?.error?.message ||
            'Failed to load dashboard'
          );
        }
      });
  }

  get role() {

    return this.userStateService
      .role();
  }

  get completionPercentage(): number {

    const total =
      this.dashboardData.totalTasks || 0;

    const completed =
      this.dashboardData.completedTasks || 0;

    if (!total) {

      return 0;
    }

    return Math.round(
      (completed / total) * 100
    );
  }

  get pendingPercentage(): number {

    return 100 -
      this.completionPercentage;
  }

}
