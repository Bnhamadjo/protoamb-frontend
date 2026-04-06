import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../api-config';

export interface DataSchema {
  id: string;
  name: string;
  table: string;
  fields: Array<{
    name: string;
    label: string;
    type: string;
  }>;
}

export interface DataResource {
  id?: number;
  title: string;
  type: 'internal' | 'external' | 'custom';
  source: string;
  configuration: any;
  category?: string;
  icon?: string;
  created_by?: number;
  is_public: boolean;
  creator?: { id: number; name: string };
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExplorerService {
  private apiUrl = `${API_BASE}/explorer`;

  constructor(private http: HttpClient) { }

  getSchemas(): Observable<DataSchema[]> {
    return this.http.get<DataSchema[]>(`${this.apiUrl}/schemas`);
  }

  getResources(): Observable<DataResource[]> {
    return this.http.get<DataResource[]>(this.apiUrl);
  }

  getResourceData(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/data`);
  }

  previewData(source: string, configuration: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/preview`, { source, configuration });
  }

  saveResource(resource: DataResource): Observable<DataResource> {
    return this.http.post<DataResource>(this.apiUrl, resource);
  }

  shareResource(id: number, permissions: { user_ids?: number[], equipa_ids?: number[], is_public?: boolean }): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/share`, permissions);
  }

  deleteResource(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  exportData(id: number, format: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/export/${format}`, { responseType: 'blob' });
  }
}
