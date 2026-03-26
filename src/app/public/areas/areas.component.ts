import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, of } from 'rxjs';

import { API_BASE } from '../../api-config';

@Component({
  standalone: true,
  selector: 'app-public-areas',
  imports: [CommonModule],
  template: `
    <div class="page-header areas-hero">
      <div class="container">
        <h1>Areas Protegidas</h1>
        <p>Conheca os parques, reservas e paisagens naturais protegidas da Guine-Bissau.</p>
      </div>
    </div>

    <div class="container areas-layout">
      <div *ngIf="loading" class="muted center" style="padding: 60px">A carregar areas protegidas...</div>

      <div *ngIf="!loading && error" class="empty-state card">
        <h3>Falha ao carregar</h3>
        <p>{{ error }}</p>
      </div>

      <div class="grid-areas" *ngIf="!loading && !error && areas.length > 0">
        <article class="area-card card" *ngFor="let area of areas">
          <div class="area-image" [style.backgroundImage]="'url(' + (area.image || fallbackImage) + ')'"></div>
          <div class="area-content">
            <div class="area-location" *ngIf="area.location">{{ area.location }}</div>
            <h2>{{ area.name }}</h2>
            <p>{{ getPreview(area.description) }}</p>
          </div>
        </article>
      </div>

      <div *ngIf="!loading && !error && areas.length === 0" class="empty-state card">
        <h3>Sem areas publicadas ainda</h3>
        <p>As areas protegidas vao aparecer aqui assim que forem adicionadas no portal.</p>
      </div>
    </div>
  `,
  styles: [`
    .areas-hero { background: linear-gradient(135deg, #163520 0%, #2f6841 100%); color: #fff; padding: 60px 0; margin-bottom: 40px; }
    .areas-layout { padding-bottom: 20px; }
    .grid-areas { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
    .area-card { overflow: hidden; }
    .area-image { height: 220px; background-size: cover; background-position: center; }
    .area-content { padding: 24px; }
    .area-location { color: var(--brand); font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 10px; }
    .area-content h2 { margin: 0 0 12px; font-size: 1.4rem; color: var(--ink); }
    .area-content p { margin: 0; line-height: 1.7; color: var(--ink-muted); }
    .empty-state { padding: 40px 30px; text-align: center; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
  `]
})
export class PublicAreasComponent implements OnInit {
  fallbackImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 600'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='%231c3a24'/><stop offset='1' stop-color='%23558b5d'/></linearGradient></defs><rect width='1200' height='600' fill='url(%23g)'/><path d='M0 420 C180 360 320 470 500 410 S860 350 1200 430 V600 H0 Z' fill='%23ffffff22'/><text x='70' y='110' font-size='44' font-family='Arial' fill='white'>Areas Protegidas</text></svg>";
  areas: any[] = [];
  loading = true;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>(`${API_BASE}/areas`).pipe(
      catchError(() => {
        this.error = 'Nao foi possivel carregar as areas protegidas agora.';
        return of([]);
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe((res) => {
      this.areas = Array.isArray(res) ? res : [];
    });
  }

  getPreview(description?: string): string {
    const plain = this.toPlainText(description || '');
    if (!plain) {
      return 'Descricao indisponivel no momento.';
    }

    return plain.length > 160 ? `${plain.slice(0, 160).trim()}...` : plain;
  }

  private toPlainText(value: string): string {
    const withoutTags = value.replace(/<[^>]+>/g, ' ');
    const textarea = document.createElement('textarea');
    textarea.innerHTML = withoutTags;

    return textarea.value
      .replace(/\u00a0/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
