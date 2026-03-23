import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-public-post-detail',
  imports: [CommonModule, RouterLink],
  template: `
    <article class="post-detail" *ngIf="post">
      <div class="post-hero" [style.backgroundImage]="'url(' + (post.image || 'assets/default-post.jpg') + ')'">
        <div class="container">
          <div class="meta">
            <span>{{ post.created_at | date:'dd MMMM, yyyy' }}</span>
            <span class="sep">•</span>
            <span>Conservação</span>
          </div>
          <h1>{{ post.title }}</h1>
        </div>
      </div>

      <div class="container post-body">
        <div class="content" [innerHTML]="post.content"></div>
        
        <div class="post-footer">
          <a routerLink="/posts" class="btn secondary">← Voltar às Notícias</a>
        </div>
      </div>
    </article>
    
    <div *ngIf="loading" class="muted center" style="padding: 100px">Carregando publicação...</div>
  `,
  styles: [`
    .post-hero { 
      height: 400px; background-size: cover; background-position: center; 
      display: flex; align-items: flex-end; padding-bottom: 60px; color: #fff;
      position: relative;
    }
    .post-hero::before { 
      content: ''; position: absolute; inset: 0; 
      background: linear-gradient(transparent, rgba(0,0,0,0.8)); 
    }
    .post-hero .container { position: relative; z-index: 1; }
    .post-hero h1 { font-size: 3rem; font-weight: 800; margin-top: 15px; }
    .meta { font-size: 0.9rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9; }
    .sep { margin: 0 10px; }

    .post-body { max-width: 800px; margin-top: -60px; background: #fff; padding: 60px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); position: relative; z-index: 10; margin-bottom: 80px; }
    .content { line-height: 1.8; font-size: 1.15rem; color: #333; }
    .content ::ng-deep img { max-width: 100%; border-radius: 8px; margin: 30px 0; }
    
    .post-footer { margin-top: 60px; border-top: 1px solid var(--border); padding-top: 30px; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
  `]
})
export class PublicPostDetailComponent implements OnInit {
  post: any;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      this.fetchPost(slug);
    });
  }

  fetchPost(slug: string): void {
    this.http.get<any>(`http://127.0.0.1:8000/api/posts/${slug}`).subscribe({
      next: (res) => {
        this.post = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Publicação não encontrada.');
      }
    });
  }
}
