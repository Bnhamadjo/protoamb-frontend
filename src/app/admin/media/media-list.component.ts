import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MediaService, MediaFile } from '../../services/media.service';
import { UploadService } from '../../services/upload.service';

@Component({
  standalone: true,
  selector: 'app-media-list',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="media-container">
      <div class="header">
        <div>
          <span class="section-kicker">Biblioteca</span>
          <h1>Gestor de Media</h1>
        </div>
        <div class="actions">
          <input type="file" #fileInput hidden (change)="onFileSelected($event)" accept="image/*,application/pdf,.pdf" multiple>
          <button class="btn primary" (click)="fileInput.click()" [disabled]="uploading">
            {{ uploading ? 'Enviando...' : 'Upload de ficheiros' }}
          </button>
        </div>
      </div>

      <div class="toolbar card">
        <input [(ngModel)]="searchTerm" (ngModelChange)="applyFilters()" placeholder="Pesquisar ficheiro, pasta ou extensao">
        <div class="type-filters">
          <button class="btn sm" [class.primary]="activeType === 'all'" (click)="setType('all')">Todos</button>
          <button class="btn sm" [class.primary]="activeType === 'image'" (click)="setType('image')">Imagens</button>
          <button class="btn sm" [class.primary]="activeType === 'document'" (click)="setType('document')">Documentos</button>
        </div>
      </div>

      <div *ngIf="loading" class="muted center" style="padding: 40px">Carregando galeria...</div>
      <div *ngIf="error" class="error">{{ error }}</div>

      <div class="media-grid" *ngIf="!loading">
        <div class="media-item card" *ngFor="let file of filteredMedia">
          <div class="image-wrapper" [class.document-wrapper]="!isImage(file)">
            <img *ngIf="isImage(file)" [src]="file.url" [alt]="file.name">
            <div *ngIf="!isImage(file)" class="document-placeholder">
              <strong>PDF</strong>
              <span>{{ file.name }}</span>
            </div>
          </div>
          <div class="item-info">
            <div class="meta">
              <span class="name">{{ file.name || file.path }}</span>
              <span class="muted type-tag">{{ isImage(file) ? 'Imagem' : 'Documento' }}</span>
            </div>
            <div class="item-actions">
              <button class="btn ghost sm" (click)="copyUrl(file.url)">Copiar link</button>
              <a class="btn ghost sm" [href]="file.url" target="_blank" rel="noopener">Abrir</a>
              <button class="btn danger sm icon-only" (click)="deleteMedia(file.path)" title="Eliminar">x</button>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && filteredMedia.length === 0" class="empty">
        <p>Nenhum ficheiro corresponde aos filtros atuais.</p>
      </div>
    </div>
  `,
  styles: [`
    .media-container { animation: fadeIn 0.4s ease-out; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; gap: 18px; }
    .toolbar { display: grid; grid-template-columns: 1.2fr auto; gap: 16px; align-items: center; }
    .type-filters { display: flex; gap: 8px; flex-wrap: wrap; }
    .media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
    .media-item { padding: 10px; display: flex; flex-direction: column; gap: 10px; transition: var(--transition); }
    .media-item:hover { transform: translateY(-3px); }
    .image-wrapper { aspect-ratio: 1; overflow: hidden; border-radius: var(--radius-sm); background: var(--bg-app); display: flex; align-items: center; justify-content: center; }
    .image-wrapper img { width: 100%; height: 100%; object-fit: cover; }
    .document-wrapper { background: linear-gradient(135deg, #edf4ef, #f7fbf8); }
    .document-placeholder { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 18px; text-align: center; }
    .document-placeholder strong { width: 64px; height: 64px; border-radius: 18px; display: flex; align-items: center; justify-content: center; background: var(--brand); color: #fff; }
    .item-info { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
    .meta { min-width: 0; }
    .item-info .name { display: block; font-size: 0.8rem; color: var(--ink-muted); word-break: break-word; }
    .type-tag { display: block; margin-top: 6px; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; }
    .item-actions { display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }
    .icon-only { padding: 4px 8px; font-size: 1rem; }
    .empty { padding: 80px; text-align: center; color: var(--ink-muted); border: 2px dashed var(--border); border-radius: var(--radius-lg); }
    @media (max-width: 900px) {
      .toolbar { grid-template-columns: 1fr; }
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class MediaListComponent implements OnInit {
  media: MediaFile[] = [];
  filteredMedia: MediaFile[] = [];
  loading = true;
  uploading = false;
  error = '';
  searchTerm = '';
  activeType: 'all' | 'image' | 'document' = 'all';

  constructor(
    private mediaService: MediaService,
    private uploadService: UploadService
  ) {}

  ngOnInit(): void {
    this.loadMedia();
  }

  loadMedia(): void {
    this.mediaService.all().subscribe({
      next: (res) => {
        this.media = res;
        this.filteredMedia = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erro ao carregar galeria.';
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files.length === 0) return;

    this.uploading = true;
    let completed = 0;

    Array.from(files).forEach((file: any) => {
      const uploader = String(file.type).includes('pdf') || String(file.name).toLowerCase().endsWith('.pdf')
        ? this.uploadService.uploadDocument(file)
        : this.uploadService.upload(file);

      uploader.subscribe({
        next: () => {
          completed++;
          if (completed === files.length) {
            this.uploading = false;
            this.loadMedia();
          }
        },
        error: () => {
          this.uploading = false;
          this.error = 'Erro em um ou mais uploads.';
        }
      });
    });
  }

  deleteMedia(path: string): void {
    if (!confirm('Eliminar este ficheiro permanentemente?')) return;
    this.mediaService.delete(path).subscribe({
      next: () => {
        this.media = this.media.filter(m => m.path !== path);
        this.applyFilters();
      },
      error: () => alert('Erro ao eliminar.')
    });
  }

  setType(type: 'all' | 'image' | 'document'): void {
    this.activeType = type;
    this.applyFilters();
  }

  applyFilters(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredMedia = this.media.filter((file) => {
      const kind = this.isImage(file) ? 'image' : 'document';
      const haystack = `${file.name || ''} ${file.path || ''} ${file.type || ''}`.toLowerCase();
      const matchesTerm = !term || haystack.includes(term);
      const matchesType = this.activeType === 'all' || kind === this.activeType;
      return matchesTerm && matchesType;
    });
  }

  isImage(file: MediaFile): boolean {
    return (file.type || '').startsWith('image/') || /\.(png|jpe?g|webp|gif|svg)$/i.test(file.path);
  }

  copyUrl(url: string): void {
    navigator.clipboard.writeText(url).catch(() => {});
  }
}
