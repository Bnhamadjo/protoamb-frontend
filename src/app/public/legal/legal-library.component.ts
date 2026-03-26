import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../api-config';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-legal-library',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <!-- Hero Header using the slider pattern -->
    <div class="home-slider" style="height: 40vh; min-height: 350px;">
      <div class="slides-container">
        <div class="slide active" style="background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2070&auto=format&fit=crop'); background-position: center;">
          <div class="slide-content anim-up">
            <h1 class="logo-text" style="font-size: 3rem;">Biblioteca Técnico-Legal</h1>
            <p class="subtitle">Legislação, manuais técnicos, pareceres e relatórios oficiais</p>
            <div style="position: relative; max-width: 600px; margin: 0 auto;">
               <input type="text" [(ngModel)]="searchQuery" (input)="filter()" placeholder="Pesquisar por título ou referência..." style="width: 100%; padding: 15px 20px 15px 50px; border: none; border-radius: 50px; font-size: 1.1rem; box-shadow: 0 4px 20px rgba(0,0,0,0.3); color: var(--ink-dark);">
               <span style="position: absolute; left: 20px; top: 15px; font-size: 1.2rem; color: var(--ink-muted);">🔍</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Layout -->
    <section class="container" style="margin: 60px auto; min-height: 600px;">
      <div style="display: grid; grid-template-columns: 280px 1fr; gap: 40px; align-items: start;">
        
        <!-- Sidebar Filtros -->
        <aside style="background: var(--bg-card); padding: 30px; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
           <h3 style="font-size: 1.2rem; font-weight: 800; border-bottom: 2px solid var(--border-color); padding-bottom: 10px; margin-bottom: 20px;">Filtros</h3>
           <ul style="list-style: none; padding: 0; margin: 0;">
             <li *ngFor="let type of docTypes" (click)="selectedType = type; filter()" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; cursor: pointer; border-bottom: 1px solid rgba(0,0,0,0.05); transition: 0.2s;" [style.color]="selectedType === type ? 'var(--primary)' : 'var(--ink)'" [style.font-weight]="selectedType === type ? '800' : '500'">
               <span>{{ type }}</span>
               <span class="status-pill" style="font-size: 0.65rem; padding: 3px 8px;">DOC</span>
             </li>
             <li (click)="selectedType = ''; filter()" style="padding-top: 15px; font-weight: 800; color: #dc2626; cursor: pointer; font-size: 0.85rem; text-transform: uppercase;">
                Limpar filtros ✖
             </li>
           </ul>

           <div style="margin-top: 40px; padding: 25px; background: rgba(22,96,72,0.05); border: 1px solid rgba(22,96,72,0.1); border-radius: 12px; text-align: center;">
              <h4 style="font-weight: 800; margin-bottom: 10px; color: var(--primary);">Precisa de ajuda?</h4>
              <p style="font-size: 0.85rem; color: var(--ink-muted); line-height: 1.6; margin-bottom: 15px;">Os nossos serviços jurídicos estão disponíveis para esclarecimentos.</p>
              <button class="btn outline sm" style="width: 100%;">Contactar D.J.</button>
           </div>
        </aside>

        <!-- Lista de Documentos -->
        <main>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 15px;">
            <span style="font-size: 0.9rem; color: var(--ink-muted); font-weight: 600;">A mostrar {{ filteredPosts.length }} documentos oficiais</span>
            <select style="background: none; border: 1px solid var(--border-color); padding: 8px 15px; border-radius: 6px; font-weight: 700; color: var(--ink-dark); outline: none;">
               <option>Mais recentes</option>
               <option>Antigos</option>
               <option>A-Z</option>
            </select>
          </div>

          <div class="glass-card anim-up" style="padding: 0; overflow: hidden;" *ngIf="filteredPosts.length > 0">
             <div *ngFor="let post of filteredPosts" class="module-row" style="padding: 25px; align-items: center;">
                <div style="flex: 1; padding-right: 20px;">
                  <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <span class="status-pill" style="font-size: 0.65rem;">{{ post.document_label || 'Geral' }}</span>
                    <span style="font-size: 0.75rem; color: var(--ink-muted); font-weight: 600;">Publicado a {{ post.created_at | date }}</span>
                  </div>
                  <h3 style="font-size: 1.3rem; font-weight: 800; color: var(--ink-dark); margin: 0 0 5px 0; cursor: pointer;">{{ post.title }}</h3>
                  <p style="font-size: 0.95rem; color: var(--ink-muted); margin: 0; line-height: 1.6;">{{ post.excerpt }}</p>
                </div>
                <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                  <a [href]="post.document_file" target="_blank" class="btn primary sm" style="padding: 10px 15px; font-weight: 800; display: flex; align-items: center; gap: 5px;" title="Descarregar Formulário/Documento">
                    Descarregar <span>📄</span>
                  </a>
                </div>
             </div>
          </div>

          <div *ngIf="filteredPosts.length === 0" style="text-align: center; padding: 60px 20px; background: var(--bg-card); border-radius: 12px; border: 1px dashed var(--border-color);">
             <span style="font-size: 3rem; margin-bottom: 15px; display: block; color: var(--ink-muted);">🗂️</span>
             <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--ink-dark); margin-bottom: 10px;">Sem resultados</h3>
             <p style="color: var(--ink-muted); margin: 0;">Nenhum documento encontrado com os critérios de pesquisa atuais.</p>
          </div>
        </main>
      </div>
    </section>
  `
})
export class LegalLibraryComponent implements OnInit {
  posts: any[] = [];
  filteredPosts: any[] = [];
  searchQuery = '';
  selectedType = '';
  docTypes = ['Legislação', 'Manuais', 'Pareceres', 'Relatórios', 'Formulários'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>(`${API_BASE}/posts?category=biblioteca-legal`).subscribe({
      next: (res) => {
        this.posts = res;
        this.filteredPosts = res;
      },
      error: () => {
        this.posts = [];
        this.filteredPosts = [];
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
