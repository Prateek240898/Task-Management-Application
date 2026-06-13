import {
  Component,
  OnInit
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
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';

import {
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
  MatSelectModule
} from '@angular/material/select';

import {
  Task
} from '../../../core/models/task.model';

import {
  Pagination
} from '../../../core/models/pagination.model';

import {
  TaskService
} from '../../../core/services/api/task.service';

import {
  ToasterService
} from '../../../core/services/toaster/toaster.service';

import {
  LoaderComponent
} from '../../../shared/components/loader/loader.component';

import {
  PageHeaderComponent
} from '../../../shared/components/page-header/page-header.component';

import {
  NoRecordsComponent
} from '../../../shared/components/no-records/no-records.component';

import {
  ConfirmDialogComponent
} from '../../../shared/components/confirm-dialog/confirm-dialog.component';

import {
  TaskFormComponent
} from '../task-form/task-form.component';

import {
  TaskDetailsComponent
} from '../task-details/task-details.component';

import {
  MatTooltipModule
} from '@angular/material/tooltip';

import {
  DatePipe
} from '@angular/common';

@Component({
  selector: 'app-task-list',
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
    MatChipsModule,
    MatSelectModule,
    LoaderComponent,
    PageHeaderComponent,
    NoRecordsComponent,
    MatTooltipModule,
    DatePipe
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent
  implements OnInit {

  isLoading = false;

  displayedColumns = [
    'title',
    'assignedTo',
    'role',
    'status',
    'createdAt',
    'actions'
  ];

  dataSource =
    new MatTableDataSource<Task>(
      []
    );

  searchControl =
    new FormControl('');

  selectedStatus = '';

  pagination: Pagination = {

    page: 1,

    limit: 10,

    totalRecords: 0,

    totalPages: 0
  };

  sortBy = 'createdAt';

  sortOrder = 'desc';

  constructor(
    private taskService:
      TaskService,

    private toasterService:
      ToasterService,

    private dialog:
      MatDialog
  ) { }

  ngOnInit(): void {

    this.loadTasks();

    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(() => {

        this.pagination.page = 1;

        this.loadTasks();
      });
  }

  loadTasks(): void {

    this.isLoading = true;

    const params = {

      page:
        this.pagination.page,

      limit:
        this.pagination.limit,

      search:
        this.searchControl.value || '',

      status:
        this.selectedStatus,

      sortBy:
        this.sortBy,

      sortOrder:
        this.sortOrder
    };

    this.taskService
      .getTasks(
        params
      )
      .pipe(
        finalize(() => {

          this.isLoading =
            false;
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
            'Failed to load tasks'
          );

          return;
        }
      });
  }

  changeStatusFilter(
    status: string
  ): void {

    this.selectedStatus =
      status;

    this.pagination.page = 1;

    this.loadTasks();
  }

  pageChanged(
    event: PageEvent
  ): void {

    this.pagination.page =
      event.pageIndex + 1;

    this.pagination.limit =
      event.pageSize;

    this.loadTasks();
  }

  sortChanged(
    sort: Sort
  ): void {

    this.sortBy =
      sort.active;

    this.sortOrder =
      sort.direction || 'asc';

    this.loadTasks();
  }

  openCreateDialog(): void {

    const dialogRef =
      this.dialog.open(
        TaskFormComponent,
        {
          width: '700px',
          maxWidth: '95vw',
          disableClose: true,
          data: {
            isEdit: false
          }
        }
      );

    dialogRef.afterClosed()
      .subscribe(result => {

        if (result) {

          this.loadTasks();
        }
      });
  }

  openEditDialog(
    task: Task
  ): void {

    const dialogRef =
      this.dialog.open(
        TaskFormComponent,
        {
          width: '700px',
          maxWidth: '95vw',
          disableClose: true,
          data: {
            isEdit: true,
            task
          }
        }
      );

    dialogRef.afterClosed()
      .subscribe(result => {

        if (result) {

          this.loadTasks();
        }
      });
  }

  viewTask(
    task: Task
  ): void {

    this.dialog.open(
      TaskDetailsComponent,
      {
        width: '800px',
        data: task
      }
    );
  }

  deleteTask(
    task: Task
  ): void {

    const dialogRef =
      this.dialog.open(
        ConfirmDialogComponent,
        {
          width: '450px',
          data: {
            title:
              'Delete Task',
            message:
              `Are you sure you want to delete "${task.title}"?`
          }
        }
      );

    dialogRef.afterClosed()
      .subscribe(result => {

        if (!result) {

          return;
        }

        this.isLoading = true;

        this.taskService
          .deleteTask(
            task._id
          )
          .pipe(
            finalize(() => {

              this.isLoading =
                false;
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

              this.loadTasks();
            },

            error: (
              error
            ) => {

              this.toasterService.error(
                error?.error?.message ||
                'Delete failed'
              );

              return;
            }
          });
      });
  }

  changeTaskStatus(
    task: Task,
    status: string
  ): void {

    if (
      task.status ===
      status
    ) {

      return;
    }

    const dialogRef =
      this.dialog.open(
        ConfirmDialogComponent,
        {
          width: '450px',
          data: {
            title:
              'Change Status',
            message:
              `Are you sure you want to mark this task as ${status}?`
          }
        }
      );

    dialogRef.afterClosed()
      .subscribe(result => {

        if (!result) {

          return;
        }

        this.isLoading = true;

        this.taskService
          .changeTaskStatus(
            task._id,
            status
          )
          .pipe(
            finalize(() => {

              this.isLoading =
                false;
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

              this.loadTasks();
            },

            error: (
              error
            ) => {

              this.toasterService.error(
                error?.error?.message ||
                'Status update failed'
              );

              return;
            }
          });
      });
  }
}