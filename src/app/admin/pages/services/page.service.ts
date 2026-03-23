import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Page {
  id?: number;
  title: string;
  slug?: string;
  content: string;
  featured_image?: string | null;
  status: 'draft' | 'published';
  lang: 'pt' | 'fr' | 'en';
  parent_id?: number | null;
  created_at?: string;
  updated_at?: string;
}

import { API_BASE } from '../../../api-config';

@Injectable({ providedIn: 'root' })
export class PageService {
  private readonly API = API_BASE + '/pages';

  constructor(private http: HttpClient) {}

  all(): Observable<Page[]> {
    return this.http.get<Page[]>(this.API);
  }

  show(slug: string): Observable<Page> {
    return this.http.get<Page>(`${this.API}/${slug}`);
  }

  create(data: Page): Observable<Page> {
    return this.http.post<Page>(this.API, data);
  }

  update(id: number, data: Page): Observable<Page> {
    return this.http.put<Page>(`${this.API}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.API}/${id}`);
  }
}