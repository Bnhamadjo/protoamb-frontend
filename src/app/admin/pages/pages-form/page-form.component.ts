import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QuillEditorComponent } from 'ngx-quill';
import { PageService, Page } from '../services/page.service';
import { UploadService } from '../../../services/upload.service';

@Component({
  standalone: true,
  selector: 'app-page-form',
  imports: [CommonModule, FormsModule, RouterLink, QuillEditorComponent],
  templateUrl: './page-form.component.html',
  styleUrls: ['./page-form.component.scss']
})
export class PagesFormComponent implements OnInit {
  slug: string | null = null;
  page: Page = {
    title: '',
    content: '',
    status: 'draft',
    lang: 'pt',
    featured_image: null,
    parent_id: null
  };
  pages: Page[] = [];
  loading = false;
  saving = false;
  uploading = false;
  error = '';
  dirty = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: PageService,
    private uploadService: UploadService
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug');

    this.loadPages();

    if (this.slug && this.slug !== 'new') {
      this.loading = true;
      this.service.show(this.slug).subscribe({
        next: (res) => { this.page = res; this.loading = false; },
        error: () => { this.error = 'Falha ao carregar a página.'; this.loading = false; }
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploading = true;
      this.uploadService.upload(file).subscribe({
        next: (res) => {
          this.page.featured_image = res.url;
          this.uploading = false;
        },
        error: () => {
          this.error = 'Falha ao fazer upload da imagem.';
          this.uploading = false;
        }
      });
    }
  }

  removeImage(): void {
    this.page.featured_image = null;
  }

  loadPages(): void {
    this.service.all().subscribe(res => {
      this.pages = res.filter(p => p.id !== this.page.id); // Prevent self-parenting
    });
  }

  save(): void {
    if (!this.page.title) { this.error = 'O título da página é obrigatório.'; return; }
    this.saving = true; this.error = '';

    const action$ = (this.slug === 'new' || !this.slug) 
      ? this.service.create(this.page) 
      : this.service.update(this.page.id!, this.page);

    action$.subscribe({
      next: () => this.router.navigate(['/admin/pages']),
      error: (err) => { 
        console.error('Save error:', err);
        this.error = 'Não foi possível guardar a página. Verifique a ligação.'; 
      }
    });
  }
}