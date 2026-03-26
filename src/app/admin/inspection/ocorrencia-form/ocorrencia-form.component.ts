import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { InspectionService, Ocorrencia } from '../services/inspection.service';
import { TeamService, Equipa } from '../services/team.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ocorrencia-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="p-6">
      <div class="mb-6">
        <a routerLink="/admin/inspection/ocorrencias" class="text-blue-600 text-sm hover:underline">← Voltar</a>
        <h1 class="text-2xl font-bold mt-2">{{ isEdit ? 'Editar' : 'Nova' }} Ocorrência</h1>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-3xl">
        <form (ngSubmit)="save()" #form="ngForm" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="block text-sm font-bold text-gray-700 mb-2">Título da Ocorrência</label>
              <input type="text" name="titulo" [(ngModel)]="model.titulo" required class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-bold text-gray-700 mb-2">Descrição Detalhada</label>
              <textarea name="descricao" [(ngModel)]="model.descricao" rows="5" required class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Tipo de Incidente</label>
              <select name="tipo" [(ngModel)]="model.tipo" required class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="Incêndio">Incêndio</option>
                <option value="Desmatamento">Desmatamento</option>
                <option value="Caça Ilegal">Caça Ilegal</option>
                <option value="Poluição">Poluição</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Gravidade</label>
              <select name="gravidade" [(ngModel)]="model.gravidade" required class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Atribuir Equipa</label>
              <select name="equipa_id" [(ngModel)]="model.equipa_id" class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                <option [ngValue]="null">Não atribuir agora</option>
                <option *ngFor="let t of teams" [value]="t.id">{{ t.nome }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Localização (Texto)</label>
              <input type="text" name="localizacao" [(ngModel)]="model.localizacao" placeholder="Ex: Setor de Buba" class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-6 border-t">
            <button type="button" routerLink="/admin/inspection/ocorrencias" class="px-6 py-2 border rounded-lg hover:bg-gray-50 transition font-bold">
              Cancelar
            </button>
            <button type="submit" [disabled]="!form.valid" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold disabled:opacity-50">
              {{ isEdit ? 'Guardar Alterações' : 'Criar Ocorrência' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class OcorrenciaFormComponent implements OnInit {
  isEdit = false;
  model: Partial<Ocorrencia> = {
    status: 'pendente',
    gravidade: 'media'
  };
  teams: Equipa[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private inspectionService: InspectionService,
    private teamService: TeamService
  ) {}

  ngOnInit() {
    this.teamService.all().subscribe(data => this.teams = data);
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit = true;
      this.inspectionService.getOcorrencia(Number(id)).subscribe(data => {
        this.model = data;
      });
    }
  }

  save() {
    const obs = this.isEdit 
      ? this.inspectionService.updateOcorrencia(this.model.id!, this.model)
      : this.inspectionService.createOcorrencia(this.model);

    obs.subscribe(() => {
      this.router.navigate(['/admin/inspection/ocorrencias']);
    });
  }
}
