import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InspectionService, Missao } from '../services/inspection.service';

@Component({
  selector: 'app-missoes-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Missões de Inspeção</h1>
        <button class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition" [routerLink]="['/admin/inspection/missoes/new']">
          Nova Missão
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-100">
              <th class="p-4 font-semibold text-gray-600">Título</th>
              <th class="p-4 font-semibold text-gray-600">Equipa</th>
              <th class="p-4 font-semibold text-gray-600">Status</th>
              <th class="p-4 font-semibold text-gray-600">Início</th>
              <th class="p-4 font-semibold text-gray-600 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of missoes" class="border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer" [routerLink]="['/admin/inspection/missoes', item.id]">
              <td class="p-4 font-medium">{{ item.titulo }}</td>
              <td class="p-4">{{ item.equipa?.nome || 'Sem equipa' }}</td>
              <td class="p-4">
                <span class="px-2 py-1 rounded-full text-xs font-medium" [ngClass]="getStatusClass(item.status)">
                  {{ item.status }}
                </span>
              </td>
              <td class="p-4 text-gray-500 text-sm">{{ item.data_inicio | date:'dd/MM/yyyy' }}</td>
              <td class="p-4 text-right">
                <button class="text-blue-600 hover:text-blue-800">Gerir Missão</button>
              </td>
            </tr>
            <tr *ngIf="missoes.length === 0">
              <td colspan="5" class="p-8 text-center text-gray-400 italic">
                Nenhuma missão planeada.
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
