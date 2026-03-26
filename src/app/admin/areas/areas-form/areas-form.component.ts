import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QuillEditorComponent } from 'ngx-quill';
import { AreaService, AreaItem } from '../services/area.service';
import { MediaPickerComponent, MediaPickerSelection } from '../../../shared/media-picker/media-picker.component';
import { ToastService } from '../../../services/toast.service';

@Component({
  standalone: true,
  selector: 'app-areas-form',
  imports: [CommonModule, FormsModule, RouterLink, QuillEditorComponent, MediaPickerComponent],
  template: `
    <div class="areas-form">
      <h1>{{ isNew ? 'Nova Area Protegida' : 'Editar Area Protegida' }}</h1>

      <div *ngIf="loading" class="muted">Carregando...</div>
      <div *ngIf="error" class="error">{{ error }}</div>

      <form *ngIf="!loading" (ngSubmit)="save()">
        <div class="grid-2">
          <div>
            <label>Nome da Area</label>
            <input [(ngModel)]="item.name" name="name" required placeholder="Ex: Parque Nacional de Cantanhez">
          </div>
          <div>
            <label>Localizacao</label>
            <input [(ngModel)]="item.location" name="location" placeholder="Ex: Regiao de Tombali">
          </div>
        </div>

        <div class="image-upload-section">
          <div class="section-head">
            <div>
              <label>Imagem da Area</label>
              <p class="muted">Escolha a partir da galeria. Se nao encontrar, carregue dentro da biblioteca.</p>
            </div>
            <button type="button" class="btn outline sm" (click)="openImagePicker()">Abrir galeria</button>
          </div>

          <div *ngIf="item.image_url" class="preview-container">
            <img [src]="item.image_url" alt="Area preview">
            <div class="preview-actions">
              <button type="button" class="btn outline sm" (click)="openImagePicker()">Trocar pela galeria</button>
              <button type="button" class="btn danger sm" (click)="removeImage()">Remover imagem</button>
            </div>
          </div>

          <div *ngIf="!item.image_url" class="upload-placeholder">
            <button type="button" class="btn" (click)="openImagePicker()">Selecionar imagem da galeria</button>
          </div>
        </div>

        <label>Descricao e Contexto</label>
        <quill-editor 
          [(ngModel)]="item.description" 
          name="description" 
          [styles]="{ height: '300px' }"
        ></quill-editor>

        <div class="grid-2">
          <div>
            <label>Superficie (km2)</label>
            <input [(ngModel)]="item.surface_area" name="surface_area" placeholder="Ex: 1067 km2">
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
          <button type="submit" class="btn primary" [disabled]="saving">
            {{ saving ? 'Salvando...' : 'Salvar' }}
          </button>
          <a class="btn" routerLink="/admin/areas">Voltar</a>
        </div>
      </form>
    </div>

    <app-media-picker
      [visible]="imagePickerOpen"
      mode="image"
      title="Galeria para area protegida"
      (close)="imagePickerOpen = false"
      (selected)="onImageSelected($event)">
    </app-media-picker>
  `,
  styles: [`
    .areas-form { max-width: 900px; }
    .image-upload-section { margin: 16px 0; padding: 16px; border: 1px dashed #cfe0da; border-radius: 10px; background: #fdfdfd; }
    .section-head { display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; margin-bottom: 12px; }
    .section-head p { margin: 6px 0 0; }
    .preview-container { display: flex; flex-direction: column; align-items: center; gap: 10px; }
    .preview-container img { max-width: 100%; max-height: 250px; border-radius: 8px; }
    .preview-actions { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
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
  error = '';
  imagePickerOpen = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private areaService: AreaService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id && this.id !== 'new') {
      this.isNew = false;
      this.loading = true;
      this.areaService.show(+this.id).subscribe({
        next: (res) => { this.item = res; this.loading = false; },
        error: () => { this.error = 'Falha ao carregar area.'; this.loading = false; }
      });
    }
  }

  removeImage(): void {
    this.item.image_url = null;
  }

  openImagePicker(): void {
    this.imagePickerOpen = true;
  }

  onImageSelected(selection: MediaPickerSelection): void {
    this.item.image_url = selection.url;
    this.imagePickerOpen = false;
  }

  save(): void {
    this.saving = true;
    const action$ = this.isNew 
      ? this.areaService.create(this.item) 
      : this.areaService.update(+this.id!, this.item);

    action$.subscribe({
      next: () => {
        this.toast.success(this.isNew ? 'Area guardada com sucesso.' : 'Area atualizada com sucesso.');
        this.router.navigate(['/admin/areas']);
      },
      error: () => { this.error = 'Erro ao salvar area.'; this.saving = false; }
    });
  }
}
