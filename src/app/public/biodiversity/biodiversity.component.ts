import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-public-biodiversity',
  imports: [CommonModule],
  template: `
    <div class="page-header biodiversity-hero">
      <div class="container">
        <h1>Biodiversidade</h1>
        <p>Explore o catálogo de espécies da Guiné-Bissau.</p>
      </div>
    </div>

    <div class="container biodiversity-grid">
      <div class="filters">
        <button class="btn sm" [class.primary]="filter === 'all'" (click)="setFilter('all')">Todos</button>
        <button class="btn sm" [class.primary]="filter === 'fauna'" (click)="setFilter('fauna')">Fauna</button>
        <button class="btn sm" [class.primary]="filter === 'flora'" (click)="setFilter('flora')">Flora</button>
        <button class="btn sm" [class.primary]="filter === 'ecossistema'" (click)="setFilter('ecossistema')">Ecossistemas</button>
      </div>

      <div *ngIf="loading" class="muted center" style="padding: 60px">A carregar espécies...</div>

      <div class="grid-4" *ngIf="!loading">
        <div class="species-card card" *ngFor="let item of filteredItems">
          <div class="image-area">
             <img [src]="item.image || 'https://images.unsplash.com/photo-1544336090-7d08658097d8?q=80&w=400&auto=format&fit=crop'" [alt]="item.name">
             <span class="badge type">{{ item.type }}</span>
          </div>
          <div class="card-body">
            <h3>{{ item.name }}</h3>
            <p class="description" style="font-size: 0.9rem; color: var(--ink-muted); margin-top: 10px;">
              {{ item.description?.replace('<[^>]*>', '') | slice:0:100 }}...
            </p>
          </div>
        </div>
      </div>
      
      <div *ngIf="!loading && filteredItems.length === 0" class="empty">
        Nenhum registo encontrado para este filtro.
      </div>
    </div>
  `,
  styles: [`
    .biodiversity-hero { background: #2d5a27; color: #fff; padding: 60px 0; margin-bottom: 40px; }
    .biodiversity-hero h1 { font-size: 2.5rem; margin-bottom: 10px; }
    
    .filters { display: flex; gap: 10px; margin-bottom: 30px; }
    
    .species-card { overflow: hidden; }
    .image-area { height: 180px; position: relative; }
    .image-area img { width: 100%; height: 100%; object-fit: cover; }
    .badge.type { position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.6); color: #fff; font-size: 0.7rem; }
    
    .card-body { padding: 15px; }
    .card-body h3 { font-size: 1.1rem; margin-bottom: 5px; color: var(--primary); }
    .scientific { font-size: 0.85rem; color: var(--ink-muted); margin-bottom: 10px; }
    .status { font-size: 0.8rem; font-weight: 700; color: var(--warning); text-transform: uppercase; }

    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
  `]
})
export class PublicBiodiversityComponent implements OnInit {
  items: any[] = [];
  filteredItems: any[] = [];
  filter = 'all';
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://127.0.0.1:8000/api/biodiversity').subscribe({
      next: (res) => {
        this.items = res;
        this.filteredItems = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  setFilter(f: string): void {
    this.filter = f;
    if (f === 'all') this.filteredItems = this.items;
    else this.filteredItems = this.items.filter(i => i.type.toLowerCase() === f);
  }
}
