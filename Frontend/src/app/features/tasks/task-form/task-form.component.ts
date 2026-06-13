import {
  Component,
  Inject,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import {
  MatFormFieldModule
} from '@angular/material/form-field';

import {
  MatInputModule
} from '@angular/material/input';

import {
  MatButtonModule
} from '@angular/material/button';

import {
  MatIconModule
} from '@angular/material/icon';

import {
  MatSelectModule
} from '@angular/material/select';

import {
  finalize
} from 'rxjs';

import {
  TaskService
} from '../../../core/services/api/task.service';

import {
  ToasterService
} from '../../../core/services/toaster/toaster.service';

import {
  UserStateService
} from '../../../core/services/user-state/user-state.service';

import {
  AssignableUser
} from '../../../core/models/assignable-user.model';

import {
  LoaderComponent
} from '../../../shared/components/loader/loader.component';

import {
  noConsecutiveSpacesValidator
} from '../../../shared/validators/no-consecutive-spaces.validator';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    LoaderComponent
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit {

  isLoading = false;

  assignableUsers: AssignableUser[] = [];

  currentUserRole = '';

  form = new FormGroup({

    title: new FormControl(
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(200),
        noConsecutiveSpacesValidator()
      ]
    ),

    description: new FormControl(
      '',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(2000),
        noConsecutiveSpacesValidator()
      ]
    ),

    assignedTo: new FormControl('')
  });

  constructor(
    private taskService: TaskService,
    private toasterService: ToasterService,
    private userStateService: UserStateService,
    private dialogRef: MatDialogRef<TaskFormComponent>,

    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) { }

  ngOnInit(): void {

    const user =
      this.userStateService.currentUser();

    this.currentUserRole =
      user?.role ?? '';

    if (
      this.currentUserRole !==
      'EMPLOYEE'
    ) {

      this.form
        .get('assignedTo')
        ?.addValidators(
          Validators.required
        );

      this.loadAssignableUsers();
    }

    if (
      this.data?.isEdit
    ) {

      this.patchForm();
    }
  }

  loadAssignableUsers(): void {

    this.taskService
      .getAssignableUsers()
      .subscribe({

        next: (response) => {

          if (!response.success) {

            this.toasterService.error(
              response.message
            );

            return;
          }

          this.assignableUsers =
            response.data;
        },

        error: (error) => {

          this.toasterService.error(
            error?.error?.message ||
            'Failed to load users'
          );
        }
      });
  }

  patchForm(): void {

    const task =
      this.data.task;

    this.form.patchValue({

      title:
        task.title,

      description:
        task.description,

      assignedTo:
        task.assignedTo?._id
    });
  }

  save(): void {

    this.form.markAllAsTouched();

    if (
      this.form.invalid
    ) {

      return;
    }

    this.isLoading = true;

    const payload =
      this.form.getRawValue();

    const request =
      this.data?.isEdit
        ? this.taskService.updateTask(
          this.data.task._id,
          payload
        )
        : this.taskService.createTask(
          payload
        );

    request
      .pipe(
        finalize(() => {

          this.isLoading =
            false;
        })
      )
      .subscribe({

        next: (response) => {

          if (!response.success) {

            this.toasterService.error(
              response.message
            );

            return;
          }

          this.toasterService.success(
            response.message
          );

          this.dialogRef.close(
            true
          );
        },

        error: (error) => {

          this.toasterService.error(
            error?.error?.message ||
            'Operation failed'
          );
        }
      });
  }

  close(): void {

    this.dialogRef.close();
  }
}