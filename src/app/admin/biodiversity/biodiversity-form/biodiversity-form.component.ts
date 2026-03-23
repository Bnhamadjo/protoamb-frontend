import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QuillEditorComponent } from 'ngx-quill';
import { BiodiversityService, BiodiversityItem } from '../services/biodiversity.service';
import { UploadService } from '../../../services/upload.service';

@Component({
  standalone: true,
  selector: 'app-biodiversity-form',
  imports: [CommonModule, FormsModule, RouterLink, QuillEditorComponent],
  template: `
    <div class="bio-form">
      <h1>{{ isNew ? 'Nova Entrada' : 'Editar Entrada' }}</h1>

      <div *ngIf="loading" class="muted">Carregando...</div>
      <div *ngIf="error" class="error">{{ error }}</div>

      <form *ngIf="!loading" (ngSubmit)="save()">
        <div class="grid-2">
          <div>
            <label>Nome</label>
            <input [(ngModel)]="item.name" name="name" required placeholder="Ex: Chimpanzé">
          </div>
          <div>
            <label>Tipo</label>
            <select [(ngModel)]="item.type" name="type" required>
              <option value="fauna">Fauna</option>
              <option value="flora">Flora</option>
              <option value="ecossistema">Ecossistema</option>
            </select>
          </div>
        </div>

        <div class="image-upload-section">
          <label>Imagem</label>
          <div *ngIf="item.image" class="preview-container">
            <img [src]="item.image" alt="Bio preview">
            <button type="button" class="btn danger sm" (click)="removeImage()">Remover Imagem</button>
          </div>
          <div *ngIf="!item.image" class="upload-placeholder">
            <input type="file" #fileInput hidden (change)="onFileSelected($event)" accept="image/*">
            <button type="button" class="btn" (click)="fileInput.click()" [disabled]="uploading">
              {{ uploading ? 'Enviando...' : 'Selecionar Imagem' }}
            </button>
          </div>
        </div>

        <label>Descrição</label>
        <quill-editor 
          [(ngModel)]="item.description" 
          name="description" 
          [styles]="{ height: '300px' }"
        ></quill-editor>

        <div class="actions">
          <button type="submit" class="btn primary" [disabled]="saving || uploading">
            {{ saving ? 'Salvando...' : 'Salvar' }}
          </button>
          <a class="btn" routerLink="/admin/biodiversity">Voltar</a>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .bio-form { max-width: 900px; }
    .image-upload-section { margin: 16px 0; padding: 16px; border: 1px dashed #cfe0da; border-radius: 10px; background: #fdfdfd; }
    .preview-container { display: flex; flex-direction: column; align-items: center; gap: 10px; }
    .preview-container img { max-width: 100%; max-height: 250px; border-radius: 8px; }
    .actions { display: flex; gap: 10px; margin-top: 24px; }
  `]
})
export class BiodiversityFormComponent implements OnInit {
  id: string | null = null;
  isNew = true;
  item: BiodiversityItem = {
    name: '',
    type: 'fauna',
    description: ''
  };
  loading = false;
  saving = false;
  uploading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bioService: BiodiversityService,
    private uploadService: UploadService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id && this.id !== 'new') {
      this.isNew = false;
      this.loading = true;
      this.bioService.show(+this.id).subscribe({
        next: (res) => { this.item = res; this.loading = false; },
        error: () => { this.error = 'Falha ao carregar entrada.'; this.loading = false; }
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploading = true;
      this.uploadService.upload(file).subscribe({
        next: (res) => { this.item.image = res.url; this.uploading = false; },
        error: () => { this.error = 'Falha no upload da imagem.'; this.uploading = false; }
      });
    }
  }

  removeImage(): void {
    this.item.image = '';
  }

  save(): void {
    this.saving = true;
    const action$ = this.isNew 
      ? this.bioService.create(this.item) 
      : this.bioService.update(+this.id!, this.item);

    action$.subscribe({
      next: () => this.router.navigate(['/admin/biodiversity']),
      error: () => { this.error = 'Erro ao salvar entrada.'; this.saving = false; }
    });
  }
}
