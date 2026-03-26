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
      tap((res: any) => localStorage.setItem('token', res.token))
    );
  }

  getToken()   { return localStorage.getItem('token'); }
  getUser()    { 
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch {
      return null;
    }
  }
  isLogged()   { return !!this.getToken(); }
  logout()     { localStorage.removeItem('token'); }
}