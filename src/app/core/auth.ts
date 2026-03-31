// src/app/core/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { API_BASE } from '../api-config';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API = API_BASE;

  constructor(private http: HttpClient) {}

  login(data: { email: string; password: string }) {
    // NADA de headers manuais aqui
    return this.http.post(`${this.API}/login`, data).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
      })
    );
  }

  getToken()   { return localStorage.getItem('token'); }
  getUser()    { 
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }

  hasRole(roles: string[]): boolean {
    const user = this.getUser();
    return user && roles.includes(user.role);
  }

  isLogged()   { return !!this.getToken(); }
  
  logout() { 
    this.http.post(`${this.API}/logout`, {}).subscribe({
      next: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      },
      error: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    });
  }
}