import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService, User } from '../../../services/user.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="admin-container anim-up">
      <header class="page-header">
        <div class="title-section">
          <h1>Gestão de Utilizadores</h1>
          <p>Controlo de acesso e níveis de permissão da plataforma</p>
        </div>
        <a routerLink="new" class="btn-primary">
          <span class="icon">➕</span> Novo Utilizador
        </a>
      </header>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ users.length }}</div>
          <div class="stat-label">Total de Contas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value text-accent">{{ countByRole('admin') }}</div>
          <div class="stat-label">Administradores</div>
        </div>
        <div class="stat-card">
          <div class="stat-value text-info">{{ countByRole('tecnico') }}</div>
          <div class="stat-label">Técnicos</div>
        </div>
      </div>

      <div class="data-card">
        <div class="table-responsive">
          <table class="modern-table">
            <thead>
              <tr>
                <th>Utilizador</th>
                <th>Email</th>
                <th>Role/Papel</th>
                <th>Criado em</th>
                <th class="actions-cell">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of users" class="hover-row">
                <td>
                  <div class="user-cell">
                    <div class="avatar">{{ user.name.substring(0,2).toUpperCase() }}</div>
                    <strong>{{ user.name }}</strong>
                  </div>
                </td>
                <td>{{ user.email }}</td>
                <td>
                  <span class="badge" [ngClass]="'badge-' + user.role">
                    {{ user.role | titlecase }}
                  </span>
                </td>
                <td>{{ user.created_at | date:'dd/MM/yyyy' }}</td>
                <td class="actions-cell">
                  <div class="action-buttons">
                    <a [routerLink]="['edit', user.id]" class="btn-icon" title="Editar">✏️</a>
                    <button (click)="deleteUser(user)" class="btn-icon btn-delete" title="Eliminar">🗑️</button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="users.length === 0">
                <td colspan="5" class="empty-state">Nenhum utilizador encontrado.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .user-cell { display: flex; align-items: center; gap: 10px; }
    .avatar { 
      width: 32px; height: 32px; border-radius: 50%; 
      background: var(--primary-gradient); color: white;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.8rem; font-weight: bold;
    }
    .badge-admin { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }
    .badge-tecnico { background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); }
    .badge-auditor { background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.2); }
    .badge-user { background: rgba(107, 114, 128, 0.1); color: #6b7280; border: 1px solid rgba(107, 114, 128, 0.2); }
  `]
})
export class UsersListComponent implements OnInit {
  users: User[] = [];

  constructor(
    private userService: UserService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe((res: User[]) => this.users = res);
  }

  countByRole(role: string): number {
    return this.users.filter(u => u.role === role).length;
  }

  deleteUser(user: User): void {
    if (confirm(`Tem a certeza que deseja eliminar o utilizador ${user.name}?`)) {
      this.userService.deleteUser(user.id!).subscribe({
        next: () => {
          this.toast.success('Utilizador eliminado com sucesso');
          this.loadUsers();
        },
        error: (err: any) => this.toast.error(err.error?.message || 'Erro ao eliminar')
      });
    }
  }
}
