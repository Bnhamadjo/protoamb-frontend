import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../api-config';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-legal-library',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <!-- Hero Header using the slider pattern -->
    <div class="home-slider hero-sm">
      <div class="slides-container">
        <div class="slide active hero-bg-legal">
          <div class="slide-content anim-up">
            <h1 class="hero-title text-4xl md:text-6xl mb-6">Biblioteca <br><span class="text-accent">Técnico-Legal</span></h1>
             <p class="hero-subtitle mb-8 max-w-2xl">Acesse legislação, manuais técnicos, pareceres e relatórios oficiais do Ministério.</p>
            
            <div class="search-wrapper">
               <input type="text" [(ngModel)]="searchQuery" (input)="filter()" placeholder="Pesquisar por título ou referência..." class="search-input">
               <span class="search-icon">🔍</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Layout -->
    <section class="container legal-container">
      <div class="legal-grid">
        
        <!-- Sidebar Filtros -->
        <aside class="legal-sidebar impeccable-card">
           <h3 class="sidebar-title">Filtros de Pesquisa</h3>
           <ul class="filter-list">
             <li *ngFor="let type of docTypes" 
                 (click)="selectedType = type; filter()" 
                 class="filter-item"
                 [class.active]="selectedType === type">
               <span>{{ type }}</span>
               <span class="status-pill">DOC</span>
             </li>
             <li (click)="selectedType = ''; filter()" class="clear-filters">
                Limpar filtros ✖
             </li>
           </ul>

           <div class="help-box">
              <h4>Precisa de ajuda?</h4>
              <p>O Departamento Jurídico está disponível para esclarecimentos técnicos sobre os documentos.</p>
              <button class="btn outline sm w-full">Contactar D.J.</button>
           </div>
        </aside>

        <!-- Lista de Documentos -->
        <main class="legal-main">
          <div class="results-header">
            <span class="results-count">A mostrar {{ filteredPosts.length }} documentos oficiais</span>
            <select class="sort-select">
               <option>Mais recentes</option>
               <option>Antigos</option>
               <option>A-Z</option>
            </select>
          </div>

          <div class="documents-list anim-up" *ngIf="filteredPosts.length > 0">
             <div *ngFor="let post of filteredPosts" class="document-row impeccable-card">
                <div class="doc-info">
                  <div class="doc-meta">
                    <span class="status-pill">{{ post.document_label || 'Geral' }}</span>
                    <span class="doc-date">Publicado em {{ post.created_at | date }}</span>
                  </div>
                  <h3 class="doc-title">{{ post.title }}</h3>
                  <p class="doc-excerpt">{{ post.excerpt }}</p>
                </div>
                <div class="doc-actions">
                  <a [href]="post.document_file" target="_blank" class="btn primary sm download-btn" title="Descarregar Documento">
                    Descarregar <span>📄</span>
                  </a>
                </div>
             </div>
          </div>

          <div *ngIf="filteredPosts.length === 0" class="empty-state">
             <span class="empty-icon">🗂️</span>
             <h3>Sem resultados encontrados</h3>
             <p>Ajuste os filtros ou tente uma pesquisa diferente.</p>
          </div>
        </main>
      </div>
    </section>
  `,
  styles: [`
    .hero-bg-legal {
      background-image: linear-gradient(135deg, rgba(8, 25, 18, 0.9) 0%, rgba(18, 51, 38, 0.75) 50%, rgba(0, 0, 0, 0.85) 100%), 
                        url('https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1920&q=80');
      background-position: center;
    }
    
    .search-wrapper { position: relative; max-width: 600px; margin: 0 auto; width: 100%; }
    .search-input { width: 100%; padding: 18px 25px 18px 60px !important; border: none !important; border-radius: 50px !important; font-size: 1.1rem !important; box-shadow: 0 10px 30px rgba(0,0,0,0.3) !important; color: var(--ink-dark) !important; background: white !important; }
    .search-icon { position: absolute; left: 25px; top: 50%; transform: translateY(-50%); font-size: 1.4rem; color: var(--ink-muted); }

    .legal-container { margin: 60px auto; min-height: 600px; }
    .legal-grid { display: grid; grid-template-columns: 300px 1fr; gap: 40px; align-items: start; }
    
    .legal-sidebar { padding: 30px; position: sticky; top: 100px; }
    .sidebar-title { font-size: 1.3rem; font-weight: 900; margin-bottom: 25px; color: var(--brand); border-bottom: 3px solid var(--accent); padding-bottom: 12px; display: inline-block; }
    
    .filter-list { list-style: none; padding: 0; margin: 0; }
    .filter-item { display: flex; justify-content: space-between; align-items: center; padding: 14px 0; cursor: pointer; border-bottom: 1px solid rgba(0,0,0,0.05); transition: 0.2s; font-weight: 600; color: var(--ink-muted); }
    .filter-item:hover { color: var(--brand); padding-left: 5px; }
    .filter-item.active { color: var(--primary); font-weight: 800; border-bottom-color: var(--primary); }
    
    .clear-filters { padding-top: 20px; font-weight: 800; color: #dc2626; cursor: pointer; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; }
    
    .help-box { margin-top: 40px; padding: 25px; background: rgba(21, 128, 61, 0.05); border-radius: 20px; border: 1px solid rgba(21, 128, 61, 0.1); }
    .help-box h4 { color: var(--primary); margin-bottom: 10px; font-weight: 800; }
    .help-box p { font-size: 0.85rem; color: var(--ink-muted); line-height: 1.6; }

    .results-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 15px; border-bottom: 1px solid var(--border); }
    .results-count { font-size: 0.95rem; color: var(--ink-muted); font-weight: 700; }
    
    .document-row { display: flex; padding: 28px !important; margin-bottom: 20px; transition: transform 0.3s; cursor: default; }
    .document-row:hover { transform: scale(1.01); border-color: var(--primary); }
    .doc-info { flex: 1; padding-right: 30px; }
    .doc-meta { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .doc-date { font-size: 0.8rem; color: var(--ink-muted); font-weight: 700; }
    .doc-title { font-size: 1.4rem; font-weight: 800; color: var(--brand); margin-bottom: 10px; line-height: 1.3; }
    .doc-excerpt { font-size: 0.95rem; color: var(--ink-muted); line-height: 1.7; margin: 0; }
    
    .download-btn { min-width: 160px; justify-content: center; font-weight: 800; }

    .empty-state { text-align: center; padding: 100px 30px; background: white; border-radius: 24px; border: 2px dashed var(--border); }
    .empty-icon { font-size: 4rem; display: block; margin-bottom: 20px; opacity: 0.3; }

    @media (max-width: 1024px) {
      .legal-grid { grid-template-columns: 1fr; }
      .legal-sidebar { position: static; }
      .document-row { flex-direction: column; gap: 20px; }
      .doc-info { padding-right: 0; }
      .download-btn { width: 100%; }
    }

    @media (max-width: 768px) {
      .hero-title { font-size: 2.2rem !important; }
      .legal-container { margin: 40px auto; }
      .search-input { font-size: 1rem !important; padding: 15px 20px 15px 50px !important; }
      .search-icon { left: 20px; font-size: 1.2rem; }
      .sidebar-title { font-size: 1.1rem; }
    }
  `]
})
export class LegalLibraryComponent implements OnInit {
  posts: any[] = [];
  filteredPosts: any[] = [];
  searchQuery = '';
  selectedType = '';
  docTypes = ['Legislação', 'Manuais', 'Pareceres', 'Relatórios', 'Formulários'];

  constructor(private http: HttpClient, private toast: ToastService) {}

  ngOnInit(): void {
    this.http.get<any[]>(`${API_BASE}/posts?category=biblioteca-legal`).subscribe({
      next: (res) => {
        this.posts = res;
        this.filteredPosts = res;
      },
      error: () => {
        this.posts = [];
        this.filteredPosts = [];
        this.toast.error('Não foi possível carregar a biblioteca legal.');
      }
    });
  }

  filter() {
    this.filteredPosts = this.posts.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                          (p.excerpt && p.excerpt.toLowerCase().includes(this.searchQuery.toLowerCase()));
      const matchType = !this.selectedType || p.document_label === this.selectedType;
      return matchSearch && matchType;
    });
  }
}
