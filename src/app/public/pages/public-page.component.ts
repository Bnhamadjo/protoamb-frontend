import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../api-config';
import { SeoService } from '../../services/seo.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  standalone: true,
  selector: 'app-public-page',
  imports: [CommonModule],
  template: `
    <div class="public-page" *ngIf="page">
      <div class="public-hero" *ngIf="page.featured_image" [style.backgroundImage]="'url(' + page.featured_image + ')'">
        <div class="hero-content anim-up">
          <h1>{{ page.title }}</h1>
        </div>
      </div>
      <div class="container page-main-layout anim-up">
        <h1 *ngIf="!page.featured_image" class="section-title mb-8">{{ page.title }}</h1>
        <div class="card page-content-card" [innerHTML]="safeContent">
        </div>
      </div>
    </div>
    
    <div *ngIf="loading" class="center-box" style="padding: 150px">
      <div class="spinner"></div>
      <p class="muted">Carregando conteúdo...</p>
    </div>
  `,
  styles: [`
    .public-page { background: var(--bg-app); min-height: 100vh; padding-bottom: 80px; }
    .mb-8 { margin-bottom: 32px; }
    .section-title { font-size: clamp(2rem, 5vw, 3.5rem); line-height: 1.1; overflow-wrap: break-word; }
    
    .public-hero {
      position: relative; height: 45vh; min-height: 320px; max-height: 500px;
      display: flex; align-items: center; justify-content: center;
      background-size: cover; background-position: center; color: #fff;
      margin-bottom: -60px; /* Overlap effect */
    }
    .public-hero::before {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(rgba(6, 38, 29, 0.4), rgba(6, 38, 29, 0.85));
      z-index: 1;
    }
    .hero-content { position: relative; z-index: 10; text-align: center; padding: 0 24px; }
    .hero-content h1 { font-size: clamp(2rem, 5vw, 3.8rem); margin: 0; color: #fff; text-shadow: 0 10px 30px rgba(0,0,0,0.3); }

    .page-main-layout { position: relative; z-index: 20; padding-top: 40px; }
    .page-content-card {
      padding: clamp(24px, 6vw, 64px) !important;
      font-size: clamp(1rem, 1.2vw, 1.16rem);
      line-height: 1.85;
      color: var(--ink);
      border-radius: 24px;
      box-shadow: var(--shadow-xl);
      overflow-wrap: break-word;
      word-wrap: break-word;
      word-break: break-word;
      hyphens: auto;
    }

    .page-content-card ::ng-deep img { max-width: 100%; height: auto; border-radius: 16px; margin: 32px 0; box-shadow: var(--shadow); }
    .page-content-card ::ng-deep h1, .page-content-card ::ng-deep h2 { margin: 40px 0 20px; font-family: "Fraunces", serif; color: var(--brand); line-height: 1.2; max-width: 100%; overflow-wrap: break-word; }
    .page-content-card ::ng-deep h1 { font-size: clamp(1.8rem, 4vw, 2.8rem); }
    .page-content-card ::ng-deep h2 { font-size: clamp(1.4rem, 3vw, 2.22rem); }
    .page-content-card ::ng-deep p { margin-bottom: 24px; text-align: justify; text-wrap: pretty; }
    
    .page-content-card ::ng-deep table { width: 100%; border-collapse: collapse; margin: 24px 0; overflow-x: auto; display: block; }
    .page-content-card ::ng-deep tr:nth-child(even) { background: #f8faf9; }
    .page-content-card ::ng-deep td, .page-content-card ::ng-deep th { padding: 12px 16px; border: 1px solid #e2e8f0; text-align: left; }

    .page-content-card ::ng-deep blockquote {
      margin: 32px 0; padding: 24px 32px;
      background: #f1f5f2; border-left: 5px solid var(--primary);
      border-radius: 0 20px 20px 0; font-style: italic; color: #334155;
    }

    @media (max-width: 768px) {
      .public-hero { height: 35vh; margin-bottom: 20px; }
      .page-main-layout { padding-top: 0; }
      .page-content-card { border-radius: 16px; padding: 24px !important; }
      .page-content-card ::ng-deep p { text-align: left; font-size: 1.05rem; }
      .page-content-card ::ng-deep h1 { font-size: 1.8rem; }
      .page-content-card ::ng-deep h2 { font-size: 1.5rem; }
    }
  `]
})
export class PublicPageComponent implements OnInit {
  page: any;
  loading = true;
  safeContent: SafeHtml = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private seo: SeoService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.fetchPage(params['slug']);
    });
  }

  fetchPage(slug: string): void {
    this.http.get<any>(API_BASE + '/pages/' + slug).subscribe({
      next: (res) => {
        this.page = res;
        this.safeContent = this.sanitizer.bypassSecurityTrustHtml(res.content || '');
        this.loading = false;
        this.seo.updatePage({
          title: res.title || 'Pagina institucional',
          description: this.getDescription(res.content),
          image: res.featured_image || '/logo.png'
        });
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/404']);
      }
    });
  }

  private getDescription(content?: string): string {
    const plain = this.toPlainText(content || '');
    return plain.slice(0, 160) || 'Conheca o conteudo institucional publicado no portal ProtoAmb.';
  }

  private toPlainText(value: string): string {
    const withoutTags = value.replace(/<[^>]+>/g, ' ');
    const textarea = document.createElement('textarea');
    textarea.innerHTML = withoutTags;

    return textarea.value
      .replace(/\u00a0/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
