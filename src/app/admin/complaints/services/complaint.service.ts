import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Complaint {
  id?: number;
  subject: string;
  description: string;
  reporter_name?: string;
  reporter_email?: string;
  location?: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  created_at?: string;
  updated_at?: string;
}

@Injectable({ providedIn: 'root' })
export class ComplaintService {
  private readonly API = 'http://127.0.0.1:8000/api/complaints';

  constructor(private http: HttpClient) {}

  all(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(this.API);
  }

  show(id: number): Observable<Complaint> {
    return this.http.get<Complaint>(`${this.API}/${id}`);
  }

  updateStatus(id: number, status: string): Observable<Complaint> {
    return this.http.patch<Complaint>(`${this.API}/${id}/status`, { status });
  }

  delete(id: number) {
    return this.http.delete(`${this.API}/${id}`);
  }
}
