import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QuillEditorComponent } from 'ngx-quill';
import { finalize } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { PostService, Post } from '../services/post.service';
import { PageService, Page } from '../../pages/services/page.service';
import { CategoryService, Category } from '../services/category.service';
import { MediaFile, MediaService } from '../../../services/media.service';
import { ToastService } from '../../../services/toast.service';
import { UploadService } from '../../../services/upload.service';

type LibraryMode = 'image' | 'document';

@Component({
  standalone: true,
  selector: 'app-posts-form',
  imports: [CommonModule, FormsModule, RouterLink, QuillEditorComponent],
  template: `
    <div class="posts-form">
      <header class="form-header">
        <h1>{{ slug === 'new' ? 'Nova Publicacao' : 'Editar Publicacao' }}</h1>
        <p class="muted">Gerencie o conteudo do blog do portal.</p>
      </header>

      <div *ngIf="loading" class="center-box">
        <div class="spinner"></div>
        <p class="muted">Carregando dados...</p>
      </div>

      <div *ngIf="error" class="error-banner">
        <span>Aviso</span> {{ error }}
        <button (click)="error = ''" class="btn ghost sm">x</button>
      </div>

      <form *ngIf="!loading" (ngSubmit)="save()" class="card">
        <div *ngIf="saving" class="loading-overlay">
          <div class="center-box">
            <div class="spinner"></div>
            <p class="muted">A guardar...</p>
          </div>
        </div>

        <div class="form-group">
          <label>Titulo</label>
          <input [(ngModel)]="post.title" name="title" required placeholder="Informe um titulo atraente">
        </div>

        <div class="featured-image-section">
          <div class="section-head">
            <div>
              <label>Imagem de Destaque</label>
              <p class="muted sm">Escolha primeiro a partir da galeria. Se nao existir, carregue um ficheiro novo.</p>
            </div>
            <button type="button" class="btn outline sm" (click)="openMediaLibrary('image')">Abrir galeria</button>
          </div>

          <div *ngIf="post.featured_image" class="preview-container">
            <img [src]="post.featured_image" alt="Preview">
            
            <div class="form-group w-full" style="margin-top: 10px;">
              <label class="sm">Legenda da Imagem (Opcional)</label>
              <input [(ngModel)]="post.featured_image_caption" name="featured_image_caption" placeholder="Ex: Foto por João Silva / Ministério do Ambiente">
            </div>

            <div class="preview-actions">
              <button type="button" class="btn outline sm" (click)="openMediaLibrary('image')">Trocar pela galeria</button>
              <button type="button" class="btn danger sm" (click)="removeImage()">Remover imagem</button>
            </div>
          </div>

          <div *ngIf="!post.featured_image" class="empty-selection">
            <span class="muted">Nenhuma imagem selecionada.</span>
          </div>
        </div>

        <div class="featured-image-section">
          <div class="section-head">
            <div>
              <label>Anexo PDF</label>
              <p class="muted sm">Use a biblioteca de documentos do portal para anexar o PDF.</p>
            </div>
            <button type="button" class="btn outline sm" (click)="openMediaLibrary('document')">Abrir galeria</button>
          </div>

          <div *ngIf="post.document_file" class="preview-container document-preview">
            <div class="document-card">
              <strong>{{ post.document_label || 'Documento PDF anexado' }}</strong>
              <a [href]="post.document_file" target="_blank" rel="noopener">Abrir PDF</a>
            </div>
            <div class="preview-actions">
              <button type="button" class="btn outline sm" (click)="openMediaLibrary('document')">Trocar pela galeria</button>
              <button type="button" class="btn danger sm" (click)="removeDocument()">Remover PDF</button>
            </div>
          </div>

          <div *ngIf="!post.document_file" class="empty-selection">
            <span class="muted">Nenhum PDF selecionado.</span>
          </div>

          <div class="form-group" style="margin-top: 16px;">
            <label>Texto do link do PDF</label>
            <input [(ngModel)]="post.document_label" name="document_label" placeholder="Ex: Baixar relatorio completo (PDF)">
          </div>
        </div>

        <div class="form-group">
          <label>Conteudo</label>
          <quill-editor
            [(ngModel)]="post.body"
            name="body"
            [styles]="{ height: '350px', 'background': '#fff' }"
            placeholder="Comece a escrever a historia..."
          ></quill-editor>
        </div>

        <div class="preview-block card" *ngIf="post.body">
          <div class="preview-head">
            <strong>Pre-visualizacao</strong>
            <span class="muted">Assim o conteudo sera apresentado ao leitor.</span>
          </div>
          <div class="preview-content" [innerHTML]="post.body"></div>
        </div>

        <div class="grid-3">
          <div class="form-group">
            <label>Categoria</label>
            <select [(ngModel)]="post.category_id" name="category_id">
              <option [ngValue]="undefined">Sem Categoria</option>
              <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Pagina Destino</label>
            <select [(ngModel)]="post.page_id" name="page_id">
              <option [ngValue]="undefined">Nenhuma (Post Geral)</option>
              <option *ngFor="let pg of pages" [value]="pg.id">{{ pg.title }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Status</label>
            <select [(ngModel)]="post.status" name="status">
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Resumo (Opcional)</label>
          <textarea [(ngModel)]="post.excerpt" name="excerpt" placeholder="Breve descricao para listagens" rows="3"></textarea>
        </div>

        <div class="actions">
          <button type="submit" class="btn primary lg" [disabled]="saving || uploading">
            {{ saving ? 'Processando...' : 'Salvar Publicacao' }}
          </button>
          <a class="btn outline lg" routerLink="/admin/posts">Cancelar</a>
        </div>
      </form>
    </div>

    <div class="media-modal" *ngIf="libraryOpen">
      <div class="media-overlay" (click)="closeMediaLibrary()"></div>
      <div class="media-dialog card">
        <div class="media-dialog-head">
          <div>
            <h2>{{ libraryMode === 'image' ? 'Galeria de imagens' : 'Galeria de documentos' }}</h2>
            <p class="muted">Selecione um ficheiro existente. Se nao encontrar, carregue um novo abaixo.</p>
          </div>
          <button type="button" class="btn ghost sm" (click)="closeMediaLibrary()">Fechar</button>
        </div>

        <div class="media-toolbar">
          <input [(ngModel)]="librarySearch" (ngModelChange)="applyLibraryFilter()" placeholder="Pesquisar na galeria">
          <div class="library-upload">
            <input
              type="file"
              #libraryFileInput
              hidden
              (change)="onLibraryUpload($event)"
              [accept]="libraryMode === 'image' ? 'image/*' : 'application/pdf,.pdf'">
            <button type="button" class="btn outline sm" (click)="libraryFileInput.click()">
              {{ libraryMode === 'image' ? 'Carregar nova imagem' : 'Carregar novo PDF' }}
            </button>
          </div>
        </div>

        <div *ngIf="libraryLoading" class="center-box">
          <div class="spinner"></div>
          <p class="muted">A carregar galeria...</p>
        </div>

        <div class="library-grid" *ngIf="!libraryLoading && filteredLibraryMedia.length">
          <button type="button" class="library-card" *ngFor="let file of filteredLibraryMedia" (click)="selectLibraryFile(file)">
            <div class="library-thumb" [class.document-thumb]="libraryMode === 'document'">
              <img *ngIf="libraryMode === 'image'" [src]="file.url" [alt]="file.name">
              <div *ngIf="libraryMode === 'document'" class="pdf-tile">PDF</div>
            </div>
            <strong>{{ file.name }}</strong>
            <span class="muted">{{ file.path }}</span>
          </button>
        </div>

        <div class="empty-illustration" *ngIf="!libraryLoading && !filteredLibraryMedia.length">
          <h3>Nenhum ficheiro encontrado</h3>
          <p class="muted">Pesquise outro nome ou use o botao de carregar para adicionar um novo ficheiro a galeria.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .posts-form { max-width: 1000px; animation: fadeIn 0.4s ease-out; }
    .form-header { margin-bottom: 30px; }
    .error-banner {
      background: #FEF2F2; color: #DC2626; padding: 12px 20px; border-radius: 8px;
      margin-bottom: 20px; display: flex; align-items: center; gap: 12px; border: 1px solid #FEE2E2;
    }
    .featured-image-section {
      margin: 20px 0; padding: 24px; border: 2px dashed var(--border); border-radius: 12px;
      background: #F8FAFC;
    }
    .section-head {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: start;
      margin-bottom: 16px;
    }
    .preview-container { display: flex; flex-direction: column; align-items: center; gap: 15px; }
    .preview-container img { max-width: 100%; max-height: 300px; border-radius: 12px; box-shadow: var(--shadow); }
    .preview-actions { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
    .empty-selection {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      border-radius: 12px;
      background: #fff;
      border: 1px solid var(--border);
    }
    .document-preview { align-items: stretch; }
    .document-card {
      width: 100%;
      padding: 16px 18px;
      border-radius: 12px;
      background: #fff;
      border: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }
    .preview-block { margin-top: 12px; background: #fcfdfb; }
    .preview-head { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 16px; align-items: center; }
    .preview-content { line-height: 1.85; color: var(--ink); }
    .preview-content ::ng-deep p { text-align: justify; }
    .preview-content ::ng-deep img { max-width: 100%; border-radius: 12px; margin: 24px 0; }
    .actions { display: flex; gap: 15px; margin-top: 30px; padding-top: 20px; border-top: 1px solid var(--border); }

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
    .media-dialog-head {
      display: flex;
      justify-content: space-between;
      gap: 18px;
      align-items: start;
      margin-bottom: 18px;
    }
    .media-toolbar {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 14px;
      margin-bottom: 18px;
    }
    .library-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 16px;
    }
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
    .library-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow);
      border-color: rgba(var(--primary-rgb), 0.32);
    }
    .library-thumb {
      aspect-ratio: 1;
      border-radius: 12px;
      overflow: hidden;
      background: #edf3ee;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .library-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
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
    .library-card strong {
      word-break: break-word;
    }
    .library-card span {
      font-size: 0.76rem;
      word-break: break-word;
    }
    @media (max-width: 900px) {
      .media-toolbar,
      .section-head {
        grid-template-columns: 1fr;
        display: grid;
      }
    }
  `]
})
export class PostsFormComponent implements OnInit {
  slug: string | null = null;
  post: Post = {
    title: '',
    body: '',
    status: 'published',
    excerpt: '',
    lang: 'pt'
  };
  categories: Category[] = [];
  pages: Page[] = [];
  loading = false;
  saving = false;
  uploading = false;
  error = '';

  libraryOpen = false;
  libraryMode: LibraryMode = 'image';
  libraryLoading = false;
  librarySearch = '';
  libraryMedia: MediaFile[] = [];
  filteredLibraryMedia: MediaFile[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private pageService: PageService,
    private categoryService: CategoryService,
    private mediaService: MediaService,
    private uploadService: UploadService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug');
    this.loadMetadata();
    if (this.slug && this.slug !== 'new') {
      this.loading = true;
      this.postService.show(this.slug).subscribe({
        next: (res) => { this.post = res; this.loading = false; },
        error: () => {
          this.error = 'Falha ao carregar publicacao. Verifique se o slug esta correto.';
          this.loading = false;
        }
      });
    }
  }

  loadMetadata(): void {
    // Use forkJoin to fire both requests in parallel instead of sequentially
    // This cuts the wait time by ~50% on a single-threaded artisan serve
    forkJoin({
      categories: this.categoryService.all(),
      pages: this.pageService.all()
    }).subscribe(({ categories, pages }) => {
      this.categories = categories;
      this.pages = pages;
    });
  }

  openMediaLibrary(mode: LibraryMode): void {
    this.libraryMode = mode;
    this.libraryOpen = true;
    this.librarySearch = '';
    this.loadLibraryMedia();
  }

  closeMediaLibrary(): void {
    this.libraryOpen = false;
  }

  // Cache media within a session to avoid repeated fetching on every modal open
  private cachedMedia: MediaFile[] | null = null;

  loadLibraryMedia(): void {
    if (this.cachedMedia !== null) {
      // Use the cache - no HTTP round trip
      this.libraryMedia = this.cachedMedia;
      this.applyLibraryFilter();
      this.libraryLoading = false;
      return;
    }
    this.libraryLoading = true;
    this.mediaService.all().subscribe({
      next: (res) => {
        this.cachedMedia = Array.isArray(res) ? res : [];
        this.libraryMedia = this.cachedMedia;
        this.applyLibraryFilter();
        this.libraryLoading = false;
      },
      error: () => {
        this.libraryMedia = [];
        this.filteredLibraryMedia = [];
        this.libraryLoading = false;
        this.toast.error('Erro ao carregar a galeria de media.');
      }
    });
  }

  applyLibraryFilter(): void {
    const term = this.librarySearch.trim().toLowerCase();
    this.filteredLibraryMedia = this.libraryMedia.filter((file) => {
      const matchesKind = this.libraryMode === 'image' ? this.isImage(file) : this.isDocument(file);
      const haystack = `${file.name || ''} ${file.path || ''}`.toLowerCase();
      const matchesTerm = !term || haystack.includes(term);
      return matchesKind && matchesTerm;
    });
  }

  selectLibraryFile(file: MediaFile): void {
    if (this.libraryMode === 'image') {
      this.post.featured_image = file.url;
    } else {
      this.post.document_file = file.url;
      this.post.document_label = this.post.document_label || file.name;
    }

    this.toast.success(this.libraryMode === 'image' ? 'Imagem selecionada a partir da galeria.' : 'Documento selecionado a partir da galeria.');
    this.closeMediaLibrary();
  }

  onLibraryUpload(event: Event): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;

    this.uploading = true;
    const request$ = this.libraryMode === 'image'
      ? this.uploadService.upload(file)
      : this.uploadService.uploadDocument(file);

    request$.subscribe({
      next: (res) => {
        this.uploading = false;
        this.toast.success(this.libraryMode === 'image' ? 'Nova imagem carregada para a galeria.' : 'Novo documento carregado para a galeria.');
        if (this.libraryMode === 'image') {
          this.post.featured_image = res.url;
        } else {
          this.post.document_file = res.url;
          this.post.document_label = this.post.document_label || file.name;
        }
        this.loadLibraryMedia();
      },
      error: () => {
        this.uploading = false;
        this.toast.error(this.libraryMode === 'image' ? 'Falha no upload da imagem.' : 'Falha no upload do PDF.');
      }
    });
  }

  removeImage(): void {
    this.post.featured_image = null;
  }

  removeDocument(): void {
    this.post.document_file = null;
    this.post.document_label = null;
  }

  save(): void {
    if (!this.post.title) {
      this.error = 'O titulo e obrigatorio.';
      return;
    }

    this.saving = true;
    this.error = '';

    const action$ = (this.slug === 'new' || !this.slug)
      ? this.postService.create(this.post)
      : this.postService.update(this.post.id!, this.post);

    action$.pipe(
      finalize(() => {
        this.saving = false;
      })
    ).subscribe({
      next: () => {
        this.saving = false;
        this.toast.success(this.slug === 'new' || !this.slug ? 'Publicacao criada com sucesso.' : 'Publicacao atualizada com sucesso.');
        this.router.navigate(['/admin/posts']);
      },
      error: (err) => {
        console.error('Save error:', err);
        const apiMessage = err?.error?.message || err?.error?.error || err?.message;
        this.error = apiMessage ? `Erro ao salvar publicacao: ${apiMessage}` : 'Erro ao salvar publicacao. Verifique a conexao com a API.';
        this.toast.error('Nao foi possivel publicar o post.');
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
