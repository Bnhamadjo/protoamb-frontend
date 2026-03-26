import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

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
    return this.http.get<Page[]>(this.API).pipe(timeout(15000));
  }

  show(slug: string): Observable<Page> {
    return this.http.get<Page>(`${this.API}/${slug}`).pipe(timeout(15000));
  }

  create(data: Page): Observable<Page> {
    return this.http.post<Page>(this.API, data).pipe(timeout(15000));
  }

  update(id: number, data: Page): Observable<Page> {
    return this.http.put<Page>(`${this.API}/${id}`, data).pipe(timeout(15000));
  }

  delete(id: number) {
    return this.http.delete(`${this.API}/${id}`).pipe(timeout(15000));
  }
}
