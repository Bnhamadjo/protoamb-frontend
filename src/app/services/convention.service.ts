import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../api-config';

export interface Convention {
  id?: number;
  title: string;
  description?: string;
  document_url?: string;
  signed_at?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConventionService {
  private readonly API = `${API_BASE}/conventions`;

  constructor(private http: HttpClient) {}

  all(): Observable<Convention[]> {
    return this.http.get<Convention[]>(this.API);
  }

  show(id: number): Observable<Convention> {
    return this.http.get<Convention>(`${this.API}/${id}`);
  }

  create(data: Partial<Convention>): Observable<Convention> {
    return this.http.post<Convention>(this.API, data);
  }

  update(id: number, data: Partial<Convention>): Observable<Convention> {
    return this.http.put<Convention>(`${this.API}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }
}
