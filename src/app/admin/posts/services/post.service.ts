import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Post {
  id?: number;
  title: string;
  slug?: string;
  body: string;
  excerpt?: string;
  featured_image?: string | null;
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
    return this.http.get<Post[]>(this.API);
  }

  show(slug: string): Observable<Post> {
    return this.http.get<Post>(`${this.API}/${slug}`);
  }

  create(data: Post): Observable<Post> {
    return this.http.post<Post>(this.API, data);
  }

  update(id: number, data: Post): Observable<Post> {
    return this.http.put<Post>(`${this.API}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.API}/${id}`);
  }
}
