import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../api-config';

@Component({
  standalone: true,
  selector: 'app-public-page',
  imports: [CommonModule],
  template: `
    <div class="public-page" *ngIf="page">
      <!-- HERO -->
      <div class="public-hero" *ngIf="page.featured_image">
        <div class="hero-bg" [style.backgroundImage]="'url(' + page.featured_image + ')'"></div>
        <div class="hero-content anim-up">
          <h1>{{ page.title }}</h1>
        </div>
      </div>
      
      <!-- TITLE ONLY (if no image) -->
      <div class="container" *ngIf="!page.featured_image" style="margin-top: 60px;">
        <h1 class="section-title">{{ page.title }}</h1>
      </div>

      <!-- CONTENT -->
      <div class="container anim-up" style="margin-bottom: 100px;">
        <div class="card page-content" [innerHTML]="page.content" style="padding: 50px; font-size: 1.15rem; line-height: 1.8; color: var(--ink);">
        </div>
      </div>
    </div>
    
    <div *ngIf="loading" class="center-box" style="padding: 150px">
      <div class="spinner"></div>
      <p class="muted">Carregando conteúdo...</p>
    </div>
  `,
  styles: [`
    .page-content ::ng-deep img { max-width: 100%; border-radius: var(--radius-sm); margin: 20px 0; }
    .page-content ::ng-deep h2 { margin-top: 40px; color: var(--brand); }
    .page-content ::ng-deep p { margin-bottom: 20px; }
    .container { max-width: 1000px; margin: 0 auto; padding: 0 20px; }
  `]
})
export class PublicPageComponent implements OnInit {
  page: any;
  loading = true;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.fetchPage(params['slug']);
    });
  }

  fetchPage(slug: string): void {
    this.http.get<any>(API_BASE + '/pages/' + slug).subscribe({
      next: (res) => {
        this.page = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/404']);
      }
    });
  }
}
