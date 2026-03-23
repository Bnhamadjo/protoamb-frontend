import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  id?: number;
  name: string;
  slug?: string;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly API = 'http://127.0.0.1:8000/api/categories';

  constructor(private http: HttpClient) {}

  all(): Observable<Category[]> {
    return this.http.get<Category[]>(this.API);
  }

  show(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.API}/${id}`);
  }

  create(data: Category): Observable<Category> {
    return this.http.post<Category>(this.API, data);
  }

  update(id: number, data: Category): Observable<Category> {
    return this.http.put<Category>(`${this.API}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.API}/${id}`);
  }
}
