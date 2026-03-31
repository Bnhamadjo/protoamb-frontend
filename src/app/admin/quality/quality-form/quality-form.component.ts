import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EnvironmentalService, EnvironmentalMetric } from '../../../services/environmental.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  standalone: true,
  selector: 'app-quality-form',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="admin-container anim-up">
      <header class="page-header">
        <div class="title-area">
          <div class="pre-title">Monitorização Ambiental</div>
          <h1>{{ isEdit ? 'Editar' : 'Novo' }} Registo de Qualidade</h1>
        </div>
        <div class="actions">
          <a routerLink="/admin/quality" class="btn secondary glass focus:ring-0">← Voltar</a>
        </div>
      </header>

      <div class="impeccable-card mt-6 p-8">
        <form (ngSubmit)="save()" #qualityForm="ngForm" class="premium-form">
          <div class="form-grid">
            
            <div class="form-section">
              <h3 class="section-title">Informação Básica</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-group">
                  <label>Tipo de Recurso</label>
                  <div class="select-wrapper">
                    <select name="type" [(ngModel)]="metric.type" required class="form-control">
                      <option value="air">🌬️ Qualidade do Ar</option>
                      <option value="water">💧 Qualidade da Água</option>
                      <option value="climate">🌡️ Monitorização Climática</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label>Parâmetro (Ex: CO2, pH, Temp)</label>
                  <input type="text" name="parameter" [(ngModel)]="metric.parameter" required class="form-control" placeholder="Introduza o parâmetro">
                </div>
              </div>
            </div>

            <div class="form-separator"></div>

            <div class="form-section">
              <h3 class="section-title">Dados da Medição</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="form-group">
                  <label>Valor</label>
                  <input type="number" name="value" [(ngModel)]="metric.value" required class="form-control" placeholder="0.00">
                </div>

                <div class="form-group">
                  <label>Unidade (Ex: ppm, mg/L, °C)</label>
                  <input type="text" name="unit" [(ngModel)]="metric.unit" required class="form-control" placeholder="unidade">
                </div>

                <div class="form-group">
                  <label>Data/Hora da Leitura</label>
                  <input type="datetime-local" name="recorded_at" [(ngModel)]="metric.recorded_at" required class="form-control">
                </div>
              </div>
            </div>

            <div class="form-separator"></div>

            <div class="form-section">
              <h3 class="section-title">Localização & Sensor</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-group">
                  <label>Localização / Estação</label>
                  <input type="text" name="location" [(ngModel)]="metric.location" class="form-control" placeholder="Ex: Bissau, Porto, Rio Geba">
                </div>

                <div class="form-group">
                  <label>Identificador do Sensor (Opcional)</label>
                  <input type="text" name="sensor_id" [(ngModel)]="metric.sensor_id" class="form-control" placeholder="ID-SENSOR-001">
                </div>
              </div>
            </div>

            <div class="form-separator"></div>

            <div class="form-group">
              <label>Estado da Leitura</label>
              <div class="flex gap-4">
                <label class="radio-tab">
                  <input type="radio" name="status" [(ngModel)]="metric.status" value="normal">
                  <span class="pill pill-green">Normal</span>
                </label>
                <label class="radio-tab">
                  <input type="radio" name="status" [(ngModel)]="metric.status" value="warning">
                  <span class="pill pill-amber">Aviso</span>
                </label>
                <label class="radio-tab">
                  <input type="radio" name="status" [(ngModel)]="metric.status" value="critical">
                  <span class="pill pill-rose">Crítico</span>
                </label>
              </div>
            </div>
          </div>

          <div class="form-actions mt-10">
            <button type="submit" class="btn primary lg shadow-xl" [disabled]="!qualityForm.form.valid || loading">
              {{ loading ? 'A guardar...' : 'Confirmar Registo Ambiental' }}
            </button>
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
    
    .radio-tab input { display: none; }
    .radio-tab span { cursor: pointer; opacity: 0.5; transition: all 0.2s; }
    .radio-tab input:checked + span { opacity: 1; transform: scale(1.05); box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
    
    .pill { padding: 8px 20px; border-radius: 30px; font-weight: 700; font-size: 0.8rem; display: inline-block; }
    .pill-green { background: #dcfce7; color: #166534; }
    .pill-amber { background: #fef3c7; color: #92400e; }
    .pill-rose { background: #ffe4e6; color: #9f1239; }

    .form-separator { height: 1px; background: linear-gradient(to right, #f1f5f9, transparent); margin: 30px 0; }
    .form-actions { display: flex; justify-content: center; border-top: 1px solid #f1f5f9; padding-top: 30px; }
    .btn.lg { padding: 16px 40px; font-size: 1.1rem; border-radius: 50px; }
    .glass { backdrop-filter: blur(4px); background: rgba(255,255,255,0.7) !important; color: #1e293b !important; border: 1px solid rgba(0,0,0,0.05) !important; }
  `]
})
export class AdminQualityFormComponent implements OnInit {
  metric: EnvironmentalMetric = {
    type: 'air',
    parameter: '',
    value: 0,
    unit: '',
    status: 'normal',
    recorded_at: new Date().toISOString().slice(0, 16)
  };
  isEdit = false;
  loading = false;

  constructor(
    private envService: EnvironmentalService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.loadMetric(+id);
    }
  }

  loadMetric(id: number): void {
    this.envService.show(id).subscribe({
      next: (res) => {
        this.metric = res;
        if (this.metric.recorded_at) {
          this.metric.recorded_at = new Date(this.metric.recorded_at).toISOString().slice(0, 16);
        }
      }
    });
  }

  save(): void {
    this.loading = true;
    const obs = this.isEdit 
      ? this.envService.update(this.metric.id!, this.metric)
      : this.envService.create(this.metric);

    obs.subscribe({
      next: () => {
        this.toast.success('Registo ambiental guardado.');
        this.router.navigate(['/admin/quality']);
      },
      error: () => {
        this.toast.error('Erro ao guardar registo.');
        this.loading = false;
      }
    });
  }
}
