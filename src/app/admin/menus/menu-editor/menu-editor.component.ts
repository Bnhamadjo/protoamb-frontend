import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MenuService, Menu, MenuItem } from '../services/menu.service';

@Component({
  standalone: true,
  selector: 'app-menu-editor',
  imports: [CommonModule, RouterLink, DragDropModule, FormsModule],
  template: `
    <div class="menu-editor">
      <div class="header">
        <div class="title-area">
          <a routerLink="/admin/menus" class="back-link">← Voltar</a>
          <h1>Itens do Menu: {{ menu?.name }}</h1>
          <span class="badge">{{ menu?.lang | uppercase }}</span>
          <span class="badge">{{ menu?.location }}</span>
        </div>
        <div class="actions">
          <button (click)="addItem()" class="btn sm">Adicionar Item</button>
          <button (click)="save()" class="btn primary" [disabled]="saving">
            {{ saving ? 'Salvando...' : 'Salvar Alterações' }}
          </button>
        </div>
      </div>

      <div *ngIf="loading" class="muted center" style="padding: 40px">Carregando itens...</div>
      <div *ngIf="error" class="error">{{ error }}</div>

      <div cdkDropList (cdkDropListDropped)="onDrop($event)" class="drag-list" *ngIf="!loading">
        <div class="drag-item card" *ngFor="let item of items; let i = index" cdkDrag>
          <div class="drag-handle" cdkDragHandle>⠿</div>
          
          <div class="item-fields">
            <input [(ngModel)]="item.label" placeholder="Título do link" class="form-control sm">
            <input [(ngModel)]="item.url" placeholder="URL (ex: /sobre-nos)" class="form-control sm">
          </div>

          <button (click)="removeItem(i)" class="btn danger sm icon-only" title="Remover">🗑️</button>
        </div>
      </div>

      <div *ngIf="!loading && items.length === 0" class="empty">
        <p>Este menu ainda não tem itens. Adicione o primeiro!</p>
        <button (click)="addItem()" class="btn">Adicionar Item</button>
      </div>
    </div>
  `,
  styles: [`
    .menu-editor { animation: fadeIn 0.4s ease-out; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .title-area { display: flex; align-items: center; gap: 15px; }
    .back-link { font-size: 0.9rem; color: var(--ink-muted); text-decoration: none; }
    
    .drag-list { display: flex; flex-direction: column; gap: 10px; max-width: 800px; }
    .drag-item {
      display: flex; align-items: center; gap: 15px; padding: 12px 15px;
      background: #fff;
    }
    .drag-handle { cursor: grab; color: var(--ink-muted); font-size: 1.2rem; }
    .item-fields { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    
    .badge { 
      background: var(--bg-app); padding: 4px 8px; border-radius: 4px; 
      font-size: 0.75rem; font-weight: 600; color: var(--ink-muted); border: 1px solid var(--border);
    }

    .empty { padding: 60px; text-align: center; border: 2px dashed var(--border); border-radius: 12px; }
    
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class MenuEditorComponent implements OnInit {
  menuId: number | null = null;
  menu: Menu | null = null;
  items: MenuItem[] = [];
  loading = true;
  saving = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.menuId = +id;
      this.loadMenu();
    }
  }

  loadMenu(): void {
    this.menuService.show(this.menuId!).subscribe({
      next: (res) => {
        this.menu = res;
        this.items = res.items || [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Erro ao carregar menu.';
        this.loading = false;
      }
    });
  }

  addItem(): void {
    this.items.push({
      label: 'Novo Link',
      url: '/',
      order: this.items.length
    });
  }

  removeItem(index: number): void {
    this.items.splice(index, 1);
  }

  onDrop(event: CdkDragDrop<MenuItem[]>): void {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
    // Update order after move
    this.items.forEach((item, index) => item.order = index);
  }

  save(): void {
    if (!this.menuId) return;
    this.saving = true;
    this.menuService.updateItems(this.menuId, this.items).subscribe({
      next: () => {
        this.saving = false;
        alert('Menu atualizado com sucesso!');
      },
      error: () => {
        this.error = 'Erro ao salvar os itens do menu.';
        this.saving = false;
      }
    });
  }
}
