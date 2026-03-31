import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ConventionService, Convention } from '../../../services/convention.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  standalone: true,
  selector: 'app-convention-list',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="admin-conventions">
      <header class="page-header">
        <div>
          <h1>Convenções e Tratados</h1>
          <p class="muted">Gerencie os acordos internacionais e documentos técnicos.</p>
        </div>
        <a routerLink="new" class="btn primary">Nova Convenção</a>
      </header>

      <div *ngIf="loading" class="center-box"><div class="spinner"></div></div>

      <div class="table-container card" *ngIf="!loading && conventions.length">
        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Status</th>
              <th>Data Assinatura</th>
              <th>Documento</th>
              <th class="actions-col">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of conventions">
              <td><strong>{{ c.title }}</strong></td>
              <td><span class="status-pill {{ c.status }}">{{ c.status | uppercase }}</span></td>
              <td>{{ c.signed_at | date:'dd/MM/yyyy' }}</td>
              <td>
                <a *ngIf="c.document_url" [href]="c.document_url" target="_blank" class="btn ghost sm">📄 Ver PDF</a>
                <span *ngIf="!c.document_url" class="muted sm">Sem arquivo</span>
              </td>
              <td class="actions-col">
                <a [routerLink]="['edit', c.id]" class="btn outline sm icon-only" title="Editar">✏️</a>
                <button (click)="deleteConvention(c)" class="btn danger sm icon-only" title="Excluir">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="empty-state card" *ngIf="!loading && !conventions.length">
        <h3>Nenhuma convenção registada</h3>
        <p class="muted">Publique os tratados internacionais para consulta pública.</p>
        <a routerLink="new" class="btn primary">Criar Convenção</a>
      </div>
    </div>
  `,
  styles: [`
    .status-pill { padding: 4px 10px; border-radius: 999px; font-size: 0.7rem; font-weight: 800; background: #f1f5f9; }
    .status-pill.active, .status-pill.ratified { background: #dcfce7; color: #15803d; }
    .status-pill.pending { background: #fef9c3; color: #854d0e; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 12px 16px; border-bottom: 2px solid var(--border); color: var(--ink-muted); font-size: 0.8rem; text-transform: uppercase; }
    td { padding: 16px; border-bottom: 1px solid var(--border); }
    .actions-col { text-align: right; white-space: nowrap; }
  `]
})
export class ConventionListComponent implements OnInit {
  conventions: Convention[] = [];
  loading = true;

  constructor(private conventionService: ConventionService, private toast: ToastService) {}

  ngOnInit(): void {
    this.loadConventions();
  }

  loadConventions(): void {
    this.loading = true;
    this.conventionService.all().subscribe({
      next: (res: Convention[]) => { this.conventions = res; this.loading = false; },
      error: () => { this.toast.error('Erro ao carregar convenções.'); this.loading = false; }
    });
  }

  deleteConvention(c: Convention): void {
    if (!confirm(`Excluir convenção "${c.title}"?`)) return;
    this.conventionService.delete(c.id!).subscribe(() => {
      this.toast.success('Convenção excluída.');
      this.loadConventions();
    });
  }
}
