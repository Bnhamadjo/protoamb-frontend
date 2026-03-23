import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { API_BASE } from '../../api-config';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-public-home',
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <!-- HERO SLIDER -->
    <div class="home-slider" *ngIf="slider.length > 0">
      <div class="slides-container">
        <div *ngFor="let slide of slider; let i = index" 
             class="slide" 
             [class.active]="i === currentSlide"
             [style.background-image]="'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(' + slide.image + ')'">
          <div class="slide-content anim-up" *ngIf="i === currentSlide">
            <h1 class="logo-text">{{ slide.title }}</h1>
            <p class="subtitle">{{ slide.subtitle }}</p>
            <div class="slider-actions">
              <a routerLink="/denuncias" class="btn primary lg">Denunciar Irregularidade</a>
              <a routerLink="/pages/ministerio" class="btn outline lg white">Conheça o Ministério</a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- CONTROLS -->
      <button (click)="prevSlide()" class="slider-nav prev">❮</button>
      <button (click)="nextSlide()" class="slider-nav next">❯</button>
      
      <div class="slider-dots">
        <span *ngFor="let slide of slider; let i = index" 
              [class.active]="i === currentSlide"
              (click)="goToSlide(i)"></span>
      </div>
    </div>

    <!-- OLD HERO (Fallback) -->
    <div class="public-hero" *ngIf="slider.length === 0">
      <div class="hero-bg" [style.background-image]="'url(assets/hero-bg.png)'"></div>
      <div class="hero-content anim-up">
        <h1 class="logo-text">Protegendo o Ambiente para as Gerações Futuras</h1>
        <div class="search-bar">
          <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="onSearch()" placeholder="O que você está procurando?">
          <button (click)="onSearch()" class="btn-search">Pesquisar</button>
        </div>
      </div>
    </div>

    <!-- ACTION BLOCKS -->
    <section class="action-blocks container">
      <div class="grid-4">
        <div class="action-card anim-up" style="animation-delay: 0.1s" routerLink="/denuncias">
          <span class="icon">📢</span>
          <h3>Denúncias Ambientais</h3>
          <p class="muted sm">Reporte irregularidades</p>
        </div>
        <div class="action-card anim-up" style="animation-delay: 0.2s" routerLink="/biodiversity">
          <span class="icon">🐾</span>
          <h3>Áreas Protegidas</h3>
          <p class="muted sm">Explore a biodiversidade</p>
        </div>
        <div class="action-card anim-up" style="animation-delay: 0.3s" routerLink="/publicacoes">
          <span class="icon">📜</span>
          <h3>Legislação Ambiental</h3>
          <p class="muted sm">Conheça as leis</p>
        </div>
        <div class="action-card anim-up" style="animation-delay: 0.4s" routerLink="/estatisticas">
          <span class="icon">📊</span>
          <h3>Dados e Estatísticas</h3>
          <p class="muted sm">Relatórios atualizados</p>
        </div>
      </div>
    </section>

    <!-- SOBRE O MINISTÉRIO -->
    <section class="about-section container" style="margin: 100px auto;">
      <div class="grid-2" style="align-items: center; gap: 60px;">
        <div class="anim-up">
          <h2 class="section-title">Sobre o Ministério</h2>
          <p style="font-size: 1.1rem; line-height: 1.8; color: var(--ink-muted); margin-bottom: 25px;">
            O Ministério do Ambiente e Biodiversidade tem como missão a promoção do desenvolvimento sustentável através da preservação, proteção e conservação do ambiente e da biodiversidade na Guiné-Bissau.
          </p>
          <a routerLink="/pages/sobre-nos" class="btn primary lg">Ver Missão e Visão</a>
        </div>
        <div class="anim-up" style="animation-delay: 0.2s">
          <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop" style="width: 100%; border-radius: var(--radius-md); box-shadow: var(--shadow-lg);" alt="Ambiente">
        </div>
      </div>
    </section>

    <!-- DESTAQUES / HIGHLIGHTS -->
    <section class="highlights-section py-5" style="background: var(--bg-alt); padding: 100px 0;">
      <div class="container">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 50px;">
          <div>
            <h2 class="section-title" style="margin-bottom: 10px;">Destaques Recentes</h2>
            <p class="muted">As últimas notícias e eventos sobre o ambiente.</p>
          </div>
          <a routerLink="/posts" class="btn-link" style="color: var(--brand); font-weight: 700;">Ver Todos os Posts →</a>
        </div>

        <div *ngIf="loadingPosts" class="center-box">
          <div class="spinner"></div>
        </div>

        <div class="grid-3" *ngIf="!loadingPosts">
          <div class="impeccable-card anim-up" *ngFor="let post of posts; let i = index" [style.animation-delay]="(i * 0.1) + 's'">
            <img [src]="post.featured_image || 'https://images.unsplash.com/photo-1501854140801-50d01674fe86?q=80&w=1000&auto=format&fit=crop'" class="card-img" alt="Post">
            <div class="card-content">
              <span class="tag">{{ post.category_name || 'Notícias' }}</span>
              <h4>{{ post.title }}</h4>
              <p>{{ post.excerpt }}</p>
              <a [routerLink]="['/posts', post.slug]" class="btn-link">Ler Mais →</a>
            </div>
          </div>
        </div>
      </div>
    </section>

  `,
  styles: [`
    .home-slider { height: 85vh; min-height: 600px; position: relative; overflow: hidden; background: #000; }
    .slides-container { height: 100%; width: 100%; }
    .slide { 
      position: absolute; inset: 0; background-size: cover; background-position: center;
      display: flex; align-items: center; justify-content: center; text-align: center;
      opacity: 0; transition: opacity 1s ease-in-out, transform 1s ease-out; transform: scale(1.1);
    }
    .slide.active { opacity: 1; transform: scale(1); }
    
    .slide-content { max-width: 900px; padding: 0 40px; color: #fff; }
    .slide-content h1 { font-size: 4rem; font-weight: 800; line-height: 1.1; margin-bottom: 20px; text-shadow: 0 4px 20px rgba(0,0,0,0.3); }
    .slide-content .subtitle { font-size: 1.4rem; opacity: 0.9; margin-bottom: 40px; }
    
    .slider-actions { display: flex; gap: 20px; justify-content: center; }
    .btn.white { color: #fff; border-color: #fff; }
    .btn.white:hover { background: #fff; color: var(--primary); }

    .slider-nav { 
      position: absolute; top: 50%; transform: translateY(-50%); 
      background: rgba(255,255,255,0.1); border: none; color: #fff; font-size: 2rem;
      padding: 20px; cursor: pointer; border-radius: 50%; width: 70px; height: 70px;
      display: flex; align-items: center; justify-content: center; transition: 0.3s;
      z-index: 10; backdrop-filter: blur(5px);
    }
    .slider-nav:hover { background: var(--primary); }
    .slider-nav.prev { left: 30px; }
    .slider-nav.next { right: 30px; }

    .slider-dots { 
      position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); 
      display: flex; gap: 12px; z-index: 10;
    }
    .slider-dots span { 
      width: 12px; height: 12px; border-radius: 50%; background: rgba(255,255,255,0.3); 
      cursor: pointer; transition: 0.3s;
    }
    .slider-dots span.active { background: #fff; transform: scale(1.3); }

    @media (max-width: 768px) {
      .slide-content h1 { font-size: 2.5rem; }
      .slider-nav { display: none; }
    }
  `]
})
export class PublicHomeComponent implements OnInit, OnDestroy {
  stats: any = { fauna: 0, flora: 0, areas: 0, projects: 0 };
  posts: any[] = [];
  slider: any[] = [];
  currentSlide = 0;
  slideInterval: any;
  
  loadingStats = true;
  loadingPosts = true;
  searchQuery = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>(API_BASE + '/home').subscribe({
      next: (res) => {
        if (res.stats) this.stats = res.stats;
        if (res.slider) this.slider = res.slider;
        this.loadingStats = false;
        
        if (res.posts) {
          this.posts = res.posts.map((p: any) => ({
            ...p,
            excerpt: p.body?.replace(/<[^>]*>/g, '').substring(0, 150) + (p.body?.length > 150 ? '...' : '')
          }));
        }
        this.loadingPosts = false;
      },
      error: () => {
        this.loadingStats = false;
        this.loadingPosts = false;
      }
    });

    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    if (this.slideInterval) clearInterval(this.slideInterval);
  }

  startAutoPlay(): void {
    if (this.slideInterval) clearInterval(this.slideInterval);
    if (this.slider && this.slider.length > 1) {
      this.slideInterval = setInterval(() => {
        this.nextSlide();
      }, 5000);
    }
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Search for:', this.searchQuery);
    }
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slider.length;
    this.startAutoPlay(); // Reset timer on manual click
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slider.length) % this.slider.length;
    this.startAutoPlay(); // Reset timer on manual click
  }

  goToSlide(i: number): void {
    this.currentSlide = i;
    this.startAutoPlay(); // Reset timer on manual click
  }
}
