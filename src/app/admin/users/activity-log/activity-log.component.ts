import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatsService, PaginatedActivities, ActivityLog } from '../../../services/stats.service';
import { finalize } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-activity-log',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="activity-log-page anim-fade-in">
      <header class="page-header">
        <div>
          <span class="kicker">Auditoria & Supervisão</span>
          <h1>Registo de Atividades</h1>
          <p class="muted">Monitorize todas as ações realizadas pelos técnicos e administradores na plataforma.</p>
        </div>
      </header>

      <div class="filter-bar card">
        <div class="filter-group">
          <label>Filtrar por Ação</label>
          <select [(ngModel)]="filters.action" (change)="loadActivities()">
            <option value="">Todas as ações</option>
            <option value="created">Criação</option>
            <option value="updated">Edição</option>
            <option value="deleted">Eliminação</option>
            <option value="login">Login</option>
          </select>
        </div>
        <button class="btn outline sm" (click)="resetFilters()">Limpar Filtros</button>
      </div>

      <div *ngIf="loading" class="center-box py-20">
        <div class="spinner"></div>
      </div>

      <div *ngIf="!loading && logs.length > 0" class="card p-0 overflow-hidden">
        <table class="activity-table">
          <thead>
            <tr>
              <th>Utilizador</th>
              <th>Ação</th>
              <th>Descrição</th>
              <th>Data & Hora</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let log of logs">
              <td>
                <div class="user-info">
                  <div class="avatar">{{ (log.user?.name || log.causer_name).charAt(0) }}</div>
                  <div class="details">
                    <strong>{{ log.user?.name || log.causer_name }}</strong>
                    <span class="muted text-xs">{{ log.user?.email || 'Sistema' }}</span>
                  </div>
                </div>
              </td>
              <td>
                <span class="badge" [class]="log.action">{{ log.action }}</span>
              </td>
              <td>
                <div class="description-box">
                  {{ log.description }}
                </div>
              </td>
              <td class="text-sm font-medium">
                {{ log.created_at | date:'dd/MM/yyyy' }}
                <span class="muted block text-xs">{{ log.created_at | date:'HH:mm:ss' }}</span>
              </td>
              <td class="muted text-xs font-mono">
                {{ log.ip_address }}
              </td>
            </tr>
          </tbody>
        </table>

        <div class="pagination-bar">
          <button class="btn ghost sm" [disabled]="page === 1" (click)="prevPage()">Anterior</button>
          <span class="page-info">Página {{ page }} de {{ totalPages }}</span>
          <button class="btn ghost sm" [disabled]="page === totalPages" (click)="nextPage()">Próxima</button>
        </div>
      </div>

      <div *ngIf="!loading && logs.length === 0" class="empty-state card">
        <h3>Nenhuma atividade encontrada</h3>
        <p class="muted">O histórico de auditoria está vazio para os filtros selecionados.</p>
      </div>
    </div>
  `,
  styles: [`
    .activity-log-page { padding: 20px; max-width: 1200px; margin: 0 auto; }
    .page-header { margin-bottom: 30px; }
    .kicker { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: var(--brand); letter-spacing: 1px; }
    
    .filter-bar { display: flex; align-items: flex-end; gap: 20px; padding: 20px; margin-bottom: 24px; }
    .filter-group { display: flex; flex-direction: column; gap: 6px; }
    .filter-group label { font-size: 0.75rem; font-weight: 700; color: var(--ink-muted); }
    
    .activity-table { width: 100%; border-collapse: collapse; }
    .activity-table th { background: #f8faf9; text-align: left; padding: 15px 20px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: var(--ink-muted); border-bottom: 1px solid var(--border); }
    .activity-table td { padding: 15px 20px; border-bottom: 1px solid var(--border); vertical-align: middle; }
    
    .user-info { display: flex; align-items: center; gap: 12px; }
    .avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--brand); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 14px; }
    .details { display: flex; flex-direction: column; }
    
    .badge { padding: 4px 10px; border-radius: 6px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; }
    .badge.created { background: #dcfce7; color: #166534; }
    .badge.updated { background: #fef9c3; color: #854d0e; }
    .badge.deleted { background: #fee2e2; color: #991b1b; }
    
    .pagination-bar { padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; background: #fff; }
    .page-info { font-size: 0.85rem; font-weight: 600; color: var(--ink-muted); }

    .anim-fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class ActivityLogComponent implements OnInit {
  logs: ActivityLog[] = [];
  loading = true;
  page = 1;
  totalPages = 1;
  filters = {
    action: ''
  };

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    this.loadActivities();
  }

  loadActivities(): void {
    this.loading = true;
    const params = {
      page: this.page,
      ...this.filters
    };

    this.statsService.getActivities(params).pipe(
      finalize(() => this.loading = false)
    ).subscribe(res => {
      this.logs = res.data;
      this.totalPages = res.last_page;
    });
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadActivities();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadActivities();
    }
  }

  resetFilters(): void {
    this.filters.action = '';
    this.page = 1;
    this.loadActivities();
  }
}
