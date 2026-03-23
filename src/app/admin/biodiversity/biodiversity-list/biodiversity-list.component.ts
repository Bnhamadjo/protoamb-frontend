import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BiodiversityService, BiodiversityItem } from '../services/biodiversity.service';

@Component({
  standalone: true,
  selector: 'app-biodiversity-list',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="biodiversity-list anim-fade-in">
      <header class="list-header" style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px;">
        <div>
          <h1>Biodiversidade</h1>
          <p class="muted">Gestão do inventário de fauna, flora e ecossistemas.</p>
        </div>
        <a routerLink="/admin/biodiversity/new" class="btn primary lg">
          <span>+</span> Nova Entrada
        </a>
      </header>

      <div *ngIf="loading" class="center-box card">
        <div class="spinner"></div>
        <p class="muted">Buscando dados da biodiversidade...</p>
      </div>

      <div *ngIf="error" class="error-banner card" style="background: #FEF2F2; color: #DC2626; padding: 20px; text-align: center; margin-bottom: 20px;">
        {{ error }}
      </div>

      <div class="table-container" *ngIf="!loading && items.length > 0">
        <table class="table">
          <thead>
            <tr>
              <th>Espécie</th>
              <th style="text-align: right;">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of items">
              <td style="display: flex; align-items: center; gap: 15px;">
                <img *ngIf="item.image" [src]="item.image" class="thumb" alt="thumb" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
                <div *ngIf="!item.image" class="thumb-alt" style="width: 50px; height: 50px; background: #f1f5f9; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">🍃</div>
                <div>
                   <div style="font-weight: 600;">{{ item.name }}</div>
                   <div class="muted" style="font-size: 0.8rem;">{{ item.type | uppercase }}</div>
                </div>
              </td>
              <td style="text-align: right;">
                <div class="actions" style="display: flex; gap: 8px; justify-content: flex-end;">
                  <a [routerLink]="['/admin/biodiversity', item.id]" class="btn sm">✏️ Editar</a>
                  <button (click)="deleteItem(item.id!)" class="btn danger sm">🗑️ Eliminar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="!loading && items.length === 0" class="empty card center-box">
        <div style="font-size: 3rem; margin-bottom: 20px;">🦎</div>
        <h3>Nenhuma entrada encontrada</h3>
        <p class="muted">A biodiversidade da Guiné-Bissau aguarda o seu registo.</p>
        <a routerLink="/admin/biodiversity/new" class="btn primary mt-4">Adicionar Espécie</a>
      </div>
    </div>
  `,
  styles: []
})
export class BiodiversityListComponent implements OnInit {
  items: BiodiversityItem[] = [];
  loading = true;
  error = '';

  constructor(private service: BiodiversityService) {}

  ngOnInit(): void {
    this.service.all().subscribe({
      next: (res) => { this.items = res; this.loading = false; },
      error: () => { this.error = 'Falha ao carregar biodiversidade.'; this.loading = false; }
    });
  }

  deleteItem(id: number): void {
    if (!confirm('Tem certeza que deseja eliminar esta entrada?')) return;
    this.service.delete(id).subscribe({
      next: () => this.items = this.items.filter(i => i.id !== id),
      error: () => alert('Erro ao eliminar entrada.')
    });
  }
}
