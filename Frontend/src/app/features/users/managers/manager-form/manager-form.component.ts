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
  finalize
} from 'rxjs';

import { User } from '../../../../core/models/user.model';

import { ManagerService } from '../../../../core/services/api/manager.service';

import { ToasterService } from '../../../../core/services/toaster/toaster.service';

import { noConsecutiveSpacesValidator } from '../../../../shared/validators/no-consecutive-spaces.validator';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-manager-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    LoaderComponent
  ],
  templateUrl:
    './manager-form.component.html',
  styleUrl:
    './manager-form.component.css'
})
export class ManagerFormComponent
  implements OnInit {

  isLoading = false;

  hidePassword = true;

  managerForm =
    new FormGroup({

      fullName:
        new FormControl(
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
            Validators.pattern(
              /^[A-Za-z]+(?: [A-Za-z]+)*$/
            ),
            noConsecutiveSpacesValidator()
          ]
        ),

      username:
        new FormControl(
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(30),
            Validators.pattern(
              /^[a-zA-Z0-9_]+$/
            )
          ]
        ),

      email:
        new FormControl(
          '',
          [
            Validators.required,
            Validators.pattern(
              /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            ),
            Validators.maxLength(255)
          ]
        ),

      password:
        new FormControl(
          '',
          []
        )
    });

  constructor(
    private dialogRef:
      MatDialogRef<ManagerFormComponent>,

    @Inject(MAT_DIALOG_DATA)
    public data: {
      manager?: User;
      isEdit: boolean;
    },

    private managerService:
      ManagerService,

    private toasterService:
      ToasterService
  ) { }

  ngOnInit(): void {

    if (
      this.data.isEdit &&
      this.data.manager
    ) {

      this.managerForm.patchValue({

        fullName:
          this.data.manager.fullName,

        username:
          this.data.manager.username,

        email:
          this.data.manager.email
      });

    } else {

      this.managerForm
        .get('password')
        ?.setValidators([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(50),
          Validators.pattern(
            /^\S+$/
          )
        ]);

      this.managerForm
        .get('password')
        ?.updateValueAndValidity();
    }
  }

  submit(): void {

    if (
      this.managerForm.invalid
    ) {

      this.managerForm
        .markAllAsTouched();

      return;
    }

    const payload = {
      ...this.managerForm.value
    };

    this.isLoading = true;

    if (
      this.data.isEdit
    ) {

      delete payload.password;

      this.managerService
        .updateManager(
          this.data.manager!._id,
          payload
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

            this.dialogRef.close(
              true
            );
          },

          error: (
            error
          ) => {

            this.toasterService.error(
              error?.error?.message ||
              'Failed to update manager'
            );

            return;
          }
        });

      return;
    }

    this.managerService
      .createManager(
        payload
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

          this.dialogRef.close(
            true
          );
        },

        error: (
          error
        ) => {

          this.toasterService.error(
            error?.error?.message ||
            'Failed to create manager'
          );

          return;
        }
      });
  }

  get f() {

    return this.managerForm.controls;
  }
}