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
  MatTableDataSource, MatTableModule
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
  ManagerService
} from '../../../../core/services/api/manager.service';

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
  ManagerFormComponent
} from '../manager-form/manager-form.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoRecordsComponent } from '../../../../shared/components/no-records/no-records.component';
import {
  PageHeaderComponent
} from '../../../../shared/components/page-header/page-header.component';
@Component({
  selector: 'app-manager-list',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    LoaderComponent,
    MatTooltipModule,
    NoRecordsComponent,
    PageHeaderComponent
  ],
  templateUrl:
    './manager-list.component.html',
  styleUrl:
    './manager-list.component.css'
})
export class ManagerListComponent
  implements OnInit,
  AfterViewInit {

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
    private managerService:
      ManagerService,

    private toasterService:
      ToasterService,

    private dialog:
      MatDialog
  ) { }

  ngOnInit(): void {

    this.loadManagers();

    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {

        this.queryParams.page = 1;

        this.queryParams.search =
          value?.trim() || '';

        this.loadManagers();
      });
  }

  ngAfterViewInit(): void { }

  loadManagers(): void {

    this.isLoading = true;

    this.managerService
      .getManagers(
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

          if (
            !response.success
          ) {

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
            'Failed to load managers'
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

    this.loadManagers();
  }

  sortChanged(
    event: Sort
  ): void {

    this.queryParams.sortBy =
      event.active;

    this.queryParams.sortOrder =
      event.direction || 'asc';

    this.loadManagers();
  }

  openCreateDialog(): void {

    const dialogRef =
      this.dialog.open(
        ManagerFormComponent,
        {
          width: '600px',
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

        this.loadManagers();
      });
  }

  openEditDialog(
    manager: User
  ): void {

    const dialogRef =
      this.dialog.open(
        ManagerFormComponent,
        {
          width: '600px',
          disableClose: true,
          data: {
            isEdit: true,
            manager
          }
        }
      );

    dialogRef.afterClosed()
      .subscribe(result => {

        if (!result) {

          return;
        }

        this.loadManagers();
      });
  }

  deleteManager(
    manager: User
  ): void {

    const dialogRef =
      this.dialog.open(
        ConfirmDialogComponent,
        {
          width: '400px',
          data: {
            title:
              'Delete Manager',
            message:
              `Are you sure you want to delete ${manager.fullName}?`
          }
        }
      );

    dialogRef.afterClosed()
      .subscribe(result => {

        if (!result) {

          return;
        }

        this.isLoading = true;

        this.managerService
          .deleteManager(
            manager._id
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

              if (
                !response.success
              ) {

                this.toasterService.error(
                  response.message
                );

                return;
              }

              this.toasterService.success(
                response.message
              );

              this.loadManagers();
            },
            error: (
              error
            ) => {

              this.toasterService.error(
                error?.error?.message ||
                'Failed to delete manager'
              );

              return;
            }
          });
      });
  }
}