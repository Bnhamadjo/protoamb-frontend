import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InspectionService, Ocorrencia } from '../services/inspection.service';

@Component({
  selector: 'app-ocorrencias-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="content-view anim-up">
      <header class="section-header">
        <div class="header-left">
          <div class="section-kicker">Fiscalização & Controlo</div>
          <h1 class="section-title">Ocorrências Ambientais</h1>
        </div>
        <div class="header-right">
          <button class="btn primary lg" [routerLink]="['/admin/inspection/ocorrencias/new']">
            <span>+</span> Nova Ocorrência
          </button>
        </div>
      </header>

      <div class="table-container shadow-lg mt-8">
        <table class="table">
          <thead>
            <tr>
              <th width="35%">Título da Ocorrência</th>
              <th>Categoria</th>
              <th>Estado</th>
              <th>Gravidade</th>
              <th>Data de Registo</th>
              <th class="text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of ocorrencias" class="clickable-row" [routerLink]="['/admin/inspection/ocorrencias', item.id]">
              <td>
                <div class="title-cell">
                  <span class="main-text">{{ item.titulo }}</span>
                  <span class="sub-text">{{ item.id }}</span>
                </div>
              </td>
              <td>{{ item.tipo }}</td>
              <td>
                <span class="badge" [ngClass]="getStatusClass(item.status)">
                  {{ item.status }}
                </span>
              </td>
              <td>
                <span class="badge" [ngClass]="getGravidadeClass(item.gravidade)">
                  {{ item.gravidade }}
                </span>
              </td>
              <td class="muted">{{ item.created_at | date:'dd MMM yyyy, HH:mm' }}</td>
              <td class="text-right">
                <button class="btn sm ghost">Gerir recurso</button>
              </td>
            </tr>
            <tr *ngIf="ocorrencias.length === 0">
              <td colspan="6">
                <div class="empty-illustration">
                  <h3>Nenhuma ocorrência registada</h3>
                  <p class="muted">Os alertas de fiscalização ambiental aparecerão nesta listagem assim que forem criados.</p>
                  <button class="btn outline sm" [routerLink]="['/admin/inspection/ocorrencias/new']">Registar primeira ocorrência</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .section-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; }
    .title-cell { display: flex; flex-direction: column; }
    .main-text { font-weight: 800; color: var(--brand); font-size: 1.05rem; }
    .sub-text { font-size: 0.75rem; color: var(--ink-light); text-transform: uppercase; letter-spacing: 1px; }
    
    .badge { 
      padding: 6px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;
      display: inline-flex; align-items: center; gap: 6px;
    }
    .badge::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

    .status-pendente { background: #fef3c7; color: #92400e; }
    .status-analise { background: #dbeafe; color: #1e40af; }
    .status-resolvida { background: #dcfce7; color: #166534; }
    
    .grav-critica, .grav-alta { background: #fee2e2; color: #991b1b; }
    .grav-media { background: #ffedd5; color: #9a3412; }
    .grav-baixa { background: #f0fdf4; color: #166534; }

    .clickable-row { cursor: pointer; transition: var(--transition-fast); }
    .clickable-row:hover { background: var(--surface-hover); }
  `]
})
export class OcorrenciasListComponent implements OnInit {
  ocorrencias: Ocorrencia[] = [];

  constructor(private inspectionService: InspectionService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.inspectionService.getOcorrencias().subscribe((data: Ocorrencia[]) => {
      this.ocorrencias = data;
    });
  }

  getStatusClass(status: string) {
    switch (status?.toLowerCase()) {
      case 'pendente': return 'status-pendente';
      case 'em analise': return 'status-analise';
      case 'resolvida': return 'status-resolvida';
      default: return 'status-pendente';
    }
  }

  getGravidadeClass(gravidade: string) {
    switch (gravidade?.toLowerCase()) {
      case 'alta':
      case 'critica': return 'grav-critica';
      case 'media': return 'grav-media';
      default: return 'grav-baixa';
    }
  }
}
