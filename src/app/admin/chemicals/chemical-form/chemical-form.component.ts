import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ChemicalProductService, ChemicalProduct } from '../../../services/chemical-product.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-chemical-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="admin-container anim-up">
      <header class="page-header friendly-header">
        <div class="title-section">
          <div class="header-icon-box">⚗️</div>
          <div>
            <h1>{{ isEdit ? 'Ficha de Produto' : 'Nova Substância' }}</h1>
            <p>Registo e conformidade de segurança GHS</p>
          </div>
        </div>
        <a routerLink="/admin/chemicals" class="btn-secondary">Voltar</a>
      </header>

      <form (ngSubmit)="save()" #chemForm="ngForm" class="white-container shadow-lg">
        <div class="friendly-form-grid">
          <!-- Coluna 1: Identificação -->
          <div class="form-pane">
            <h3 class="pane-title">Identificação do Produto</h3>
            <div class="form-group">
              <label>Nome Comercial / Químico</label>
              <div class="input-wrapper-light">
                <span class="icon">🏷️</span>
                <input type="text" [(ngModel)]="item.name" name="name" required placeholder="Ex: Hipoclorito de Sódio">
              </div>
            </div>
            
            <div class="row">
              <div class="form-group col">
                <label>Classificação</label>
                <input type="text" [(ngModel)]="item.classification" name="classification" placeholder="Ex: Desinfetante">
              </div>
              <div class="form-group col">
                <label>Fabricante</label>
                <input type="text" [(ngModel)]="item.manufacturer" name="manufacturer" placeholder="Ex: QuimiLab">
              </div>
            </div>

            <div class="row">
              <div class="form-group col">
                <label>Quantidade Atual</label>
                <input type="number" [(ngModel)]="item.quantity" name="quantity" required>
              </div>
              <div class="form-group col">
                <label>Unidade</label>
                <select [(ngModel)]="item.unit" name="unit" required>
                  <option value="L">Litros (L)</option>
                  <option value="kg">Quilos (kg)</option>
                  <option value="un">Unidades</option>
                  <option value="m3">Metros Cúbicos</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Notas de Manuseamento</label>
              <textarea [(ngModel)]="item.notes" name="notes" rows="4" placeholder="Indique precauções especiais..."></textarea>
            </div>
          </div>

          <!-- Coluna 2: Segurança (Destaque) -->
          <div class="form-pane safety-pane-light" [ngClass]="'risk-' + item.risk_level">
            <h3 class="pane-title">Risco & Condições</h3>
            
            <div class="risk-grid">
              <label class="risk-item" [class.selected]="item.risk_level === 'low'">
                <input type="radio" [(ngModel)]="item.risk_level" name="risk_level" value="low">
                <div class="risk-box low">
                   <span class="dot"></span>
                   <span class="label">BAIXO</span>
                </div>
              </label>
              <label class="risk-item" [class.selected]="item.risk_level === 'medium'">
                <input type="radio" [(ngModel)]="item.risk_level" name="risk_level" value="medium">
                <div class="risk-box medium">
                   <span class="dot"></span>
                   <span class="label">MÉDIO</span>
                </div>
              </label>
              <label class="risk-item" [class.selected]="item.risk_level === 'high'">
                <input type="radio" [(ngModel)]="item.risk_level" name="risk_level" value="high">
                <div class="risk-box high">
                   <span class="dot"></span>
                   <span class="label">ALTO</span>
                </div>
              </label>
              <label class="risk-item" [class.selected]="item.risk_level === 'extreme'">
                <input type="radio" [(ngModel)]="item.risk_level" name="risk_level" value="extreme">
                <div class="risk-box extreme">
                   <span class="dot"></span>
                   <span class="label">EXTREMO</span>
                </div>
              </label>
            </div>

            <div class="form-group mt-5">
              <label>Data de Validade</label>
              <div class="input-wrapper-light">
                <span class="icon">📅</span>
                <input type="date" [(ngModel)]="item.expiry_date" name="expiry_date" [class.expired-text]="isExpired(item.expiry_date)">
              </div>
            </div>

            <div class="form-group">
              <label>Localização de Armazenamento</label>
              <div class="input-wrapper-light">
                <span class="icon">📍</span>
                <input type="text" [(ngModel)]="item.location" name="location" placeholder="Ex: Armazém Norte - P2">
              </div>
            </div>

             <div class="upload-placeholder-friendly mt-auto">
                <div class="friendly-box">
                   <span class="box-icon">📄</span>
                   <p>SDS / FISPQ</p>
                   <small>Anexar ficha de segurança</small>
                </div>
             </div>
          </div>
        </div>

        <footer class="friendly-footer">
          <button type="submit" class="btn-primary-pro" [disabled]="!chemForm.form.valid || loading">
            {{ loading ? 'A processar...' : (isEdit ? 'Atualizar Ficha' : 'Registar Substância') }}
          </button>
        </footer>
      </form>
    </div>
  `,
  styles: [`
    .friendly-header { 
      background: var(--surface); border-radius: var(--radius-lg); padding: 30px; 
      border-bottom: 3px solid var(--brand); box-shadow: var(--shadow);
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 30px;
    }
    .header-icon-box { 
      width: 60px; height: 60px; background: #f0f7f4; border-radius: 15px;
      display: flex; align-items: center; justify-content: center; font-size: 2rem;
      margin-right: 20px;
    }
    .title-section { display: flex; align-items: center; }
    .title-section h1 { margin: 0; font-size: 1.8rem; color: var(--brand); }
    .title-section p { margin: 5px 0 0; color: var(--ink-muted); font-size: 0.95rem; }

    .white-container { background: white; border-radius: 24px; border: 1px solid var(--border); overflow: hidden; }
    .friendly-form-grid { display: grid; grid-template-columns: 1.2fr 1fr; }
    .form-pane { padding: 45px; }
    .pane-title { font-size: 1.2rem; font-weight: 800; color: var(--brand); margin-bottom: 35px; border-left: 4px solid var(--accent); padding-left: 15px; }
    
    .safety-pane-light { background: #fcfdfc; border-left: 1px solid var(--border); display: flex; flex-direction: column; }
    .row { display: flex; gap: 20px; }
    .col { flex: 1; }

    .input-wrapper-light { display: flex; align-items: center; background: #f1f4f3; border: 1px solid var(--border); border-radius: 12px; padding: 0 15px; }
    .input-wrapper-light .icon { margin-right: 12px; opacity: 0.5; }
    .input-wrapper-light input { background: transparent; border: none; padding: 14px 0; color: var(--ink); width: 100%; outline: none; font-weight: 600; }
    .expired-text { color: var(--danger) !important; }

    .risk-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
    .risk-item { cursor: pointer; position: relative; }
    .risk-item input { position: absolute; opacity: 0; }
    
    .risk-box { 
      padding: 15px; border-radius: 12px; background: white; border: 1px solid var(--border);
      text-align: center; transition: all 0.3s; display: flex; align-items: center; gap: 12px;
    }
    .risk-box .dot { width: 10px; height: 10px; border-radius: 50%; opacity: 0.3; }
    .risk-box .label { font-size: 0.75rem; font-weight: 800; color: var(--ink-muted); }
    
    .selected .risk-box { border-color: var(--brand); box-shadow: 0 4px 15px rgba(0,0,0,0.05); transform: translateY(-2px); }
    .selected .risk-box .dot { opacity: 1; box-shadow: 0 0 8px currentColor; }
    .selected .risk-box .label { color: var(--brand); }

    .risk-box.low .dot { background: #10b981; color: #10b981; }
    .risk-box.medium .dot { background: #f59e0b; color: #f59e0b; }
    .risk-box.high .dot { background: #ef4444; color: #ef4444; }
    .risk-box.extreme .dot { background: #ef4444; color: #ef4444; animation: blink-dot 1s infinite; }

    @keyframes blink-dot { 0% { opacity: 0.2; } 50% { opacity: 1; } 100% { opacity: 0.2; } }

    .friendly-box { 
      border: 2px dashed var(--border); border-radius: 20px; padding: 30px; text-align: center;
      background: #f8faf9; color: var(--ink-muted); transition: 0.3s;
    }
    .friendly-box:hover { border-color: var(--brand); background: #f0f7f4; }
    .box-icon { font-size: 2rem; display: block; margin-bottom: 10px; opacity: 0.5; }

    .friendly-footer { background: #fcfdfc; padding: 25px 45px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; }
    
    .btn-primary-pro {
      background: var(--brand); color: white; padding: 14px 30px; border-radius: 12px;
      font-weight: 700; border: none; cursor: pointer; transition: all 0.3s;
      box-shadow: 0 4px 15px rgba(10, 60, 46, 0.2);
    }
    .btn-primary-pro:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(10, 60, 46, 0.3); }

    @media (max-width: 900px) { .friendly-form-grid { grid-template-columns: 1fr; } .safety-pane-light { border-left: none; border-top: 1px solid var(--border); } }
  `]
})
export class ChemicalFormComponent implements OnInit {
  item: ChemicalProduct = { name: '', quantity: 0, unit: 'L', risk_level: 'low' };
  isEdit = false;
  loading = false;

  constructor(
    private chemicalService: ChemicalProductService,
    private toast: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.chemicalService.get(id).subscribe({
        next: (res) => {
          this.item = res;
          // Format date for input type="date"
          if (this.item.expiry_date) {
            this.item.expiry_date = new Date(this.item.expiry_date).toISOString().split('T')[0];
          }
        },
        error: () => {
          this.toast.error('Erro ao carregar produto');
          this.router.navigate(['/admin/chemicals']);
        }
      });
    }
  }

  save(): void {
    this.loading = true;
    const obs = this.isEdit 
      ? this.chemicalService.update(this.item.id!, this.item)
      : this.chemicalService.create(this.item);

    obs.subscribe({
      next: () => {
        this.toast.success(this.isEdit ? 'Produto atualizado' : 'Produto registado');
        this.router.navigate(['/admin/chemicals']);
      },
      error: () => {
        this.loading = false;
        this.toast.error('Erro ao guardar');
      }
    });
  }

  isExpired(date: any): boolean {
    if (!date) return false;
    return new Date(date) < new Date();
  }
}
