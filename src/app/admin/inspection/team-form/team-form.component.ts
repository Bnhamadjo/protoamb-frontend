import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { TeamService, Equipa } from '../services/team.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-team-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="p-6">
      <div class="mb-6">
        <a routerLink="/admin/inspection/teams" class="text-blue-600 text-sm hover:underline">← Voltar</a>
        <h1 class="text-2xl font-bold mt-2">{{ isEdit ? 'Editar' : 'Nova' }} Equipa Técnica</h1>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-2xl">
        <form (ngSubmit)="save()" #form="ngForm" class="space-y-6">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Nome da Equipa</label>
            <input type="text" name="nome" [(ngModel)]="model.nome" required placeholder="Ex: Brigada Florestal Leste" class="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500">
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Descrição / Especialidade</label>
            <textarea name="descricao" [(ngModel)]="model.descricao" rows="4" class="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Cor de Identificação</label>
            <div class="flex gap-4 items-center">
              <input type="color" name="color_code" [(ngModel)]="model.color_code" class="w-12 h-12 border-none rounded cursor-pointer">
              <span class="text-gray-500 font-mono">{{ model.color_code }}</span>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-6 border-t">
            <button type="button" routerLink="/admin/inspection/teams" class="px-6 py-2 border rounded-lg font-bold">
              Cancelar
            </button>
            <button type="submit" [disabled]="!form.valid" class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-bold disabled:opacity-50">
              {{ isEdit ? 'Guardar Alterações' : 'Criar Equipa' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class TeamFormComponent implements OnInit {
  isEdit = false;
  model: Partial<Equipa> = {
    color_code: '#6366f1'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private teamService: TeamService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit = true;
      this.teamService.show(Number(id)).subscribe(data => {
        this.model = data;
      });
    }
  }

  save() {
    const obs = this.isEdit 
      ? this.teamService.update(this.model.id!, this.model)
      : this.teamService.create(this.model);

    obs.subscribe(() => {
      this.router.navigate(['/admin/inspection/teams']);
    });
  }
}
