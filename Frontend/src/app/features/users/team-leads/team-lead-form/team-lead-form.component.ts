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

import {
  User
} from '../../../../core/models/user.model';

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
  noConsecutiveSpacesValidator
} from '../../../../shared/validators/no-consecutive-spaces.validator';

@Component({
  selector: 'app-team-lead-form',
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
    './team-lead-form.component.html',
  styleUrl:
    './team-lead-form.component.css'
})
export class TeamLeadFormComponent
  implements OnInit {

  isLoading = false;

  hidePassword = true;

  teamLeadForm =
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
      MatDialogRef<TeamLeadFormComponent>,

    @Inject(MAT_DIALOG_DATA)
    public data: {
      teamLead?: User;
      isEdit: boolean;
    },

    private teamLeadService:
      TeamLeadService,

    private toasterService:
      ToasterService
  ) { }

  ngOnInit(): void {

    if (
      this.data.isEdit &&
      this.data.teamLead
    ) {

      this.teamLeadForm.patchValue({

        fullName:
          this.data.teamLead.fullName,

        username:
          this.data.teamLead.username,

        email:
          this.data.teamLead.email
      });

    } else {

      this.teamLeadForm
        .get('password')
        ?.setValidators([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(50),
          Validators.pattern(
            /^\S+$/
          )
        ]);

      this.teamLeadForm
        .get('password')
        ?.updateValueAndValidity();
    }
  }

  submit(): void {

    if (
      this.teamLeadForm.invalid
    ) {

      this.teamLeadForm
        .markAllAsTouched();

      return;
    }

    const payload = {
      ...this.teamLeadForm.value
    };

    this.isLoading = true;

    if (
      this.data.isEdit
    ) {

      delete payload.password;

      this.teamLeadService
        .updateTeamLead(
          this.data.teamLead!._id,
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
              'Failed to update team lead'
            );

            return;
          }
        });

      return;
    }

    this.teamLeadService
      .createTeamLead(
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
            'Failed to create team lead'
          );

          return;
        }
      });
  }

  get f() {

    return this.teamLeadForm.controls;
  }
}