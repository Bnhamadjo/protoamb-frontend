import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE } from '../api-config';

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
  private readonly API = API_BASE + '/upload/files';
  private readonly DELETE_API = API_BASE + '/upload/file';

  constructor(private http: HttpClient) {}

  all(): Observable<MediaFile[]> {
    return this.http.get<MediaFile[]>(this.API);
  }

  delete(path: string): Observable<any> {
    return this.http.delete(`${this.DELETE_API}?path=${encodeURIComponent(path)}`);
  }
}
