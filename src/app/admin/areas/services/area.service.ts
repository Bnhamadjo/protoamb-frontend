import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private readonly API = 'http://127.0.0.1:8000/api/areas';

  constructor(private http: HttpClient) {}

  all(): Observable<AreaItem[]> {
    return this.http.get<AreaItem[]>(this.API);
  }

  show(id: number): Observable<AreaItem> {
    return this.http.get<AreaItem>(`${this.API}/${id}`);
  }

  create(data: AreaItem): Observable<AreaItem> {
    return this.http.post<AreaItem>(this.API, data);
  }

  update(id: number, data: AreaItem): Observable<AreaItem> {
    return this.http.put<AreaItem>(`${this.API}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.API}/${id}`);
  }
}
