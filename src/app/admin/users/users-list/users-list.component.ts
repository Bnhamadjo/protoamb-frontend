import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../../services/user.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="admin-container anim-up">
      <header class="premium-header">
        <div class="title-group">
          <h1 class="premium-title">Gestão de Utilizadores</h1>
          <p class="premium-subtitle">Controlo de acesso e níveis de permissão da plataforma</p>
        </div>
        
        <div class="header-actions">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input 
              type="text" 
              [(ngModel)]="searchQuery" 
              (input)="filterUsers()" 
              placeholder="Pesquisar utilizadores..."
              class="premium-input"
            >
          </div>
          <a routerLink="new" class="premium-btn primary">
            <span class="icon">➕</span> Novo Utilizador
          </a>
        </div>
      </header>

      <div class="premium-stats-grid">
        <div class="premium-stat-card glass-card anim-delayed-1">
          <div class="stat-icon-wrapper users">👤</div>
          <div class="stat-content">
            <div class="stat-value">{{ users.length }}</div>
            <div class="stat-label">Total de Contas</div>
          </div>
        </div>
        <div class="premium-stat-card glass-card anim-delayed-2">
          <div class="stat-icon-wrapper admins">🛡️</div>
          <div class="stat-content">
            <div class="stat-value">{{ countByRole('admin') }}</div>
            <div class="stat-label">Administradores</div>
          </div>
        </div>
        <div class="premium-stat-card glass-card anim-delayed-3">
          <div class="stat-icon-wrapper technicians">🛠️</div>
          <div class="stat-content">
            <div class="stat-value">{{ countByRole('tecnico') }}</div>
            <div class="stat-label">Técnicos</div>
          </div>
        </div>
      </div>

      <div class="premium-data-card glass-card">
        <div class="table-container">
          <table class="premium-table">
            <thead>
              <tr>
                <th>Utilizador</th>
                <th>Email</th>
                <th>Papel / Nível</th>
                <th>Membro Desde</th>
                <th class="actions-cell">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of filteredUsers; let i = index" class="premium-row" [style.animation-delay]="(i * 0.05) + 's'">
                <td>
                  <div class="user-profile">
                    <div class="profile-avatar" [style.background]="getAvatarGradient(user.name)">
                      {{ user.name.substring(0,2).toUpperCase() }}
                    </div>
                    <div class="user-info">
                      <span class="user-name">{{ user.name }}</span>
                      <span class="user-id">ID: #{{ user.id }}</span>
                    </div>
                  </div>
                </td>
                <td class="email-cell">{{ user.email }}</td>
                <td>
                  <span class="premium-badge" [ngClass]="user.role">
                    <span class="badge-dot"></span>
                    {{ user.role | titlecase }}
                  </span>
                </td>
                <td class="date-cell">{{ user.created_at | date:'dd MMM, yyyy' }}</td>
                <td class="actions-cell">
                  <div class="premium-actions">
                    <a [routerLink]="['edit', user.id]" class="action-btn edit" title="Editar Perfil">
                      <span class="icon">✏️</span>
                    </a>
                    <button (click)="deleteUser(user)" class="action-btn delete" title="Eliminar Cadastro">
                      <span class="icon">🗑️</span>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="filteredUsers.length === 0">
                <td colspan="5">
                  <div class="premium-empty-state">
                    <div class="empty-icon">📂</div>
                    <h3>Nenhum resultado encontrado</h3>
                    <p>Tente ajustar os seus termos de pesquisa para encontrar o que procura.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .premium-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 40px;
      gap: 24px;
      flex-wrap: wrap;
    }

    .premium-title {
      font-size: 2.5rem;
      margin-bottom: 8px;
      background: linear-gradient(135deg, var(--brand), var(--brand-light));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .premium-subtitle {
      color: var(--ink-muted);
      font-size: 1.1rem;
      max-width: 500px;
    }

    .header-actions {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .search-box {
      position: relative;
      min-width: 300px;
    }

    .search-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.2rem;
      opacity: 0.5;
    }

    .premium-input {
      padding-left: 48px !important;
      height: 52px;
      border-radius: var(--radius-md) !important;
      background: var(--surface) !important;
      border: 1px solid var(--border) !important;
      box-shadow: var(--shadow-sm) !important;
    }

    .premium-btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 14px 28px;
      border-radius: var(--radius-md);
      font-weight: 700;
      transition: var(--transition);
      cursor: pointer;
      font-size: 1rem;
      border: none;
    }

    .premium-btn.primary {
      background: var(--brand);
      color: white;
      box-shadow: 0 10px 25px rgba(6, 38, 29, 0.2);
    }

    .premium-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 30px rgba(6, 38, 29, 0.3);
    }

    /* Stats Grid */
    .premium-stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      margin-bottom: 40px;
    }

    .premium-stat-card {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 24px;
      border-radius: var(--radius-lg);
      transition: var(--transition);
    }

    .premium-stat-card:hover {
      transform: scale(1.02);
      border-color: var(--brand-muted);
    }

    .stat-icon-wrapper {
      width: 64px;
      height: 64px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
    }

    .stat-icon-wrapper.users { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
    .stat-icon-wrapper.admins { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
    .stat-icon-wrapper.technicians { background: rgba(16, 185, 129, 0.1); color: #10b981; }

    .stat-value {
      font-size: 1.8rem;
      font-weight: 800;
      line-height: 1;
      margin-bottom: 4px;
      color: var(--brand);
    }

    .stat-label {
      color: var(--ink-muted);
      font-size: 0.9rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Table Styling */
    .premium-data-card {
      padding: 0;
      overflow: hidden;
      border-radius: var(--radius-lg);
    }

    .table-container {
      overflow-x: auto;
    }

    .premium-table {
      width: 100%;
      border-collapse: collapse;
    }

    .premium-table th {
      background: rgba(6, 38, 29, 0.02);
      padding: 20px 32px;
      text-align: left;
      font-size: 0.8rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--brand-muted);
      border-bottom: 1px solid var(--border);
    }

    .premium-row {
      border-bottom: 1px solid var(--border);
      transition: var(--transition-fast);
      animation: fadeInRow 0.5s ease forwards;
      opacity: 0;
    }

    @keyframes fadeInRow {
      from { opacity: 0; transform: translateX(-10px); }
      to { opacity: 1; transform: translateX(0); }
    }

    .premium-row:hover {
      background: rgba(6, 38, 29, 0.015);
    }

    .premium-row td {
      padding: 20px 32px;
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .profile-avatar {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 800;
      font-size: 1rem;
      box-shadow: 0 8px 15px rgba(0,0,0,0.1);
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-weight: 700;
      color: var(--brand);
      font-size: 1.05rem;
    }

    .user-id {
      font-size: 0.75rem;
      color: var(--ink-light);
      font-weight: 500;
    }

    .email-cell {
      color: var(--ink-muted);
      font-weight: 500;
    }

    /* Badges */
    .premium-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 100px;
      font-size: 0.85rem;
      font-weight: 700;
    }

    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    .premium-badge.admin { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
    .premium-badge.admin .badge-dot { background: #ef4444; }

    .premium-badge.tecnico { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .premium-badge.tecnico .badge-dot { background: #10b981; }

    .premium-badge.auditor { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
    .premium-badge.auditor .badge-dot { background: #3b82f6; }

    .premium-badge.user { background: rgba(107, 114, 128, 0.1); color: #6b7280; }
    .premium-badge.user .badge-dot { background: #6b7280; }

    .date-cell {
      font-weight: 600;
      color: var(--ink-muted);
    }

    /* Actions */
    .premium-actions {
      display: flex;
      gap: 8px;
    }

    .action-btn {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition-fast);
      border: 1px solid var(--border);
      background: white;
      cursor: pointer;
    }

    .action-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    }

    .action-btn.edit:hover { background: var(--brand); color: white; border-color: var(--brand); }
    .action-btn.delete:hover { background: #fef2f2; color: #ef4444; border-color: #fecaca; }

    .premium-empty-state {
      padding: 80px 0;
      text-align: center;
      color: var(--ink-light);
    }

    .empty-icon { font-size: 4rem; margin-bottom: 20px; opacity: 0.5; }
    .premium-empty-state h3 { color: var(--brand); margin-bottom: 8px; }

    /* Animations */
    .anim-delayed-1 { animation: fadeIn 0.8s ease backwards 0.1s; }
    .anim-delayed-2 { animation: fadeIn 0.8s ease backwards 0.2s; }
    .anim-delayed-3 { animation: fadeIn 0.8s ease backwards 0.3s; }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 1100px) {
      .premium-stats-grid { grid-template-columns: 1fr; }
      .premium-header { flex-direction: column; align-items: flex-start; }
      .search-box { width: 100%; min-width: auto; }
      .header-actions { width: 100%; flex-direction: column; align-items: stretch; }
    }
  `]
})
export class UsersListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchQuery: string = '';

  constructor(
    private userService: UserService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe((res: User[]) => {
      this.users = res;
      this.filterUsers();
    });
  }

  filterUsers(): void {
    if (!this.searchQuery) {
      this.filteredUsers = [...this.users];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredUsers = this.users.filter(u => 
        u.name.toLowerCase().includes(query) || 
        u.email.toLowerCase().includes(query) ||
        u.role.toLowerCase().includes(query)
      );
    }
  }

  countByRole(role: string): number {
    return this.users.filter(u => u.role === role).length;
  }

  getAvatarGradient(name: string): string {
    const gradients = [
      'linear-gradient(135deg, #6366f1, #a855f7)',
      'linear-gradient(135deg, #3b82f6, #2dd4bf)',
      'linear-gradient(135deg, #f59e0b, #ef4444)',
      'linear-gradient(135deg, #10b981, #3b82f6)',
      'linear-gradient(135deg, #6366f1, #ec4899)'
    ];
    const index = name.length % gradients.length;
    return gradients[index];
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

