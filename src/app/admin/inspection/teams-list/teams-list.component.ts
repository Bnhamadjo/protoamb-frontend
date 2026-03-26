import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TeamService, Equipa } from '../services/team.service';

@Component({
  selector: 'app-teams-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Gestão de Equipas</h1>
        <button class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition" [routerLink]="['/admin/inspection/teams/new']">
          Criar Equipa
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let team of teams" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition cursor-pointer" [routerLink]="['/admin/inspection/teams', team.id]">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl" [style.background-color]="team.color_code || '#6366f1'">
              {{ team.nome.charAt(0) }}
            </div>
            <div>
              <h2 class="font-bold text-lg">{{ team.nome }}</h2>
              <p class="text-gray-500 text-sm">{{ team.users?.length || 0 }} Membros</p>
            </div>
          </div>
          <p class="text-gray-600 text-sm mb-4 line-clamp-2">
            {{ team.descricao || 'Sem descrição.' }}
          </p>
          <div class="flex justify-between items-center text-xs font-medium">
            <span class="text-gray-400">Criada em {{ team.created_at | date:'dd/MM/yyyy' }}</span>
            <span class="text-indigo-600 hover:underline">Ver detalhes</span>
          </div>
        </div>

        <div *ngIf="teams.length === 0" class="col-span-full p-12 text-center text-gray-400 italic">
          Nenhuma equipa configurada.
        </div>
      </div>
    </div>
  `
})
export class TeamsListComponent implements OnInit {
  teams: Equipa[] = [];

  constructor(private teamService: TeamService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.teamService.all().subscribe((data: Equipa[]) => {
      this.teams = data;
    });
  }
}
