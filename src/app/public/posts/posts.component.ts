import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-public-posts',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-header posts-hero">
      <div class="container">
        <h1>Publicações e Notícias</h1>
        <p>As últimas novidades sobre conservação e projetos ambientais.</p>
      </div>
    </div>

    <div class="container posts-layout">
      <div class="grid-posts" *ngIf="!loading">
        <article class="post-item card" *ngFor="let post of posts">
          <div class="post-image" *ngIf="post.image">
            <img [src]="post.image" [alt]="post.title">
          </div>
          <div class="post-content">
            <div class="meta">
              <span class="date">{{ post.created_at | date:'dd MMM, yyyy' }}</span>
              <span class="category" *ngIf="post.category">{{ post.category }}</span>
            </div>
            <h2>{{ post.title }}</h2>
            <div class="excerpt" [innerHTML]="post.content?.substring(0, 200) + '...'"></div>
            <a [routerLink]="['/posts', post.slug]" class="btn sm">Continuar a ler</a>
          </div>
        </article>
      </div>

      <div *ngIf="loading" class="muted center" style="padding: 60px">A carregar publicações...</div>
      
      <aside class="sidebar" *ngIf="!loading">
        <div class="widget card">
          <h4>Categorias</h4>
          <ul>
            <li><a>Comunidade</a></li>
            <li><a>Eventos</a></li>
            <li><a>Projetos</a></li>
            <li><a>Pesquisa</a></li>
          </ul>
        </div>
      </aside>
    </div>
  `,
  styles: [`
    .posts-hero { background: #1a2a1a; color: #fff; padding: 60px 0; margin-bottom: 40px; }
    
    .posts-layout { display: grid; grid-template-columns: 1fr 300px; gap: 40px; }
    
    .grid-posts { display: flex; flex-direction: column; gap: 30px; }
    .post-item { display: grid; grid-template-columns: 300px 1fr; overflow: hidden; }
    .post-image img { width: 100%; height: 100%; object-fit: cover; }
    .post-content { padding: 30px; display: flex; flex-direction: column; gap: 15px; }
    
    .meta { display: flex; gap: 15px; font-size: 0.8rem; color: var(--ink-muted); font-weight: 600; }
    .category { color: var(--primary); text-transform: uppercase; }
    
    h2 { font-size: 1.5rem; color: var(--ink); }
    .excerpt { color: var(--ink-muted); line-height: 1.6; }
    
    .sidebar .widget { padding: 25px; }
    .sidebar h4 { margin-bottom: 20px; border-bottom: 2px solid var(--primary); display: inline-block; }
    .sidebar ul { list-style: none; padding: 0; }
    .sidebar li { margin-bottom: 12px; }
    .sidebar a { text-decoration: none; color: var(--ink-muted); transition: 0.2s; cursor: pointer; }
    .sidebar a:hover { color: var(--primary); }

    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
  `]
})
export class PublicPostsComponent implements OnInit {
  posts: any[] = [];
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://127.0.0.1:8000/api/posts').subscribe({
      next: (res) => {
        this.posts = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
