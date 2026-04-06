import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ExplorerService, DataSchema, DataResource } from '../../../services/explorer.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-query-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="admin-container anim-up">
      <header class="premium-header">
        <div class="title-group">
          <h1 class="premium-title">Assistente de Consulta</h1>
          <p class="premium-subtitle">Defina o quê, como e quando quer visualizar os seus dados.</p>
        </div>
        <a routerLink="/admin/explorer" class="premium-btn secondary">
          <span class="icon">⬅️</span> Cancelar
        </a>
      </header>

      <div class="builder-layout">
        <!-- Step Sidebar -->
        <aside class="builder-steps glass-card">
          <div class="step-item" [class.active]="step === 1" (click)="step = 1">
            <span class="step-num">1</span>
            <div class="step-text">
              <strong>Fonte</strong>
              <small>{{ selectedSchema?.name || 'Não selecionada' }}</small>
            </div>
          </div>
          <div class="step-line"></div>
          <div class="step-item" [class.active]="step === 2" [class.disabled]="!selectedSchema" (click)="selectedSchema && step = 2">
            <span class="step-num">2</span>
            <div class="step-text">
              <strong>Colunas</strong>
              <small>{{ selectedColumns.length }} colunas</small>
            </div>
          </div>
          <div class="step-line"></div>
          <div class="step-item" [class.active]="step === 3" [class.disabled]="!selectedSchema" (click)="selectedSchema && step = 3">
            <span class="step-num">3</span>
            <div class="step-text">
              <strong>Filtros</strong>
              <small>{{ filters.length }} ativos</small>
            </div>
          </div>
          <div class="step-line"></div>
          <div class="step-item" [class.active]="step === 4" [class.disabled]="!selectedSchema" (click)="selectedSchema && step = 4">
            <span class="step-num">4</span>
            <div class="step-text">
              <strong>Guardar</strong>
              <small>Exportar & Partilhar</small>
            </div>
          </div>
        </aside>

        <!-- Main Builder Content -->
        <main class="builder-content glass-card">
          <!-- STEP 1: SELECT SOURCE -->
          <div *ngIf="step === 1" class="step-content">
            <h2 class="step-title">1. Selecione a Fonte de Dados</h2>
            <div class="schema-grid">
              <div *ngFor="let s of schemas" 
                   (click)="selectSchema(s)" 
                   class="schema-card" 
                   [class.selected]="selectedSchema?.id === s.id">
                <span class="schema-icon">📂</span>
                <strong>{{ s.name }}</strong>
                <p>{{ s.fields.length }} campos disponíveis</p>
              </div>
            </div>
          </div>

          <!-- STEP 2: SELECT COLUMNS -->
          <div *ngIf="step === 2 && selectedSchema" class="step-content">
            <h2 class="step-title">2. Escolha as Colunas a Exibir</h2>
            <div class="columns-selector">
              <div *ngFor="let f of selectedSchema.fields" class="column-checkbox">
                <label>
                  <input type="checkbox" [checked]="isColumnSelected(f.name)" (change)="toggleColumn(f.name)">
                  <span class="check-custom"></span>
                  <div class="label-info">
                    <strong>{{ f.label }}</strong>
                    <small>{{ f.type }}</small>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- STEP 3: ADD FILTERS -->
          <div *ngIf="step === 3 && selectedSchema" class="step-content">
            <h2 class="step-title">3. Refine com Filtros Inteligentes</h2>
            <div class="filters-list">
              <div *ngFor="let f of filters; let i = index" class="filter-row">
                <select [(ngModel)]="f.field" class="premium-input sm">
                  <option *ngFor="let field of selectedSchema.fields" [value]="field.name">{{ field.label }}</option>
                </select>
                <select [(ngModel)]="f.operator" class="premium-input sm icon-select">
                  <option value="=">Igual a</option>
                  <option value="!=">Diferente de</option>
                  <option value="like">Contém</option>
                  <option value=">">Maior que</option>
                  <option value="<">Menor que</option>
                </select>
                <input type="text" [(ngModel)]="f.value" class="premium-input sm" placeholder="Valor...">
                <button (click)="removeFilter(i)" class="btn-icon delete">🗑️</button>
              </div>
              <button (click)="addFilter()" class="premium-btn outline sm mt-2">
                ➕ Adicionar Filtro
              </button>
            </div>
          </div>

          <!-- STEP 4: SAVE & CONFIG -->
          <div *ngIf="step === 4 && selectedSchema" class="step-content">
            <h2 class="step-title">4. Identidade da sua Consulta</h2>
            <div class="save-config">
              <div class="premium-group">
                <label class="premium-label">Título da Vista</label>
                <input type="text" [(ngModel)]="resource.title" placeholder="Ex: Relatório de Ocorrências Mensal" class="premium-input">
              </div>
              <div class="premium-group">
                <label class="premium-label">Categoria</label>
                <input type="text" [(ngModel)]="resource.category" placeholder="Ex: Sustentabilidade" class="premium-input">
              </div>
              <div class="premium-group">
                <label>
                  <input type="checkbox" [(ngModel)]="resource.is_public"> Tornar público para toda a organização
                </label>
              </div>
            </div>
          </div>

          <footer class="builder-footer">
            <button *ngIf="step > 1" (click)="step = step - 1" class="premium-btn outline">Anterior</button>
            <div class="spacer"></div>
            <button *ngIf="step < 4" (click)="step = step + 1" [disabled]="!selectedSchema" class="premium-btn primary">Próximo</button>
            <button *ngIf="step === 4" (click)="save()" [disabled]="!resource.title || loading" class="premium-btn primary">
              🚀 Guardar e Ver Dados
            </button>
          </footer>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .builder-layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 32px;
    }

    .builder-steps {
      padding: 32px;
      height: fit-content;
    }

    .step-item {
      display: flex;
      gap: 16px;
      align-items: center;
      cursor: pointer;
      opacity: 0.6;
      transition: var(--transition-fast);
    }

    .step-item.active { opacity: 1; }
    .step-item.disabled { cursor: not-allowed; opacity: 0.3; }

    .step-num {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      color: var(--ink-muted);
    }

    .active .step-num {
      background: var(--brand);
      color: white;
      box-shadow: 0 4px 10px rgba(6, 38, 29, 0.3);
    }

    .step-text strong { display: block; font-size: 0.95rem; }
    .step-text small { font-size: 0.75rem; color: var(--ink-light); }

    .step-line {
      width: 2px;
      height: 24px;
      background: var(--border);
      margin-left: 17px;
    }

    .builder-content {
      padding: 48px;
    }

    .step-title {
      font-size: 1.8rem;
      margin-bottom: 32px;
      color: var(--brand);
    }

    .schema-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }

    .schema-card {
      padding: 24px;
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: var(--transition-fast);
      text-align: center;
    }

    .schema-card:hover, .schema-card.selected {
      border-color: var(--brand);
      background: rgba(6, 38, 29, 0.02);
      transform: translateY(-4px);
    }

    .schema-card.selected {
      box-shadow: 0 8px 20px rgba(6, 38, 29, 0.1);
    }

    .schema-icon { font-size: 2rem; display: block; margin-bottom: 12px; }

    .columns-selector {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 16px;
    }

    .column-checkbox label {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border: 1px solid var(--border);
      border-radius: 12px;
      cursor: pointer;
      transition: var(--transition-fast);
    }

    .column-checkbox label:hover { background: #f8fafc; }

    .label-info strong { display: block; font-size: 0.9rem; }
    .label-info small { font-size: 0.7rem; color: var(--ink-light); text-transform: uppercase; }

    .filter-row {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;
      align-items: center;
    }

    .builder-footer {
      margin-top: 48px;
      padding-top: 32px;
      border-top: 1px solid var(--border);
      display: flex;
      align-items: center;
    }

    /* Small Premium Style Utils */
    .premium-group { margin-bottom: 24px; }
    .premium-label { display: block; margin-bottom: 8px; font-weight: 700; color: var(--brand); font-size: 0.9rem; }
    .spacer { flex: 1; }
    .btn-icon.delete:hover { color: #ef4444; }
  `]
})
export class QueryBuilderComponent implements OnInit {
  step = 1;
  loading = false;
  
  schemas: DataSchema[] = [];
  selectedSchema: DataSchema | null = null;
  
  selectedColumns: string[] = [];
  filters: any[] = [];
  
  resource: DataResource = {
    title: '',
    type: 'custom',
    source: '',
    configuration: {},
    is_public: false
  };

  constructor(
    private explorerService: ExplorerService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.explorerService.getSchemas().subscribe({
      next: (s) => this.schemas = s,
      error: () => this.toast.error('Erro ao carregar esquemas')
    });
  }

  selectSchema(schema: DataSchema): void {
    this.selectedSchema = schema;
    this.resource.source = schema.id;
    this.selectedColumns = schema.fields.map(f => f.name); // Default select all
    this.filters = [];
  }

  toggleColumn(colName: string): void {
    const idx = this.selectedColumns.indexOf(colName);
    if (idx > -1) {
      this.selectedColumns.splice(idx, 1);
    } else {
      this.selectedColumns.push(colName);
    }
  }

  isColumnSelected(colName: string): boolean {
    return this.selectedColumns.includes(colName);
  }

  addFilter(): void {
    this.filters.push({ field: this.selectedSchema?.fields[0].name, operator: '=', value: '' });
  }

  removeFilter(idx: number): void {
    this.filters.splice(idx, 1);
  }

  save(): void {
    this.loading = true;
    this.resource.configuration = {
      columns: this.selectedColumns,
      filters: this.filters
    };

    this.explorerService.saveResource(this.resource).subscribe({
      next: (res) => {
        this.toast.success('Consulta guardada com sucesso!');
        this.router.navigate(['/admin/explorer', res.id]);
      },
      error: () => {
        this.toast.error('Erro ao guardar consulta');
        this.loading = false;
      }
    });
  }
}
