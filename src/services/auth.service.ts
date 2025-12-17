import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../enviroments/environment';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUri}/auth`;

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
        })
      );
  }

  logout() {
    localStorage.removeItem('accessToken');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }
  getUserEmail(): string | null {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.email || null;
  } catch {
    return null;
  }
}

}
