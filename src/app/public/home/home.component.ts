import { Component, OnDestroy, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { API_BASE } from '../../api-config';
import { DepartmentItem, HomeActionCard, PlatformModuleItem, SettingsService } from '../../services/settings.service';

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
              <a routerLink="/denuncias" class="btn primary lg">Denunciar Irregularidade</a>
              <a routerLink="/pages/sobre-nos" class="btn outline lg white">Conheca o MINISTERIO</a>
            </div>
          </div>
        </div>
      </div>

      <button *ngIf="slider.length > 1" (click)="prevSlide()" class="slider-nav prev" aria-label="Slide anterior">&#10094;</button>
      <button *ngIf="slider.length > 1" (click)="nextSlide()" class="slider-nav next" aria-label="Proximo slide">&#10095;</button>

      <div class="slider-dots" *ngIf="slider.length > 1">
        <span *ngFor="let slide of slider; let i = index"
              [class.active]="i === currentSlide"
              (click)="goToSlide(i)"></span>
      </div>

    </div>

    <section class="action-blocks container">
      <div class="grid-4">
        <div
          *ngFor="let card of actionCards; let i = index"
          class="action-card anim-up"
          [style.animation-delay]="((i + 1) * 0.1) + 's'"
          [style.background-image]="card.image ? 'linear-gradient(180deg, rgba(8,18,13,0.35), rgba(8,18,13,0.82)), url(' + card.image + ')' : ''"
          [routerLink]="card.link">
          <span class="icon">{{ card.icon }}</span>
          <h3>{{ card.title }}</h3>
          <p class="muted sm">{{ card.subtitle }}</p>
        </div>
      </div>
    </section>

    <section class="about-section container" style="margin: 100px auto;">
      <div class="grid-2" style="align-items: center; gap: 60px;">
        <div class="anim-up">
          <h2 class="section-title">{{ aboutSection.title }}</h2>
          <p style="font-size: 1.1rem; line-height: 1.8; color: var(--ink-muted); margin-bottom: 25px;">
            {{ aboutSection.text }}
          </p>
          <a [routerLink]="aboutSection.buttonLink" class="btn primary lg">{{ aboutSection.buttonText }}</a>
        </div>
        <div class="anim-up" style="animation-delay: 0.2s">
          <img [src]="aboutSection.image || fallbackAboutImage" style="width: 100%; border-radius: var(--radius-md); box-shadow: var(--shadow-lg);" alt="Ambiente">
        </div>
      </div>
    </section>

    <section class="platform-section">
      <div class="container platform-grid">
        <div class="platform-copy anim-up">
          <span class="section-kicker">Plataforma MAB Publica</span>
          <h2 class="section-title">{{ platformProfile.tagline }}</h2>
          <p class="platform-summary">{{ platformProfile.summary }}</p>
          <div class="audience-pills" *ngIf="platformAudiences.length">
            <span class="pill" *ngFor="let audience of platformAudiences">{{ audience }}</span>
          </div>
          <a [routerLink]="platformProfile.ctaLink" class="btn primary lg">{{ platformProfile.ctaText }}</a>
        </div>

        <div class="platform-panel glass-card anim-up" style="animation-delay: 0.15s">
          <h3>Capacidades ativas</h3>
          <div class="module-stack">
            <article class="module-row" *ngFor="let module of solutionModules.slice(0, 4)">
              <div>
                <strong>{{ getIconForModule(module.name) }} {{ module.name }}</strong>
                <p>{{ module.summary }}</p>
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
          <span class="section-kicker">Solucoes Integradas</span>
          <h2 class="section-title">Ferramentas para ambiente, agricultura e gestao publica</h2>
        </div>
        <a [routerLink]="platformProfile.ctaLink" class="btn outline">Ver plataforma completa</a>
      </div>

      <div class="grid-2 solutions-grid">
        <article class="solution-card card anim-up" *ngFor="let module of solutionModules; let j = index" [style.animation-delay]="(j * 0.1) + 's'">
          <div class="solution-meta">
            <span class="status-pill" [class.pilot]="module.status === 'pilot'" [class.planned]="module.status === 'planned'">{{ getModuleStatusLabel(module.status) }}</span>
            <span class="muted">{{ module.audience }}</span>
          </div>
          <h3>{{ getIconForModule(module.name) }} {{ module.name }}</h3>
          <p>{{ module.summary }}</p>
          <a [routerLink]="getSolutionModuleLink(module)" class="btn ghost">Abrir modulo</a>
        </article>
      </div>
    </section>

    <section class="departments-section container" *ngIf="stateDepartments.length">
      <div class="section-headline anim-up">
        <div>
          <span class="section-kicker">Arquitetura Institucional</span>
          <h2 class="section-title">Preparado para incorporar novos departamentos do Estado</h2>
        </div>
      </div>

      <div class="grid-3 departments-grid">
        <article class="department-card card anim-up" *ngFor="let department of stateDepartments; let k = index" [style.animation-delay]="(k * 0.1) + 's'">
          <span class="department-focus">{{ department.focus }}</span>
          <h3>{{ getIconForDepartment(department.name) }} {{ department.name }}</h3>
          <p>{{ department.summary }}</p>
          <a [routerLink]="getDepartmentLink(department)" class="btn outline sm">Entrar no departamento</a>
        </article>
      </div>
    </section>

    <section class="highlights-section py-5" style="background: var(--bg-alt); padding: 100px 0;">
      <div class="container">
        <div class="anim-up" style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 50px;">
          <div>
            <h2 class="section-title" style="margin-bottom: 10px;">Destaques Recentes</h2>
            <p class="muted">As ultimas noticias e eventos sobre o ambiente.</p>
          </div>
          <a routerLink="/posts" class="btn-link" style="color: var(--brand); font-weight: 700;">Ver Todos os Posts -></a>
        </div>

        <div *ngIf="loadingPosts" class="center-box">
          <div class="spinner"></div>
        </div>

        <div class="marquee-wrapper" *ngIf="!loadingPosts">
          <div class="marquee-content">
            <div class="impeccable-card fixed-width" *ngFor="let post of marqueePosts">
              <img [src]="post.featured_image || fallbackPostImage" class="card-img" alt="Post">
              <div class="card-content">
                <span class="tag">{{ post.category_name || 'Noticias' }}</span>
                <h4>{{ post.title }}</h4>
                <p>{{ post.excerpt }}</p>
                <a [routerLink]="['/posts', post.slug]" class="btn-link">Ler Mais -></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .home-slider { height: 85vh; min-height: 600px; position: relative; overflow: hidden; background: #000; cursor: default; }
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
    
    @media (max-width: 768px) {
      .impeccable-card.fixed-width { width: 300px; }
      .marquee-wrapper::before, .marquee-wrapper::after { width: 5vw; }
    }
  `]
})
export class PublicHomeComponent implements OnInit, OnDestroy {
  fallbackAboutImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 900 600'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='%232f6b45'/><stop offset='1' stop-color='%23d8e7c8'/></linearGradient></defs><rect width='900' height='600' fill='url(%23g)'/><path d='M0 430 C140 360 240 510 360 440 S610 340 900 460 V600 H0 Z' fill='%23ffffff33'/><text x='70' y='110' font-size='42' font-family='Arial' fill='white'>MINISTERIO</text><text x='70' y='165' font-size='26' font-family='Arial' fill='white'>Ambiente e Biodiversidade</text></svg>";
  fallbackPostImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 700'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='%2327442f'/><stop offset='1' stop-color='%2394b77a'/></linearGradient></defs><rect width='1200' height='700' fill='url(%23g)'/><rect x='90' y='90' width='420' height='34' rx='6' fill='%23ffffff66'/><rect x='90' y='150' width='620' height='18' rx='6' fill='%23ffffff55'/><rect x='90' y='186' width='520' height='18' rx='6' fill='%23ffffff44'/></svg>";

  stats: any = { fauna: 0, flora: 0, areas: 0, projects: 0 };
  posts: any[] = [];
  slider: any[] = [];
  actionCards: HomeActionCard[] = [
    { icon: 'Ins', title: 'Inspeção e Controlo', subtitle: 'Gestão de ocorrências e missões', link: '/ocorrencias', image: '' },
    { icon: 'Den', title: 'Queres Denunciar?', subtitle: 'Reporte irregularidades agora', link: '/denuncias', image: '' },
    { icon: 'Bio', title: 'Áreas Protegidas', subtitle: 'Explore a biodiversidade', link: '/biodiversity', image: '' },
    { icon: 'Lei', title: 'Legislação', subtitle: 'Conheça as leis ambientais', link: '/posts', image: '' }
  ];
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
