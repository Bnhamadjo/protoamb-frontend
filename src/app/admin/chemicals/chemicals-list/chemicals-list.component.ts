import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ChemicalProductService, ChemicalProduct } from '../../../services/chemical-product.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-chemicals-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="admin-container anim-up">
      <header class="page-header friendly-header">
        <div class="title-section">
          <div class="header-icon-box">🧪</div>
          <div>
            <h1>Inventário Químico</h1>
            <p>Controlo institucional de substâncias e reagentes</p>
          </div>
        </div>
        <div class="header-actions">
           <a routerLink="new" class="btn-primary-pro">
            <span class="icon">➕</span> Novo Registo
          </a>
        </div>
      </header>

      <div class="friendly-stats">
        <div class="f-stat-card soft-card">
          <div class="f-stat-icon info">📋</div>
          <div class="f-stat-info">
            <div class="f-stat-label">Total em Stock</div>
            <div class="f-stat-value">{{ stats.total }}</div>
          </div>
        </div>
        <div class="f-stat-card soft-card" *ngIf="stats.expired > 0">
          <div class="f-stat-icon danger">⚠️</div>
          <div class="f-stat-info">
            <div class="f-stat-label">Fora de Validade</div>
            <div class="f-stat-value text-danger">{{ stats.expired }}</div>
          </div>
        </div>
        <div class="f-stat-card soft-card">
          <div class="f-stat-icon warning">☢️</div>
          <div class="f-stat-info">
            <div class="f-stat-label">Risco Crítico</div>
            <div class="f-stat-value text-warning">{{ stats.high_risk }}</div>
          </div>
        </div>
      </div>

      <div class="data-card white-card listing-card shadow-sm">
        <div class="table-controls">
          <div class="search-box-light">
             <span class="search-icon">🔍</span>
             <input type="text" placeholder="Pesquisar por nome ou fabricante..." (input)="filter($any($event.target).value)">
          </div>
        </div>

        <div class="table-responsive">
          <table class="modern-table friendly-table">
            <thead>
              <tr>
                <th>Substância / Fabricante</th>
                <th>Localização</th>
                <th>Stock</th>
                <th>Risco GHS</th>
                <th>Validade</th>
                <th class="text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of filteredChemicals" class="friendly-row">
                <td>
                  <div class="chem-cell">
                    <div class="chem-icon-box" [ngClass]="item.risk_level">🧪</div>
                    <div class="chem-text">
                      <span class="chem-name">{{ item.name }}</span>
                      <span class="chem-brand">{{ item.manufacturer || 'Fabricante não indicado' }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="location-cell">
                    <span class="text-muted small">📍</span> {{ item.location || '--' }}
                  </div>
                </td>
                <td>
                  <div class="stock-cell">
                     <span class="amount">{{ item.quantity }}</span> 
                     <span class="unit">{{ item.unit }}</span>
                  </div>
                </td>
                <td>
                  <div class="risk-tag" [ngClass]="item.risk_level">
                    <span class="dot"></span>
                    {{ item.risk_level | uppercase }}
                  </div>
                </td>
                <td>
                  <div class="status-cell">
                    <span class="date-label" [class.expired]="isExpired(item.expiry_date)">
                      {{ item.expiry_date ? (item.expiry_date | date:'dd/MM/yyyy') : '--' }}
                    </span>
                  </div>
                </td>
                <td class="text-right actions-cell">
                  <div class="friendly-actions">
                    <a [routerLink]="['edit', item.id]" class="btn-action edit" title="Editar">✏️</a>
                    <button (click)="deleteChemical(item)" class="btn-action delete" title="Remover">🗑️</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div *ngIf="filteredChemicals.length === 0" class="friendly-empty">
             <div class="empty-icon">⚗️</div>
             <h3>Nenhum resultado encontrado</h3>
             <p>Não existem produtos químicos que correspondam à sua pesquisa.</p>
          </div>
        </div>
      </div>
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
      margin-right: 20px; box-shadow: inset 0 0 10px rgba(0,0,0,0.02);
    }
    .title-section { display: flex; align-items: center; }
    .title-section h1 { margin: 0; font-size: 1.8rem; color: var(--brand); }
    .title-section p { margin: 5px 0 0; color: var(--ink-muted); font-size: 0.95rem; }

    .btn-primary-pro {
      background: var(--brand); color: white; padding: 12px 24px; border-radius: 12px;
      font-weight: 700; display: inline-flex; align-items: center; gap: 10px;
      transition: all 0.3s; box-shadow: 0 4px 15px rgba(10, 60, 46, 0.2);
    }
    .btn-primary-pro:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(10, 60, 46, 0.3); opacity: 0.9; }

    .friendly-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .soft-card { 
      background: var(--surface); border-radius: var(--radius-lg); padding: 25px;
      border: 1px solid var(--border); box-shadow: var(--shadow-sm);
      display: flex; align-items: center; gap: 20px; transition: var(--transition);
    }
    .soft-card:hover { transform: translateY(-3px); box-shadow: var(--shadow); border-color: var(--brand); }

    .f-stat-icon { 
      width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;
      background: #f8faf9; border: 1px solid var(--border);
    }
    .f-stat-value { font-size: 1.8rem; font-weight: 800; color: var(--brand); line-height: 1; }
    .f-stat-label { font-size: 0.8rem; color: var(--ink-muted); font-weight: 600; text-transform: uppercase; margin-bottom: 4px; }

    .white-card { background: var(--surface); border-radius: var(--radius-lg); border: 1px solid var(--border); overflow: hidden; }
    .table-controls { padding: 25px 30px; background: #fcfdfc; border-bottom: 1px solid var(--border); }
    
    .search-box-light { 
      background: #f1f4f3; border: 1px solid var(--border); 
      border-radius: 12px; padding: 12px 20px; display: flex; align-items: center; gap: 12px;
      max-width: 450px; transition: all 0.3s;
    }
    .search-box-light:focus-within { border-color: var(--brand); background: white; box-shadow: 0 0 0 4px rgba(10, 60, 46, 0.05); }
    .search-box-light input { background: transparent; border: none; color: var(--ink); width: 100%; outline: none; font-size: 0.95rem; }

    .friendly-table { width: 100%; border-collapse: collapse; }
    .friendly-table thead th { background: #f8faf9; color: var(--brand); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; padding: 15px 30px; border-bottom: 2px solid var(--border); text-align: left; }
    
    .friendly-row { border-bottom: 1px solid var(--border); transition: all 0.2s; }
    .friendly-row:hover { background: #f9fbfb; }
    .friendly-row td { padding: 20px 30px; vertical-align: middle; }

    .chem-icon-box { 
      width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center;
      background: #f1f5f9; color: #94a3b8; font-size: 1rem;
    }
    .chem-icon-box.extreme { background: #fee2e2; color: #ef4444; }
    
    .chem-name { display: block; font-weight: 700; color: var(--ink); font-size: 0.95rem; }
    .chem-brand { display: block; font-size: 0.8rem; color: var(--ink-muted); }

    .risk-tag { 
      display: inline-flex; align-items: center; gap: 8px; font-weight: 800; font-size: 0.7rem; 
      padding: 4px 10px; border-radius: 6px; background: #f1f5f9; color: #475569;
    }
    .risk-tag .dot { width: 6px; height: 6px; border-radius: 50%; }
    .risk-low { background: #ecfdf5; color: #065f46; } .risk-low .dot { background: #10b981; }
    .risk-medium { background: #fffbeb; color: #92400e; } .risk-medium .dot { background: #f59e0b; }
    .risk-high { background: #fef2f2; color: #991b1b; } .risk-high .dot { background: #ef4444; }
    .risk-extreme { background: #ef4444; color: white; } .risk-extreme .dot { background: white; animation: flash 1s infinite; }

    @keyframes flash { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }

    .date-label { font-weight: 600; color: var(--ink-muted); font-size: 0.85rem; }
    .date-label.expired { color: var(--danger); background: #fee2e2; padding: 2px 6px; border-radius: 4px; }

    .friendly-actions { display: flex; gap: 8px; justify-content: flex-end; }
    .btn-action { 
      width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center;
      background: white; border: 1px solid var(--border); color: var(--ink-muted); cursor: pointer; transition: 0.2s;
    }
    .btn-action:hover { border-color: var(--brand); color: var(--brand); transform: translateY(-1px); }
    .btn-action.delete:hover { border-color: var(--danger); color: var(--danger); background: #fff1f2; }

    .friendly-empty { text-align: center; padding: 80px 40px; color: var(--ink-muted); }
    .empty-icon { font-size: 3rem; margin-bottom: 20px; opacity: 0.3; }
  `]
})
export class ChemicalsListComponent implements OnInit {
  chemicals: ChemicalProduct[] = [];
  filteredChemicals: ChemicalProduct[] = [];
  stats = { total: 0, expired: 0, high_risk: 0 };
  searchTerm = '';

  constructor(
    private chemicalService: ChemicalProductService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.loadStats();
  }

  loadData(): void {
    this.chemicalService.getAll().subscribe(res => {
      this.chemicals = res;
      this.applyFilter();
    });
  }

  loadStats(): void {
    this.chemicalService.getStats().subscribe((res: any) => this.stats = res);
  }

  filter(val: string): void {
    this.searchTerm = val.toLowerCase();
    this.applyFilter();
  }

  applyFilter(): void {
    if (!this.searchTerm) {
      this.filteredChemicals = this.chemicals;
      return;
    }
    this.filteredChemicals = this.chemicals.filter(c => 
      c.name.toLowerCase().includes(this.searchTerm) || 
      (c.manufacturer && c.manufacturer.toLowerCase().includes(this.searchTerm))
    );
  }

  isExpired(date: string | undefined): boolean {
    if (!date) return false;
    return new Date(date) < new Date();
  }

  deleteChemical(item: ChemicalProduct): void {
    if (confirm(`Tem a certeza que deseja eliminar ${item.name}?`)) {
      this.chemicalService.delete(item.id!).subscribe({
        next: () => {
          this.toast.success('Produto removido');
          this.loadData();
          this.loadStats();
        },
        error: () => this.toast.error('Erro ao eliminar')
      });
    }
  }
}
