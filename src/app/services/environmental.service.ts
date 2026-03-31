import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../api-config';

export interface EnvironmentalMetric {
  id?: number;
  type: 'air' | 'water' | 'climate';
  parameter: string;
  value: number;
  unit: string;
  location?: string;
  sensor_id?: string;
  status: 'normal' | 'warning' | 'critical';
  recorded_at: string;
}

export interface QualityStats {
  latest: EnvironmentalMetric[];
  summary: {
    total: number;
    warning: number;
    critical: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class EnvironmentalService {
  private apiUrl = `${API_BASE}/environmental-metrics`;

  constructor(private http: HttpClient) {}

  all(params?: any): Observable<any> {
    return this.http.get(this.apiUrl, { params });
  }

  getStats(): Observable<QualityStats> {
    return this.http.get<QualityStats>(`${this.apiUrl}/stats`);
  }

  create(data: EnvironmentalMetric): Observable<EnvironmentalMetric> {
    return this.http.post<EnvironmentalMetric>(this.apiUrl, data);
  }

  show(id: number): Observable<EnvironmentalMetric> {
    return this.http.get<EnvironmentalMetric>(`${this.apiUrl}/${id}`);
  }

  update(id: number, data: Partial<EnvironmentalMetric>): Observable<EnvironmentalMetric> {
    return this.http.put<EnvironmentalMetric>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
