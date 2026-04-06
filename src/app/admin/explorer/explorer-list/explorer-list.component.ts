import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ExplorerService, DataResource } from '../../../services/explorer.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-explorer-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="admin-container anim-up">
      <header class="premium-header">
        <div class="title-group">
          <h1 class="premium-title">Explorador de Dados</h1>
          <p class="premium-subtitle">Descubra, visualize e partilhe recursos de dados críticos do ecossistema MAB</p>
        </div>
        <a routerLink="new" class="premium-btn primary">
          <span class="icon">🪄</span> Criar Nova Vista Customizada
        </a>
      </header>

      <div class="explorer-grid">
        <!-- New Resource Placeholder Card -->
        <div routerLink="new" class="resource-card placeholder-card anim-delayed-1">
          <div class="placeholder-content">
            <span class="plus-icon">➕</span>
            <h3>Explorar Nova Fonte</h3>
            <p>Selecione um módulo e defina os seus próprios filtros e colunas.</p>
          </div>
        </div>

        <!-- Real Resource Cards -->
  <div *ngFor="let res of resources; let i = index" class="resource-card glass-card anim-delayed-{{ (i % 3) + 1 }}">
    <div class="card-badge" [ngClass]="res.type">
      {{ res.type === 'internal' ? 'Interno' : 'Externo' }}
    </div>

    <!-- Alert Pulse for Monitoring -->
    <div *ngIf="res.category === 'Monitoramento Nacional'" class="alert-pulse" title="Monitoramento Ativo"></div>
    
    <div class="card-header">
      <div class="resource-icon">{{ getIcon(res.icon) }}</div>
      <div class="header-text">
        <h3>{{ res.title }}</h3>
        <span class="category">{{ res.category || 'Geral' }}</span>
      </div>
    </div>

          <div class="card-preview-info">
            <div class="info-item">
              <span class="label">Fonte:</span>
              <span class="value">{{ res.source }}</span>
            </div>
            <div class="info-item">
              <span class="label">Criado por:</span>
              <span class="value">{{ res.creator?.name || 'Sistema' }}</span>
            </div>
          </div>

          <div class="card-actions">
            <a [routerLink]="[res.id]" class="action-btn view">
              <span class="icon">👁️</span> Abrir Dados
            </a>
            <div class="secondary-actions">
              <button (click)="shareResource(res)" class="icon-btn" title="Partilhar">🔗</button>
              <button (click)="deleteResource(res)" class="icon-btn delete" title="Eliminar" *ngIf="res.created_by">🗑️</button>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="resources.length === 0 && !loading" class="premium-empty-state glass-card">
        <div class="empty-icon">📊</div>
        <h3>O seu explorador está vazio</h3>
        <p>Comece por criar uma vista customizada ou explorar as fontes internas da plataforma.</p>
        <a routerLink="new" class="premium-btn outline mt-4">Fazer a minha primeira consulta</a>
      </div>
    </div>
  `,
  styles: [`
    .explorer-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
      margin-bottom: 40px;
    }

    .resource-card {
      position: relative;
      padding: 32px;
      display: flex;
      flex-direction: column;
      height: 100%;
      transition: var(--transition);
      cursor: pointer;
    }

    .resource-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-xl);
    }

    .placeholder-card {
      background: rgba(6, 38, 29, 0.05);
      border: 2px dashed var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .placeholder-card:hover {
      background: rgba(6, 38, 29, 0.08);
      border-color: var(--brand);
    }

    .placeholder-content .plus-icon {
      font-size: 3rem;
      color: var(--brand);
      margin-bottom: 16px;
      display: block;
    }

    .card-badge {
      position: absolute;
      top: 16px;
      right: 16px;
      padding: 4px 12px;
      border-radius: 100px;
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .card-badge.internal { background: rgba(59, 130, 146, 0.1); color: #3b82f6; }
    .card-badge.external { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .card-badge.custom { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }

    .alert-pulse {
      position: absolute;
      top: 18px;
      right: 90px;
      width: 10px;
      height: 10px;
      background: #ef4444;
      border-radius: 50%;
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
      animation: pulseAlert 2s infinite;
    }

    @keyframes pulseAlert {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }

    .card-header {
      display: flex;
      gap: 20px;
      margin-bottom: 24px;
    }

    .resource-icon {
      width: 56px;
      height: 56px;
      background: var(--brand);
      color: white;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
      box-shadow: 0 8px 15px rgba(6, 38, 29, 0.2);
    }

    .header-text h3 {
      font-size: 1.25rem;
      margin-bottom: 4px;
      color: var(--brand);
    }

    .header-text .category {
      font-size: 0.85rem;
      color: var(--ink-muted);
      font-weight: 600;
      text-transform: uppercase;
    }

    .card-preview-info {
      margin-top: auto;
      padding: 16px 0;
      border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
      margin-bottom: 24px;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
      margin-bottom: 4px;
    }

    .info-item .label { color: var(--ink-light); }
    .info-item .value { font-weight: 600; color: var(--ink); }

    .card-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .action-btn.view {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: var(--brand);
      color: white;
      border-radius: 12px;
      font-weight: 700;
      font-size: 0.9rem;
    }

    .action-btn.view:hover {
      background: var(--brand-light);
      transform: scale(1.05);
    }

    .secondary-actions {
      display: flex;
      gap: 8px;
    }

    .icon-btn {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(6, 38, 29, 0.05);
      border: none;
      cursor: pointer;
      transition: var(--transition-fast);
    }

    .icon-btn:hover {
      background: var(--brand);
      color: white;
    }

    .icon-btn.delete:hover {
      background: #fef2f2;
      color: #ef4444;
    }

    .premium-empty-state {
      text-align: center;
      padding: 80px 40px;
    }

    .empty-icon { font-size: 4rem; margin-bottom: 20px; opacity: 0.5; }

    .anim-delayed-1 { animation: fadeIn 0.8s ease backwards 0.1s; }
    .anim-delayed-2 { animation: fadeIn 0.8s ease backwards 0.2s; }
    .anim-delayed-3 { animation: fadeIn 0.8s ease backwards 0.3s; }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ExplorerListComponent implements OnInit {
  resources: DataResource[] = [];
  loading = true;

  constructor(
    private explorerService: ExplorerService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadResources();
  }

  loadResources(): void {
    this.loading = true;
    this.explorerService.getResources().subscribe({
      next: (res) => {
        this.resources = res;
        this.loading = false;
      },
      error: () => {
        this.toast.error('Erro ao carregar recursos');
        this.loading = false;
      }
    });
  }

  getIcon(iconName: string | undefined): string {
    const icons: any = {
      'database': '📊',
      'users': '👥',
      'nature': '🌿',
      'waste': '♻️',
      'water': '💧',
      'shield': '🛡️'
    };
    return icons[iconName || 'database'] || '📊';
  }

  shareResource(res: DataResource): void {
    const perm = prompt('Com quem deseja partilhar? Insira os IDs dos utilizadores separados por vírgula (ex: 1,2)');
    if (perm) {
      const ids = perm.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
      this.explorerService.shareResource(res.id!, { user_ids: ids }).subscribe({
        next: () => this.toast.success('Recurso partilhado com sucesso'),
        error: () => this.toast.error('Erro ao partilhar recurso')
      });
    }
  }

  deleteResource(res: DataResource): void {
    if (confirm(`Tem a certeza que deseja eliminar "${res.title}"?`)) {
      this.explorerService.deleteResource(res.id!).subscribe({
        next: () => {
          this.toast.success('Recurso eliminado');
          this.loadResources();
        },
        error: () => this.toast.error('Erro ao eliminar recurso')
      });
    }
  }
}
