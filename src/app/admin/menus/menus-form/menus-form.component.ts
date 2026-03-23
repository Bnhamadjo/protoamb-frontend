import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MenuService, Menu } from '../services/menu.service';

@Component({
  standalone: true,
  selector: 'app-menus-form',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="menus-form">
      <h1>{{ isNew ? 'Novo Menu' : 'Editar Menu' }}</h1>

      <div *ngIf="loading" class="muted">Carregando...</div>
      <div *ngIf="error" class="error">{{ error }}</div>

      <form *ngIf="!loading" (ngSubmit)="save()">
        <div class="form-group">
          <label>Nome do Menu</label>
          <input [(ngModel)]="menu.name" name="name" required placeholder="Ex: Menu Principal Superior">
        </div>

        <div class="grid-2">
          <div>
            <label>Localização (Location Slug)</label>
            <input [(ngModel)]="menu.location" name="location" required placeholder="Ex: header, footer, sidebar">
          </div>
          <div>
            <label>Idioma</label>
            <select [(ngModel)]="menu.lang" name="lang">
              <option value="pt">Português (PT)</option>
              <option value="en">English (EN)</option>
              <option value="fr">Français (FR)</option>
            </select>
          </div>
        </div>

        <div class="actions">
          <button type="submit" class="btn primary" [disabled]="saving">
            {{ saving ? 'Salvando...' : 'Salvar' }}
          </button>
          <a class="btn" routerLink="/admin/menus">Voltar</a>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .menus-form { max-width: 600px; animation: fadeIn 0.4s ease-out; }
    .actions { display: flex; gap: 10px; margin-top: 24px; }
    .form-group { margin-bottom: 20px; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class MenusFormComponent implements OnInit {
  id: string | null = null;
  isNew = true;
  menu: Partial<Menu> = {
    name: '',
    location: 'header',
    lang: 'pt'
  };
  loading = false;
  saving = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id && this.id !== 'new') {
      this.isNew = false;
      this.loading = true;
      this.menuService.show(+this.id).subscribe({
        next: (res) => { this.menu = res; this.loading = false; },
        error: () => { this.error = 'Falha ao carregar menu.'; this.loading = false; }
      });
    }
  }

  save(): void {
    this.saving = true;
    const action$ = this.isNew 
      ? this.menuService.create(this.menu) 
      : this.menuService.update(+this.id!, this.menu);

    action$.subscribe({
      next: (res) => {
        if (this.isNew) {
           this.router.navigate(['/admin/menus', res.id, 'items']);
        } else {
           this.router.navigate(['/admin/menus']);
        }
      },
      error: () => { this.error = 'Erro ao salvar menu.'; this.saving = false; }
    });
  }
}
