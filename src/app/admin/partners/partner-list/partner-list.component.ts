import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PartnerService, Partner } from '../../../services/partner.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  standalone: true,
  selector: 'app-partner-list',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="admin-partners">
      <header class="page-header">
        <div>
          <h1>Parceiros Institucionais</h1>
          <p class="muted">Gerencie os logotipos e links das entidades parceiras.</p>
        </div>
        <a routerLink="new" class="btn primary">Novo Parceiro</a>
      </header>

      <div *ngIf="loading" class="center-box">
        <div class="spinner"></div>
        <p class="muted">Carregando parceiros...</p>
      </div>

      <div class="grid-partners" *ngIf="!loading && partners.length">
        <div class="partner-card card" *ngFor="let p of partners">
          <div class="partner-logo">
            <img *ngIf="p.logo" [src]="p.logo" [alt]="p.name">
            <div *ngIf="!p.logo" class="no-logo">Sem Logo</div>
          </div>
          <div class="partner-info">
            <h3>{{ p.name }}</h3>
            <p class="muted sm">{{ p.url || 'Sem site link' }}</p>
            <div class="status-badge" [class.active]="p.is_active">
              {{ p.is_active ? 'Ativo' : 'Inativo' }}
            </div>
          </div>
          <div class="card-actions">
            <a [routerLink]="['edit', p.id]" class="btn outline sm">Editar</a>
            <button (click)="deletePartner(p)" class="btn danger sm">Excluir</button>
          </div>
        </div>
      </div>

      <div class="empty-state card" *ngIf="!loading && !partners.length">
        <h3>Nenhum parceiro cadastrado</h3>
        <p class="muted">Adicione o primeiro parceiro para exibir no portal público.</p>
        <a routerLink="new" class="btn primary">Criar Parceiro</a>
      </div>
    </div>
  `,
  styles: [`
    .grid-partners { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
    .partner-card { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 24px; position: relative; }
    .partner-logo { width: 100px; height: 100px; border-radius: 12px; background: #f8fafc; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; overflow: hidden; border: 1px solid var(--border); }
    .partner-logo img { max-width: 80%; max-height: 80%; object-fit: contain; }
    .no-logo { font-size: 0.7rem; font-weight: 700; color: var(--ink-muted); text-transform: uppercase; }
    .partner-info { flex: 1; margin-bottom: 20px; }
    .partner-info h3 { font-size: 1.1rem; margin-bottom: 6px; }
    .status-badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; background: #f1f5f9; color: #64748b; }
    .status-badge.active { background: #dcfce7; color: #15803d; }
    .card-actions { display: flex; gap: 10px; width: 100%; justify-content: center; }
  `]
})
export class PartnerListComponent implements OnInit {
  partners: Partner[] = [];
  loading = true;

  constructor(private partnerService: PartnerService, private toast: ToastService) {}

  ngOnInit(): void {
    this.loadPartners();
  }

  loadPartners(): void {
    this.loading = true;
    this.partnerService.all().subscribe({
      next: (res: Partner[]) => { this.partners = res; this.loading = false; },
      error: () => { this.toast.error('Erro ao carregar parceiros.'); this.loading = false; }
    });
  }

  deletePartner(p: Partner): void {
    if (!confirm(`Excluir parceiro "${p.name}"?`)) return;
    this.partnerService.delete(p.id!).subscribe(() => {
      this.toast.success('Parceiro excluído.');
      this.loadPartners();
    });
  }
}
