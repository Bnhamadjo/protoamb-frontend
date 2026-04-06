import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, timeout } from 'rxjs/operators';

import { API_BASE } from '../../../api-config';

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
  private readonly API = API_BASE + '/denuncias';

  constructor(private http: HttpClient) {}

  all(): Observable<Complaint[]> {
    return this.http.get<any[]>(this.API).pipe(
      timeout(30000),
      map(items => items.map(item => this.fromApi(item)))
    );
  }

  show(id: number): Observable<Complaint> {
    return this.http.get<any>(`${this.API}/${id}`).pipe(
      timeout(30000),
      map(item => this.fromApi(item))
    );
  }

  updateStatus(id: number, status: string): Observable<Complaint> {
    return this.http.put<any>(`${this.API}/${id}`, {
      status: this.toApiStatus(status)
    }).pipe(
      timeout(30000),
      map(item => this.fromApi(item))
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.API}/${id}`).pipe(timeout(30000));
  }

  private fromApi(item: any): Complaint {
    return {
      id: item.id,
      subject: item.tipo_infracao || 'Denuncia sem titulo',
      description: item.descricao || '',
      reporter_name: item.nome || '',
      reporter_email: item.contato || '',
      location: item.local || '',
      status: this.fromApiStatus(item.status),
      created_at: item.created_at,
      updated_at: item.updated_at
    };
  }

  private fromApiStatus(status: string): Complaint['status'] {
    switch (status) {
      case 'em analise':
        return 'investigating';
      case 'resolvido':
        return 'resolved';
      case 'arquivado':
        return 'dismissed';
      case 'pendente':
      default:
        return 'pending';
    }
  }

  private toApiStatus(status: string): string {
    switch (status) {
      case 'investigating':
        return 'em analise';
      case 'resolved':
        return 'resolvido';
      case 'dismissed':
        return 'arquivado';
      case 'pending':
      default:
        return 'pendente';
    }
  }
}
