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
    <div class="page-header posts-hero">
      <div class="container">
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
    .posts-hero { background: var(--hero-wash); color: #fff; padding: 72px 0; margin-bottom: 40px; }
    .posts-layout { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 40px; }
    .posts-main { min-width: 0; }
    .filter-bar { display: grid; grid-template-columns: 1.7fr 0.8fr; gap: 16px; padding: 18px; margin-bottom: 18px; border-radius: 22px; }
    .filter-bar label { display: block; font-size: 0.78rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-muted); margin-bottom: 8px; }
    .results-head { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 18px; }
    .grid-posts { display: flex; flex-direction: column; gap: 30px; }
    .post-item { display: grid; grid-template-columns: 300px 1fr; overflow: hidden; border-radius: 24px; }
    .post-image img { width: 100%; height: 100%; object-fit: cover; }
    .post-content { padding: 30px; display: flex; flex-direction: column; gap: 15px; }
    .meta { display: flex; gap: 15px; font-size: 0.8rem; color: var(--ink-muted); font-weight: 600; }
    .category { color: var(--primary); text-transform: uppercase; }
    h2 { font-size: 1.5rem; color: var(--ink); }
    .excerpt { color: var(--ink-muted); line-height: 1.8; text-align: justify; }
    .sidebar .widget { padding: 25px; }
    .sidebar h4 { margin-bottom: 20px; border-bottom: 2px solid var(--primary); display: inline-block; }
    .sidebar ul { list-style: none; padding: 0; }
    .sidebar li { margin-bottom: 12px; }
    .sidebar a { text-decoration: none; color: var(--ink-muted); transition: 0.2s; cursor: pointer; }
    .sidebar a:hover { color: var(--primary); }
    @media (max-width: 980px) {
      .posts-layout, .filter-bar, .post-item { grid-template-columns: 1fr; }
    }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
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
    return content.length > 200 ? `${content.slice(0, 200).trim()}...` : content;
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
