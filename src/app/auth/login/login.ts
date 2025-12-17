import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.auth.login(this.loginForm.value).subscribe({
      next: () => {
        this.snackBar.open('Login successful', 'Close', { duration: 3000 });
        this.router.navigate(['/recipes']);
      },
      error: () => {
        this.snackBar.open('Invalid email or password', 'Close', { duration: 4000 });
      }
    });
  }
}
