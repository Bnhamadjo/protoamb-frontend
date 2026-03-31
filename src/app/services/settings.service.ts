import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, timeout, catchError, shareReplay } from 'rxjs/operators';

import { API_BASE } from '../api-config';

export interface HomeActionCard {
  icon: string;
  title: string;
  subtitle: string;
  link: string;
  image?: string;
}

export interface HomeSliderItem {
  title: string;
  subtitle: string;
  image: string;
}

export interface PlatformModuleItem {
  name: string;
  summary: string;
  link: string;
  audience?: string;
  status?: 'active' | 'pilot' | 'planned';
}

export interface DepartmentItem {
  name: string;
  summary: string;
  focus: string;
  link: string;
}

export interface GalleryItem {
  url: string;
  caption?: string;
}

export interface HubStats {
  label1?: string; value1?: number | string;
  label2?: string; value2?: number | string;
  label3?: string; value3?: number | string;
  label4?: string; value4?: number | string;
}

export interface MapMarker {
  lat: number;
  lng: number;
  title: string;
  description?: string;
  type: 'furo' | 'basin' | 'station' | 'project';
}

export interface SiteSettings {
  site_name?: string;
  logo_header?: string;
  logo_footer?: string;
  logo_admin?: string;
  active_languages?: string[];
  home_slider?: HomeSliderItem[];
  home_action_cards?: HomeActionCard[];
  about_section_title?: string;
  about_section_text?: string;
  about_section_button_text?: string;
  about_section_button_link?: string;
  about_section_image?: string;
  platform_tagline?: string;
  platform_summary?: string;
  platform_cta_text?: string;
  platform_cta_link?: string;
  target_audiences?: string[];
  solution_modules?: PlatformModuleItem[];
  state_departments?: DepartmentItem[];
  home_gallery?: GalleryItem[];
  map_markers?: MapMarker[];
  // Hub-specific editable stats
  water_hub_stats?: HubStats;
  agriculture_hub_stats?: HubStats;
}

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly API = API_BASE + '/settings';
  private settings$?: Observable<SiteSettings>;

  constructor(private http: HttpClient) {}

  getSettings(): Observable<SiteSettings> {
    if (!this.settings$) {
      this.settings$ = this.http.get<Record<string, any>>(this.API).pipe(
        timeout(30000),
        map((settings) => this.normalizeSettings(settings)),
        shareReplay(1),
        catchError(err => {
          console.error('Settings fetch error:', err);
          this.settings$ = undefined;
          return of({});
        })
      );
    }

    return this.settings$;
  }

  updateSettings(settings: Partial<SiteSettings>): Observable<any> {
    return this.http.post<any>(this.API, settings).pipe(timeout(30000));
  }

  clearCache(): void {
    this.settings$ = undefined;
  }

  private normalizeSettings(settings: Record<string, any>): SiteSettings {
    return {
      ...settings,
      active_languages: this.parseJsonArray<string>(settings['active_languages'], ['pt']),
      home_slider: this.parseJsonArray<HomeSliderItem>(settings['home_slider'], []),
      home_action_cards: this.parseJsonArray<HomeActionCard>(settings['home_action_cards'], []),
      target_audiences: this.parseJsonArray<string>(settings['target_audiences'], []),
      solution_modules: this.parseJsonArray<PlatformModuleItem>(settings['solution_modules'], []),
      state_departments: this.parseJsonArray<DepartmentItem>(settings['state_departments'], []),
      home_gallery: this.parseJsonArray<GalleryItem>(settings['home_gallery'], []),
      map_markers: this.parseJsonArray<MapMarker>(settings['map_markers'], []),
      water_hub_stats: this.parseJsonObject<HubStats>(settings['water_hub_stats'], {}),
      agriculture_hub_stats: this.parseJsonObject<HubStats>(settings['agriculture_hub_stats'], {}),
    };
  }

  private parseJsonObject<T>(value: unknown, fallback: T): T {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return value as T;
    }
    if (typeof value === 'string' && value.trim()) {
      try {
        const parsed = JSON.parse(value);
        return (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) ? parsed as T : fallback;
      } catch {
        return fallback;
      }
    }
    return fallback;
  }

  private parseJsonArray<T>(value: unknown, fallback: T[]): T[] {
    if (Array.isArray(value)) {
      return value as T[];
    }

    if (typeof value === 'string' && value.trim()) {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed as T[] : fallback;
      } catch {
        return fallback;
      }
    }

    return fallback;
  }
}
