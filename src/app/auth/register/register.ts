import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIcon,
    MatSnackBarModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

    ngOnInit(): void {
    this.registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    username: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(/^[a-zA-Z0-9_]+$/)
    ]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+\s()-]{7,15}$/)]],
    dateOfBirth: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
}


  get name() {
    return this.registerForm.get('name');
  }
  get username() {
  return this.registerForm.get('username');
  }


  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

    get phone() {
    return this.registerForm.get('phone');
  }

  get dateOfBirth() {
    return this.registerForm.get('dateOfBirth');
  }


  register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.snackBar.open('Please fix all validation errors', 'Close', {
        duration: 3000
      });
      return;
    }

    this.auth.register(this.registerForm.value).subscribe({
      next: () => {
        this.snackBar.open('Registration successful! Please login.', 'Close', {
          duration: 3000
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        if (err.error?.message?.toLowerCase().includes('exists')) {
          this.snackBar.open('Email already exists', 'Close', {
            duration: 4000
          });
        } else {
          this.snackBar.open('Registration failed', 'Close', {
            duration: 4000
          });
        }
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/recipes']);
  }
}
