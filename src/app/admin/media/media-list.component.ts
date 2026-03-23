import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaService, MediaFile } from '../../services/media.service';
import { UploadService } from '../../services/upload.service';

@Component({
  standalone: true,
  selector: 'app-media-list',
  imports: [CommonModule],
  template: `
    <div class="media-container">
      <div class="header">
        <h1>Gestor de Media</h1>
        <div class="actions">
          <input type="file" #fileInput hidden (change)="onFileSelected($event)" accept="image/*" multiple>
          <button class="btn primary" (click)="fileInput.click()" [disabled]="uploading">
            {{ uploading ? 'Enviando...' : 'Upload de Imagens' }}
          </button>
        </div>
      </div>

      <div *ngIf="loading" class="muted center" style="padding: 40px">Carregando galeria...</div>
      <div *ngIf="error" class="error">{{ error }}</div>

      <div class="media-grid" *ngIf="!loading">
        <div class="media-item card" *ngFor="let file of media">
          <div class="image-wrapper">
            <img [src]="file.url" [alt]="file.name">
          </div>
          <div class="item-info">
            <span class="name">{{ file.name || file.path }}</span>
            <button class="btn danger sm icon-only" (click)="deleteMedia(file.path)" title="Eliminar">🗑️</button>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && media.length === 0" class="empty">
        <p>Ainda não carregou nenhuma imagem.</p>
      </div>
    </div>
  `,
  styles: [`
    .media-container { animation: fadeIn 0.4s ease-out; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    
    .media-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
    }

    .media-item {
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      transition: var(--transition);
    }
    .media-item:hover { transform: translateY(-3px); }

    .image-wrapper {
      aspect-ratio: 1;
      overflow: hidden;
      border-radius: var(--radius-sm);
      background: var(--bg-app);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .image-wrapper img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .item-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
    }
    .item-info .name {
      font-size: 0.8rem;
      color: var(--ink-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .icon-only { padding: 4px 8px; font-size: 1rem; }

    .empty { padding: 80px; text-align: center; color: var(--ink-muted); border: 2px dashed var(--border); border-radius: var(--radius-lg); }
    
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class MediaListComponent implements OnInit {
  media: MediaFile[] = [];
  loading = true;
  uploading = false;
  error = '';

  constructor(
    private mediaService: MediaService,
    private uploadService: UploadService
  ) {}

  ngOnInit(): void {
    this.loadMedia();
  }

  loadMedia(): void {
    this.mediaService.all().subscribe({
      next: (res) => { this.media = res; this.loading = false; },
      error: () => { this.error = 'Erro ao carregar galeria.'; this.loading = false; }
    });
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files.length === 0) return;

    this.uploading = true;
    // For simplicity, upload sequentially or handled by backend to accept multiple
    // Here we'll just handle one for example or loop
    const uploads = Array.from(files).map(file => this.uploadService.upload(file as File));
    
    // Using simple loop for now as UploadService might not handle multi directly in its current form
    let completed = 0;
    Array.from(files).forEach((file: any) => {
      this.uploadService.upload(file).subscribe({
        next: () => {
          completed++;
          if (completed === files.length) {
            this.uploading = false;
            this.loadMedia();
          }
        },
        error: () => { this.uploading = false; this.error = 'Erro em um ou mais uploads.'; }
      });
    });
  }

  deleteMedia(path: string): void {
    if (!confirm('Eliminar esta imagem permanentemente?')) return;
    this.mediaService.delete(path).subscribe({
      next: () => this.media = this.media.filter(m => m.path !== path),
      error: () => alert('Erro ao eliminar.')
    });
  }
}
