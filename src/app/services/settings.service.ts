import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SiteSettings {
  site_name?: string;
  logo_header?: string;
  logo_footer?: string;
  active_languages?: string[]; // Will be parsed from JSON in string
}

import { API_BASE } from '../api-config';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly API = API_BASE + '/settings';

  constructor(private http: HttpClient) {}

  getSettings(): Observable<any> {
    return this.http.get<any>(this.API);
  }

  updateSettings(settings: any): Observable<any> {
    return this.http.post<any>(this.API, settings);
  }
}
