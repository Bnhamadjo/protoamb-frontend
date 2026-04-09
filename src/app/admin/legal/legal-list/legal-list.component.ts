import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { PostService, Post } from '../../posts/services/post.service';

@Component({
  standalone: true,
  selector: 'app-legal-list',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="legal-list anim-fade-in">
      <header class="list-header">
        <div>
          <h1>Biblioteca Técnico-Legal</h1>
          <p class="muted">Gerencie legislação, manuais, pareceres e relatórios oficiais.</p>
        </div>
        <a routerLink="/admin/legal/new" class="btn primary lg">
          <span>+</span> Novo Documento
        </a>
      </header>

      <div *ngIf="loading" class="center-box card">
        <div class="spinner"></div>
        <p class="muted">Buscando documentos...</p>
      </div>

      <div *ngIf="error" class="error-banner card">
        {{ error }}
      </div>

      <div class="table-container" *ngIf="!loading && !error && documents.length > 0">
        <table class="table">
          <thead>
            <tr>
              <th>Título do Documento</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Data de Publicação</th>
              <th style="text-align: right;">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let doc of documents">
              <td>
                <div style="font-weight: 600;">{{ doc.title }}</div>
                <div class="muted" style="font-size: 0.8rem;">{{ doc.slug }}</div>
              </td>
              <td>
                <span class="status-pill blue">{{ doc.document_label || 'Não definido' }}</span>
              </td>
              <td>
                <span class="badge" [class]="doc.status">
                  {{ doc.status === 'published' ? 'Publicado' : 'Rascunho' }}
                </span>
              </td>
              <td>{{ doc.created_at | date:'dd MMM, yyyy' }}</td>
              <td style="text-align: right;">
                <div class="actions">
                  <a *ngIf="doc.document_file" [href]="doc.document_file" target="_blank" class="btn sm outline">Abrir PDF</a>
                  <a [routerLink]="['/admin/legal', doc.slug]" class="btn sm">Editar</a>
                  <button (click)="deleteDocument(doc.id!)" class="btn danger sm">Eliminar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="!loading && !error && documents.length === 0" class="empty card center-box">
        <div style="font-size: 3rem; margin-bottom: 20px;">⚖️</div>
        <h3>Nenhum documento encontrado</h3>
        <p class="muted">Comece a carregar a legislação e manuais do ministério.</p>
        <a routerLink="/admin/legal/new" class="btn primary mt-4">Adicionar primeiro documento</a>
      </div>
    </div>
  `,
  styles: [`
    .list-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px; }
    .badge.published { background: #DCFCE7; color: #166534; }
    .badge.draft { background: #F1F5F9; color: #475569; }
    .status-pill.blue { background: #E0F2FE; color: #0369A1; padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 700; }
    .actions { display: flex; gap: 8px; justify-content: flex-end; }
    .error-banner { background: #FEF2F2; color: #DC2626; padding: 20px; text-align: center; }
  `]
})
export class LegalListComponent implements OnInit {
  documents: Post[] = [];
  loading = true;
  error = '';

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.postService.all({ category: 'biblioteca-legal' }).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (res) => {
        this.documents = Array.isArray(res) ? res : [];
      },
      error: () => {
        this.error = 'Falha ao carregar biblioteca legal.';
      }
    });
  }

  deleteDocument(id: number): void {
    if (!confirm('Tem certeza que deseja eliminar este documento?')) {
      return;
    }

    this.postService.delete(id).subscribe({
      next: () => {
        this.documents = this.documents.filter((doc) => doc.id !== id);
      },
      error: () => {
        alert('Erro ao eliminar documento.');
      }
    });
  }
}
