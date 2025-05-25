import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SignupRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  email: string;
  email_confirmed_at: string | null;
  id: string;
}

export interface Session {
  access_token: string | null;
  refresh_token: string | null;
  expires_at?: number;
}

export interface AuthResponse {
  message: string;
  session: Session;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  signup(request: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}signup`, request);
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}login`, request);
  }

  saveSession(response: AuthResponse): void {
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('session', JSON.stringify(response.session));
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getSession(): Session | null {
    const session = localStorage.getItem('session');
    return session ? JSON.parse(session) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }


  isLoggedIn(): boolean {
    return !!this.getCurrentUser() && !!this.getSession()?.access_token;
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('session');
  }
}
