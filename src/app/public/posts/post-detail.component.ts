import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, of } from 'rxjs';

import { API_BASE } from '../../api-config';
import { SeoService } from '../../services/seo.service';

@Component({
  standalone: true,
  selector: 'app-public-post-detail',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="news-header">
      <div class="container anim-up">
        <span class="section-kicker" style="color: #fff; background: rgba(255,255,255,0.15);">Centro Editorial</span>
        <h1>Publicacoes e Noticias</h1>
        <p>Comunicacao institucional, relatorios e atualizacoes.</p>
      </div>
    </div>

    <article class="post-detail container anim-up" *ngIf="post">
      <div class="post-meta mb-6">
        <span class="text-brand font-bold uppercase tracking-wider text-sm">{{ post.category?.name || 'Noticias' }}</span>
        <span class="mx-3 text-gray-300">|</span>
        <span class="text-muted font-medium">{{ post.created_at | date:'dd MMMM, yyyy' }}</span>
      </div>

      <h1 class="detailed-title mb-10 text-5xl md:text-6xl font-black leading-tight">{{ post.title }}</h1>

      <div class="featured-img-box mb-12 shadow-2xl rounded-3xl overflow-hidden anim-up" *ngIf="post.featured_image">
        <img [src]="post.featured_image" class="w-full" style="display: block;" [alt]="post.title">
        <p class="image-caption" *ngIf="post.featured_image_caption">{{ post.featured_image_caption }}</p>
      </div>

      <div class="post-body-content">
        <div class="content lg:text-xl" [innerHTML]="post.body || post.excerpt"></div>

        <div *ngIf="post.document_file" class="document-download">
          <div>
            <span class="eyebrow">Documento</span>
            <h3>{{ post.document_label || 'Anexo PDF' }}</h3>
            <p>Abra ou descarregue o ficheiro complementar desta publicacao.</p>
          </div>
          <a [href]="post.document_file" target="_blank" rel="noopener" class="btn primary">Abrir PDF</a>
        </div>

        <div class="post-footer">
          <a routerLink="/posts" class="btn secondary">Voltar as Noticias</a>
        </div>
      </div>
    </article>

    <div *ngIf="loading" class="muted center" style="padding: 100px">Carregando publicacao...</div>

    <div *ngIf="!loading && !post" class="empty-state">
      <h2>Publicacao indisponivel</h2>
      <p>{{ error || 'Esta publicacao nao foi encontrada ou ainda nao esta publicada.' }}</p>
      <a routerLink="/posts" class="btn secondary">Voltar as Noticias</a>
    </div>
  `,
  styles: [`
    .detailed-title { color: var(--brand); max-width: 900px; }
    .featured-img-box { 
      max-width: 400px; 
      float: left;
      margin: 0 32px 24px 0; 
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 15px 30px rgba(0,0,0,0.1);
    }
    @media (max-width: 768px) {
      .featured-img-box { float: none; margin: 0 0 32px 0; max-width: 100%; }
    }
    .post-body-content {
      max-width: 900px; margin: 0 auto 80px; 
      padding: 0;
    }
    .content {
      line-height: 1.95;
      font-size: 1.12rem;
      color: #2a332d;
      text-align: justify;
      text-wrap: pretty;
      hyphens: auto;
      overflow-wrap: break-word;
      word-wrap: break-word;
      word-break: break-word;
    }
    .content ::ng-deep p,
    .content ::ng-deep li {
      text-align: justify;
    }
    .content ::ng-deep h2,
    .content ::ng-deep h3,
    .content ::ng-deep h4 {
      line-height: 1.3;
      margin: 2.2rem 0 1rem;
      color: #16261c;
    }
    .content ::ng-deep img { max-width: 100%; border-radius: 8px; margin: 30px 0; }
    .content ::ng-deep blockquote {
      margin: 2rem 0;
      padding: 1rem 1.25rem;
      border-left: 4px solid var(--primary);
      background: #f6f8f5;
      color: #435046;
    }
    .document-download {
      margin-top: 32px;
      padding: 22px 24px;
      border-radius: 16px;
      background: linear-gradient(135deg, #eef5ec, #f8fbf7);
      border: 1px solid #d8e4d7;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 24px;
    }
    .eyebrow {
      display: inline-block;
      margin-bottom: 8px;
      font-size: 0.75rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #5f7361;
      font-weight: 700;
    }
    .image-caption {
      padding: 12px 16px;
      font-size: 0.85rem;
      color: var(--ink-muted);
      font-style: italic;
      background: rgba(0,0,0,0.02);
      margin: 0;
      border-top: 1px solid rgba(0,0,0,0.05);
      line-height: 1.4;
    }
    .post-footer { margin-top: 60px; border-top: 1px solid var(--border); padding-top: 30px; }
    .empty-state { max-width: 720px; margin: 80px auto; padding: 40px 20px; text-align: center; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
  `]
})
export class PublicPostDetailComponent implements OnInit {
  fallbackImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 500'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='%23152f20'/><stop offset='1' stop-color='%233b6c44'/></linearGradient></defs><rect width='1200' height='500' fill='url(%23g)'/><text x='80' y='120' font-size='42' font-family='Arial' fill='white'>Publicacao</text></svg>";
  post: any = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private seo: SeoService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.fetchPost(params['slug']);
    });
  }

  fetchPost(slug: string): void {
    this.post = null;
    this.loading = true;
    this.error = '';

    this.http.get<any>(`${API_BASE}/posts/${slug}`).pipe(
      catchError((err) => {
        this.error = err?.status === 404
          ? 'Esta publicacao ainda nao esta publicada ou nao existe.'
          : 'Nao foi possivel carregar esta publicacao.';
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe((res) => {
      this.post = res;
      if (res) {
        this.seo.updatePage({
          title: res.title || 'Publicacao',
          description: this.toDescription(res.excerpt || res.body),
          image: res.featured_image || this.fallbackImage,
          type: 'article'
        });
      }
    });
  }

  private toDescription(value?: string): string {
    return this.toPlainText(value || '').slice(0, 160)
      || 'Leia esta publicacao do portal ProtoAmb.';
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
