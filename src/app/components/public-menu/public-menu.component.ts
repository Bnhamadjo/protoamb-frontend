import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuService, Menu, MenuItem } from '../../admin/menus/services/menu.service';

@Component({
  standalone: true,
  selector: 'app-public-menu',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="public-nav" [class]="customClass">
      <ul class="menu-root" *ngIf="menu">
        <li *ngFor="let item of topLevelItems" class="menu-item">
          <a [routerLink]="item.url" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" *ngIf="item.url">
            {{ item.label }}
          </a>
          <a href="javascript:void(0)" *ngIf="!item.url">
            {{ item.label }}
          </a>
          
          <!-- Suporte a submenus -->
          <ul class="submenu" *ngIf="item.children && item.children.length > 0">
            <li *ngFor="let child of item.children">
              <a [routerLink]="child.url">{{ child.label }}</a>
            </li>
          </ul>
        </li>
      </ul>
      
      <div *ngIf="loading" class="menu-loading">...</div>
    </nav>
  `,
  styles: [`
    .public-nav { display: block; }
    .menu-root { 
      list-style: none; display: flex; gap: 32px; margin: 0; padding: 0; 
    }
    .menu-item { position: relative; padding: 10px 0; }
    .menu-item > a { 
      text-decoration: none; 
      color: var(--ink); 
      font-weight: 600; 
      font-size: 0.95rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      transition: var(--transition);
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .menu-item > a:hover, .menu-item > a.active { color: var(--brand); }
    
    .menu-item:has(.submenu) > a::after {
      content: '▾';
      font-size: 0.8rem;
      opacity: 0.5;
    }

    /* Submenu dropdown */
    .submenu {
      display: block;
      position: absolute;
      top: 100%;
      left: 0;
      background: #fff;
      box-shadow: var(--shadow-lg);
      list-style: none;
      padding: 12px 0;
      min-width: 220px;
      z-index: 100;
      border-radius: var(--radius-sm);
      border-top: 3px solid var(--brand);
      opacity: 0;
      visibility: hidden;
      transform: translateY(10px);
      transition: var(--transition);
    }
    
    .menu-item:hover .submenu { 
      opacity: 1; 
      visibility: visible; 
      transform: translateY(0); 
    }

    .submenu li a { 
      padding: 10px 20px; 
      display: block; 
      font-size: 0.9rem; 
      font-weight: 500;
      color: var(--ink);
      transition: all 0.2s;
    }
    .submenu li a:hover { 
      background: var(--surface-hover); 
      color: var(--brand);
      padding-left: 25px;
    }

    .menu-loading { opacity: 0.5; font-size: 0.8rem; }
  `]
})
export class PublicMenuComponent implements OnInit {
  @Input() location: string = 'header';
  @Input() lang: string = 'pt';
  @Input() customClass: string = '';

  menu: Menu | null = null;
  loading = true;

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.loadMenu();
  }

  loadMenu(): void {
    this.menuService.all({ location: this.location, lang: this.lang }).subscribe({
      next: (res) => {
        this.menu = res.length > 0 ? res[0] : null;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        console.error('Erro ao carregar menu público');
      }
    });
  }

  get topLevelItems(): MenuItem[] {
    if (!this.menu || !this.menu.items) return [];
    return this.menu.items.filter(item => !item.parent_id);
  }
}
