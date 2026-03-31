import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WasteService, WasteRecord } from '../../../services/waste.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  standalone: true,
  selector: 'app-waste-list',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="admin-container anim-up">
      <header class="page-header">
        <div class="title-area">
          <div class="pre-title">Gestão SIRE</div>
          <h1>Registo de Resíduos</h1>
          <p>Monitorização e controlo da produção de resíduos MAB</p>
        </div>
        <div class="actions">
          <a routerLink="transporters" class="btn secondary glass">
            <span class="icon">🚛</span> Operadores
          </a>
          <a routerLink="reports" class="btn secondary glass">
            <span class="icon">📊</span> Relatórios
          </a>
          <a routerLink="new" class="btn primary">
            <span class="icon">＋</span> Novo Registo
          </a>
        </div>
      </header>

      <div class="impeccable-card mt-6">
        <div class="card-header border-b p-4 flex justify-between items-center">
          <h3 class="text-lg font-bold">Histórico de Produção</h3>
          <div class="filters">
            <!-- Future filters could go here -->
          </div>
        </div>
        <div class="p-0 overflow-x-auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Categoria</th>
                <th>Quantidade</th>
                <th>Operador / Estado</th>
                <th class="actions">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let record of records" class="hoverable">
                <td class="font-medium">{{ record.production_date | date:'dd MMM, yyyy' }}</td>
                <td>
                  <span class="category-pill" [ngClass]="getCategoryClass(record.category)">
                    {{ record.category }}
                  </span>
                </td>
                <td class="font-bold text-gray-900">{{ record.quantity }} <small class="text-gray-400 font-normal">{{ record.unit }}</small></td>
                <td>
                  <div class="status-cell">
                    <span class="status-indicator" [ngClass]="getStatusClass(record.status)"></span>
                    <div class="status-info">
                      <span class="status-text">{{ record.status || 'Pendente' }}</span>
                      <small *ngIf="record.transporter" class="transporter-name">
                        {{ record.transporter.name }}
                      </small>
                    </div>
                  </div>
                </td>
                <td class="actions">
                  <div class="action-buttons">
                    <button *ngIf="!record.manifest_token" (click)="emitManifest(record)" class="btn-icon" title="Gerar Manifesto">
                      <span class="icon">📄</span>
                    </button>
                    <a *ngIf="record.manifest_token" [routerLink]="['manifest', record.id]" class="btn-icon success" title="Ver Manifesto">
                      <span class="icon">📜</span>
                    </a>
                    <a [routerLink]="['edit', record.id]" class="btn-icon info" title="Editar">
                      <span class="icon">✏️</span>
                    </a>
                    <button (click)="deleteRecord(record.id!)" class="btn-icon danger" title="Eliminar">
                      <span class="icon">🗑️</span>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="!loading && records.length === 0">
                <td colspan="5" class="empty-state">
                  <div class="empty-icon">📭</div>
                  <p>Nenhum registo de resíduos encontrado.</p>
                </td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="loading" class="loading-overlay">
            <div class="spinner"></div>
            <p>A sincronizar dados...</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .category-pill { 
      padding: 4px 12px; 
      border-radius: 20px; 
      font-size: 0.7rem; 
      font-weight: 800; 
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: inline-block;
    }
    .category-pill.perigoso { background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; }
    .category-pill.reciclavel { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
    .category-pill.organico { background: #fef9c3; color: #a16207; border: 1px solid #fef08a; }
    .category-pill.outro { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }

    .status-cell { display: flex; align-items: center; gap: 10px; }
    .status-indicator { width: 8px; height: 8px; border-radius: 50%; background: #cbd5e1; }
    .status-indicator.status-transporte { background: #3b82f6; box-shadow: 0 0 8px rgba(59, 130, 246, 0.5); }
    .status-indicator.status-processado { background: #8b5cf6; box-shadow: 0 0 8px rgba(139, 92, 246, 0.5); }
    .status-indicator.status-reciclado { background: #10b981; box-shadow: 0 0 8px rgba(16, 185, 129, 0.5); }
    
    .status-info { display: flex; flex-direction: column; }
    .status-text { font-size: 0.75rem; font-weight: 600; text-transform: capitalize; color: #1e293b; }
    .transporter-name { font-size: 0.65rem; color: #64748b; margin-top: -2px; }

    .action-buttons { display: flex; gap: 8px; justify-content: flex-end; }
    .btn-icon {
      width: 32px; height: 32px; border-radius: 8px; border: 1px solid #e2e8f0;
      background: white; display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.2s; font-size: 1rem;
    }
    .btn-icon:hover { background: #f8fafc; transform: translateY(-2px); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    .btn-icon.success:hover { background: #ecfdf5; border-color: #10b981; }
    .btn-icon.info:hover { background: #eff6ff; border-color: #3b82f6; }
    .btn-icon.danger:hover { background: #fef2f2; border-color: #ef4444; }

    .empty-state { text-align: center; padding: 60px 0; color: #94a3b8; }
    .empty-icon { font-size: 3rem; margin-bottom: 10px; opacity: 0.5; }

    .loading-overlay { text-align: center; padding: 40px 0; background: rgba(255,255,255,0.8); }

    .glass { backdrop-filter: blur(4px); background: rgba(255,255,255,0.7) !important; color: #1e293b !important; border: 1px solid rgba(0,0,0,0.05) !important; }
    .glass:hover { background: white !important; }
  `]
})
export class WasteListComponent implements OnInit {
  records: WasteRecord[] = [];
  loading = true;

  constructor(private wasteService: WasteService, private toast: ToastService) {}

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords(): void {
    this.loading = true;
    this.wasteService.all().subscribe({
      next: (res: WasteRecord[]) => { this.records = res; this.loading = false; },
      error: () => { this.toast.error('Erro ao carregar registos.'); this.loading = false; }
    });
  }

  deleteRecord(id: number): void {
    if (confirm('Tem a certeza que deseja eliminar este registo?')) {
      this.wasteService.delete(id).subscribe({
        next: () => {
          this.toast.success('Registo eliminado com sucesso.');
          this.loadRecords();
        },
        error: () => this.toast.error('Erro ao eliminar registo.')
      });
    }
  }

  emitManifest(record: WasteRecord): void {
    if (!record.transporter_id) {
      this.toast.error('Associe um transportador antes de emitir o manifesto.');
      return;
    }
    this.wasteService.generateManifest(record.id!).subscribe({
      next: () => {
        this.toast.success('Manifesto gerado com sucesso.');
        this.loadRecords();
      },
      error: () => this.toast.error('Erro ao gerar manifesto.')
    });
  }

  getCategoryClass(category: string): string {
    const cat = category.toLowerCase();
    if (cat.includes('perigoso')) return 'perigoso';
    if (cat.includes('reciclavel')) return 'reciclavel';
    if (cat.includes('organico')) return 'organico';
    return 'outro';
  }

  getStatusClass(status?: string): string {
    if (!status) return 'status-pendente';
    const s = status.toLowerCase();
    if (s.includes('transporte')) return 'status-transporte';
    if (s.includes('processado')) return 'status-processado';
    if (s.includes('reciclado')) return 'status-reciclado';
    return 'status-pendente';
  }
}
