import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QuillEditorComponent } from 'ngx-quill';
import { PostService, Post } from '../services/post.service';
import { PageService, Page } from '../../pages/services/page.service';
import { CategoryService, Category } from '../services/category.service';
import { UploadService } from '../../../services/upload.service';

@Component({
  standalone: true,
  selector: 'app-posts-form',
  imports: [CommonModule, FormsModule, RouterLink, QuillEditorComponent],
  template: `
    <div class="posts-form">
      <header class="form-header">
        <h1>{{ slug === 'new' ? 'Nova Publicação' : 'Editar Publicação' }}</h1>
        <p class="muted">Gerencie o conteúdo do blog do portal.</p>
      </header>

      <div *ngIf="loading" class="center-box">
        <div class="spinner"></div>
        <p class="muted">Carregando dados...</p>
      </div>

      <div *ngIf="error" class="error-banner">
        <span>⚠️</span> {{ error }}
        <button (click)="error = ''" class="btn ghost sm">x</button>
      </div>

      <form *ngIf="!loading" (ngSubmit)="save()" class="card">
        <div *ngIf="saving || uploading" class="loading-overlay">
           <div class="center-box">
             <div class="spinner"></div>
             <p class="muted">{{ uploading ? 'Fazendo upload...' : 'Salvando...' }}</p>
           </div>
        </div>

        <div class="form-group">
          <label>Título</label>
          <input [(ngModel)]="post.title" name="title" required placeholder="Informe o título atraente">
        </div>

        <div class="featured-image-section">
          <label>Imagem de Destaque</label>
          <div *ngIf="post.featured_image" class="preview-container">
            <img [src]="post.featured_image" alt="Preview">
            <button type="button" class="btn danger sm" (click)="removeImage()">Remover Imagem</button>
          </div>
          <div *ngIf="!post.featured_image" class="upload-placeholder">
            <input type="file" #fileInput hidden (change)="onFileSelected($event)" accept="image/*">
            <button type="button" class="btn outline" (click)="fileInput.click()">
              <span>📸 Selecionar Imagem</span>
            </button>
          </div>
        </div>

        <div class="form-group">
          <label>Conteúdo</label>
          <quill-editor 
            [(ngModel)]="post.body" 
            name="body" 
            [styles]="{ height: '350px', 'background': '#fff' }"
            placeholder="Comece a escrever a história..."
          ></quill-editor>
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
            <label>Página Destino</label>
            <select [(ngModel)]="post.page_id" name="page_id">
              <option [ngValue]="undefined">Nenhuma (Post Geral)</option>
              <option *ngFor="let pg of pages" [value]="pg.id">{{ pg.title }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Status</label>
            <select [(ngModel)]="post.status" name="status">
              <option value="draft">📝 Rascunho</option>
              <option value="published">🚀 Publicado</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Resumo (Opcional)</label>
          <textarea [(ngModel)]="post.excerpt" name="excerpt" placeholder="Breve descrição para listagens" rows="3"></textarea>
        </div>

        <div class="actions">
          <button type="submit" class="btn primary lg" [disabled]="saving || uploading">
            {{ saving ? 'Processando...' : 'Salvar Publicação' }}
          </button>
          <a class="btn outline lg" routerLink="/admin/posts">Cancelar</a>
        </div>
      </form>
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
    .preview-container { display: flex; flex-direction: column; align-items: center; gap: 15px; }
    .preview-container img { max-width: 100%; max-height: 300px; border-radius: 12px; shadow: var(--shadow); }
    .upload-placeholder { display: flex; justify-content: center; padding: 20px; }
    .actions { display: flex; gap: 15px; margin-top: 30px; padding-top: 20px; border-top: 1px solid var(--border); }
  `]
})
export class PostsFormComponent implements OnInit {
  slug: string | null = null;
  post: Post = {
    title: '',
    body: '',
    status: 'draft',
    excerpt: '',
    lang: 'pt'
  };
  categories: Category[] = [];
  pages: Page[] = [];
  loadingData = false;
  loading = false;
  saving = false;
  uploading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private pageService: PageService,
    private categoryService: CategoryService,
    private uploadService: UploadService
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug');
    this.loadMetadata();
    if (this.slug && this.slug !== 'new') {
      this.loading = true;
      this.postService.show(this.slug).subscribe({
        next: (res) => { this.post = res; this.loading = false; },
        error: () => { 
          this.error = 'Falha ao carregar publicação. Verifique se o slug está correto.'; 
          this.loading = false; 
        }
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploading = true;
      this.error = '';
      this.uploadService.upload(file).subscribe({
        next: (res) => { this.post.featured_image = res.url; this.uploading = false; },
        error: () => { this.error = 'Falha no upload da imagem.'; this.uploading = false; }
      });
    }
  }

  loadMetadata(): void {
    this.categoryService.all().subscribe(res => this.categories = res);
    this.pageService.all().subscribe(res => this.pages = res);
  }

  removeImage(): void {
    this.post.featured_image = null;
  }

  save(): void {
    if (!this.post.title) {
      this.error = 'O título é obrigatório.';
      return;
    }

    this.saving = true;
    this.error = '';

    const action$ = (this.slug === 'new' || !this.slug) 
      ? this.postService.create(this.post) 
      : this.postService.update(this.post.id!, this.post);

    action$.subscribe({
      next: () => this.router.navigate(['/admin/posts']),
      error: (err) => { 
        console.error('Save error:', err);
        this.error = 'Erro ao salvar publicação. Verifique a conexão com a API.'; 
        this.saving = false; 
      }
    });
  }
}
