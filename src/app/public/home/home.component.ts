import { Component, OnDestroy, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { API_BASE } from '../../api-config';
import { DepartmentItem, GalleryItem, HomeActionCard, PlatformModuleItem, SettingsService } from '../../services/settings.service';

@Component({
  standalone: true,
  selector: 'app-public-home',
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="home-slider" (mouseenter)="pauseAutoPlay()" (mouseleave)="resumeAutoPlay()">
      <div class="slides-container">
        <div *ngFor="let slide of slider; let i = index"
             class="slide"
             [class.active]="i === currentSlide"
             [style.background-image]="'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(' + slide.image + ')'">
          <div class="slide-content anim-up" *ngIf="i === currentSlide">
            <h1 class="logo-text">{{ slide.title }}</h1>
            <p class="subtitle">{{ slide.subtitle }}</p>
            <div class="slider-actions">
              <a routerLink="/denunciar" class="btn primary lg">Denunciar Irregularidade</a>
              <a routerLink="/pages/sobre-nos" class="btn outline lg white">Conheça o Ministério</a>
            </div>
          </div>
        </div>
      </div>

      <button *ngIf="slider.length > 1" (click)="prevSlide()" class="slider-nav prev" aria-label="Slide anterior">&#10094;</button>
      <button *ngIf="slider.length > 1" (click)="nextSlide()" class="slider-nav next" aria-label="Próximo slide">&#10095;</button>

      <div class="slider-dots" *ngIf="slider.length > 1">
        <span *ngFor="let slide of slider; let i = index"
              [class.active]="i === currentSlide"
              (click)="goToSlide(i)"></span>
      </div>
    </div>

    <section class="action-blocks container">
      <div class="grid-4 mt-neg">
        <div
          *ngFor="let card of actionCards; let i = index"
          class="action-card impeccable-card anim-up"
          [style.animation-delay]="((i + 1) * 0.1) + 's'"
          [style.background-image]="card.image ? 'linear-gradient(180deg, rgba(8,18,13,0.35), rgba(8,18,13,0.82)), url(' + card.image + ')' : ''"
          [routerLink]="card.link">
          <span class="icon">{{ card.icon }}</span>
          <h3>{{ card.title }}</h3>
          <p class="muted sm">{{ card.subtitle }}</p>
        </div>
      </div>
    </section>

    <section class="about-section container section-spacing">
      <div class="grid-2 anim-up items-center gap-20">
        <div>
          <span class="section-kicker">Institucional</span>
          <h2 class="section-title">{{ aboutSection.title }}</h2>
          <p style="font-size: 1.15rem; line-height: 1.9; color: var(--ink-muted); margin-bottom: 30px;">
            {{ aboutSection.text }}
          </p>
          <a [routerLink]="aboutSection.buttonLink" class="btn primary lg">{{ aboutSection.buttonText }}</a>
        </div>
        <div style="position: relative;">
          <img [src]="aboutSection.image || fallbackAboutImage" class="impeccable-card" style="width: 100%; border: none;" alt="Ambiente">
          <div class="accent-blob"></div>
        </div>
      </div>
    </section>

    <section class="stats-section py-20" style="background: var(--brand); color: white;">
      <div class="container grid-4 text-center anim-up">
        <a routerLink="/biodiversity" class="stat-item cursor-pointer hover-lift">
          <span class="stat-number">{{ stats.fauna || 1250 }}</span>
          <p class="stat-desc">Espécies de Fauna</p>
        </a>
        <a routerLink="/biodiversity" class="stat-item cursor-pointer hover-lift">
          <span class="stat-number">{{ stats.flora || 840 }}</span>
          <p class="stat-desc">Espécies de Flora</p>
        </a>
        <a routerLink="/areas" class="stat-item cursor-pointer hover-lift">
          <span class="stat-number">{{ stats.areas || 15 }}</span>
          <p class="stat-desc">Áreas Protegidas</p>
        </a>
        <a routerLink="/solutions" class="stat-item cursor-pointer hover-lift">
          <span class="stat-number">{{ stats.projects || 42 }}</span>
          <p class="stat-desc">Projectos Ativos</p>
        </a>
      </div>
    </section>

    <section class="platform-section section-spacing">
      <div class="container platform-grid">
        <div class="platform-copy anim-up">
          <span class="section-kicker">Plataforma Digital</span>
          <h2 class="section-title">{{ platformProfile.tagline }}</h2>
          <p class="platform-summary">{{ platformProfile.summary }}</p>
          <div class="audience-pills" *ngIf="platformAudiences.length">
            <span class="pill" *ngFor="let audience of platformAudiences">{{ audience }}</span>
          </div>
          <a [routerLink]="platformProfile.ctaLink" class="btn primary lg">{{ platformProfile.ctaText }}</a>
        </div>

        <div class="platform-panel glass-card anim-up" style="animation-delay: 0.15s">
          <h3 class="font-serif mb-6">Capacidades Operacionais</h3>
          <div class="module-stack">
            <article class="module-row cursor-pointer hover-lift" 
                     *ngFor="let module of solutionModules.slice(0, 4)"
                     [routerLink]="getSolutionModuleLink(module)">
              <div>
                <strong class="text-brand">{{ getIconForModule(module.name) }} {{ module.name }}</strong>
                <p class="text-sm mt-1 mb-0">{{ module.summary }}</p>
              </div>
              <span class="status-pill" [class.pilot]="module.status === 'pilot'" [class.planned]="module.status === 'planned'">
                {{ getModuleStatusLabel(module.status) }}
              </span>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="solutions-section container">
      <div class="section-headline anim-up">
        <div>
          <span class="section-kicker">Hub Ministerial</span>
          <h2 class="section-title">Governação Interdepartamental</h2>
        </div>
        <a [routerLink]="platformProfile.ctaLink" class="btn outline lg">Explorar Rede</a>
      </div>

      <div class="grid-2 solutions-grid mt-10">
        <article class="solution-card impeccable-card anim-up cursor-pointer hover-lift" 
                 *ngFor="let module of solutionModules; let j = index" 
                 [style.animation-delay]="(j * 0.1) + 's'"
                 [routerLink]="getSolutionModuleLink(module)">
          <div class="solution-meta">
            <span class="status-pill" [class.pilot]="module.status === 'pilot'" [class.planned]="module.status === 'planned'">{{ getModuleStatusLabel(module.status) }}</span>
            <span class="muted text-xs font-bold uppercase tracking-widest">{{ module.audience }}</span>
          </div>
          <h3 class="text-2xl">{{ getIconForModule(module.name) }} {{ module.name }}</h3>
          <p class="muted mt-4">{{ module.summary }}</p>
          <div class="mt-auto pt-6">
             <button class="btn primary sm w-full">Abrir Portal Técnico</button>
          </div>
        </article>
      </div>
    </section>

    <section class="highlights-section" style="background: #F1F4F2; padding: 120px 0;">
      <div class="container">
        <div class="anim-up flex-between mb-12">
          <div>
            <span class="section-kicker">Ecos do Ministério</span>
            <h2 class="section-title">Últimas do Ambiente</h2>
          </div>
          <a routerLink="/posts" class="btn-link font-bold text-brand">Ver arquivo histórico -></a>
        </div>

        <div *ngIf="loadingPosts" class="center-box">
          <div class="spinner"></div>
        </div>

        <div class="marquee-wrapper mt-10" *ngIf="!loadingPosts">
          <div class="marquee-content">
            <div class="impeccable-card fixed-width cursor-pointer hover-lift" 
                 *ngFor="let post of marqueePosts"
                 [routerLink]="['/posts', post.slug]">
              <div class="card-img-box">
                 <img [src]="post.featured_image || fallbackPostImage" class="card-img" alt="Post">
              </div>
              <div class="card-content p-8">
                <span class="badge sm mb-4">{{ post.category_name || 'Notícias' }}</span>
                <h4 class="text-xl mb-3">{{ post.title }}</h4>
                <p class="muted text-sm line-clamp-2">{{ post.excerpt }}</p>
                <div class="btn-link text-brand font-bold mt-4 inline-block">Ler Relatório -></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="gallery-section container section-spacing" *ngIf="homeGallery.length">
      <div class="section-headline anim-up">
        <div class="center-text w-full">
          <span class="section-kicker">Galeria Institucional</span>
          <h2 class="section-title">Património Natural em Foco</h2>
        </div>
      </div>

      <div class="gallery-grid mt-12 px-4">
        <div *ngFor="let photo of homeGallery; let idx = index" 
             class="gallery-item impeccable-card anim-up" 
             [style.animation-delay]="(idx * 0.1) + 's'"
             (click)="openGalleryModal(photo)">
          <img [src]="photo.url" [alt]="photo.caption || 'Imagem da Galeria'">
          <div class="gallery-overlay">
            <span class="btn glass sm">🔍 Ampliar Vista</span>
          </div>
        </div>
      </div>
    </section>

    <!-- MODAL LIGHTBOX -->
    <div class="gallery-modal" *ngIf="selectedGalleryImage" (click)="closeGalleryModal()">
      <div class="modal-content glass-card p-6" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="closeGalleryModal()">&times;</button>
        <div class="modal-img-box">
           <img [src]="selectedGalleryImage.url" [alt]="selectedGalleryImage.caption" class="impeccable-card">
        </div>
        <div class="modal-footer mt-6">
          <p class="caption font-bold text-brand" *ngIf="selectedGalleryImage.caption">{{ selectedGalleryImage.caption }}</p>
          <button class="btn primary" (click)="downloadImage(selectedGalleryImage.url, 'mab-galeria')">
             📥 Guardar Imagem
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-slider { height: 85vh; min-height: 600px; position: relative; overflow: hidden; background: #000; cursor: default; }
    .slides-container { height: 100%; width: 100%; }
    .slide {
      position: absolute; inset: 0; background-size: cover; background-position: center;
      display: flex; align-items: center; justify-content: center; text-align: center;
      opacity: 0; pointer-events: none; transition: opacity 1s ease-in-out, transform 1s ease-out; transform: scale(1.1);
    }
    .slide.active { opacity: 1; transform: scale(1); z-index: 5; pointer-events: auto; }
    
    .slide::after {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(180deg, rgba(6,38,29,0.4) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.7) 100%);
      z-index: 2;
    }

    .slide-content { 
      max-width: 900px; padding: 40px; color: #fff; position: relative; z-index: 8; 
      border-left: 6px solid #fff; text-align: left; margin-left: 60px;
    }
    .slide-content h1 { 
      font-size: 4.5rem; font-weight: 900; line-height: 1; margin-bottom: 24px; 
      text-shadow: 0 10px 40px rgba(0,0,0,0.6);
      -webkit-text-stroke: 1.5px rgba(255,255,255,0.4);
    }
    .slide-content .subtitle { 
      font-size: 1.5rem; opacity: 1; margin-bottom: 48px; 
      text-shadow: 0 4px 15px rgba(0,0,0,1);
      font-weight: 600;
      letter-spacing: 0.05em;
      max-width: 700px;
    }

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

    .action-card {
      position: relative;
      overflow: hidden;
      min-height: 220px;
      background-size: cover;
      background-position: center;
      color: #fff;
      text-shadow: 0 2px 12px rgba(0,0,0,0.45);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      isolation: isolate;
    }
    .action-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(15, 36, 22, 0.08), rgba(15, 36, 22, 0.88));
      z-index: -1;
    }
    .action-card .icon,
    .action-card h3,
    .action-card p {
      color: #fff;
      position: relative;
    }
    .action-card p {
      opacity: 0.96;
    }
    .stat-number { display: block; font-size: 3.5rem; font-weight: 800; font-family: 'Fraunces', serif; line-height: 1; margin-bottom: 8px; }
    .stat-desc { font-size: 0.95rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.85; }
    .stat-item { padding: 40px 20px; transition: var(--transition); border-radius: 24px; text-decoration: none !important; color: inherit; }
    .stat-item:hover { background: rgba(255,255,255,0.08); }

    .platform-section { padding: 30px 0 80px; background: linear-gradient(180deg, rgba(247, 244, 236, 0.6), rgba(238, 245, 239, 0.95)); }
    .platform-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 28px; align-items: stretch; }
    .platform-summary { font-size: 1.05rem; line-height: 1.85; color: var(--ink-muted); max-width: 760px; }
    .platform-panel { padding: 28px; border-radius: 28px; }
    .module-stack { display: grid; gap: 16px; margin-top: 20px; }
    .module-row { display: flex; justify-content: space-between; gap: 16px; padding: 16px 0; border-top: 1px solid rgba(10, 60, 46, 0.12); }
    .module-row:first-child { border-top: 0; padding-top: 0; }
    .module-row p, .solution-card p, .department-card p { margin: 8px 0 0; color: var(--ink-muted); line-height: 1.7; }
    .audience-pills { display: flex; gap: 10px; flex-wrap: wrap; margin: 24px 0 28px; }
    .section-headline { display: flex; justify-content: space-between; gap: 18px; align-items: flex-end; margin-bottom: 28px; }
    .solutions-section, .departments-section { margin: 100px auto; }
    .solutions-grid, .departments-grid { align-items: stretch; }
    .solution-card, .department-card { height: 100%; border-radius: 24px; }
    .solution-meta { display: flex; justify-content: space-between; gap: 12px; align-items: center; margin-bottom: 16px; }
    .status-pill {
      display: inline-flex;
      align-items: center;
      border-radius: 999px;
      padding: 6px 10px;
      background: rgba(22, 96, 72, 0.12);
      color: var(--brand);
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .status-pill.pilot { background: rgba(212, 175, 55, 0.18); color: #8c6a08; }
    .status-pill.planned { background: rgba(100, 116, 139, 0.14); color: #526175; }
    .department-focus {
      display: inline-block;
      margin-bottom: 12px;
      color: var(--primary);
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .anim-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(20px); }
    @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }

    .hover-lift { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease; }
    .hover-lift:hover { transform: translateY(-8px) scale(1.01); box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important; }
    .cursor-pointer { cursor: pointer; }

    /* Infinite Marquee Styles */
    .marquee-wrapper {
      width: 100vw;
      margin-left: calc(-50vw + 50%); /* bleed out of container to screen edges */
      overflow: hidden;
      position: relative;
      padding: 20px 0;
    }
    /* Fade edges for smooth entry/exit */
    .marquee-wrapper::before, .marquee-wrapper::after {
      content: '';
      position: absolute;
      top: 0; bottom: 0;
      width: 15vw;
      z-index: 5;
      pointer-events: none;
    }
    .marquee-wrapper::before { left: 0; background: linear-gradient(to right, var(--bg-alt) 0%, transparent 100%); }
    .marquee-wrapper::after { right: 0; background: linear-gradient(to left, var(--bg-alt) 0%, transparent 100%); }
    
    .marquee-content {
      display: flex;
      gap: 30px;
      width: max-content;
      animation: scrollMarquee 40s linear infinite;
      padding: 0 15px;
    }
    .marquee-wrapper:hover .marquee-content {
      animation-play-state: paused;
    }
    .impeccable-card.fixed-width {
      width: 360px;
      flex-shrink: 0;
      border-radius: 20px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      transition: transform 0.3s;
    }
    .impeccable-card.fixed-width:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 30px rgba(0,0,0,0.12);
    }
    
    @keyframes scrollMarquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(calc(-50% - 15px)); }
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
      margin-top: 40px;
    }
    .gallery-item {
      position: relative;
      height: 240px;
      border-radius: 16px;
      overflow: hidden;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
      transition: transform 0.3s;
    }
    .gallery-item:hover { transform: translateY(-5px); }
    .gallery-item img { width: 100%; height: 100%; object-fit: cover; }
    .gallery-overlay {
      position: absolute; inset: 0;
      background: rgba(47, 107, 69, 0.6);
      display: flex; align-items: center; justify-content: center;
      opacity: 0; transition: opacity 0.3s;
    }
    .gallery-item:hover .gallery-overlay { opacity: 1; }
    .zoom-icon { color: #fff; font-weight: 700; font-size: 0.9rem; }

    .gallery-modal {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.9);
      z-index: 9999;
      display: flex; align-items: center; justify-content: center;
      padding: 40px;
      backdrop-filter: blur(8px);
      animation: fadeInModal 0.3s ease-out;
    }
    .modal-content {
      max-width: 90vw; max-height: 85vh;
      position: relative;
      background: #fff;
      padding: 10px;
      border-radius: 12px;
      display: flex; flex-direction: column;
    }
    .modal-content img { max-width: 100%; max-height: 70vh; object-fit: contain; border-radius: 8px; }
    .modal-footer { display: flex; justify-content: space-between; align-items: center; padding: 15px 10px; }
    .close-btn {
      position: absolute; top: -50px; right: 0;
      background: none; border: none; color: #fff; font-size: 3rem; cursor: pointer;
    }
    @keyframes fadeInModal { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    
    @media (max-width: 1024px) {
      .platform-grid { grid-template-columns: 1fr; }
      .home-slider { height: 60vh; min-height: 400px; }
      .slide-content { margin-left: 20px; border-left-width: 4px; padding: 20px; max-width: 100%; }
      .slide-content h1 { font-size: 2.2rem; }
      .slide-content .subtitle { font-size: 1.1rem; margin-bottom: 24px; }
      .slider-actions { flex-direction: column; gap: 12px; }
      .slider-nav { width: 50px; height: 50px; font-size: 1.2rem; }
      .grid-4.mt-neg { margin-top: 0; padding-top: 40px; }
    }

    @media (max-width: 768px) {
      .impeccable-card.fixed-width { width: 280px; }
      .marquee-wrapper::before, .marquee-wrapper::after { width: 10vw; }
      .gallery-grid { grid-template-columns: 1fr; }
      .about-section { margin: 40px auto !important; }
      .section-title { font-size: 2rem; }
      .platform-section { padding: 40px 0; }
      .stats-section { padding: 60px 0 !important; }
      .section-spacing { margin-top: 60px !important; margin-bottom: 60px !important; padding-top: 60px !important; padding-bottom: 60px !important; }
      .gap-20 { gap: 30px !important; }
    }
    
    .section-spacing { margin-top: 120px; margin-bottom: 120px; padding-top: 0; padding-bottom: 0; }
    .py-20 { padding-top: 100px; padding-bottom: 100px; }
    .gap-20 { gap: 80px; }
  `]
})
export class PublicHomeComponent implements OnInit, OnDestroy {
  fallbackAboutImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 900 600'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='%232f6b45'/><stop offset='1' stop-color='%23d8e7c8'/></linearGradient></defs><rect width='900' height='600' fill='url(%23g)'/><path d='M0 430 C140 360 240 510 360 440 S610 340 900 460 V600 H0 Z' fill='%23ffffff33'/><text x='70' y='110' font-size='42' font-family='Arial' fill='white'>MINISTERIO</text><text x='70' y='165' font-size='26' font-family='Arial' fill='white'>Ambiente e Biodiversidade</text></svg>";
  fallbackPostImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 700'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='%2327442f'/><stop offset='1' stop-color='%2394b77a'/></linearGradient></defs><rect width='1200' height='700' fill='url(%23g)'/><rect x='90' y='90' width='420' height='34' rx='6' fill='%23ffffff66'/><rect x='90' y='150' width='620' height='18' rx='6' fill='%23ffffff55'/><rect x='90' y='186' width='520' height='18' rx='6' fill='%23ffffff44'/></svg>";

  stats: any = { fauna: 0, flora: 0, areas: 0, projects: 0 };
  posts: any[] = [];
  slider: any[] = [];
  actionCards: HomeActionCard[] = [
    { icon: '🛡️', title: 'Inspeção e Controlo', subtitle: 'Ministério do Ambiente', link: '/ocorrencias', image: '/assets/bg-1.jpg' },
    { icon: '📢', title: 'Cidadania Ativa', subtitle: 'Denúncias e Sugestões', link: '/denunciar', image: '/assets/bg-2.jpg' },
    { icon: '🌳', title: 'Biodiversidade', subtitle: 'Áreas de preservação', link: '/biodiversidade', image: '/assets/bg-3.jpg' },
    { icon: '📜', title: 'Legislação', subtitle: 'Base legal do país', link: '/biblioteca-legal', image: '/assets/bg-4.jpg' }
  ];
  homeGallery: GalleryItem[] = [];
  selectedGalleryImage: GalleryItem | null = null;
  aboutSection = {
    title: 'Sobre o MINISTERIO',
    text: 'MINISTERIO do Ambiente e Biodiversidade tem como missao a promocao do desenvolvimento sustentavel atraves da preservacao, protecao e conservacao do ambiente e da biodiversidade na Guine-Bissau.',
    buttonText: 'Ver Missao e Visao',
    buttonLink: '/pages/sobre-nos',
    image: ''
  };
  platformProfile = {
    tagline: 'Plataforma digital de gestao ambiental e agricola',
    summary: 'Um ecossistema estatal para publicacao, operacao tecnica, fiscalizacao, extensao agricola e articulacao entre departamentos.',
    ctaText: 'Explorar a plataforma',
    ctaLink: '/solutions'
  };
  platformAudiences: string[] = ['Tecnicos ambientais', 'Extensionistas agricolas', 'Gestores publicos'];
  solutionModules: PlatformModuleItem[] = [];
  stateDepartments: DepartmentItem[] = [];
  currentSlide = 0;
  slideInterval: any;
  loadingPosts = true;
  isPaused = false;

  get marqueePosts(): any[] {
    if (!this.posts.length) return [];
    // Duplicate once so the CSS animation can loop seamlessly using translateX(-50%)
    return [...this.posts, ...this.posts];
  }

  constructor(
    private http: HttpClient,
    private settingsService: SettingsService,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.settingsService.getSettings().subscribe({
      next: (settings) => {
        if (settings.home_action_cards?.length) {
          this.actionCards = settings.home_action_cards.filter((card) => !!card?.title && !!card?.link);
        }

        this.aboutSection = {
          title: settings.about_section_title || this.aboutSection.title,
          text: settings.about_section_text || this.aboutSection.text,
          buttonText: settings.about_section_button_text || this.aboutSection.buttonText,
          buttonLink: settings.about_section_button_link || this.aboutSection.buttonLink,
          image: settings.about_section_image || this.fallbackAboutImage
        };
        this.platformProfile = {
          tagline: settings.platform_tagline || this.platformProfile.tagline,
          summary: settings.platform_summary || this.platformProfile.summary,
          ctaText: settings.platform_cta_text || this.platformProfile.ctaText,
          ctaLink: settings.platform_cta_link || this.platformProfile.ctaLink
        };
        this.platformAudiences = settings.target_audiences?.length ? settings.target_audiences : this.platformAudiences;
        this.solutionModules = settings.solution_modules?.length ? settings.solution_modules : this.createDefaultModules();
        this.stateDepartments = settings.state_departments?.length ? settings.state_departments : this.createDefaultDepartments();
        this.homeGallery = settings.home_gallery || [];
      }
    });

    this.http.get<any>(API_BASE + '/home').subscribe({
      next: (res) => {
        if (res.slider) this.slider = res.slider;
        if (res.stats) this.stats = res.stats;

        if (res.posts) {
          this.posts = res.posts.map((p: any) => ({
            ...p,
            excerpt: this.summarizeText(p.excerpt || p.body, 140)
          })).slice(0, 8); // At least 5-8 posts for strong marquee effect
        }
        this.loadingPosts = false;
      },
      error: () => {
        this.loadingPosts = false;
        this.slider = [  ];
      }
    });

    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    if (this.slideInterval) clearInterval(this.slideInterval);
  }

  startAutoPlay(): void {
    if (this.slideInterval) clearInterval(this.slideInterval);
    if (!this.isPaused && this.slider && this.slider.length > 1) {
      this.slideInterval = setInterval(() => {
        this.nextSlide();
      }, 5000);
    }
  }

  pauseAutoPlay(): void {
    this.isPaused = true;
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = null;
    }
  }

  resumeAutoPlay(): void {
    this.isPaused = false;
    this.startAutoPlay();
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slider.length;
    this.startAutoPlay();
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slider.length) % this.slider.length;
    this.startAutoPlay();
  }

  goToSlide(i: number): void {
    this.currentSlide = i;
    this.startAutoPlay();
  }

  openGalleryModal(image: GalleryItem): void {
    this.selectedGalleryImage = image;
    document.body.style.overflow = 'hidden'; // block scroll
  }

  closeGalleryModal(): void {
    this.selectedGalleryImage = null;
    document.body.style.overflow = 'auto'; // restore scroll
  }

  downloadImage(url: string, filename: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'download';
    // Se for URL externa, pode precisar de target blank ou blob
    if (!url.startsWith('data:') && !url.startsWith(window.location.origin)) {
      link.target = '_blank';
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  getModuleStatusLabel(status?: string): string {
    if (status === 'pilot') return 'Piloto';
    if (status === 'planned') return 'Planeado';
    return 'Ativo';
  }

  getSolutionModuleLink(module: PlatformModuleItem): string | any[] {
    if (module.link) return module.link;
    return ['/solutions', 'module', this.slugify(module.name)];
  }

  getDepartmentLink(department: DepartmentItem): string | any[] {
    if (department.link) return department.link;
    return ['/solutions', 'department', this.slugify(department.name)];
  }

  getIconForModule(name: string): string {
    const n = (name || '').toLowerCase();
    if (n.includes('agrícola') || n.includes('rural') || n.includes('produção')) return '🚜';
    if (n.includes('hídricos') || n.includes('água') || n.includes('solo') || n.includes('bacia')) return '💧';
    if (n.includes('legal') || n.includes('biblio') || n.includes('jurídica')) return '⚖️';
    if (n.includes('interdepartamental') || n.includes('gestão') || n.includes('admin')) return '📊';
    if (n.includes('inspeção') || n.includes('mab') || n.includes('controlo')) return '🛡️';
    return '⚙️';
  }

  getIconForDepartment(name: string): string {
    const n = (name || '').toLowerCase();
    if (n.includes('ambiente') || n.includes('bio') || n.includes('naturas')) return '🏞️';
    if (n.includes('agricultura') || n.includes('agrícola')) return '🌾';
    if (n.includes('hídricos') || n.includes('solo') || n.includes('recursos')) return '⛰️';
    return '🏛️';
  }

  private summarizeText(value: string, limit: number): string {
    if (!value) return '';

    const withoutTags = value.replace(/<[^>]+>/g, ' ');
    const textarea = document.createElement('textarea');
    textarea.innerHTML = withoutTags;

    const plain = textarea.value
      .replace(/\u00a0/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return plain.length > limit ? `${plain.slice(0, limit).trim()}...` : plain;
  }

  private createDefaultModules(): PlatformModuleItem[] {
    return [
      { name: 'Inspeção e Controlo MAB', summary: 'Monitorização em tempo real, gestão de missões de campo e proteção ativa do património natural.', link: '/ocorrencias', audience: 'Inspecao e controlo', status: 'active' },
      { name: 'Extensão Agrícola', summary: 'Campanhas, orientações técnicas e disseminação de boas práticas para produtores.', link: '/extensao-agricola', audience: 'Agricultura e desenvolvimento rural', status: 'pilot' },
      { name: 'Biblioteca Técnico-Legal', summary: 'Centralize legislação, relatórios, manuais e anexos PDF num ambiente único.', link: '/biblioteca-legal', audience: 'Técnicos e juristas', status: 'active' },
      { name: 'Coordenação Interdepartamental', summary: 'Estrutura o portal para novos departamentos e linhas programáticas do Estado.', link: '/solutions', audience: 'Gestão institucional', status: 'planned' }
    ];
  }

  private createDefaultDepartments(): DepartmentItem[] {
    return [
      { name: 'Ambiente e Biodiversidade', summary: 'Conservacao, monitorizacao e controlo ambiental.', focus: 'Conservacao e clima', link: '/biodiversity' },
      { name: 'Agricultura Sustentável', summary: 'Apoio tecnico, conhecimento agricola e resiliencia produtiva.', focus: 'Extensao e producao', link: '/extensao-agricola' },
      { name: 'Recursos Hídricos e Solo', summary: 'Gestao de areas, uso do solo e informacao territorial.', focus: 'Territorio e recursos', link: '/recursos-hidricos' }
    ];
  }

  private slugify(value: string): string {
    return (value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
