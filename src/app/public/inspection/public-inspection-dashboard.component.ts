import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../api-config';

@Component({
  standalone: true,
  selector: 'app-public-inspection-dashboard',
  imports: [CommonModule],
  template: `
    <div class="inspection-dashboard">
      <div class="stats-grid">
        <div class="stat-card">
          <span class="value">{{ stats.ocorrencias_totais }}</span>
          <span class="label">Ocorrências Registadas</span>
        </div>
        <div class="stat-card warning">
          <span class="value">{{ stats.ocorrencias_em_analise }}</span>
          <span class="label">Em Análise Técnica</span>
        </div>
        <div class="stat-card success">
          <span class="value">{{ stats.ocorrencias_resolvidas }}</span>
          <span class="label">Casos Resolvidos</span>
        </div>
        <div class="stat-card info">
          <span class="value">{{ stats.missoes_concluidas }}</span>
          <span class="label">Missões de Campo</span>
        </div>
      </div>

      <div class="recent-activity mt-8" *ngIf="recentActivities.length">
        <h4 class="text-lg font-bold mb-4">Monitorização em Tempo Real</h4>
        <div class="activity-list">
          <div *ngFor="let act of recentActivities" class="activity-item">
            <div class="status-indicator" [class.success]="act.status === 'resolvida'" [class.warning]="act.status === 'pendente'"></div>
            <div class="content">
              <span class="timestamp">{{ act.created_at | date:'dd/MM HH:mm' }}</span>
              <p><strong>{{ act.tipo }}:</strong> {{ act.titulo }} - <span class="loc">{{ act.localizacao }}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; }
    .stat-card { background: #fff; padding: 25px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); text-align: center; border-bottom: 4px solid var(--brand); }
    .stat-card .value { display: block; font-size: 2.2rem; font-weight: 800; color: #1a1a1a; margin-bottom: 5px; }
    .stat-card .label { font-size: 0.75rem; color: var(--ink-muted); text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }
    
    .stat-card.warning { border-color: #f59e0b; }
    .stat-card.success { border-color: #10b981; }
    .stat-card.info { border-color: #3b82f6; }

    .activity-list { background: #fff; border-radius: 16px; overflow: hidden; border: 1px solid rgba(0,0,0,0.05); }
    .activity-item { display: flex; align-items: center; gap: 15px; padding: 15px 20px; border-bottom: 1px solid rgba(0,0,0,0.05); }
    .activity-item:last-child { border-bottom: 0; }
    .status-indicator { width: 10px; height: 10px; border-radius: 50%; background: #3b82f6; }
    .status-indicator.success { background: #10b981; }
    .status-indicator.warning { background: #f59e0b; }
    
    .content p { font-size: 0.9rem; margin: 0; }
    .timestamp { font-size: 0.7rem; color: var(--ink-muted); font-weight: 700; }
    .loc { color: var(--brand); font-weight: 600; }
  `]
})
export class PublicInspectionDashboardComponent implements OnInit {
  stats: any = {
    ocorrencias_totais: 24,
    ocorrencias_em_analise: 8,
    ocorrencias_resolvidas: 16,
    missoes_concluidas: 12
  };
  recentActivities: any[] = [
    { tipo: 'Incêndio', titulo: 'Fogo controlado em Quinara', localizacao: 'Quinara', status: 'resolvida', created_at: new Date() },
    { tipo: 'Desmatamento', titulo: 'Alerta de corte ilegal em Buba', localizacao: 'Buba', status: 'pendente', created_at: new Date() }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    // In a real app, we would fetch this from an API like /api/public/inspection/stats
    // For now I'll keep the mock data to show the UI
  }
}
