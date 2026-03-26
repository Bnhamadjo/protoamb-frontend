import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

export interface BiodiversityItem {
  id?: number;
  type: 'fauna' | 'flora' | 'ecossistema';
  name: string;
  description?: string;
  image?: string;
}

import { API_BASE } from '../../../api-config';

@Injectable({ providedIn: 'root' })
export class BiodiversityService {
  private readonly API = API_BASE + '/biodiversity';

  constructor(private http: HttpClient) {}

  all(): Observable<BiodiversityItem[]> {
    return this.http.get<BiodiversityItem[]>(this.API).pipe(timeout(15000));
  }

  show(id: number): Observable<BiodiversityItem> {
    return this.http.get<BiodiversityItem>(`${this.API}/${id}`).pipe(timeout(15000));
  }

  create(data: BiodiversityItem): Observable<BiodiversityItem> {
    return this.http.post<BiodiversityItem>(this.API, data).pipe(timeout(15000));
  }

  update(id: number, data: BiodiversityItem): Observable<BiodiversityItem> {
    return this.http.put<BiodiversityItem>(`${this.API}/${id}`, data).pipe(timeout(15000));
  }

  delete(id: number) {
    return this.http.delete(`${this.API}/${id}`).pipe(timeout(15000));
  }
}
