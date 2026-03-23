import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MediaFile {
  id?: number;
  url: string;
  path: string;
  name: string;
  size?: number;
  type?: string;
  created_at?: string;
}

@Injectable({ providedIn: 'root' })
export class MediaService {
  private readonly API = 'http://127.0.0.1:8000/api/upload/files';
  private readonly DELETE_API = 'http://127.0.0.1:8000/api/upload/file';

  constructor(private http: HttpClient) {}

  all(): Observable<MediaFile[]> {
    return this.http.get<MediaFile[]>(this.API);
  }

  delete(path: string): Observable<any> {
    return this.http.delete(`${this.DELETE_API}?path=${encodeURIComponent(path)}`);
  }
}
