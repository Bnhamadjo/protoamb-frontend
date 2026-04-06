import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MenuService, Menu, MenuItem } from '../services/menu.service';
import { ToastService } from '../../../services/toast.service';

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
          <div style="width: 100%;">
            <div style="display: flex; align-items: center; gap: 15px;">
              <div class="drag-handle" cdkDragHandle>⠿</div>
              <div class="item-fields">
                <input [(ngModel)]="item.label" placeholder="Título do link" class="form-control sm">
                <input [(ngModel)]="item.url" placeholder="URL (ex: /quem-somos)" class="form-control sm">
              </div>
              <button (click)="addChild(item)" class="btn outline sm" title="Adicionar Sub-menu">+ Sub</button>
              <button (click)="removeItem(i)" class="btn danger sm icon-only" title="Remover">🗑️</button>
            </div>

            <!-- Subitems -->
            <div class="sub-items-list" *ngIf="item.children && item.children.length > 0">
              <div class="sub-item" *ngFor="let child of item.children; let j = index">
                <span class="sub-icon">↳</span>
                <div class="item-fields">
                  <input [(ngModel)]="child.label" placeholder="Sub-título" class="form-control sm">
                  <input [(ngModel)]="child.url" placeholder="URL ou link" class="form-control sm">
                </div>
                <button (click)="removeChild(item, j)" class="btn danger sm icon-only" title="Remover sub-menu">🗑️</button>
              </div>
            </div>
          </div>
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
      display: flex; padding: 15px; background: #fff; border-radius: 8px;
    }
    .drag-handle { cursor: grab; color: var(--ink-muted); font-size: 1.2rem; display: flex; align-items: center; }
    .item-fields { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    
    .sub-items-list {
      margin-top: 15px; padding-top: 15px; border-top: 1px dashed var(--border);
      display: flex; flex-direction: column; gap: 10px; padding-left: 30px;
    }
    .sub-item {
      display: flex; align-items: center; gap: 12px;
    }
    .sub-icon { color: var(--ink-muted); font-weight: bold; font-size: 1.2rem; }
    
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
    private menuService: MenuService,
    private toast: ToastService
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
        this.items = (res.items || []).filter(item => !item.parent_id);
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
      order: this.items.length,
      children: []
    });
  }

  addChild(item: MenuItem): void {
    if (!item.children) item.children = [];
    item.children.push({
      label: 'Novo Sub-link',
      url: '/',
      order: item.children.length
    });
  }

  removeChild(item: MenuItem, childIndex: number): void {
    if (item.children) {
      item.children.splice(childIndex, 1);
    }
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
        this.toast.success('Menu atualizado com sucesso.');
      },
      error: () => {
        this.error = 'Erro ao salvar os itens do menu.';
        this.saving = false;
      }
    });
  }
}
