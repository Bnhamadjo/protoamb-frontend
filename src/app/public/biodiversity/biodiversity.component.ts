import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { catchError, finalize, of } from 'rxjs';

import { API_BASE } from '../../api-config';
import { SeoService } from '../../services/seo.service';

@Component({
  standalone: true,
  selector: 'app-public-biodiversity',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header biodiversity-hero">
      <div class="container">
        <span class="section-kicker">Catalogo Vivo</span>
        <h1>Biodiversidade</h1>
        <p>Explore o catalogo de especies da Guine-Bissau.</p>
      </div>
    </div>

    <div class="container biodiversity-grid">
      <div class="search-panel glass-card">
        <div class="search-copy">
          <strong>Descoberta orientada</strong>
          <span class="muted">Filtre por tipo e pesquise por nome ou descricao.</span>
        </div>
        <input [(ngModel)]="searchTerm" (ngModelChange)="applyFilters()" placeholder="Pesquisar especie, habitat ou descricao">
      </div>

      <div class="filters">
        <button class="btn sm" [class.primary]="filter === 'all'" (click)="setFilter('all')">Todos</button>
        <button class="btn sm" [class.primary]="filter === 'fauna'" (click)="setFilter('fauna')">Fauna</button>
        <button class="btn sm" [class.primary]="filter === 'flora'" (click)="setFilter('flora')">Flora</button>
        <button class="btn sm" [class.primary]="filter === 'ecossistema'" (click)="setFilter('ecossistema')">Ecossistemas</button>
      </div>

      <div *ngIf="loading" class="muted center" style="padding: 60px">
        A carregar especies...
      </div>

      <div *ngIf="!loading && error" class="empty">
        {{ error }}
      </div>

      <div class="grid-4" *ngIf="!loading && !error && filteredItems.length > 0">
        <div class="species-card card" *ngFor="let item of filteredItems">
          <div class="image-area">
            <img [src]="item.image || fallbackSpeciesImage" [alt]="item.name">
            <span class="badge type">{{ item.type }}</span>
          </div>
          <div class="card-body">
            <h3>{{ item.name }}</h3>
            <p class="description">
              {{ getPreview(item.description) }}
            </p>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && !error && filteredItems.length === 0" class="empty">
        Nenhum registo encontrado para este filtro.
      </div>
    </div>
  `,
  styles: [`
    .biodiversity-hero { background: var(--hero-wash); color: #fff; padding: 72px 0; margin-bottom: 40px; }
    .biodiversity-hero h1 { font-size: 2.5rem; margin-bottom: 10px; }
    .search-panel { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 18px; align-items: center; padding: 18px; margin-bottom: 18px; border-radius: 22px; }
    .filters { display: flex; gap: 10px; margin-bottom: 30px; flex-wrap: wrap; }
    .species-card { overflow: hidden; }
    .image-area { height: 180px; position: relative; }
    .image-area img { width: 100%; height: 100%; object-fit: cover; }
    .badge.type { position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.6); color: #fff; font-size: 0.7rem; }
    .card-body { padding: 15px; }
    .card-body h3 { font-size: 1.1rem; margin-bottom: 5px; color: var(--primary); }
    .description { font-size: 0.9rem; color: var(--ink-muted); margin-top: 10px; text-align: justify; line-height: 1.75; }
    .empty { padding: 60px 20px; text-align: center; color: var(--ink-muted); }
    @media (max-width: 900px) {
      .search-panel { grid-template-columns: 1fr; }
    }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
  `]
})
export class PublicBiodiversityComponent implements OnInit {
  fallbackSpeciesImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='%232c5a3b'/><stop offset='1' stop-color='%23a8c98f'/></linearGradient></defs><rect width='800' height='500' fill='url(%23g)'/><circle cx='650' cy='90' r='70' fill='%23ffffff22'/><path d='M0 360 C120 310 220 420 340 370 S560 300 800 390 V500 H0 Z' fill='%23ffffff30'/><text x='60' y='110' font-size='34' font-family='Arial' fill='white'>Biodiversidade</text></svg>";
  items: any[] = [];
  filteredItems: any[] = [];
  filter = 'all';
  searchTerm = '';
  loading = true;
  error = '';

  constructor(
    private http: HttpClient,
    private seo: SeoService
  ) {}

  ngOnInit(): void {
    this.seo.updatePage({
      title: 'Biodiversidade',
      description: 'Explore especies, habitats e ecossistemas apresentados no portal publico de biodiversidade.'
    });

    this.http.get<any[]>(`${API_BASE}/biodiversity`).pipe(
      catchError(() => {
        this.error = 'Nao foi possivel carregar as especies agora.';
        return of([]);
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe((res) => {
      this.items = Array.isArray(res) ? res : [];
      this.applyFilters();
    });
  }

  setFilter(f: string): void {
    this.filter = f;
    this.applyFilters();
  }

  applyFilters(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredItems = this.items.filter((item) => {
      const type = (item.type || '').toLowerCase();
      const haystack = `${item.name || ''} ${this.toPlainText(item.description || '')}`.toLowerCase();
      const matchesType = this.filter === 'all' || type === this.filter;
      const matchesTerm = !term || haystack.includes(term);
      return matchesType && matchesTerm;
    });
  }

  getPreview(description?: string): string {
    const plainText = this.toPlainText(description || '');
    if (!plainText) {
      return 'Descricao indisponivel.';
    }

    return plainText.length > 100 ? `${plainText.slice(0, 100)}...` : plainText;
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
