import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AreaService, AreaItem } from '../services/area.service';

@Component({
  standalone: true,
  selector: 'app-areas-list',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="areas-list">
      <div class="header">
        <h1>Áreas Protegidas</h1>
        <a routerLink="/admin/areas/new" class="btn primary">Nova Área</a>
      </div>

      <div *ngIf="loading" class="muted">Carregando...</div>
      <div *ngIf="error" class="error">{{ error }}</div>

      <table class="table" *ngIf="!loading && items.length > 0">
        <thead>
          <tr>
            <th>Imagem</th>
            <th>Nome</th>
            <th>Localização</th>
            <th>Superfície</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of items">
            <td>
              <img *ngIf="item.image_url" [src]="item.image_url" class="thumb" alt="thumb">
              <span *ngIf="!item.image_url" class="muted">-</span>
            </td>
            <td><strong>{{ item.name }}</strong></td>
            <td>{{ item.location || '-' }}</td>
            <td>{{ item.surface_area || '-' }}</td>
            <td>
              <span class="badge" [class.active]="item.status === 'active'">
                {{ item.status === 'active' ? 'Ativo' : 'Inativo' }}
              </span>
            </td>
            <td class="actions">
              <a [routerLink]="['/admin/areas', item.id]" class="btn sm">Editar</a>
              <button (click)="deleteItem(item.id!)" class="btn danger sm">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="!loading && items.length === 0" class="empty">
        Nenhuma área protegida encontrada.
      </div>
    </div>
  `,
  styles: [`
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .thumb { width: 50px; height: 50px; object-fit: cover; border-radius: 6px; }
    .badge { padding: 4px 8px; border-radius: 4px; font-size: 0.85rem; background: #e0e0e0; }
    .badge.active { background: #d4edda; color: #155724; }
    .empty { padding: 40px; text-align: center; color: #666; background: #fff; border-radius: 12px; }
    .actions { display: flex; gap: 8px; }
  `]
})
export class AreasListComponent implements OnInit {
  items: AreaItem[] = [];
  loading = true;
  error = '';

  constructor(private service: AreaService) {}

  ngOnInit(): void {
    this.service.all().subscribe({
      next: (res) => { this.items = res; this.loading = false; },
      error: () => { this.error = 'Falha ao carregar áreas protegidas.'; this.loading = false; }
    });
  }

  deleteItem(id: number): void {
    if (!confirm('Tem certeza que deseja eliminar esta área?')) return;
    this.service.delete(id).subscribe({
      next: () => this.items = this.items.filter(i => i.id !== id),
      error: () => alert('Erro ao eliminar área.')
    });
  }
}
