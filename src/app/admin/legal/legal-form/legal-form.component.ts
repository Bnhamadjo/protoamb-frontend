import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QuillEditorComponent } from 'ngx-quill';
import { finalize } from 'rxjs/operators';
import { PostService, Post } from '../../posts/services/post.service';
import { CategoryService } from '../../posts/services/category.service';
import { MediaFile, MediaService } from '../../../services/media.service';
import { ToastService } from '../../../services/toast.service';
import { UploadService } from '../../../services/upload.service';

type LibraryMode = 'image' | 'document';

@Component({
  standalone: true,
  selector: 'app-legal-form',
  imports: [CommonModule, FormsModule, RouterLink, QuillEditorComponent],
  template: `
    <div class="legal-form anim-fade-in">
      <header class="form-header">
        <h1>{{ slug === 'new' ? 'Novo Documento Legal' : 'Editar Documento' }}</h1>
        <p class="muted">Carregue legislação, manuais e relatórios para a biblioteca pública.</p>
      </header>

      <div *ngIf="loading" class="center-box card">
        <div class="spinner"></div>
        <p class="muted">Carregando dados do documento...</p>
      </div>

      <div *ngIf="error" class="error-banner card">
        <span>Aviso</span> {{ error }}
        <button (click)="error = ''" class="btn ghost sm">x</button>
      </div>

      <form *ngIf="!loading" (ngSubmit)="save()" class="card" style="position: relative;">
        <div *ngIf="saving || uploading" class="loading-overlay">
           <div class="center-box">
             <div class="spinner"></div>
             <p class="muted">{{ uploading ? 'Fazendo upload...' : 'Salvando...' }}</p>
           </div>
        </div>

        <div class="grid-2">
           <div class="form-group">
            <label>Título do Documento / Lei</label>
            <input [(ngModel)]="post.title" name="title" required placeholder="Ex: Lei de Bases do Ambiente">
          </div>
          
          <div class="form-group">
            <label>Tipo de Documento</label>
            <select [(ngModel)]="post.document_label" name="document_label" required>
              <option [ngValue]="null">Selecione o tipo...</option>
              <option *ngFor="let type of docTypes" [value]="type">{{ type }}</option>
            </select>
          </div>
        </div>

        <!-- PDF UPLOAD SECTION (CRITICAL) -->
        <div class="featured-image-section pdf-primary">
          <div style="display:flex; justify-content:space-between; gap:16px; align-items:flex-start; margin-bottom:16px;">
            <div>
              <label>Ficheiro PDF do Documento</label>
              <p class="muted sm">Este é o ficheiro que o cidadão irá descarregar.</p>
            </div>
            <button type="button" class="btn primary sm" (click)="openMediaLibrary('document')">Selecionar PDF</button>
          </div>

          <div *ngIf="post.document_file" class="document-card-preview">
            <div class="pdf-icon">PDF</div>
            <div class="pdf-info">
              <strong>Documento selecionado</strong>
              <a [href]="post.document_file" target="_blank" class="text-accent">Ver ficheiro atual</a>
            </div>
            <button type="button" class="btn danger sm" (click)="removeDocument()">Remover</button>
          </div>

          <div *ngIf="!post.document_file" class="upload-placeholder">
            <span class="muted">Nenhum ficheiro anexado. Clique em "Selecionar PDF".</span>
          </div>
        </div>

        <div class="form-group">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <label style="margin: 0;">Descrição / Resumo</label>
            <button type="button" class="btn ghost sm" (click)="showSource = !showSource">
              {{ showSource ? '[ Ver Editor Visual ]' : '[ < > Ver Código ]' }}
            </button>
          </div>
          
          <quill-editor 
            *ngIf="!showSource"
            [(ngModel)]="post.body" 
            name="body" 
            [styles]="{ height: '250px', 'background': '#fff' }"
            placeholder="Breve descrição do conteúdo do documento..."
          ></quill-editor>

          <textarea
            *ngIf="showSource"
            [(ngModel)]="post.body"
            name="body_source"
            style="width: 100%; height: 250px; font-family: monospace; padding: 16px; border: 1px solid var(--border); border-radius: 8px; background: #1e1e1e; color: #d4d4d4;"
          ></textarea>
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label>Estado</label>
            <select [(ngModel)]="post.status" name="status">
              <option value="draft">Rascunho (Privado)</option>
              <option value="published">Publicado (Público)</option>
            </select>
          </div>

          <div class="form-group">
            <label>Idioma do Documento</label>
            <select [(ngModel)]="post.lang" name="lang">
              <option value="pt">Português</option>
              <option value="fr">Francês</option>
              <option value="en">Inglês</option>
            </select>
          </div>
        </div>

        <div class="actions" style="display:flex; gap: 15px; margin-top: 30px;">
          <button type="submit" class="btn primary lg" [disabled]="saving || uploading">
            {{ saving ? 'Processando...' : 'Salvar no Arquivo' }}
          </button>
          <a class="btn outline lg" routerLink="/admin/legal">Cancelar</a>
        </div>
      </form>
    </div>

    <!-- Media Library Modal -->
    <div class="media-modal" *ngIf="libraryOpen">
      <div class="media-overlay" (click)="closeMediaLibrary()"></div>
      <div class="media-dialog card">
        <div class="media-dialog-head">
          <h2>Selecionar Documento</h2>
          <button type="button" class="btn ghost sm" (click)="closeMediaLibrary()">Fechar</button>
        </div>
        
        <div class="media-toolbar">
          <input [(ngModel)]="librarySearch" (ngModelChange)="applyLibraryFilter()" placeholder="Pesquisar ficheiro...">
          <input type="file" #fileInput hidden (change)="onLibraryUpload($event)" accept=".pdf">
          <button type="button" class="btn outline sm" (click)="fileInput.click()">Carregar Novo PDF</button>
        </div>

        <div class="library-grid" *ngIf="!libraryLoading">
           <div class="library-card" *ngFor="let file of filteredLibraryMedia" (click)="selectLibraryFile(file)">
             <div class="pdf-tile">PDF</div>
             <strong>{{ file.name }}</strong>
           </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .legal-form { max-width: 900px; }
    .pdf-primary { border: 2px solid var(--primary-lighter); background: #f0f7f4 !important; }
    .document-card-preview { display: flex; align-items: center; gap: 20px; padding: 15px; background: white; border-radius: 12px; border: 1px solid var(--border); }
    .pdf-icon { background: #ef4444; color: white; padding: 10px; border-radius: 8px; font-weight: 800; }
    .pdf-info { flex: 1; display: flex; flex-direction: column; }
    .error-banner { background: #FEF2F2; color: #DC2626; padding: 15px; margin-bottom: 20px; border: 1px solid #FEE2E2; }
    .media-modal { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .media-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); }
    .media-dialog { position: relative; z-index: 1; width: 100%; max-width: 800px; max-height: 80vh; overflow-y: auto; }
    .media-toolbar { display: flex; gap: 10px; margin-bottom: 20px; }
    .library-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; }
    .library-card { border: 1px solid var(--border); padding: 15px; border-radius: 12px; cursor: pointer; text-align: center; }
    .library-card:hover { border-color: var(--primary); background: #f0fdf4; }
    .pdf-tile { background: #fee2e2; color: #ef4444; padding: 20px; border-radius: 10px; margin-bottom: 10px; font-weight: 800; }
  `]
})
export class LegalFormComponent implements OnInit {
  slug: string | null = null;
  post: Post = {
    title: '',
    body: '',
    status: 'published',
    lang: 'pt',
    document_label: null,
    document_file: null
  };
  
  loading = false;
  saving = false;
  uploading = false;
  error = '';
  showSource = false;
  
  docTypes = ['Legislação', 'Manuais', 'Pareceres', 'Relatórios', 'Formulários'];
  
  libraryOpen = false;
  libraryLoading = false;
  librarySearch = '';
  libraryMedia: MediaFile[] = [];
  filteredLibraryMedia: MediaFile[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private categoryService: CategoryService,
    private mediaService: MediaService,
    private uploadService: UploadService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug');
    if (this.slug && this.slug !== 'new') {
      this.loadDocument();
    }
  }

  loadDocument(): void {
    this.loading = true;
    this.postService.show(this.slug!).subscribe({
      next: (res) => { this.post = res; this.loading = false; },
      error: () => { this.error = 'Falha ao carregar documento.'; this.loading = false; }
    });
  }

  async save() {
    if (!this.post.title || !this.post.document_label) {
      this.error = 'Por favor, preencha o título e o tipo de documento.';
      return;
    }

    this.saving = true;
    
    // Ensure category is set
    try {
      const categories = await this.categoryService.all().toPromise();
      if (categories) {
        const legalCat = categories.find(c => c.slug === 'biblioteca-legal');
        if (legalCat) {
          this.post.category_id = legalCat.id;
        }
      }
    } catch (e) { console.error('Error fetching categories', e); }

    const action$ = (this.slug === 'new' || !this.slug)
      ? this.postService.create(this.post)
      : this.postService.update(this.post.id!, this.post);

    action$.subscribe({
      next: () => {
        this.toast.success('Documento salvo com sucesso.');
        this.router.navigate(['/admin/legal']);
      },
      error: () => { this.saving = false; this.error = 'Erro ao salvar documento.'; }
    });
  }

  openMediaLibrary(mode: 'document'): void {
    this.libraryOpen = true;
    this.loadLibraryMedia();
  }

  closeMediaLibrary(): void { this.libraryOpen = false; }

  loadLibraryMedia(): void {
    this.libraryLoading = true;
    this.mediaService.all().subscribe({
      next: (res) => {
        this.libraryMedia = res.filter(f => (f.type || '').includes('pdf') || f.path.endsWith('.pdf'));
        this.applyLibraryFilter();
        this.libraryLoading = false;
      }
    });
  }

  applyLibraryFilter(): void {
    const q = this.librarySearch.toLowerCase();
    this.filteredLibraryMedia = this.libraryMedia.filter(f => f.name.toLowerCase().includes(q));
  }

  selectLibraryFile(file: MediaFile): void {
    this.post.document_file = file.url;
    this.closeMediaLibrary();
  }

  onLibraryUpload(event: any): void {
    const file = event.target.files[0];
    if (!file) return;
    this.uploading = true;
    this.uploadService.uploadDocument(file).subscribe({
      next: (res) => {
        this.post.document_file = res.url;
        this.uploading = false;
        this.closeMediaLibrary();
      },
      error: () => { this.uploading = false; this.toast.error('Erro no upload.'); }
    });
  }

  removeDocument(): void { this.post.document_file = null; }
}
