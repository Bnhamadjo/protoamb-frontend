import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { catchError, finalize, forkJoin, of } from 'rxjs';

import { API_BASE } from '../../api-config';
import { Category, CategoryService } from '../../admin/posts/services/category.service';
import { SeoService } from '../../services/seo.service';

@Component({
  standalone: true,
  selector: 'app-public-posts',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="news-header">
      <video autoplay muted loop playsinline class="header-video">
        <source src="media/2255066_Newspaper_Headline_1920x1080.mp4" type="video/mp4">
      </video>
      <div class="header-overlay"></div>
      
      <div class="container container-relative">
        <span class="section-kicker">Centro Editorial</span>
        <h1>Publicacoes e Noticias</h1>
        <p>As ultimas novidades sobre conservacao, legislacao, projetos e dinamicas ambientais.</p>
      </div>
    </div>

    <div class="container posts-layout">
      <section class="posts-main">
        <div class="filter-bar glass-card">
          <div class="search-box">
            <label>Pesquisar</label>
            <input [(ngModel)]="searchTerm" (ngModelChange)="applyFilters()" placeholder="Procure por titulo, resumo ou conteudo">
          </div>
          <div class="category-filter">
            <label>Categoria</label>
            <select [(ngModel)]="selectedCategory" (ngModelChange)="applyFilters()">
              <option value="">Todas</option>
              <option *ngFor="let category of categories" [value]="category.name">{{ category.name }}</option>
            </select>
          </div>
        </div>

        <div class="results-head" *ngIf="!loading && !error">
          <div>
            <strong>{{ filteredPosts.length }}</strong>
            <span class="muted">resultado(s) encontrados</span>
          </div>
          <button class="btn outline sm" *ngIf="searchTerm || selectedCategory" (click)="clearFilters()">Limpar filtros</button>
        </div>

        <div *ngIf="loading" class="muted center" style="padding: 60px">
          A carregar publicacoes...
        </div>

        <div *ngIf="!loading && error" class="empty-illustration">
          <h3>Falha ao carregar</h3>
          <p class="muted">{{ error }}</p>
        </div>

        <div class="grid-posts" *ngIf="!loading && !error && filteredPosts.length > 0">
          <article class="post-item card" *ngFor="let post of filteredPosts">
            <div class="post-image" *ngIf="post.featured_image">
              <img [src]="post.featured_image" [alt]="post.title">
            </div>
            <div class="post-content">
              <div class="meta">
                <span class="date">{{ post.created_at | date:'dd MMM, yyyy' }}</span>
                <span class="category" *ngIf="post.category?.name">{{ post.category.name }}</span>
              </div>
              <h2>{{ post.title }}</h2>
              <div class="excerpt">{{ getExcerpt(post) }}</div>
              <a [routerLink]="['/posts', post.slug]" class="btn sm">Continuar a ler</a>
            </div>
          </article>
        </div>

        <div *ngIf="!loading && !error && filteredPosts.length === 0" class="empty-illustration">
          <h3>Nenhuma publicacao corresponde aos filtros</h3>
          <p class="muted">Experimente outra categoria ou um termo de pesquisa diferente.</p>
        </div>
      </section>

      <aside class="sidebar" *ngIf="!loading">
        <div class="widget card">
          <h4>Temas em destaque</h4>
          <ul>
            <li *ngFor="let category of categories">
              <a (click)="filterByCategory(category.name)">{{ category.name }}</a>
            </li>
          </ul>
        </div>

        <div class="widget card">
          <h4>Leitura editorial</h4>
          <p class="muted">Use a pesquisa para localizar noticias por assunto, iniciativas ou categoria.</p>
        </div>
      </aside>
    </div>
  `,
  styles: [`
    .news-header { position: relative; padding: 100px 0; background: var(--brand); margin-bottom: 60px; text-align: center; overflow: hidden; border-radius: 0 0 40px 40px; }
    .header-video { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.6; }
    .header-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to bottom, rgba(6,38,29,0.9), rgba(6,38,29,0.6)); }
    
    .container-relative { position: relative; z-index: 10; }
    
    .news-header h1 { font-size: clamp(2.5rem, 6vw, 4.5rem); color: #fff !important; font-weight: 950; line-height: 1.1; margin: 20px 0; letter-spacing: -0.04em; text-shadow: 0 2px 15px rgba(0,0,0,0.5); }
    .news-header p { font-size: 1.3rem; color: rgba(255,255,255,0.9) !important; max-width: 750px; margin: 0 auto; opacity: 1; text-shadow: 0 1px 5px rgba(0,0,0,0.3); }
    .section-kicker { color: var(--accent); font-weight: 900; text-transform: uppercase; letter-spacing: 0.15em; font-size: 0.85rem; }
    
    .posts-layout { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 60px; }
    .posts-main { min-width: 0; }
    
    .filter-bar { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; padding: 24px; margin-bottom: 40px; border-radius: 20px; border: 1.5px solid rgba(0,0,0,0.05); }
    .filter-bar label { display: block; font-size: 0.72rem; font-weight: 900; letter-spacing: 0.15em; text-transform: uppercase; color: var(--ink-muted); margin-bottom: 12px; }
    .filter-bar input, .filter-bar select { width: 100%; padding: 12px 16px; border-radius: 12px; border: 1.5px solid rgba(0,0,0,0.08); font-weight: 600; color: var(--ink); }
    
    .results-head { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 40px; padding: 0; }
    .grid-posts { display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px; }
    
    .post-item { 
      display: flex; flex-direction: column; gap: 25px;
      overflow: hidden; border-radius: 24px; background: white; 
      border: 1px solid var(--border);
      padding: 0; padding-bottom: 30px; transition: var(--transition);
      box-shadow: 0 4px 15px rgba(0,0,0,0.02);
    }
    .post-item:hover { transform: translateY(-10px); box-shadow: var(--shadow-xl); border-color: var(--primary); }
    
    .post-image { 
      width: 100%; aspect-ratio: 16 / 10; flex-shrink: 0; 
      overflow: hidden; 
      border-radius: 0;
      position: relative;
    }
    .post-image img { width: 100%; height: 100%; object-fit: cover; transition: 0.8s; }
    .post-item:hover .post-image img { transform: scale(1.1); }
 
    .post-content { padding: 0 25px; display: flex; flex-direction: column; gap: 12px; flex-grow: 1; }
    .meta { display: flex; gap: 15px; font-size: 0.65rem; color: var(--ink-muted); font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; align-items: center; }
    .category { color: var(--primary); background: rgba(var(--primary-rgb), 0.08); padding: 4px 12px; border-radius: 100px; font-weight: 900; }
    
    h2 { font-size: 1.45rem; color: var(--brand); line-height: 1.3; margin: 0; font-weight: 900; text-wrap: balance; }
    .excerpt { color: var(--ink-muted); line-height: 1.7; font-size: 0.92rem; margin-top: 5px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
    
    .btn.sm { width: max-content; padding: 10px 20px; font-size: 0.8rem; border-radius: 8px; margin-top: auto; font-weight: 800; }
    
    .sidebar .widget { padding: 30px; margin-bottom: 30px; border-radius: 24px; border: 1.5px solid rgba(0,0,0,0.03); background: white; }
    .sidebar h4 { font-size: 1.05rem; margin-bottom: 25px; font-weight: 900; color: var(--brand); position: relative; padding-bottom: 12px; border-bottom: 2px solid var(--accent); display: inline-block; }
    .sidebar ul { list-style: none; padding: 0; margin: 0; }
    .sidebar li { margin-bottom: 12px; }
    .sidebar a { text-decoration: none; color: var(--ink-muted); transition: 0.3s; cursor: pointer; font-weight: 600; display: block; border-bottom: 1px solid transparent; padding: 5px 0; }
    .sidebar a:hover { color: var(--primary); padding-left: 5px; border-bottom-color: rgba(var(--primary-rgb), 0.2); }
 
    @media (max-width: 1100px) {
      .posts-layout { grid-template-columns: 1fr; gap: 40px; }
      .sidebar { order: 2; display: none; }
    }
 
    @media (max-width: 800px) {
      .grid-posts { grid-template-columns: 1fr; gap: 30px; }
      .news-header { padding: 60px 0; }
    }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
  `]
})
export class PublicPostsComponent implements OnInit {
  posts: any[] = [];
  filteredPosts: any[] = [];
  categories: Category[] = [];
  searchTerm = '';
  selectedCategory = '';
  loading = true;
  error = '';

  constructor(
    private http: HttpClient,
    private categoryService: CategoryService,
    private seo: SeoService
  ) {}

  ngOnInit(): void {
    this.seo.updatePage({
      title: 'Publicacoes e Noticias',
      description: 'Explore noticias, artigos e atualizacoes sobre o ambiente e a biodiversidade na Guine-Bissau.'
    });

    forkJoin({
      posts: this.http.get<any[]>(`${API_BASE}/posts`).pipe(catchError(() => of([]))),
      categories: this.categoryService.all().pipe(catchError(() => of([])))
    }).pipe(finalize(() => {
      this.loading = false;
    })).subscribe((res) => {
      this.posts = Array.isArray(res.posts) ? res.posts : [];
      this.categories = Array.isArray(res.categories) ? res.categories : [];
      this.applyFilters();
    });
  }

  applyFilters(): void {
    const term = this.searchTerm.trim().toLowerCase();
    const category = this.selectedCategory.trim().toLowerCase();

    this.filteredPosts = this.posts.filter((post) => {
      const categoryName = (post.category?.name || '').toLowerCase();
      const haystack = `${post.title || ''} ${this.toPlainText(post.excerpt || '')} ${this.toPlainText(post.body || '')}`.toLowerCase();
      const matchesTerm = !term || haystack.includes(term);
      const matchesCategory = !category || categoryName === category;
      return matchesTerm && matchesCategory;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.applyFilters();
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  getExcerpt(post: any): string {
    const content = this.toPlainText(post?.excerpt || post?.body || '');
    return content.length > 140 ? `${content.slice(0, 140).trim()}...` : content;
  }

  private toPlainText(value: string): string {
    if (!value) return '';

    const withoutTags = value.replace(/<[^>]+>/g, ' ');
    const textarea = document.createElement('textarea');
    textarea.innerHTML = withoutTags;

    return textarea.value
      .replace(/\u00a0/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
