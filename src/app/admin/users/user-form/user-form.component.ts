import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UserService, User } from '../../../services/user.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="admin-container anim-up">
      <header class="premium-header">
        <div class="title-group">
          <h1 class="premium-title">{{ isEdit ? 'Editar Utilizador' : 'Novo Utilizador' }}</h1>
          <p class="premium-subtitle">Defina as credenciais e o nível de acesso à plataforma</p>
        </div>
        <a routerLink="/admin/users" class="premium-btn secondary">
          <span class="icon">⬅️</span> Voltar à Lista
        </a>
      </header>

      <div class="premium-form-card glass-card">
        <form (ngSubmit)="save()" #userForm="ngForm" class="premium-form">
          <div class="form-grid">
            <div class="form-column">
              <div class="premium-group">
                <label class="premium-label">Nome Completo</label>
                <div class="input-wrapper">
                  <span class="input-icon">👤</span>
                  <input 
                    type="text" 
                    [(ngModel)]="user.name" 
                    name="name" 
                    required 
                    placeholder="Ex: João Silva"
                    class="premium-input"
                  >
                </div>
              </div>

              <div class="premium-group">
                <label class="premium-label">Email Governamental</label>
                <div class="input-wrapper">
                  <span class="input-icon">✉️</span>
                  <input 
                    type="email" 
                    [(ngModel)]="user.email" 
                    name="email" 
                    required 
                    placeholder="exemplo@protoamb.gov.gw"
                    class="premium-input"
                  >
                </div>
              </div>
            </div>

            <div class="form-column">
              <div class="premium-group">
                <label class="premium-label">Cargo / Nível de Acesso</label>
                <div class="input-wrapper">
                  <span class="input-icon">🛡️</span>
                  <select [(ngModel)]="user.role" name="role" required class="premium-input select">
                    <option value="user">Utilizador Básico</option>
                    <option value="tecnico">Técnico Operacional</option>
                    <option value="auditor">Auditor Externo</option>
                    <option value="admin">Administrador de Sistema</option>
                  </select>
                </div>
              </div>

              <div class="premium-group">
                <label class="premium-label">{{ isEdit ? 'Nova Password' : 'Password Inicial' }}</label>
                <div class="input-wrapper">
                  <span class="input-icon">🔑</span>
                  <input 
                    type="password" 
                    [(ngModel)]="user.password" 
                    name="password" 
                    [required]="!isEdit" 
                    minlength="8"
                    placeholder="••••••••"
                    class="premium-input"
                  >
                </div>
                <small class="premium-help">{{ isEdit ? 'Deixe vazio para manter a atual.' : 'Mínimo 8 caracteres.' }}</small>
              </div>
            </div>
          </div>

          <footer class="premium-form-actions">
            <button type="submit" class="premium-btn primary lg" [disabled]="!userForm.form.valid || loading">
              {{ loading ? 'A processar...' : (isEdit ? 'Atualizar Conta' : 'Criar Utilizador') }}
              <span class="icon" *ngIf="!loading">🚀</span>
              <span class="spinner-sm" *ngIf="loading"></span>
            </button>
            <button type="button" routerLink="/admin/users" class="premium-btn outline lg">
              Cancelar
            </button>
          </footer>
        </form>
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
    }

    .premium-form-card {
      padding: 48px;
      max-width: 900px;
      margin: 0 auto;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      margin-bottom: 40px;
    }

    .premium-group {
      margin-bottom: 24px;
    }

    .premium-label {
      display: block;
      font-weight: 700;
      font-size: 0.9rem;
      color: var(--brand);
      margin-bottom: 10px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .input-wrapper {
      position: relative;
    }

    .input-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.2rem;
      opacity: 0.6;
      pointer-events: none;
    }

    .premium-input {
      width: 100%;
      height: 56px;
      padding-left: 48px !important;
      border-radius: var(--radius-md) !important;
      border: 1px solid var(--border) !important;
      background: white !important;
      font-size: 1rem !important;
      transition: var(--transition-fast) !important;
      color: var(--ink) !important;
    }

    .premium-input:focus {
      border-color: var(--brand) !important;
      box-shadow: 0 0 0 5px rgba(6, 38, 29, 0.08) !important;
      transform: translateY(-2px);
    }

    .premium-input.select {
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2306261D' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") !important;
      background-repeat: no-repeat !important;
      background-position: right 16px center !important;
      background-size: 18px !important;
    }

    .premium-help {
      display: block;
      margin-top: 8px;
      color: var(--ink-light);
      font-weight: 500;
    }

    .premium-form-actions {
      display: flex;
      gap: 16px;
      padding-top: 32px;
      border-top: 1px solid var(--border);
    }

    .premium-btn {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 12px 24px;
      border-radius: var(--radius-md);
      font-weight: 700;
      font-size: 1rem;
      transition: var(--transition);
      cursor: pointer;
      border: 1px solid var(--border);
      background: white;
      color: var(--ink);
    }

    .premium-btn.primary {
      background: var(--brand);
      color: white;
      border-color: var(--brand);
      box-shadow: 0 10px 25px rgba(6, 38, 29, 0.15);
    }

    .premium-btn.lg {
      padding: 16px 36px;
    }

    .premium-btn:hover:not(:disabled) {
      transform: translateY(-3px);
      box-shadow: 0 15px 30px rgba(0,0,0,0.1);
    }

    .premium-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .premium-btn.secondary {
      background: rgba(6, 38, 29, 0.05);
      color: var(--brand);
      border: none;
    }

    .premium-btn.outline {
      background: transparent;
      border: 2px solid var(--border);
    }

    .premium-btn.outline:hover {
      background: #f8fafc;
      border-color: var(--ink-light);
    }

    .spinner-sm {
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    @media (max-width: 768px) {
      .form-grid { grid-template-columns: 1fr; gap: 20px; }
      .premium-form-card { padding: 24px; }
      .premium-header { flex-direction: column; align-items: flex-start; }
      .premium-form-actions { flex-direction: column; }
      .premium-btn { width: 100%; justify-content: center; }
    }
  `]
})
export class UserFormComponent implements OnInit {
  user: User = { name: '', email: '', password: '', role: 'user' };
  isEdit = false;
  loading = false;

  constructor(
    private userService: UserService,
    private toast: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.userService.getUser(id).subscribe({
        next: (res: User) => {
          this.user = { ...res, password: '' };
        },
        error: () => {
          this.toast.error('Erro ao carregar utilizador');
          this.router.navigate(['/admin/users']);
        }
      });
    }
  }

  save(): void {
    this.loading = true;
    const obs = this.isEdit 
      ? this.userService.updateUser(this.user.id!, this.user)
      : this.userService.createUser(this.user);

    obs.subscribe({
      next: () => {
        this.toast.success(this.isEdit ? 'Utilizador atualizado com sucesso' : 'Utilizador criado com sucesso');
        this.router.navigate(['/admin/users']);
      },
      error: (err: any) => {
        this.loading = false;
        this.toast.error(err.error?.message || 'Erro ao realizar operação');
      }
    });
  }
}

