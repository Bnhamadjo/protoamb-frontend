import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MediaFile, MediaService } from '../../services/media.service';
import { ToastService } from '../../services/toast.service';
import { UploadService } from '../../services/upload.service';

export interface MediaPickerSelection {
  url: string;
  name: string;
}

@Component({
  standalone: true,
  selector: 'app-media-picker',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="media-modal" *ngIf="visible">
      <div class="media-overlay" (click)="close.emit()"></div>
      <div class="media-dialog card">
        <div class="media-dialog-head">
          <div>
            <h2>{{ title || (mode === 'image' ? 'Galeria de imagens' : 'Galeria de documentos') }}</h2>
            <p class="muted">Selecione um ficheiro existente. Se nao encontrar, carregue um novo.</p>
          </div>
          <button type="button" class="btn ghost sm" (click)="close.emit()">Fechar</button>
        </div>

        <div class="media-toolbar">
          <input [(ngModel)]="search" (ngModelChange)="applyFilter()" placeholder="Pesquisar na galeria">
          <div class="library-upload">
            <input
              type="file"
              #libraryFileInput
              hidden
              (change)="uploadFromModal($event)"
              [accept]="mode === 'image' ? 'image/*' : 'application/pdf,.pdf'">
            <button type="button" class="btn outline sm" (click)="libraryFileInput.click()">
              {{ mode === 'image' ? 'Carregar novo ficheiro' : 'Carregar novo PDF' }}
            </button>
          </div>
        </div>

        <div *ngIf="loading" class="center-box">
          <div class="spinner"></div>
          <p class="muted">A carregar galeria...</p>
        </div>

        <div class="library-grid" *ngIf="!loading && filteredMedia.length">
          <button type="button" class="library-card" *ngFor="let file of filteredMedia" (click)="choose(file)">
            <div class="library-thumb">
              <img *ngIf="mode === 'image'" [src]="file.url" [alt]="file.name">
              <div *ngIf="mode === 'document'" class="pdf-tile">PDF</div>
            </div>
            <strong>{{ file.name }}</strong>
            <span class="muted">{{ file.path }}</span>
          </button>
        </div>

        <div class="empty-illustration" *ngIf="!loading && !filteredMedia.length">
          <h3>Nenhum ficheiro encontrado</h3>
          <p class="muted">Pesquise outro nome ou carregue um novo ficheiro para a galeria.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .media-modal { position: fixed; inset: 0; z-index: 1400; display: grid; place-items: center; padding: 24px; }
    .media-overlay { position: absolute; inset: 0; background: rgba(10, 24, 18, 0.55); backdrop-filter: blur(4px); }
    .media-dialog {
      position: relative;
      z-index: 1;
      width: min(1100px, 100%);
      max-height: 88vh;
      overflow: auto;
      border-radius: 24px;
      margin: 0;
    }
    .media-dialog-head { display: flex; justify-content: space-between; gap: 18px; align-items: start; margin-bottom: 18px; }
    .media-toolbar { display: grid; grid-template-columns: 1fr auto; gap: 14px; margin-bottom: 18px; }
    .library-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; }
    .library-card {
      border: 1px solid var(--border);
      background: #fff;
      border-radius: 18px;
      padding: 12px;
      text-align: left;
      cursor: pointer;
      transition: var(--transition);
      display: grid;
      gap: 10px;
    }
    .library-card:hover { transform: translateY(-2px); box-shadow: var(--shadow); border-color: rgba(var(--primary-rgb), 0.32); }
    .library-thumb { aspect-ratio: 1; border-radius: 12px; overflow: hidden; background: #edf3ee; display: flex; align-items: center; justify-content: center; }
    .library-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .pdf-tile {
      width: 72px;
      height: 72px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--brand);
      color: #fff;
      font-weight: 800;
      letter-spacing: 0.08em;
    }
    .library-card strong, .library-card span { word-break: break-word; }
    .library-card span { font-size: 0.76rem; }
    @media (max-width: 900px) {
      .media-toolbar { grid-template-columns: 1fr; }
    }
  `]
})
export class MediaPickerComponent implements OnChanges {
  @Input() visible = false;
  @Input() mode: 'image' | 'document' = 'image';
  @Input() title = '';
  @Output() close = new EventEmitter<void>();
  @Output() selected = new EventEmitter<MediaPickerSelection>();

  loading = false;
  search = '';
  media: MediaFile[] = [];
  filteredMedia: MediaFile[] = [];

  constructor(
    private mediaService: MediaService,
    private uploadService: UploadService,
    private toast: ToastService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['visible'] || changes['mode']) && this.visible) {
      this.search = '';
      this.loadMedia();
    }
  }

  loadMedia(): void {
    this.loading = true;
    this.mediaService.all().subscribe({
      next: (res) => {
        this.media = Array.isArray(res) ? res : [];
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.media = [];
        this.filteredMedia = [];
        this.loading = false;
        this.toast.error('Erro ao carregar a galeria de media.');
      }
    });
  }

  applyFilter(): void {
    const term = this.search.trim().toLowerCase();
    this.filteredMedia = this.media.filter((file) => {
      const matchesKind = this.mode === 'image' ? this.isImage(file) : this.isDocument(file);
      const haystack = `${file.name || ''} ${file.path || ''}`.toLowerCase();
      return matchesKind && (!term || haystack.includes(term));
    });
  }

  choose(file: MediaFile): void {
    this.selected.emit({ url: file.url, name: file.name || file.path });
  }

  uploadFromModal(event: Event): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;

    const request$ = this.mode === 'image'
      ? this.uploadService.upload(file)
      : this.uploadService.uploadDocument(file);

    request$.subscribe({
      next: (res) => {
        this.toast.success(this.mode === 'image' ? 'Novo ficheiro carregado para a galeria.' : 'Novo PDF carregado para a galeria.');
        this.selected.emit({ url: res.url, name: file.name });
        this.loadMedia();
      },
      error: () => {
        this.toast.error(this.mode === 'image' ? 'Falha no upload da imagem.' : 'Falha no upload do PDF.');
      }
    });
  }

  private isImage(file: MediaFile): boolean {
    return (file.type || '').startsWith('image/') || /\.(png|jpe?g|gif|webp|svg)$/i.test(file.path);
  }

  private isDocument(file: MediaFile): boolean {
    return (file.type || '').includes('pdf') || /\.pdf$/i.test(file.path);
  }
}
