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
  MatFormFieldModule
} from '@angular/material/form-field';

import {
  MatInputModule
} from '@angular/material/input';

import {
  MatChipsModule
} from '@angular/material/chips';

import {
  MatDialog
} from '@angular/material/dialog';

import {
  User
} from '../../../../core/models/user.model';

import {
  Pagination
} from '../../../../core/models/pagination.model';

import {
  EmployeeService
} from '../../../../core/services/api/employee.service';

import {
  ToasterService
} from '../../../../core/services/toaster/toaster.service';

import {
  LoaderComponent
} from '../../../../shared/components/loader/loader.component';

import {
  PageHeaderComponent
} from '../../../../shared/components/page-header/page-header.component';

import {
  NoRecordsComponent
} from '../../../../shared/components/no-records/no-records.component';

import {
  ConfirmDialogComponent
} from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-employee-list',
  standalone: true,
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
    MatChipsModule,
    LoaderComponent,
    PageHeaderComponent,
    NoRecordsComponent
  ],
  templateUrl:
    './employee-list.component.html',
  styleUrl:
    './employee-list.component.css'
})
export class EmployeeListComponent
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
    'status',
    'actions'
  ];

  selectedFilter = '';

  searchControl =
    new FormControl('');

  dataSource =
    new MatTableDataSource<User>();

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
    filter: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  };

  constructor(
    private employeeService:
      EmployeeService,

    private toasterService:
      ToasterService,

    private dialog:
      MatDialog
  ) { }

  ngOnInit(): void {

    this.loadEmployees();

    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {

        this.queryParams.page = 1;

        this.queryParams.search =
          value?.trim() || '';

        this.loadEmployees();
      });
  }

  ngAfterViewInit(): void {
  }

  loadEmployees(): void {

    this.isLoading = true;

    this.employeeService
      .getEmployees(
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
            'Failed to load employees'
          );

          return;
        }
      });
  }

  changeFilter(
    filter: string
  ): void {

    this.selectedFilter =
      filter;

    this.queryParams.filter =
      filter;

    this.queryParams.page = 1;

    this.loadEmployees();
  }

  pageChanged(
    event: PageEvent
  ): void {

    this.queryParams.page =
      event.pageIndex + 1;

    this.queryParams.limit =
      event.pageSize;

    this.loadEmployees();
  }

  sortChanged(
    event: Sort
  ): void {

    this.queryParams.sortBy =
      event.active;

    this.queryParams.sortOrder =
      event.direction || 'asc';

    this.loadEmployees();
  }

  isAssigned(
    employee: User
  ): boolean {

    return !!employee.teamLeadId;
  }

  toggleAssignment(
    employee: User
  ): void {

    const isAssigned =
      this.isAssigned(
        employee
      );

    const dialogRef =
      this.dialog.open(
        ConfirmDialogComponent,
        {
          width: '400px',
          disableClose: true,
          data: {
            title:
              isAssigned
                ? 'Unassign Employee'
                : 'Assign Employee',

            message:
              isAssigned
                ? `Are you sure you want to unassign ${employee.fullName}?`
                : `Are you sure you want to assign ${employee.fullName}?`
          }
        }
      );

    dialogRef.afterClosed()
      .subscribe(result => {

        if (!result) {

          return;
        }

        this.processAssignment(
          employee,
          isAssigned
        );
      });
  }

  private processAssignment(
    employee: User,
    isAssigned: boolean
  ): void {

    this.isLoading = true;

    const request =
      isAssigned
        ? this.employeeService.unassignEmployee(
          employee._id
        )
        : this.employeeService.assignEmployee(
          employee._id
        );

    request
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

          this.loadEmployees();
        },

        error: (
          error
        ) => {

          this.toasterService.error(
            error?.error?.message ||
            'Operation failed'
          );

          return;
        }
      });
  }
}