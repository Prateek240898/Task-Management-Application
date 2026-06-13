import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/api/auth.service';
import { UserStateService } from '../../../core/services/user-state/user-state.service';
import { ToasterService } from '../../../core/services/toaster/toaster.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { LoginRequest } from '../../../core/models/login.model';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    LoaderComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private userStateService = inject(UserStateService);
  private toasterService = inject(ToasterService);
  private router = inject(Router);
  hidePassword = true;
  isLoading = false;
  loginForm = new FormGroup({
    loginId: new FormControl(
      '',
      [
        Validators.required,
        Validators.maxLength(255),
        Validators.pattern(/^\S+$/)
      ]
    ),
    password: new FormControl(
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(50),
        Validators.pattern(/^\S+$/)
      ]
    )
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.toasterService.warning('Please fill all required fields correctly.');
      return;
    }

    const payload = this.loginForm.getRawValue() as LoginRequest;
    this.isLoading = true;

    this.authService.login(payload)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (!response.success) {
            this.toasterService.error(response.message);
            return;
          }

          this.userStateService.setUser(response.data);
          this.toasterService.success(response.message);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.log(error);
          this.toasterService.error(error?.error?.message || 'Unable to login.');
          return;
        }
      });
  }

  get loginId() {
    return this.loginForm.controls.loginId;
  }

  get password() {
    return this.loginForm.controls.password;
  }
}
