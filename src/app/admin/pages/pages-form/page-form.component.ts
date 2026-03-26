import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QuillEditorComponent } from 'ngx-quill';
import { PageService, Page } from '../services/page.service';
import { MediaPickerComponent, MediaPickerSelection } from '../../../shared/media-picker/media-picker.component';
import { ToastService } from '../../../services/toast.service';

@Component({
  standalone: true,
  selector: 'app-page-form',
  imports: [CommonModule, FormsModule, RouterLink, QuillEditorComponent, MediaPickerComponent],
  templateUrl: './page-form.component.html',
  styleUrls: ['./page-form.component.scss']
})
export class PagesFormComponent implements OnInit {
  slug: string | null = null;
  page: Page = {
    title: '',
    content: '',
    status: 'published',
    lang: 'pt',
    featured_image: null,
    parent_id: null
  };
  pages: Page[] = [];
  loading = false;
  saving = false;
  error = '';
  dirty = false;
  imagePickerOpen = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: PageService,
    private toast: ToastService
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

  removeImage(): void {
    this.page.featured_image = null;
  }

  openImagePicker(): void {
    this.imagePickerOpen = true;
  }

  onImageSelected(selection: MediaPickerSelection): void {
    this.page.featured_image = selection.url;
    this.imagePickerOpen = false;
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
      next: () => {
        this.toast.success(this.slug === 'new' || !this.slug ? 'Pagina criada com sucesso.' : 'Pagina atualizada com sucesso.');
        this.router.navigate(['/admin/pages']);
      },
      error: (err) => { 
        console.error('Save error:', err);
        this.error = 'Não foi possível guardar a página. Verifique a ligação.'; 
      }
    });
  }
}
