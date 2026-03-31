import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EnvironmentalService, EnvironmentalMetric, QualityStats } from '../../../services/environmental.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  standalone: true,
  selector: 'app-quality-list',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="admin-container anim-up">
      <header class="page-header">
        <div class="title-area">
          <div class="pre-title">Monitorização Ambiental</div>
          <h1>Qualidade do Ar, Água & Clima</h1>
        </div>
        <div class="actions">
          <a routerLink="/admin/quality/new" class="btn primary shadow-lg">+ Novo Registo</a>
        </div>
      </header>

      <div class="stats-grid mt-6">
        <div class="impeccable-card p-6 flex flex-col items-center justify-center text-center">
            <span class="text-3xl mb-2">📊</span>
            <div class="text-2xl font-bold">{{ stats?.summary?.total || 0 }}</div>
            <div class="text-xs text-slate-500 uppercase tracking-wider">Total de Leituras</div>
        </div>
        <div class="impeccable-card p-6 flex flex-col items-center justify-center text-center border-l-4 border-amber-400">
            <span class="text-3xl mb-2">⚠️</span>
            <div class="text-2xl font-bold text-amber-600">{{ stats?.summary?.warning || 0 }}</div>
            <div class="text-xs text-slate-500 uppercase tracking-wider">Alertas Amarelos</div>
        </div>
        <div class="impeccable-card p-6 flex flex-col items-center justify-center text-center border-l-4 border-rose-500">
            <span class="text-3xl mb-2">🚨</span>
            <div class="text-2xl font-bold text-rose-600">{{ stats?.summary?.critical || 0 }}</div>
            <div class="text-xs text-slate-500 uppercase tracking-wider">Estados Críticos</div>
        </div>
      </div>

      <div class="impeccable-card mt-8 overflow-hidden">
        <div class="table-container p-2">
          <table class="premium-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Parâmetro</th>
                <th>Valor</th>
                <th>Localização</th>
                <th>Estado</th>
                <th>Data/Hora</th>
                <th class="text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let m of metrics">
                <td>
                  <span class="type-pill" [ngClass]="m.type">
                    {{ m.type === 'air' ? '🌬️ Ar' : (m.type === 'water' ? '💧 Água' : '🌡️ Clima') }}
                  </span>
                </td>
                <td class="font-semibold text-slate-700">{{ m.parameter }}</td>
                <td>
                  <span class="font-mono text-lg">{{ m.value }}</span> 
                  <span class="text-xs text-slate-400 ml-1">{{ m.unit }}</span>
                </td>
                <td class="text-slate-500 text-sm">{{ m.location }}</td>
                <td>
                  <span class="status-indicator" [ngClass]="m.status">
                    {{ m.status }}
                  </span>
                </td>
                <td class="text-slate-400 text-sm">{{ m.recorded_at | date:'dd/MM/yyyy HH:mm' }}</td>
                <td class="text-right">
                  <div class="flex justify-end gap-2">
                    <a [routerLink]="['/admin/quality/edit', m.id]" class="btn-icon" title="Editar">✏️</a>
                    <button (click)="deleteMetric(m)" class="btn-icon hover:bg-rose-50" title="Eliminar">🗑️</button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="metrics.length === 0">
                <td colspan="7" class="text-center py-20 text-slate-400">
                  <div class="flex flex-col items-center">
                    <span class="text-4xl mb-4">🔍</span>
                    <p>Nenhum registo de monitorização encontrado.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; }
    
    .type-pill { padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
    .type-pill.air { background: #eff6ff; color: #3b82f6; }
    .type-pill.water { background: #f0fdf4; color: #22c55e; }
    .type-pill.climate { background: #fff7ed; color: #f59e0b; }

    .status-indicator { display: inline-flex; align-items: center; gap: 5px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
    .status-indicator::before { content: ''; width: 8px; height: 8px; border-radius: 50%; }
    .status-indicator.normal { color: #22c55e; }
    .status-indicator.normal::before { background: #22c55e; }
    .status-indicator.warning { color: #f59e0b; }
    .status-indicator.warning::before { background: #f59e0b; }
    .status-indicator.critical { color: #ef4444; }
    .status-indicator.critical::before { background: #ef4444; }

    .btn-icon { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 8px; transition: all 0.2s; }
    .btn-icon:hover { background: #f1f5f9; transform: translateY(-2px); }
  `]
})
export class AdminQualityListComponent implements OnInit {
  metrics: EnvironmentalMetric[] = [];
  stats?: QualityStats;

  constructor(
    private envService: EnvironmentalService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.loadStats();
  }

  loadData(): void {
    this.envService.all().subscribe({
      next: (res) => this.metrics = res.data || res
    });
  }

  loadStats(): void {
    this.envService.getStats().subscribe({
      next: (res) => this.stats = res
    });
  }

  deleteMetric(metric: EnvironmentalMetric): void {
    if (confirm('Tem a certeza que deseja eliminar este registo?')) {
      this.envService.delete(metric.id!).subscribe({
        next: () => {
          this.toast.success('Registo eliminado com sucesso.');
          this.loadData();
          this.loadStats();
        }
      });
    }
  }
}
