import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InspectionService, Missao } from '../services/inspection.service';

@Component({
  selector: 'app-missoes-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container p-8 anim-fade-in">
      <div class="flex justify-between items-end mb-10">
        <div>
          <h1 class="text-4xl font-serif text-brand mb-2">Missões de Inspeção</h1>
          <p class="text-ink-muted">Planeamento, execução e monitorização de brigadas em campo.</p>
        </div>
        <button class="btn primary lg shadow-lg hover:scale-105 transition-all" [routerLink]="['/admin/inspection/missoes/new']">
          + Nova Missão Estratégica
        </button>
      </div>

      <div class="impeccable-card overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-100">
              <th class="p-5 font-bold text-xs uppercase tracking-widest text-brand">Título da Missão</th>
              <th class="p-5 font-bold text-xs uppercase tracking-widest text-brand">Equipa Designada</th>
              <th class="p-5 font-bold text-xs uppercase tracking-widest text-brand text-center">Estado</th>
              <th class="p-5 font-bold text-xs uppercase tracking-widest text-brand text-center">Data Início</th>
              <th class="p-5 font-bold text-xs uppercase tracking-widest text-brand text-right">Acções</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of missoes" class="group border-b border-slate-50 hover:bg-slate-50/50 transition-all cursor-pointer" [routerLink]="['/admin/inspection/missoes', item.id]">
              <td class="p-5">
                <div class="font-serif text-lg text-brand group-hover:translate-x-1 transition-all">{{ item.titulo }}</div>
              </td>
              <td class="p-5">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-brand border">
                    {{ item.equipa?.nome?.substring(0,2) || '?' }}
                  </div>
                  <span class="text-ink-muted text-sm">{{ item.equipa?.nome || 'Pendente' }}</span>
                </div>
              </td>
              <td class="p-5 text-center">
                <span class="badge px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest inline-block min-w-[100px]" [ngClass]="getStatusClass(item.status)">
                  {{ item.status }}
                </span>
              </td>
              <td class="p-5 text-center">
                <div class="text-ink-muted text-sm font-mono">{{ item.data_inicio | date:'dd MMM, yyyy' }}</div>
              </td>
              <td class="p-5 text-right">
                <button class="text-brand font-bold text-[10px] uppercase tracking-widest hover:text-black transition-all">Ver Detalhes →</button>
              </td>
            </tr>
            <tr *ngIf="missoes.length === 0">
              <td colspan="5" class="p-20 text-center">
                <div class="opacity-30 mb-4 text-4xl">📋</div>
                <p class="text-ink-muted italic font-serif">Nenhuma missão activa ou agendada para o período actual.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class MissoesListComponent implements OnInit {
  missoes: Missao[] = [];

  constructor(private inspectionService: InspectionService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.inspectionService.getMissoes().subscribe((data: Missao[]) => {
      this.missoes = data;
    });
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'planeada': return 'bg-blue-100 text-blue-800';
      case 'em curso': return 'bg-orange-100 text-orange-800';
      case 'concluida': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
