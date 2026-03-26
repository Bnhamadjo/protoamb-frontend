import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QuillEditorComponent } from 'ngx-quill';
import { BiodiversityService, BiodiversityItem } from '../services/biodiversity.service';
import { MediaPickerComponent, MediaPickerSelection } from '../../../shared/media-picker/media-picker.component';
import { ToastService } from '../../../services/toast.service';

@Component({
  standalone: true,
  selector: 'app-biodiversity-form',
  imports: [CommonModule, FormsModule, RouterLink, QuillEditorComponent, MediaPickerComponent],
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
          <div style="display:flex; justify-content:space-between; gap:16px; align-items:flex-start; margin-bottom:12px;">
            <div>
              <label>Imagem</label>
              <p class="muted" style="margin:6px 0 0;">Escolha sempre da galeria primeiro. Se nao existir, carregue na biblioteca.</p>
            </div>
            <button type="button" class="btn outline sm" (click)="openImagePicker()">Abrir galeria</button>
          </div>
          <div *ngIf="item.image" class="preview-container">
            <img [src]="item.image" alt="Bio preview">
            <div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center;">
              <button type="button" class="btn outline sm" (click)="openImagePicker()">Trocar pela galeria</button>
              <button type="button" class="btn danger sm" (click)="removeImage()">Remover Imagem</button>
            </div>
          </div>
          <div *ngIf="!item.image" class="upload-placeholder">
            <button type="button" class="btn" (click)="openImagePicker()">
              Selecionar Imagem da Galeria
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
          <button type="submit" class="btn primary" [disabled]="saving">
            {{ saving ? 'Salvando...' : 'Salvar' }}
          </button>
          <a class="btn" routerLink="/admin/biodiversity">Voltar</a>
        </div>
      </form>
    </div>

    <app-media-picker
      [visible]="imagePickerOpen"
      mode="image"
      title="Galeria para biodiversidade"
      (close)="imagePickerOpen = false"
      (selected)="onImageSelected($event)">
    </app-media-picker>
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
  error = '';
  imagePickerOpen = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bioService: BiodiversityService,
    private toast: ToastService
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

  removeImage(): void {
    this.item.image = '';
  }

  openImagePicker(): void {
    this.imagePickerOpen = true;
  }

  onImageSelected(selection: MediaPickerSelection): void {
    this.item.image = selection.url;
    this.imagePickerOpen = false;
  }

  save(): void {
    this.saving = true;
    const action$ = this.isNew 
      ? this.bioService.create(this.item) 
      : this.bioService.update(+this.id!, this.item);

    action$.subscribe({
      next: () => {
        this.toast.success(this.isNew ? 'Entrada criada com sucesso.' : 'Entrada atualizada com sucesso.');
        this.router.navigate(['/admin/biodiversity']);
      },
      error: () => { this.error = 'Erro ao salvar entrada.'; this.saving = false; }
    });
  }
}
