import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PartnerService, Partner } from '../../../services/partner.service';
import { ToastService } from '../../../services/toast.service';
import { UploadService } from '../../../services/upload.service';

@Component({
  standalone: true,
  selector: 'app-partner-form',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="admin-form">
      <header class="page-header">
        <div>
          <h1>{{ isEdit ? 'Editar Parceiro' : 'Novo Parceiro' }}</h1>
          <a routerLink="/admin/partners" class="back-link">← Voltar para lista</a>
        </div>
      </header>

      <div *ngIf="loading" class="center-box"><div class="spinner"></div></div>

      <form *ngIf="!loading" (ngSubmit)="save()" class="card">
        <div class="form-group">
          <label>Nome do Parceiro</label>
          <input [(ngModel)]="partner.name" name="name" required placeholder="Ex: Banco Mundial, UNDP, etc.">
        </div>

        <div class="form-group">
          <label>Website Link (URL)</label>
          <input [(ngModel)]="partner.url" name="url" placeholder="https://exemplo.com">
        </div>

        <div class="form-group">
          <label>Logótipo</label>
          <div class="logo-upload">
            <div class="logo-preview" *ngIf="partner.logo">
              <img [src]="partner.logo" alt="Logo preview">
              <button type="button" class="btn danger sm" (click)="partner.logo = ''">Remover</button>
            </div>
            <div class="upload-trigger" *ngIf="!partner.logo">
              <input type="file" (change)="onFileSelected($event)" accept="image/*" #fileInput hidden>
              <button type="button" class="btn outline" (click)="fileInput.click()" [disabled]="uploading">
                {{ uploading ? 'Carregando...' : 'Carregar Imagem' }}
              </button>
              <p class="muted sm">SVG, PNG ou JPG recomendado (fundo transparente).</p>
            </div>
          </div>
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label>Ordem de exibição</label>
            <input type="number" [(ngModel)]="partner.order" name="order">
          </div>
          <div class="form-group">
            <label>Status</label>
            <div class="toggle-control">
              <input type="checkbox" [(ngModel)]="partner.is_active" name="is_active" id="isActive">
              <label for="isActive">Ativo no portal público</label>
            </div>
          </div>
        </div>

        <div class="actions">
          <button type="submit" class="btn primary lg" [disabled]="saving || uploading">
            {{ saving ? 'Processando...' : 'Salvar Parceiro' }}
          </button>
          <a routerLink="/admin/partners" class="btn outline lg">Cancelar</a>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .logo-preview { display: flex; align-items: center; gap: 20px; padding: 20px; border: 1px solid var(--border); border-radius: 12px; }
    .logo-preview img { max-height: 80px; }
    .upload-trigger { padding: 40px; border: 2px dashed var(--border); border-radius: 12px; text-align: center; }
    .toggle-control { display: flex; align-items: center; gap: 10px; margin-top: 10px; }
    .back-link { font-size: 0.9rem; color: var(--ink-muted); text-decoration: none; }
    .actions { border-top: 1px solid var(--border); padding-top: 24px; margin-top: 24px; display: flex; gap: 16px; }
  `]
})
export class PartnerFormComponent implements OnInit {
  partner: Partner = { name: '', order: 0, is_active: true };
  isEdit = false;
  loading = false;
  saving = false;
  uploading = false;

  constructor(
    private partnerService: PartnerService,
    private uploadService: UploadService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.loading = true;
      this.partnerService.show(+id).subscribe({
        next: (res: Partner) => { this.partner = res; this.loading = false; },
        error: () => { this.toast.error('Erro ao carregar parceiro.'); this.router.navigate(['/admin/partners']); }
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.uploading = true;
    this.uploadService.upload(file).subscribe({
      next: (res) => { this.partner.logo = res.url; this.uploading = false; },
      error: () => { this.toast.error('Falha no upload.'); this.uploading = false; }
    });
  }

  save(): void {
    this.saving = true;
    const obs = this.isEdit 
      ? this.partnerService.update(this.partner.id!, this.partner)
      : this.partnerService.create(this.partner);

    obs.subscribe({
      next: () => { this.toast.success('Parceiro salvo com sucesso!'); this.router.navigate(['/admin/partners']); },
      error: () => { this.toast.error('Erro ao salvar parceiro.'); this.saving = false; }
    });
  }
}
