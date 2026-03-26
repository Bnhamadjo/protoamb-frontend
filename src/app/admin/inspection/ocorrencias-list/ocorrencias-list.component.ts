import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InspectionService, Ocorrencia } from '../services/inspection.service';

@Component({
  selector: 'app-ocorrencias-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Ocorrências Ambientais</h1>
        <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition" [routerLink]="['/admin/inspection/ocorrencias/new']">
          Nova Ocorrência
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="p-4 font-semibold text-gray-600">Título</th>
              <th class="p-4 font-semibold text-gray-600">Tipo</th>
              <th class="p-4 font-semibold text-gray-600">Status</th>
              <th class="p-4 font-semibold text-gray-600">Gravidade</th>
              <th class="p-4 font-semibold text-gray-600">Data</th>
              <th class="p-4 font-semibold text-gray-600 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of ocorrencias" class="border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer" [routerLink]="['/admin/inspection/ocorrencias', item.id]">
              <td class="p-4 font-medium">{{ item.titulo }}</td>
              <td class="p-4">{{ item.tipo }}</td>
              <td class="p-4">
                <span class="px-2 py-1 rounded-full text-xs font-medium" [ngClass]="getStatusClass(item.status)">
                  {{ item.status }}
                </span>
              </td>
              <td class="p-4">
                <span class="px-2 py-1 rounded-full text-xs font-medium" [ngClass]="getGravidadeClass(item.gravidade)">
                  {{ item.gravidade }}
                </span>
              </td>
              <td class="p-4 text-gray-500 text-sm">{{ item.created_at | date:'dd/MM/yyyy HH:mm' }}</td>
              <td class="p-4 text-right">
                <button class="text-blue-600 hover:text-blue-800">Ver detalhes</button>
              </td>
            </tr>
            <tr *ngIf="ocorrencias.length === 0">
              <td colspan="6" class="p-8 text-center text-gray-400 italic">
                Nenhuma ocorrência registada.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .status-pending { background-color: #fef3c7; color: #92400e; }
    .status-investigating { background-color: #dbeafe; color: #1e40af; }
    .status-resolved { background-color: #dcfce7; color: #166534; }
    .status-archived { background-color: #f3f4f6; color: #374151; }
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
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'em analise': return 'bg-blue-100 text-blue-800';
      case 'resolvida': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getGravidadeClass(gravidade: string) {
    switch (gravidade) {
      case 'alta':
      case 'critica': return 'bg-red-100 text-red-800';
      case 'media': return 'bg-orange-100 text-orange-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  }
}
