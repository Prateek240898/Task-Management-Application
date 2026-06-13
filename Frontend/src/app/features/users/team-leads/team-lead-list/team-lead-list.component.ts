import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormControl,
  ReactiveFormsModule
} from '@angular/forms';

import {
  debounceTime,
  distinctUntilChanged,
  finalize
} from 'rxjs';

import {
  MatTableDataSource,
  MatTableModule
} from '@angular/material/table';

import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';

import {
  MatSort,
  MatSortModule,
  Sort
} from '@angular/material/sort';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatIconModule
} from '@angular/material/icon';

import {
  MatTooltipModule
} from '@angular/material/tooltip';

import {
  MatDialog
} from '@angular/material/dialog';

import {
  MatFormFieldModule
} from '@angular/material/form-field';

import {
  MatInputModule
} from '@angular/material/input';

import {
  User
} from '../../../../core/models/user.model';

import {
  Pagination
} from '../../../../core/models/pagination.model';

import {
  TeamLeadService
} from '../../../../core/services/api/team-lead.service';

import {
  ToasterService
} from '../../../../core/services/toaster/toaster.service';

import {
  LoaderComponent
} from '../../../../shared/components/loader/loader.component';

import {
  ConfirmDialogComponent
} from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

import {
  TeamLeadFormComponent
} from '../team-lead-form/team-lead-form.component';

import {
  PageHeaderComponent
} from '../../../../shared/components/page-header/page-header.component';

import {
  NoRecordsComponent
} from '../../../../shared/components/no-records/no-records.component';

@Component({
  selector: 'app-team-lead-list',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    LoaderComponent,
    PageHeaderComponent,
    NoRecordsComponent
  ],
  templateUrl:
    './team-lead-list.component.html',
  styleUrl:
    './team-lead-list.component.css'
})
export class TeamLeadListComponent
  implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  isLoading = false;

  displayedColumns = [
    'fullName',
    'username',
    'email',
    'createdAt',
    'actions'
  ];

  dataSource =
    new MatTableDataSource<User>();

  searchControl =
    new FormControl('');

  pagination: Pagination = {
    page: 1,
    limit: 10,
    totalRecords: 0,
    totalPages: 0
  };

  queryParams = {
    page: 1,
    limit: 10,
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  };

  constructor(
    private teamLeadService:
      TeamLeadService,

    private toasterService:
      ToasterService,

    private dialog:
      MatDialog
  ) { }

  ngOnInit(): void {

    this.loadTeamLeads();

    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {

        this.queryParams.page = 1;

        this.queryParams.search =
          value?.trim() || '';

        this.loadTeamLeads();
      });
  }

  ngAfterViewInit(): void {
  }

  loadTeamLeads(): void {

    this.isLoading = true;

    this.teamLeadService
      .getTeamLeads(
        this.queryParams
      )
      .pipe(
        finalize(() => {

          this.isLoading = false;
        })
      )
      .subscribe({

        next: (
          response
        ) => {

          if (!response.success) {

            this.toasterService.error(
              response.message
            );

            return;
          }

          this.dataSource.data =
            response.data;

          if (
            response.pagination
          ) {

            this.pagination =
              response.pagination;
          }
        },

        error: (
          error
        ) => {

          this.toasterService.error(
            error?.error?.message ||
            'Failed to load team leads'
          );

          return;
        }
      });
  }

  pageChanged(
    event: PageEvent
  ): void {

    this.queryParams.page =
      event.pageIndex + 1;

    this.queryParams.limit =
      event.pageSize;

    this.loadTeamLeads();
  }

  sortChanged(
    event: Sort
  ): void {

    this.queryParams.sortBy =
      event.active;

    this.queryParams.sortOrder =
      event.direction || 'asc';

    this.loadTeamLeads();
  }

  openCreateDialog(): void {

    const dialogRef =
      this.dialog.open(
        TeamLeadFormComponent,
        {
          width: '600px',
          maxWidth: '95vw',
          disableClose: true,
          data: {
            isEdit: false
          }
        }
      );

    dialogRef.afterClosed()
      .subscribe(result => {

        if (!result) {

          return;
        }

        this.loadTeamLeads();
      });
  }

  openEditDialog(
    teamLead: User
  ): void {

    const dialogRef =
      this.dialog.open(
        TeamLeadFormComponent,
        {
          width: '600px',
          maxWidth: '95vw',
          disableClose: true,
          data: {
            isEdit: true,
            teamLead
          }
        }
      );

    dialogRef.afterClosed()
      .subscribe(result => {

        if (!result) {

          return;
        }

        this.loadTeamLeads();
      });
  }

  deleteTeamLead(
    teamLead: User
  ): void {

    const dialogRef =
      this.dialog.open(
        ConfirmDialogComponent,
        {
          width: '400px',
          disableClose: true,
          data: {
            title:
              'Delete Team Lead',
            message:
              `Are you sure you want to delete ${teamLead.fullName}?`
          }
        }
      );

    dialogRef.afterClosed()
      .subscribe(result => {

        if (!result) {

          return;
        }

        this.isLoading = true;

        this.teamLeadService
          .deleteTeamLead(
            teamLead._id
          )
          .pipe(
            finalize(() => {

              this.isLoading = false;
            })
          )
          .subscribe({

            next: (
              response
            ) => {

              if (!response.success) {

                this.toasterService.error(
                  response.message
                );

                return;
              }

              this.toasterService.success(
                response.message
              );

              this.loadTeamLeads();
            },

            error: (
              error
            ) => {

              this.toasterService.error(
                error?.error?.message ||
                'Failed to delete team lead'
              );

              return;
            }
          });
      });
  }
}