import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';
import { API_BASE } from '../../../api-config';

export interface Equipa {
  id?: number;
  nome: string;
  descricao?: string;
  color_code?: string;
  users?: any[];
  created_at?: string;
  updated_at?: string;
}

@Injectable({ providedIn: 'root' })
export class TeamService {
  private readonly API = API_BASE + '/equipas';

  constructor(private http: HttpClient) {}

  all(): Observable<Equipa[]> {
    return this.http.get<Equipa[]>(this.API).pipe(timeout(10000));
  }

  show(id: number): Observable<Equipa> {
    return this.http.get<Equipa>(`${this.API}/${id}`).pipe(timeout(10000));
  }

  create(data: Partial<Equipa>): Observable<Equipa> {
    return this.http.post<Equipa>(this.API, data).pipe(timeout(10000));
  }

  update(id: number, data: Partial<Equipa>): Observable<Equipa> {
    return this.http.put<Equipa>(`${this.API}/${id}`, data).pipe(timeout(10000));
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`).pipe(timeout(10000));
  }

  addMember(teamId: number, userId: number, papel: string = 'tecnico'): Observable<any> {
    return this.http.post(`${this.API}/${teamId}/members`, { user_id: userId, papel }).pipe(timeout(10000));
  }

  removeMember(teamId: number, userId: number): Observable<any> {
    return this.http.delete(`${this.API}/${teamId}/members/${userId}`).pipe(timeout(10000));
  }
}
