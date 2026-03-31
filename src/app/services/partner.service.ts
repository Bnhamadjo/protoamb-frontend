import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../api-config';

export interface Partner {
  id?: number;
  name: string;
  url?: string;
  logo?: string;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
  private readonly API = `${API_BASE}/partners`;

  constructor(private http: HttpClient) {}

  all(): Observable<Partner[]> {
    return this.http.get<Partner[]>(this.API);
  }

  show(id: number): Observable<Partner> {
    return this.http.get<Partner>(`${this.API}/${id}`);
  }

  create(data: Partial<Partner>): Observable<Partner> {
    return this.http.post<Partner>(this.API, data);
  }

  update(id: number, data: Partial<Partner>): Observable<Partner> {
    return this.http.put<Partner>(`${this.API}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }
}
