import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PostService, Post } from '../services/post.service';

@Component({
  standalone: true,
  selector: 'app-posts-list',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="posts-list anim-fade-in">
      <header class="list-header">
        <div>
          <h1>Publicações</h1>
          <p class="muted">Gerencie as notícias e artigos do portal.</p>
        </div>
        <a routerLink="/admin/posts/new" class="btn primary lg">
          <span>+</span> Nova Publicação
        </a>
      </header>

      <div *ngIf="loading" class="center-box card">
        <div class="spinner"></div>
        <p class="muted">Buscando publicações...</p>
      </div>

      <div *ngIf="error" class="error-banner card">
        {{ error }}
      </div>

      <div class="table-container" *ngIf="!loading && posts.length > 0">
        <table class="table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Status</th>
              <th>Data</th>
              <th style="text-align: right;">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let post of posts">
              <td>
                <div style="font-weight: 600;">{{ post.title }}</div>
                <div class="muted" style="font-size: 0.8rem;">{{ post.slug }}</div>
              </td>
              <td>
                <span class="badge" [class]="post.status">
                  {{ post.status === 'published' ? '🚀 Publicado' : '📝 Rascunho' }}
                </span>
              </td>
              <td>{{ post.created_at | date:'dd MMM, yyyy' }}</td>
              <td style="text-align: right;">
                <div class="actions">
                  <a [routerLink]="['/posts', post.slug]" target="_blank" class="btn sm outline">👁️ Ver</a>
                  <a [routerLink]="['/admin/posts', post.slug]" class="btn sm">✏️ Editar</a>
                  <button (click)="deletePost(post.id!)" class="btn danger sm">🗑️ Eliminar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="!loading && posts.length === 0" class="empty card center-box">
        <div style="font-size: 3rem; margin-bottom: 20px;">📭</div>
        <h3>Nenhuma publicação encontrada</h3>
        <p class="muted">Comece a criar conteúdo para o seu portal agora mesmo.</p>
        <a routerLink="/admin/posts/new" class="btn primary mt-4">Criar Primeiro Post</a>
      </div>
    </div>
  `,
  styles: [`
    .list-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px; }
    .badge.published { background: #DCFCE7; color: #166534; }
    .badge.draft { background: #F1F5F9; color: #475569; }
    .actions { display: flex; gap: 8px; justify-content: flex-end; }
    .error-banner { background: #FEF2F2; color: #DC2626; padding: 20px; text-align: center; }
  `]
})
export class PostsListComponent implements OnInit {
  posts: Post[] = [];
  loading = true;
  error = '';

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.postService.all().subscribe({
      next: (res) => { this.posts = res; this.loading = false; },
      error: () => { this.error = 'Falha ao carregar publicações.'; this.loading = false; }
    });
  }

  deletePost(id: number): void {
    if (!confirm('Tem certeza que deseja eliminar esta publicação?')) return;
    this.postService.delete(id).subscribe({
      next: () => this.posts = this.posts.filter(p => p.id !== id),
      error: () => alert('Erro ao eliminar publicação.')
    });
  }
}
