import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../api-config';

export interface ChemicalProduct {
  id?: number;
  name: string;
  classification?: string;
  manufacturer?: string;
  quantity: number;
  unit: string;
  expiry_date?: string;
  risk_level: 'low' | 'medium' | 'high' | 'extreme';
  sds_path?: string;
  location?: string;
  notes?: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChemicalProductService {
  private apiUrl = `${API_BASE}/chemicals`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<ChemicalProduct[]> {
    return this.http.get<ChemicalProduct[]>(this.apiUrl);
  }

  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }

  get(id: number): Observable<ChemicalProduct> {
    return this.http.get<ChemicalProduct>(`${this.apiUrl}/${id}`);
  }

  create(data: ChemicalProduct): Observable<ChemicalProduct> {
    return this.http.post<ChemicalProduct>(this.apiUrl, data);
  }

  update(id: number, data: Partial<ChemicalProduct>): Observable<ChemicalProduct> {
    return this.http.put<ChemicalProduct>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
