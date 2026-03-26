import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { TeamService, Equipa } from '../services/team.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-team-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="p-6" *ngIf="team">
      <div class="flex justify-between items-center mb-6">
        <div>
          <a routerLink="/admin/inspection/teams" class="text-blue-600 text-sm hover:underline">← Voltar para a lista</a>
          <h1 class="text-3xl font-bold mt-2">{{ team.nome }}</h1>
        </div>
        <button class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition" (click)="deleteTeam()">
          Eliminar Equipa
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 class="text-lg font-bold mb-4 border-b pb-2">Membros da Equipa</h2>
            <div class="overflow-hidden border rounded-lg">
              <table class="w-full text-left text-sm">
                <thead class="bg-gray-50 border-b">
                  <tr>
                    <th class="p-3">Nome</th>
                    <th class="p-3">Email</th>
                    <th class="p-3">Papel</th>
                    <th class="p-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let user of team.users" class="border-b last:border-0">
                    <td class="p-3 font-medium">{{ user.name }}</td>
                    <td class="p-3 text-gray-500">{{ user.email }}</td>
                    <td class="p-3">
                      <span class="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold uppercase">
                        {{ user.pivot?.papel || 'membro' }}
                      </span>
                    </td>
                    <td class="p-3 text-right">
                      <button class="text-red-500 hover:text-red-700" (click)="removeMember(user.id)">Remover</button>
                    </td>
                  </tr>
                  <tr *ngIf="!team.users?.length">
                    <td colspan="4" class="p-4 text-center text-gray-400 italic">Nenhum membro nesta equipa.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="mt-6 pt-6 border-t">
              <h3 class="font-bold mb-3">Adicionar Membro</h3>
              <div class="flex gap-2">
                <input type="number" placeholder="ID do Utilizador" class="flex-1 p-2 border rounded-lg text-sm" [(ngModel)]="newMemberId">
                <select class="p-2 border rounded-lg text-sm" [(ngModel)]="newMemberRole">
                  <option value="tecnico">Técnico</option>
                  <option value="lider">Líder</option>
                  <option value="supervisor">Supervisor</option>
                </select>
                <button class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold" (click)="addMember()">
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 class="text-lg font-bold mb-4 border-b pb-2">Definições</h2>
            <div class="space-y-4 text-sm">
              <div>
                <label class="text-gray-400 uppercase text-[10px] font-bold block mb-1">Descrição</label>
                <p>{{ team.descricao || 'Sem descrição.' }}</p>
              </div>
              <div>
                <label class="text-gray-400 uppercase text-[10px] font-bold block mb-1">Cor da Equipa</label>
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded border" [style.background-color]="team.color_code"></div>
                  <span>{{ team.color_code }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TeamDetailComponent implements OnInit {
  team?: Equipa;
  newMemberId?: number;
  newMemberRole: string = 'tecnico';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private teamService: TeamService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadTeam(id);
    }
  }

  loadTeam(id: number) {
    this.teamService.show(id).subscribe((data: Equipa) => {
      this.team = data;
    });
  }

  addMember() {
    if (!this.newMemberId) return;
    this.teamService.addMember(this.team!.id!, this.newMemberId, this.newMemberRole).subscribe(() => {
      this.loadTeam(this.team!.id!);
      this.newMemberId = undefined;
    });
  }

  removeMember(userId: number) {
    if (confirm('Deseja remover este membro da equipa?')) {
      this.teamService.removeMember(this.team!.id!, userId).subscribe(() => {
        this.loadTeam(this.team!.id!);
      });
    }
  }

  deleteTeam() {
    if (confirm('Tem a certeza que deseja eliminar esta equipa?')) {
      this.teamService.delete(this.team!.id!).subscribe(() => {
        this.router.navigate(['/admin/inspection/teams']);
      });
    }
  }
}
