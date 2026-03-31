import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConventionService, Convention } from '../../services/convention.service';

@Component({
  standalone: true,
  selector: 'app-public-conventions',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="public-conventions-page">
      <section class="hero-section">
        <div class="container">
          <h1>Convenções e Tratados</h1>
          <p>Documentação oficial e compromissos internacionais assumidos pela República da Guiné-Bissau em matéria ambiental.</p>
        </div>
      </section>

      <div class="container main-content">
        <div class="search-bar card">
          <input type="text" [(ngModel)]="searchTerm" placeholder="Pesquisar por título ou palavra-chave..." (input)="filterConventions()">
          <span class="search-icon">🔍</span>
        </div>

        <div *ngIf="loading" class="center-box">
          <div class="spinner"></div>
          <p class="muted">A carregar documentos...</p>
        </div>

        <div class="conventions-list" *ngIf="!loading">
          <div class="convention-card card" *ngFor="let c of filteredConventions">
            <div class="card-body">
              <div class="card-meta">
                <span class="status-badge {{ c.status }}">{{ c.status === 'active' ? 'Ratificado' : (c.status === 'pending' ? 'Pendente' : c.status) }}</span>
                <span class="date-badge" *ngIf="c.signed_at">Assinado em: {{ c.signed_at | date:'yyyy' }}</span>
              </div>
              <h2>{{ c.title }}</h2>
              <p class="description">{{ c.description || 'Consulta o documento oficial para mais informações sobre este tratado.' }}</p>
              
              <div class="card-footer">
                <a *ngIf="c.document_url" [href]="c.document_url" target="_blank" class="btn primary outline">
                  <span class="icon">📥</span> Descarregar PDF Oficial
                </a>
                <span *ngIf="!c.document_url" class="muted sm">Documento digital não disponível</span>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="!loading && !filteredConventions.length" class="empty-msg card">
          <p>Nenhuma convenção encontrada para "{{ searchTerm }}".</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .public-conventions-page { padding-bottom: 100px; min-height: 80vh; }
    .hero-section { background: linear-gradient(135deg, var(--bg-app) 0%, #f0f7f4 100%); padding: 100px 0; border-bottom: 1px solid var(--border); margin-bottom: 60px; }
    .hero-section h1 { font-size: 3.5rem; color: var(--brand); margin-bottom: 20px; font-weight: 800; }
    .hero-section p { font-size: 1.3rem; color: var(--ink-muted); max-width: 800px; line-height: 1.6; }
    
    .search-bar { position: relative; margin-top: -90px; margin-bottom: 50px; padding: 15px 30px; display: flex; align-items: center; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
    .search-bar input { border: none; font-size: 1.2rem; width: 100%; outline: none; background: transparent; }
    .search-icon { font-size: 1.5rem; color: var(--ink-muted); }
    
    .conventions-list { display: flex; flex-direction: column; gap: 24px; }
    .convention-card { padding: 32px; transition: border-color 0.3s ease; }
    .convention-card:hover { border-color: var(--brand); }
    
    .card-meta { display: flex; gap: 15px; margin-bottom: 16px; }
    .status-badge { padding: 4px 12px; border-radius: 4px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; background: #f0fdf4; color: #166534; }
    .status-badge.pending { background: #fef9c3; color: #854d0e; }
    .date-badge { font-size: 0.85rem; color: var(--ink-muted); font-weight: 600; }
    
    .convention-card h2 { font-size: 1.8rem; margin-bottom: 15px; color: var(--ink); }
    .description { color: var(--ink-muted); line-height: 1.6; margin-bottom: 24px; font-size: 1.1rem; }
    
    .card-footer { border-top: 1px solid var(--border); padding-top: 24px; display: flex; align-items: center; }
    .container { max-width: 1000px; margin: 0 auto; padding: 0 24px; }
    
    .btn.outline { border: 2px solid var(--brand); color: var(--brand); background: transparent; padding: 10px 24px; font-weight: 700; display: flex; align-items: center; gap: 10px; }
    .btn.outline:hover { background: var(--brand); color: white; }
  `]
})
export class PublicConventionsComponent implements OnInit {
  conventions: Convention[] = [];
  filteredConventions: Convention[] = [];
  loading = true;
  searchTerm = '';

  constructor(private conventionService: ConventionService) {}

  ngOnInit(): void {
    this.conventionService.all().subscribe({
      next: (res: Convention[]) => {
        this.conventions = res;
        this.filteredConventions = res;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  filterConventions(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredConventions = this.conventions.filter(c => 
      c.title.toLowerCase().includes(term) || 
      (c.description && c.description.toLowerCase().includes(term))
    );
  }
}
