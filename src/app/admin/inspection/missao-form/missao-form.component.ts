import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { InspectionService, Missao } from '../services/inspection.service';
import { TeamService, Equipa } from '../services/team.service';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-missao-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="p-6">
      <div class="mb-6">
        <a routerLink="/admin/inspection/missoes" class="text-blue-600 text-sm hover:underline">← Voltar</a>
        <h1 class="text-2xl font-bold mt-2">{{ isEdit ? 'Editar' : 'Nova' }} Missão de Inspeção</h1>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-3xl">
        <form (ngSubmit)="save()" #form="ngForm" class="space-y-6">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Título da Missão</label>
            <input type="text" name="titulo" [(ngModel)]="model.titulo" required placeholder="Ex: Patrulha Setor Oeste" class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Objetivos / Descrição</label>
            <textarea name="descricao" [(ngModel)]="model.descricao" rows="4" class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Data de Início</label>
              <input type="datetime-local" name="data_inicio" [(ngModel)]="model.data_inicio" required class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Fim Previsto</label>
              <input type="datetime-local" name="data_fim_prevista" [(ngModel)]="model.data_fim_prevista" class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Equipa Responsável</label>
              <select name="equipa_id" [(ngModel)]="model.equipa_id" required class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                <option *ngFor="let t of teams" [value]="t.id">{{ t.nome }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Status Inicial</label>
              <select name="status" [(ngModel)]="model.status" class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="planeada">Planeada</option>
                <option value="em curso">Em Curso</option>
                <option value="concluida">Concluída</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-6 border-t">
            <button type="button" routerLink="/admin/inspection/missoes" class="px-6 py-2 border rounded-lg font-bold">
              Cancelar
            </button>
            <button type="submit" [disabled]="!form.valid" class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold disabled:opacity-50">
              {{ isEdit ? 'Atualizar Missão' : 'Criar Missão' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class MissaoFormComponent implements OnInit {
  isEdit = false;
  model: Partial<Missao> = {
    status: 'planeada'
  };
  teams: Equipa[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private inspectionService: InspectionService,
    private teamService: TeamService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.teamService.all().subscribe({
      next: data => this.teams = data,
      error: () => this.toast.error('Erro ao carregar equipas.')
    });
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit = true;
      this.inspectionService.getMissao(Number(id)).subscribe({
        next: data => {
          this.model = data;
          // Format dates for input type="datetime-local"
          if (this.model.data_inicio) this.model.data_inicio = this.model.data_inicio.substring(0, 16);
          if (this.model.data_fim_prevista) this.model.data_fim_prevista = this.model.data_fim_prevista.substring(0, 16);
        },
        error: () => this.toast.error('Erro ao carregar dados da missão.')
      });
    }
  }

  save() {
    const obs = this.isEdit 
      ? this.inspectionService.updateMissao(this.model.id!, this.model)
      : this.inspectionService.createMissao(this.model);

    obs.subscribe({
      next: () => {
        this.toast.success(this.isEdit ? 'Missão atualizada' : 'Missão criada com sucesso');
        this.router.navigate(['/admin/inspection/missoes']);
      },
      error: () => this.toast.error('Erro ao guardar missão. Verifique os dados.')
    });
  }
}
