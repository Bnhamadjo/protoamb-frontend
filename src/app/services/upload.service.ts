import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UploadResponse {
  url: string;
  path: string;
}

import { API_BASE } from '../api-config';

@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly API = API_BASE + '/upload/image';
  private readonly DOCUMENT_API = API_BASE + '/upload/document';

  constructor(private http: HttpClient) {}

  upload(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<UploadResponse>(this.API, formData);
  }

  uploadDocument(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<UploadResponse>(this.DOCUMENT_API, formData);
  }
}
