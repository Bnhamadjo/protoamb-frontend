import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { WasteService, WasteRecord, Transporter } from '../../../services/waste.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  standalone: true,
  selector: 'app-waste-form',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="admin-container anim-up">
      <header class="page-header">
        <div class="title-area">
          <div class="pre-title">Formulário SIRE</div>
          <h1>{{ isEdit ? 'Editar' : 'Novo' }} Registo de Resíduo</h1>
        </div>
        <div class="actions">
          <a routerLink="/admin/waste" class="btn secondary glass focus:ring-0">← Cancelar</a>
        </div>
      </header>

      <div class="impeccable-card mt-6 p-8">
        <form (ngSubmit)="save()" #wasteForm="ngForm" class="premium-form">
          <div class="form-grid">
            
            <div class="form-section">
              <h3 class="section-title">Classificação & Origem</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-group">
                  <label>Categoria do Resíduo</label>
                  <div class="select-wrapper">
                    <select name="category" [(ngModel)]="record.category" required class="form-control">
                      <option value="Perigoso">Perigoso</option>
                      <option value="Reciclável">Reciclável</option>
                      <option value="Orgânico">Orgânico</option>
                      <option value="Construção">Construção</option>
                      <option value="E-waste">E-waste</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label>Origem / Local de Produção</label>
                  <input type="text" name="origin" [(ngModel)]="record.origin" class="form-control" placeholder="Ex: Setor A, Instalação B">
                </div>
              </div>
            </div>

            <div class="form-separator"></div>

            <div class="form-section">
              <h3 class="section-title">Logística & Operação</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-group">
                  <label>Transportador Autorizado</label>
                  <div class="select-wrapper">
                    <select name="transporter_id" [(ngModel)]="record.transporter_id" class="form-control">
                      <option [ngValue]="null">Aguardar Recolha MAB</option>
                      <option *ngFor="let t of transporters" [value]="t.id">{{ t.name }} ({{ t.vehicle_plate }})</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label>Estado da Gestão</label>
                  <div class="select-wrapper">
                    <select name="status" [(ngModel)]="record.status" class="form-control">
                      <option value="pendente">Pendente / Armazenado</option>
                      <option value="em_transporte">Em Transporte</option>
                      <option value="processado">Processado / Triagem</option>
                      <option value="reciclado">Reciclado / Valorizado</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-separator"></div>

            <div class="form-section">
              <h3 class="section-title">Medição & Data</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="form-group">
                  <label>Quantidade</label>
                  <input type="number" name="quantity" [(ngModel)]="record.quantity" required class="form-control" placeholder="0.00">
                </div>

                <div class="form-group">
                  <label>Unidade de Medida</label>
                  <div class="select-wrapper">
                    <select name="unit" [(ngModel)]="record.unit" required class="form-control">
                      <option value="kg">Quilos (kg)</option>
                      <option value="ton">Toneladas (ton)</option>
                      <option value="m3">Metros Cúbicos (m³)</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label>Data de Produção</label>
                  <input type="date" name="production_date" [(ngModel)]="record.production_date" required class="form-control">
                </div>
              </div>
            </div>

            <div class="form-separator"></div>

            <div class="form-group">
              <label>Observações Adicionais</label>
              <textarea name="notes" [(ngModel)]="record.notes" class="form-control" rows="3" placeholder="Detalhes relevantes sobre o resíduo..."></textarea>
            </div>
          </div>

          <div class="form-actions mt-10">
            <button type="submit" class="btn primary lg shadow-xl" [disabled]="!wasteForm.form.valid || loading">
              <span class="icon">{{ loading ? '⏳' : '✅' }}</span>
              {{ loading ? 'A processar...' : 'Guardar Registo Oficial' }}
            </button>
            <p class="text-xs text-slate-400 mt-4 text-center">Ao guardar, este registo será integrado no sistema de monitorização SIRE.</p>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .premium-form { max-width: 900px; margin: 0 auto; }
    .section-title { font-size: 0.9rem; font-weight: 700; color: #1e293b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
    .section-title::after { content: ''; flex: 1; height: 1px; background: #e2e8f0; }
    
    .form-group label { display: block; font-size: 0.8rem; font-weight: 600; color: #64748b; margin-bottom: 8px; }
    .form-control { 
      width: 100%; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px 16px; 
      font-size: 0.95rem; color: #1e293b; transition: all 0.2s; background: #fcfdfe;
    }
    .form-control:focus { border-color: #3b82f6; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); outline: none; background: white; }
    
    .select-wrapper { position: relative; }
    .select-wrapper::after {
      content: '▼'; position: absolute; right: 15px; top: 15px; font-size: 0.7rem; color: #94a3b8; pointer-events: none;
    }
    select.form-control { appearance: none; padding-right: 40px; }

    .form-separator { height: 1px; background: linear-gradient(to right, #f1f5f9, transparent); margin: 30px 0; }

    .form-actions { display: flex; flex-direction: column; align-items: center; border-t: 1px solid #f1f5f9; padding-top: 30px; }
    .btn.lg { padding: 16px 40px; font-size: 1.1rem; border-radius: 50px; }

    .glass { backdrop-filter: blur(4px); background: rgba(255,255,255,0.7) !important; color: #1e293b !important; border: 1px solid rgba(0,0,0,0.05) !important; }
  `]
})
export class WasteFormComponent implements OnInit {
  record: WasteRecord = {
    category: 'Reciclável',
    quantity: 0,
    unit: 'kg',
    production_date: new Date().toISOString().split('T')[0],
    status: 'pendente'
  };
  transporters: Transporter[] = [];
  isEdit = false;
  loading = false;

  constructor(
    private wasteService: WasteService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadTransporters();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.loadRecord(+id);
    }
  }

  loadTransporters(): void {
    this.wasteService.getTransporters().subscribe({
      next: (res) => this.transporters = res
    });
  }

  loadRecord(id: number): void {
    this.loading = true;
    this.wasteService.show(id).subscribe({
      next: (res: WasteRecord) => {
        this.record = res;
        if (this.record.production_date) {
          this.record.production_date = new Date(this.record.production_date).toISOString().split('T')[0];
        }
        this.loading = false;
      },
      error: () => {
        this.toast.error('Erro ao carregar registo.');
        this.router.navigate(['/admin/waste']);
      }
    });
  }

  save(): void {
    this.loading = true;
    const obs = this.isEdit 
      ? this.wasteService.update(this.record.id!, this.record)
      : this.wasteService.create(this.record);

    obs.subscribe({
      next: () => {
        this.toast.success('Registo guardado com sucesso.');
        this.router.navigate(['/admin/waste']);
      },
      error: () => {
        this.toast.error('Erro ao guardar registo.');
        this.loading = false;
      }
    });
  }
}
