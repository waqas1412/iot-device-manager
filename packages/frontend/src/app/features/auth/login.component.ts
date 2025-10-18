/**
 * Login Component
 * Demonstrates: Reactive forms, authentication flow
 */

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1>IoT Device Manager</h1>
        <h2>Login</h2>

        @if (error()) {
          <div class="error-message">{{ error() }}</div>
        }

        <form (ngSubmit)="login()">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              [(ngModel)]="email"
              name="email"
              required
              placeholder="Enter your email"
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              [(ngModel)]="password"
              name="password"
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" class="btn-login" [disabled]="loading()">
            {{ loading() ? 'Logging in...' : 'Login' }}
          </button>
        </form>

        <p class="register-link">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .login-card {
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      width: 100%;
      max-width: 400px;
    }

    h1 {
      margin: 0 0 10px 0;
      color: #2c3e50;
      font-size: 24px;
      text-align: center;
    }

    h2 {
      margin: 0 0 30px 0;
      color: #7f8c8d;
      font-size: 18px;
      text-align: center;
      font-weight: normal;
    }

    .error-message {
      background: #fee;
      color: #c33;
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 20px;
      font-size: 14px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      color: #2c3e50;
      font-weight: 500;
    }

    input {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
    }

    input:focus {
      outline: none;
      border-color: #667eea;
    }

    .btn-login {
      width: 100%;
      padding: 14px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 10px;
    }

    .btn-login:hover:not(:disabled) {
      background: #5568d3;
    }

    .btn-login:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .register-link {
      text-align: center;
      margin-top: 20px;
      color: #7f8c8d;
    }

    .register-link a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }

    .register-link a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  login() {
    if (!this.email || !this.password) {
      this.error.set('Please enter email and password');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error.set(err.error?.error?.message || 'Login failed');
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }
}

