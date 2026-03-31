import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../api-config';

export interface ApiToken {
  id: number;
  name: string;
  last_used_at: string | null;
  created_at: string;
  token?: string; // For creation response
  plainTextToken?: string; 
}

@Injectable({
  providedIn: 'root'
})
export class IntegrationService {
  private apiUrl = `${API_BASE}/api-tokens`;

  constructor(private http: HttpClient) { }

  getTokens(): Observable<ApiToken[]> {
    return this.http.get<ApiToken[]>(this.apiUrl);
  }

  createToken(name: string): Observable<ApiToken> {
    return this.http.post<ApiToken>(this.apiUrl, { token_name: name });
  }

  deleteToken(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
