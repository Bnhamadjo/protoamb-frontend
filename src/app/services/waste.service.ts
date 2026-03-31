import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../api-config';

export interface Transporter {
  id?: number;
  name: string;
  license_number?: string;
  vehicle_plate?: string;
  contact?: string;
  is_active?: boolean;
}

export interface WasteRecord {
  id?: number;
  category: string;
  quantity: number;
  unit: string;
  production_date: string;
  origin?: string;
  notes?: string;
  status?: string;
  transporter_id?: number;
  transporter?: Transporter;
  manifest_token?: string;
  created_at?: string;
}

export interface WasteStat {
  category: string;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class WasteService {
  private apiUrl = `${API_BASE}/waste-records`;
  private transporterUrl = `${API_BASE}/transporters`;

  constructor(private http: HttpClient) {}

  // Records
  all(): Observable<WasteRecord[]> {
    return this.http.get<WasteRecord[]>(this.apiUrl);
  }

  show(id: number): Observable<WasteRecord> {
    return this.http.get<WasteRecord>(`${this.apiUrl}/${id}`);
  }

  create(data: WasteRecord): Observable<WasteRecord> {
    return this.http.post<WasteRecord>(this.apiUrl, data);
  }

  update(id: number, data: Partial<WasteRecord>): Observable<WasteRecord> {
    return this.http.put<WasteRecord>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getStats(): Observable<WasteStat[]> {
    return this.http.get<WasteStat[]>(`${this.apiUrl}/stats`);
  }

  generateManifest(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/manifest`, {});
  }

  // Transporters
  getTransporters(): Observable<Transporter[]> {
    return this.http.get<Transporter[]>(this.transporterUrl);
  }

  createTransporter(data: Transporter): Observable<Transporter> {
    return this.http.post<Transporter>(this.transporterUrl, data);
  }

  updateTransporter(id: number, data: Partial<Transporter>): Observable<Transporter> {
    return this.http.put<Transporter>(`${this.transporterUrl}/${id}`, data);
  }

  deleteTransporter(id: number): Observable<void> {
    return this.http.delete<void>(`${this.transporterUrl}/${id}`);
  }
}
