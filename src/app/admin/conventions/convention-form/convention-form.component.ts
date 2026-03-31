import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConventionService, Convention } from '../../../services/convention.service';
import { ToastService } from '../../../services/toast.service';
import { UploadService } from '../../../services/upload.service';

@Component({
  standalone: true,
  selector: 'app-convention-form',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="admin-form">
      <header class="page-header">
        <div>
          <h1>{{ isEdit ? 'Editar Convenção' : 'Nova Convenção' }}</h1>
          <a routerLink="/admin/conventions" class="back-link">← Voltar para lista</a>
        </div>
      </header>

      <div *ngIf="loading" class="center-box"><div class="spinner"></div></div>

      <form *ngIf="!loading" (ngSubmit)="save()" class="card">
        <div class="form-group">
          <label>Título da Convenção / Tratado</label>
          <input [(ngModel)]="convention.title" name="title" required placeholder="Ex: Convenção sobre Diversidade Biológica">
        </div>

        <div class="form-group">
          <label>Breve Descrição / Resumo</label>
          <textarea [(ngModel)]="convention.description" name="description" rows="4" placeholder="Explique o propósito deste tratado..."></textarea>
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label>Data de Assinatura / Ratificação</label>
            <input type="date" [(ngModel)]="convention.signed_at" name="signed_at">
          </div>
          <div class="form-group">
            <label>Status Atual</label>
            <select [(ngModel)]="convention.status" name="status">
              <option value="active">Ativo / Ratificado</option>
              <option value="pending">Em Processo / Pendente</option>
              <option value="archived">Arquivado</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Documento Oficial (PDF)</label>
          <div class="file-upload">
            <div class="file-info" *ngIf="convention.document_url">
              <span class="sub-icon">📄</span>
              <a [href]="convention.document_url" target="_blank">{{ convention.document_url | slice:-30 }}...</a>
              <button type="button" class="btn danger sm" (click)="convention.document_url = ''">Substituir</button>
            </div>
            <div class="upload-trigger" *ngIf="!convention.document_url">
              <input type="file" (change)="onFileSelected($event)" accept=".pdf" #fileInput hidden>
              <button type="button" class="btn outline" (click)="fileInput.click()" [disabled]="uploading">
                {{ uploading ? 'Enviando PDF...' : 'Selecionar ficheiro PDF' }}
              </button>
              <p class="muted sm">Carregue o documento original do acordo.</p>
            </div>
          </div>
        </div>

        <div class="actions">
          <button type="submit" class="btn primary lg" [disabled]="saving || uploading">
            {{ saving ? 'Processando...' : 'Salvar Convenção' }}
          </button>
          <a routerLink="/admin/conventions" class="btn outline lg">Cancelar</a>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .file-info { display: flex; align-items: center; gap: 15px; padding: 15px; background: #f8fafc; border-radius: 8px; border: 1px solid var(--border); }
    .upload-trigger { padding: 30px; border: 2px dashed var(--border); border-radius: 12px; text-align: center; }
    .sub-icon { font-size: 1.5rem; }
    .back-link { font-size: 0.9rem; color: var(--ink-muted); text-decoration: none; }
    .actions { border-top: 1px solid var(--border); padding-top: 24px; margin-top: 24px; display: flex; gap: 16px; }
  `]
})
export class ConventionFormComponent implements OnInit {
  convention: Convention = { title: '', status: 'active' };
  isEdit = false;
  loading = false;
  saving = false;
  uploading = false;

  constructor(
    private conventionService: ConventionService,
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
      this.conventionService.show(+id).subscribe({
        next: (res: Convention) => {
          this.convention = res;
          // Format date for input type=date if needed
          if (this.convention.signed_at) {
             this.convention.signed_at = (this.convention.signed_at as any).split('T')[0];
          }
          this.loading = false;
        },
        error: () => { this.toast.error('Erro ao carregar convenção.'); this.router.navigate(['/admin/conventions']); }
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.uploading = true;
    this.uploadService.uploadDocument(file).subscribe({
      next: (res) => { this.convention.document_url = res.url; this.uploading = false; },
      error: () => { this.toast.error('Falha no upload do documento.'); this.uploading = false; }
    });
  }

  save(): void {
    this.saving = true;
    const obs = this.isEdit 
      ? this.conventionService.update(this.convention.id!, this.convention)
      : this.conventionService.create(this.convention);

    obs.subscribe({
      next: () => { this.toast.success('Convenção guardada com sucesso!'); this.router.navigate(['/admin/conventions']); },
      error: () => { this.toast.error('Erro ao salvar convenção.'); this.saving = false; }
    });
  }
}
