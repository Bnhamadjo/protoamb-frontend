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
      <header class="page-header">
        <div class="title-section">
          <h1>{{ isEdit ? 'Editar Utilizador' : 'Novo Utilizador' }}</h1>
          <p>Defina as credenciais e o nível de acesso à plataforma</p>
        </div>
        <a routerLink="/admin/users" class="btn-secondary">Voltar</a>
      </header>

      <div class="form-container mini-form">
        <form (ngSubmit)="save()" #userForm="ngForm" class="modern-form">
          <div class="form-section">
            <div class="form-group">
              <label>Nome Completo</label>
              <input type="text" [(ngModel)]="user.name" name="name" required placeholder="Ex: João Silva">
            </div>

            <div class="form-group">
              <label>Email Governamental</label>
              <input type="email" [(ngModel)]="user.email" name="email" required placeholder="exemplo@protoamb.gov.gw">
            </div>

            <div class="form-group">
              <label>Cargo / Nível de Acesso (Role)</label>
              <select [(ngModel)]="user.role" name="role" required>
                <option value="user">Utilizador Básico</option>
                <option value="tecnico">Técnico Operacional</option>
                <option value="auditor">Auditor Externo</option>
                <option value="admin">Administrador de Sistema</option>
              </select>
            </div>

            <div class="form-group">
              <label>{{ isEdit ? 'Nova Password (deixe vazio para manter)' : 'Password Inicial' }}</label>
              <input type="password" [(ngModel)]="user.password" name="password" [required]="!isEdit" minlength="8">
              <small class="help-text">Mínimo 8 caracteres.</small>
            </div>
          </div>

          <footer class="form-actions">
            <button type="submit" class="btn-primary" [disabled]="!userForm.form.valid || loading">
              {{ loading ? 'A guardar...' : (isEdit ? 'Atualizar Conta' : 'Criar Utilizador') }}
            </button>
          </footer>
        </form>
      </div>
    </div>
  `
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
          this.user = { ...res, password: '' }; // Clear password field for security
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
        this.toast.success(this.isEdit ? 'Utilizador atualizado' : 'Utilizador criado');
        this.router.navigate(['/admin/users']);
      },
      error: (err: any) => {
        this.loading = false;
        this.toast.error(err.error?.message || 'Erro ao guardar');
      }
    });
  }
}
