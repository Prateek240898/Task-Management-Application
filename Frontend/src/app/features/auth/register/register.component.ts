import {
  Component,
  inject
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
  Router,
  RouterLink
} from '@angular/router';

import {
  finalize
} from 'rxjs';

import {
  MatCardModule
} from '@angular/material/card';

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

import { AuthService } from '../../../core/services/api/auth.service';
import { ToasterService } from '../../../core/services/toaster/toaster.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { RegisterRequest } from '../../../core/models/register.model';
import {
  noConsecutiveSpacesValidator
} from '../../../shared/validators/no-consecutive-spaces.validator';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    LoaderComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private toaster = inject(ToasterService);
  private router = inject(Router);
  hidePassword = true;

  hideConfirmPassword = true;

  isLoading = false;

  registerForm =
    new FormGroup({

      fullName:
        new FormControl(
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
            Validators.pattern(
              /^[A-Za-z ]+$/
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
            Validators.maxLength(255),
            Validators.email,
            Validators.pattern(
              /^\S+@\S+\.\S+$/
            )
          ]
        ),

      password:
        new FormControl(
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(50),
            Validators.pattern(
              /^\S+$/
            )
          ]
        ),

      confirmPassword:
        new FormControl(
          '',
          [
            Validators.required
          ]
        )
    });

  onSubmit(): void {

    if (
      this.registerForm.invalid
    ) {

      this.registerForm.markAllAsTouched();

      this.toaster.warning(
        'Please fill all required fields'
      );

      return;
    }

    const password =
      this.registerForm.controls.password.value;

    const confirmPassword =
      this.registerForm.controls.confirmPassword.value;

    if (
      password !== confirmPassword
    ) {

      this.toaster.error(
        'Passwords do not match'
      );

      return;
    }

    const payload:
      RegisterRequest = {

      fullName:
        this.registerForm.controls.fullName.value || '',

      username:
        this.registerForm.controls.username.value || '',

      email:
        this.registerForm.controls.email.value || '',

      password:
        this.registerForm.controls.password.value || ''
    };

    this.isLoading = true;

    this.authService
      .register(payload)
      .pipe(
        finalize(() => {

          this.isLoading = false;
        })
      )
      .subscribe({

        next: (response) => {

          if (
            !response.success
          ) {

            this.toaster.error(
              response.message
            );

            return;
          }

          this.toaster.success(
            response.message
          );

          this.router.navigate(
            ['/login']
          );
        },

        error: (error) => {

          this.toaster.error(error?.error?.message || 'Unable to register'
          );
        }
      });
  }

  get f() {
    return this.registerForm.controls;
  }
}
