import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../api-config';

export interface TrafficStats {
  history: any[];
  today: {
    hits: number;
    uniques: number;
  };
}

export interface ActivityLog {
  id: number;
  causer_name: string;
  action: string;
  description: string;
  created_at: string;
  user?: {
    name: string;
    email: string;
  };
  ip_address: string;
}

export interface PaginatedActivities {
  data: ActivityLog[];
  total: number;
  current_page: number;
  last_page: number;
}

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  constructor(private http: HttpClient) {}

  getTraffic(): Observable<TrafficStats> {
    return this.http.get<TrafficStats>(`${API_BASE}/stats/traffic`);
  }

  getActivities(params?: any): Observable<PaginatedActivities> {
    return this.http.get<PaginatedActivities>(`${API_BASE}/stats/activities`, { params });
  }
}
