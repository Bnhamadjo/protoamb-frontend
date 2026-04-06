import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, timeout } from 'rxjs/operators';

import { API_BASE } from '../../../api-config';

export interface AreaItem {
  id?: number;
  name: string;
  location?: string;
  description: string;
  image_url?: string | null;
  surface_area?: string;
  status: 'active' | 'inactive';
}

@Injectable({ providedIn: 'root' })
export class AreaService {
  private readonly API = API_BASE + '/areas';

  constructor(private http: HttpClient) {}

  all(): Observable<AreaItem[]> {
    return this.http.get<any[]>(this.API).pipe(
      timeout(30000),
      map(items => items.map(item => this.fromApi(item)))
    );
  }

  show(id: number): Observable<AreaItem> {
    return this.http.get<any>(`${this.API}/${id}`).pipe(
      timeout(30000),
      map(item => this.fromApi(item))
    );
  }

  create(data: AreaItem): Observable<AreaItem> {
    return this.http.post<any>(this.API, this.toApi(data)).pipe(
      timeout(30000),
      map(item => this.fromApi(item))
    );
  }

  update(id: number, data: AreaItem): Observable<AreaItem> {
    return this.http.put<any>(`${this.API}/${id}`, this.toApi(data)).pipe(
      timeout(30000),
      map(item => this.fromApi(item))
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.API}/${id}`).pipe(timeout(30000));
  }

  private fromApi(item: any): AreaItem {
    return {
      id: item.id,
      name: item.name,
      location: item.location || '',
      description: item.description || '',
      image_url: item.image || null,
      surface_area: item.surface_area || '',
      status: item.status || 'active'
    };
  }

  private toApi(data: AreaItem): any {
    return {
      name: data.name,
      location: data.location,
      description: data.description,
      image: data.image_url
    };
  }
}
