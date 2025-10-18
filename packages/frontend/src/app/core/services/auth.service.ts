/**
 * Authentication Service
 * Demonstrates: Angular 20 Signals, reactive state management, authentication
 */

import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

import { ApiService } from './api.service';

export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

/**
 * Authentication Service
 * Demonstrates: Angular 20 Signals for reactive state
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);

  // Signals for reactive state management
  private currentUserSignal = signal<User | null>(null);
  private isAuthenticatedSignal = signal<boolean>(false);

  // Computed signals
  currentUser = this.currentUserSignal.asReadonly();
  isAuthenticated = this.isAuthenticatedSignal.asReadonly();
  isAdmin = computed(() => this.currentUserSignal()?.role === 'admin');

  constructor() {
    this.checkAuthStatus();
  }

  /**
   * Check authentication status on init
   */
  private checkAuthStatus(): void {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');

    if (token && user) {
      this.currentUserSignal.set(JSON.parse(user));
      this.isAuthenticatedSignal.set(true);
    }
  }

  /**
   * Login user
   */
  login(email: string, password: string) {
    return this.api.post<AuthResponse>('/auth/login', { email, password }).pipe(
      tap((response) => {
        if (response.success) {
          this.setAuthData(response.data.user, response.data.tokens.accessToken);
        }
      })
    );
  }

  /**
   * Register new user
   */
  register(userData: { email: string; username: string; password: string }) {
    return this.api.post<AuthResponse>('/auth/register', userData).pipe(
      tap((response) => {
        if (response.success) {
          this.setAuthData(response.data.user, response.data.tokens.accessToken);
        }
      })
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
    this.router.navigate(['/login']);
  }

  /**
   * Set authentication data
   */
  private setAuthData(user: User, accessToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSignal.set(user);
    this.isAuthenticatedSignal.set(true);
  }
}

