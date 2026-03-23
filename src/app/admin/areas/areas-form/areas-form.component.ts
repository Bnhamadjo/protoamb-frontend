import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QuillEditorComponent } from 'ngx-quill';
import { AreaService, AreaItem } from '../services/area.service';
import { UploadService } from '../../../services/upload.service';

@Component({
  standalone: true,
  selector: 'app-areas-form',
  imports: [CommonModule, FormsModule, RouterLink, QuillEditorComponent],
  template: `
    <div class="areas-form">
      <h1>{{ isNew ? 'Nova Área Protegida' : 'Editar Área Protegida' }}</h1>

      <div *ngIf="loading" class="muted">Carregando...</div>
      <div *ngIf="error" class="error">{{ error }}</div>

      <form *ngIf="!loading" (ngSubmit)="save()">
        <div class="grid-2">
          <div>
            <label>Nome da Área</label>
            <input [(ngModel)]="item.name" name="name" required placeholder="Ex: Parque Nacional de Cantanhez">
          </div>
          <div>
            <label>Localização</label>
            <input [(ngModel)]="item.location" name="location" placeholder="Ex: Região de Tombali">
          </div>
        </div>

        <div class="image-upload-section">
          <label>Imagem da Área</label>
          <div *ngIf="item.image_url" class="preview-container">
            <img [src]="item.image_url" alt="Area preview">
            <button type="button" class="btn danger sm" (click)="removeImage()">Remover Imagem</button>
          </div>
          <div *ngIf="!item.image_url" class="upload-placeholder">
            <input type="file" #fileInput hidden (change)="onFileSelected($event)" accept="image/*">
            <button type="button" class="btn" (click)="fileInput.click()" [disabled]="uploading">
              {{ uploading ? 'Enviando...' : 'Selecionar Imagem' }}
            </button>
          </div>
        </div>

        <label>Descrição e Contexto</label>
        <quill-editor 
          [(ngModel)]="item.description" 
          name="description" 
          [styles]="{ height: '300px' }"
        ></quill-editor>

        <div class="grid-2">
          <div>
            <label>Superfície (km²)</label>
            <input [(ngModel)]="item.surface_area" name="surface_area" placeholder="Ex: 1067 km²">
          </div>
          <div>
            <label>Status</label>
            <select [(ngModel)]="item.status" name="status">
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>
        </div>

        <div class="actions">
          <button type="submit" class="btn primary" [disabled]="saving || uploading">
            {{ saving ? 'Salvando...' : 'Salvar' }}
          </button>
          <a class="btn" routerLink="/admin/areas">Voltar</a>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .areas-form { max-width: 900px; }
    .image-upload-section { margin: 16px 0; padding: 16px; border: 1px dashed #cfe0da; border-radius: 10px; background: #fdfdfd; }
    .preview-container { display: flex; flex-direction: column; align-items: center; gap: 10px; }
    .preview-container img { max-width: 100%; max-height: 250px; border-radius: 8px; }
    .actions { display: flex; gap: 10px; margin-top: 24px; }
  `]
})
export class AreasFormComponent implements OnInit {
  id: string | null = null;
  isNew = true;
  item: AreaItem = {
    name: '',
    location: '',
    description: '',
    surface_area: '',
    status: 'active'
  };
  loading = false;
  saving = false;
  uploading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private areaService: AreaService,
    private uploadService: UploadService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id && this.id !== 'new') {
      this.isNew = false;
      this.loading = true;
      this.areaService.show(+this.id).subscribe({
        next: (res) => { this.item = res; this.loading = false; },
        error: () => { this.error = 'Falha ao carregar área.'; this.loading = false; }
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploading = true;
      this.uploadService.upload(file).subscribe({
        next: (res) => { this.item.image_url = res.url; this.uploading = false; },
        error: () => { this.error = 'Falha no upload da imagem.'; this.uploading = false; }
      });
    }
  }

  removeImage(): void {
    this.item.image_url = null;
  }

  save(): void {
    this.saving = true;
    const action$ = this.isNew 
      ? this.areaService.create(this.item) 
      : this.areaService.update(+this.id!, this.item);

    action$.subscribe({
      next: () => this.router.navigate(['/admin/areas']),
      error: () => { this.error = 'Erro ao salvar área.'; this.saving = false; }
    });
  }
}
