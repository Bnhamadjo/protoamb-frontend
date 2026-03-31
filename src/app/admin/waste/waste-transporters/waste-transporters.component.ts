import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { WasteService, Transporter } from '../../../services/waste.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  standalone: true,
  selector: 'app-waste-transporters',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="admin-container anim-up">
      <header class="page-header">
        <div class="title-area">
          <div class="pre-title">Operadores SIRE</div>
          <h1>Entidades Autorizadas</h1>
          <p>Gestão de operadores licenciados para transporte de resíduos</p>
        </div>
        <div class="actions">
          <a routerLink="/admin/waste" class="btn secondary glass">← Voltar</a>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        <!-- List of Transporters -->
        <div class="lg:col-span-2">
          <div class="impeccable-card">
            <div class="card-header border-b p-4">
              <h3 class="font-bold">Lista de Operadores Ativos</h3>
            </div>
            <div class="overflow-x-auto">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Entidade</th>
                    <th>Licença / Matrícula</th>
                    <th>Contacto</th>
                    <th class="actions">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let t of transporters" class="hoverable">
                    <td>
                      <div class="entity-info">
                        <span class="entity-icon">🏢</span>
                        <div class="font-bold text-gray-900">{{ t.name }}</div>
                      </div>
                    </td>
                    <td>
                      <div class="flex flex-col">
                        <span class="text-xs font-semibold text-blue-600">{{ t.license_number || 'Sem Licença' }}</span>
                        <code class="text-[0.65rem] text-gray-500">{{ t.vehicle_plate || 'Sem Viatura' }}</code>
                      </div>
                    </td>
                    <td><span class="text-sm">{{ t.contact || '-' }}</span></td>
                    <td class="actions">
                      <div class="action-buttons">
                        <button (click)="edit(t)" class="btn-icon info" title="Editar">✏️</button>
                        <button (click)="delete(t.id!)" class="btn-icon danger" title="Remover">🗑️</button>
                      </div>
                    </td>
                  </tr>
                  <tr *ngIf="transporters.length === 0">
                    <td colspan="4" class="empty-state">Nenhum operador registado.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Add/Edit Form -->
        <div class="lg:col-span-1">
          <div class="impeccable-card p-6" [style.border-top]="isEdit ? '4px solid #3b82f6' : '4px solid #10b981'">
            <h3 class="font-bold text-lg mb-6 flex items-center gap-2">
              <span class="icon">{{ isEdit ? '📝' : '✨' }}</span>
              {{ isEdit ? 'Editar Operador' : 'Novo Operador' }}
            </h3>
            <form (ngSubmit)="save()" #tForm="ngForm" class="sidebar-form">
              <div class="form-group mb-4">
                <label>Nome da Entidade</label>
                <input type="text" name="name" [(ngModel)]="currentTransporter.name" required class="form-control" placeholder="Ex: EcoRecicla Lda">
              </div>
              <div class="form-group mb-4">
                <label>Nº de Licença Ambiental</label>
                <input type="text" name="license" [(ngModel)]="currentTransporter.license_number" class="form-control" placeholder="LIC-2026-XXXX">
              </div>
              <div class="form-group mb-4">
                <label>Matrícula do Veículo</label>
                <input type="text" name="plate" [(ngModel)]="currentTransporter.vehicle_plate" class="form-control" placeholder="00-AA-00">
              </div>
              <div class="form-group mb-6">
                <label>Contacto de Emergência</label>
                <input type="text" name="contact" [(ngModel)]="currentTransporter.contact" class="form-control" placeholder="+245 ...">
              </div>
              
              <div class="flex gap-2">
                <button type="submit" [disabled]="!tForm.valid || loading" class="btn primary flex-1">
                  {{ loading ? '...' : (isEdit ? 'Atualizar' : 'Registar') }}
                </button>
                <button *ngIf="isEdit" type="button" (click)="resetForm()" class="btn secondary glass">Parar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .entity-info { display: flex; align-items: center; gap: 12px; }
    .entity-icon { font-size: 1.2rem; opacity: 0.7; }
    
    .form-group label { display: block; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 6px; }
    .form-control { 
      width: 100%; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; 
      font-size: 0.9rem; transition: all 0.2s; 
    }
    .form-control:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); outline: none; }

    .action-buttons { display: flex; gap: 6px; justify-content: flex-end; }
    .btn-icon {
      width: 28px; height: 28px; border-radius: 6px; border: 1px solid #e2e8f0;
      background: white; display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.2s; font-size: 0.8rem;
    }
    .btn-icon:hover { transform: translateY(-1px); box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .btn-icon.info:hover { background: #eff6ff; border-color: #3b82f6; }
    .btn-icon.danger:hover { background: #fef2f2; border-color: #ef4444; }

    .empty-state { text-align: center; padding: 40px; color: #94a3b8; font-style: italic; }
    .glass { backdrop-filter: blur(4px); background: rgba(255,255,255,0.7) !important; color: #1e293b !important; border: 1px solid rgba(0,0,0,0.05) !important; }
  `]
})
export class WasteTransportersComponent implements OnInit {
  transporters: Transporter[] = [];
  currentTransporter: Transporter = { name: '' };
  isEdit = false;
  loading = false;

  constructor(private wasteService: WasteService, private toast: ToastService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.wasteService.getTransporters().subscribe({
      next: (res) => this.transporters = res
    });
  }

  edit(t: Transporter): void {
    this.isEdit = true;
    this.currentTransporter = { ...t };
  }

  resetForm(): void {
    this.isEdit = false;
    this.currentTransporter = { name: '' };
  }

  save(): void {
    this.loading = true;
    const obs = this.isEdit 
      ? this.wasteService.updateTransporter(this.currentTransporter.id!, this.currentTransporter)
      : this.wasteService.createTransporter(this.currentTransporter);

    obs.subscribe({
      next: () => {
        this.toast.success('Operador guardado com sucesso.');
        this.resetForm();
        this.loadData();
        this.loading = false;
      },
      error: () => {
        this.toast.error('Erro ao guardar operador.');
        this.loading = false;
      }
    });
  }

  delete(id: number): void {
    if (confirm('Deseja eliminar este operador? Isto pode afetar manifestos associados.')) {
      this.wasteService.deleteTransporter(id).subscribe({
        next: () => { this.toast.success('Operador removido.'); this.loadData(); },
        error: () => this.toast.error('Erro ao remover operador.')
      });
    }
  }
}
