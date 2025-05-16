import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../../models/auth-response';

const LOCAL_STORAGE_TOKEN_KEY = 'token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = `${environment.baseUrl}/Auth`;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.authUrl}/login`, {
        username,
        password,
      })
      .pipe(
        tap((response: AuthResponse) => {
          this.setToken(response.token);
        })
      );
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
  }
}
