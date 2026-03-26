import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../enviroments/environment';
import { tap } from 'rxjs';

interface JwtPayload {
  userId: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  exp?: number;
  iat?: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUri}/auth`;

  private accessTokenSignal = signal<string | null>(localStorage.getItem('accessToken'));
  private userPayloadSignal = signal<JwtPayload | null>(
    this.decodeToken(localStorage.getItem('accessToken'))
  );

  isLoggedInSignal = computed(() => !!this.accessTokenSignal());
  userSignal = computed(() => this.userPayloadSignal());
  usernameSignal = computed(() => this.userPayloadSignal()?.username ?? null);
  emailSignal = computed(() => this.userPayloadSignal()?.email ?? null);
  roleSignal = computed(() => this.userPayloadSignal()?.role ?? null);
  isAdminSignal = computed(() => this.roleSignal() === 'admin');

  constructor(private http: HttpClient) {}

  register(data: { name: string; email: string; password: string }) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: { email: string; password: string }) {
    return this.http
      .post<{ accessToken: string }>(`${this.apiUrl}/login`, data)
      .pipe(
        tap(res => {
          localStorage.setItem('accessToken', res.accessToken);
          this.accessTokenSignal.set(res.accessToken);
          this.userPayloadSignal.set(this.decodeToken(res.accessToken));
        })
      );
  }

  logout() {
    localStorage.removeItem('accessToken');
    this.accessTokenSignal.set(null);
    this.userPayloadSignal.set(null);
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSignal();
  }

  getToken(): string | null {
    return this.accessTokenSignal();
  }

  getUserEmail(): string | null {
    return this.emailSignal();
  }

  getUsername(): string | null {
    return this.usernameSignal();
  }

  getRole(): string | null {
    return this.roleSignal();
  }

  isAdmin(): boolean {
    return this.isAdminSignal();
  }

  private decodeToken(token: string | null): JwtPayload | null {
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload as JwtPayload;
    } catch {
      return null;
    }
  }
}