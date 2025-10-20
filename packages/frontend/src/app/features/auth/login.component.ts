/**
 * Login Component
 * Demonstrates: Reactive forms, authentication flow
 */

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { CardComponent } from '../../shared/components/card/card.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, InputComponent, CardComponent],
  template: `
    <div class="login-container">
      <div class="login-background">
        <div class="floating-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
        </div>
      </div>
      
      <app-card class="login-card" [glass]="true" [glow]="true">
        <div class="login-header">
          <div class="logo">
            <div class="logo-icon">⚡</div>
            <h1 class="gradient-text">IoT Nexus</h1>
          </div>
          <p class="login-subtitle">Connect to the future of device management</p>
        </div>

        @if (error()) {
          <div class="error-message">
            <div class="error-icon">⚠</div>
            {{ error() }}
          </div>
        }

        <form (ngSubmit)="login()" class="login-form">
          <app-input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            [(ngModel)]="email"
            name="email"
            [error]="error() ? 'Invalid credentials' : null"
            required
          />

          <app-input
            label="Password"
            type="password"
            placeholder="Enter your password"
            [(ngModel)]="password"
            name="password"
            [error]="error() ? 'Invalid credentials' : null"
            required
          />

          <app-button
            type="submit"
            variant="default"
            size="lg"
            [loading]="loading()"
            [disabled]="loading()"
            class="login-button"
          >
            {{ loading() ? 'Authenticating...' : 'Access Dashboard' }}
          </app-button>
        </form>

        <div class="login-footer">
          <p class="register-link">
            New to IoT Nexus? <a href="/register" class="gradient-text">Create Account</a>
          </p>
        </div>
      </app-card>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      position: relative;
      overflow: hidden;
    }

    .login-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: 
        radial-gradient(circle at 20% 80%, hsl(142.1 76.2% 36.3% / 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, hsl(280 100% 70% / 0.15) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, hsl(200 100% 50% / 0.1) 0%, transparent 50%);
      z-index: -1;
    }

    .floating-shapes {
      position: absolute;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .shape {
      position: absolute;
      border-radius: 50%;
      background: var(--gradient-primary);
      opacity: 0.1;
      animation: float 6s ease-in-out infinite;
    }

    .shape-1 {
      width: 80px;
      height: 80px;
      top: 20%;
      left: 10%;
      animation-delay: 0s;
    }

    .shape-2 {
      width: 120px;
      height: 120px;
      top: 60%;
      right: 15%;
      animation-delay: 2s;
    }

    .shape-3 {
      width: 60px;
      height: 60px;
      bottom: 20%;
      left: 20%;
      animation-delay: 4s;
    }

    .login-card {
      width: 100%;
      max-width: 420px;
      padding: 2.5rem;
      position: relative;
      z-index: 1;
    }

    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
    }

    .logo-icon {
      font-size: 2rem;
      animation: pulse 2s ease-in-out infinite;
    }

    .login-subtitle {
      color: hsl(var(--muted-foreground));
      font-size: 0.875rem;
      margin: 0;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: hsl(var(--destructive) / 0.1);
      color: hsl(var(--destructive));
      padding: 0.75rem;
      border-radius: var(--radius);
      margin-bottom: 1.5rem;
      font-size: 0.875rem;
      border: 1px solid hsl(var(--destructive) / 0.2);
    }

    .error-icon {
      font-size: 1rem;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .login-button {
      width: 100%;
      margin-top: 0.5rem;
    }

    .login-footer {
      text-align: center;
    }

    .register-link {
      color: hsl(var(--muted-foreground));
      font-size: 0.875rem;
      margin: 0;
    }

    .register-link a {
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .register-link a:hover {
      text-shadow: 0 0 10px hsl(var(--primary) / 0.5);
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px) rotate(0deg);
      }
      33% {
        transform: translateY(-20px) rotate(120deg);
      }
      66% {
        transform: translateY(10px) rotate(240deg);
      }
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        opacity: 0.8;
      }
      50% {
        transform: scale(1.1);
        opacity: 1;
      }
    }

    /* Responsive design */
    @media (max-width: 480px) {
      .login-card {
        padding: 1.5rem;
        margin: 1rem;
      }
      
      .logo {
        flex-direction: column;
        gap: 0.5rem;
      }
      
      .logo-icon {
        font-size: 1.5rem;
      }
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

