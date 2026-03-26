import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { MenuService, Menu } from '../services/menu.service';

@Component({
  standalone: true,
  selector: 'app-menus-list',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="menus-list">
      <div class="header">
        <h1>Gestao de Menus</h1>
        <a routerLink="/admin/menus/new" class="btn primary">Novo Menu</a>
      </div>

      <div *ngIf="loading" class="muted center" style="padding: 40px">Carregando menus...</div>
      <div *ngIf="error" class="error">{{ error }}</div>

      <div class="grid-table" *ngIf="!loading && !error && menus.length > 0">
        <div class="table-header">
          <span>Nome</span>
          <span>Localizacao</span>
          <span>Idioma</span>
          <span>Itens</span>
          <span class="center">Acoes</span>
        </div>

        <div class="table-row card" *ngFor="let menu of menus">
          <div class="menu-info">
            <strong>{{ menu.name }}</strong>
          </div>
          <div>{{ menu.location }}</div>
          <div>
            <span class="badge lang">{{ menu.lang | uppercase }}</span>
          </div>
          <div>{{ menu.items?.length || 0 }} itens</div>
          <div class="actions center">
            <a [routerLink]="['/admin/menus', menu.id, 'items']" class="btn primary sm">Gerir Itens</a>
            <a [routerLink]="['/admin/menus', menu.id]" class="btn sm">Configuracoes</a>
            <button (click)="deleteMenu(menu.id!)" class="btn danger sm">Eliminar</button>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && !error && menus.length === 0" class="empty">
        <p>Nenhum menu configurado.</p>
        <button routerLink="/admin/menus/new" class="btn primary">Criar primeiro menu</button>
      </div>
    </div>
  `,
  styles: [`
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .grid-table { display: flex; flex-direction: column; gap: 10px; }
    .table-header {
      display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 2fr;
      padding: 10px 20px; font-weight: 600; color: var(--ink-muted); font-size: 0.85rem;
    }
    .table-row {
      display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 2fr;
      align-items: center; padding: 15px 20px; background: #fff;
    }
    .actions { display: flex; gap: 8px; justify-content: center; }
    .badge.lang {
      background: var(--bg-app); border: 1px solid var(--border);
      padding: 2px 6px; border-radius: 4px; font-size: 0.75rem;
    }
    .empty { padding: 80px; text-align: center; color: var(--ink-muted); border: 2px dashed var(--border); border-radius: var(--radius-lg); }
    .error { background: #FEF2F2; color: #B91C1C; padding: 16px 20px; border-radius: 16px; margin-bottom: 20px; text-align: center; }
    .center { text-align: center; }
  `]
})
export class MenusListComponent implements OnInit {
  menus: Menu[] = [];
  loading = true;
  error = '';

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.loadMenus();
  }

  loadMenus(): void {
    this.menuService.all().pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (res) => {
        this.menus = Array.isArray(res) ? res : [];
      },
      error: () => {
        this.error = 'Falha ao carregar menus.';
      }
    });
  }

  deleteMenu(id: number): void {
    if (!confirm('Tem certeza que deseja eliminar este menu e todos os seus itens?')) {
      return;
    }

    this.menuService.delete(id).subscribe({
      next: () => {
        this.menus = this.menus.filter((menu) => menu.id !== id);
      },
      error: () => {
        alert('Erro ao eliminar.');
      }
    });
  }
}
