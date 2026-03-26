import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

export interface Post {
  id?: number;
  title: string;
  slug?: string;
  body: string;
  excerpt?: string;
  featured_image?: string | null;
  document_file?: string | null;
  document_label?: string | null;
  status: 'draft' | 'published';
  category_id?: number;
  page_id?: number;
  lang?: string;
  created_at?: string;
  updated_at?: string;
}

import { API_BASE } from '../../../api-config';

@Injectable({ providedIn: 'root' })
export class PostService {
  private readonly API = API_BASE + '/posts';

  constructor(private http: HttpClient) {}

  all(): Observable<Post[]> {
    return this.http.get<Post[]>(this.API).pipe(timeout(15000));
  }

  show(slug: string): Observable<Post> {
    return this.http.get<Post>(`${this.API}/${slug}`).pipe(timeout(15000));
  }

  create(data: Post): Observable<Post> {
    return this.http.post<Post>(this.API, data).pipe(timeout(15000));
  }

  update(id: number, data: Post): Observable<Post> {
    return this.http.put<Post>(`${this.API}/${id}`, data).pipe(timeout(15000));
  }

  delete(id: number) {
    return this.http.delete(`${this.API}/${id}`).pipe(timeout(15000));
  }
}
