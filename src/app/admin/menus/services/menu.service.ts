import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MenuItem {
  id?: number;
  label: string;
  url?: string;
  slug?: string;
  order: number;
  parent_id?: number | null;
  children?: MenuItem[];
}

export interface Menu {
  id?: number;
  name: string;
  location: string;
  lang: string;
  items?: MenuItem[];
}

import { API_BASE } from '../../../api-config';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private readonly API = API_BASE + '/menus';

  constructor(private http: HttpClient) {}

  all(params?: { lang?: string, location?: string }): Observable<Menu[]> {
    return this.http.get<Menu[]>(this.API, { params });
  }

  show(id: number): Observable<Menu> {
    return this.http.get<Menu>(`${this.API}/${id}`);
  }

  create(data: Partial<Menu>): Observable<Menu> {
    return this.http.post<Menu>(this.API, data);
  }

  update(id: number, data: Partial<Menu>): Observable<Menu> {
    return this.http.put<Menu>(`${this.API}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.API}/${id}`);
  }

  updateItems(menuId: number, items: MenuItem[]): Observable<any> {
    return this.http.post(`${this.API}/${menuId}/items`, { items });
  }
}
