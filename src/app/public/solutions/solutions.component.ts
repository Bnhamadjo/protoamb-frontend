import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DepartmentItem, PlatformModuleItem, SettingsService } from '../../services/settings.service';
import { SeoService } from '../../services/seo.service';

@Component({
  standalone: true,
  selector: 'app-public-solutions',
  imports: [CommonModule, RouterLink],
  template: `
    <section class="solutions-hero pb-0">
      <div class="container hero-grid anim-up">
        <div>
          <span class="section-kicker" style="color: #a7f3d0; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">Governança MAB</span>
          <h1 class="hero-title">{{ tagline }}</h1>
          <p class="hero-subtitle">{{ summary }}</p>
          <div class="pill-row" *ngIf="audiences.length">
            <span class="pill outline-white" *ngFor="let audience of audiences">{{ audience }}</span>
          </div>
        </div>
        <div class="hero-panel premium-glass-card anim-up" style="animation-delay: 0.2s;">
          <div class="panel-icon">🏛️</div>
          <h3>Preparado para crescer</h3>
          <p>Uma mesma base tecnológica integrada para atender ambiente, agricultura, ordenamento, recursos hídricos e proteção do Estado.</p>
          <a routerLink="/admin/settings" class="btn primary lg" style="width: 100%; justify-content: center; margin-top: 10px;">Configurar plataforma</a>
        </div>
      </div>
      
      <!-- Decorative bottom wave -->
      <div class="hero-wave">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path fill="var(--bg-body)" fill-opacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
        </svg>
      </div>
    </section>

    <section class="container section-space">
      <div class="section-headline">
        <div>
          <span class="section-kicker">Modulos</span>
          <h2 class="section-title">Capacidades operacionais da plataforma</h2>
        </div>
      </div>

      <div class="grid-2">
        <article class="card module-card" *ngFor="let module of modules">
          <div class="module-top">
            <span class="status-pill" [class.pilot]="module.status === 'pilot'" [class.planned]="module.status === 'planned'">
              {{ getModuleStatusLabel(module.status) }}
            </span>
            <span class="muted">{{ module.audience }}</span>
          </div>
          <h3>{{ module.name }}</h3>
          <p>{{ module.summary }}</p>
          <a [routerLink]="getModuleLink(module)" class="btn outline sm">Abrir modulo</a>
        </article>
      </div>
    </section>

    <section class="container section-space" *ngIf="departments.length">
      <div class="section-headline">
        <div>
          <span class="section-kicker">Departamentos</span>
          <h2 class="section-title">Estrutura pronta para novas entidades</h2>
        </div>
      </div>

      <div class="grid-3">
        <article class="card department-card" *ngFor="let department of departments">
          <span class="department-focus">{{ department.focus }}</span>
          <h3>{{ department.name }}</h3>
          <p>{{ department.summary }}</p>
          <a [routerLink]="getDepartmentLink(department)" class="btn ghost sm">Ver area</a>
        </article>
      </div>
    </section>
  `,
  styles: [`
    .solutions-hero { 
      position: relative;
      padding: 140px 0 80px 0; 
      background-image: linear-gradient(135deg, rgba(8, 25, 18, 0.9) 0%, rgba(18, 51, 38, 0.75) 50%, rgba(0, 0, 0, 0.85) 100%), url('/ministerio-sede.jpg');
      background-size: cover;
      background-position: center;
      background-attachment: initial; /* Fallback for parallax */
      color: #fff;
      overflow: hidden;
    }
    /* Subtle light ray effect */
    .solutions-hero::before {
      content: '';
      position: absolute;
      top: -50%; left: -50%; right: -50%; bottom: -50%;
      background: radial-gradient(circle at 75% 20%, rgba(255,255,255,0.15) 0%, transparent 40%);
      pointer-events: none;
    }
    .hero-wave {
      position: absolute;
      bottom: -2px; /* Prevent subpixel gaps */
      left: 0;
      width: 100%;
      height: 60px;
      z-index: 5;
    }
    .hero-wave svg { width: 100%; height: 100%; display: block; }

    .hero-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 40px; align-items: center; position: relative; z-index: 10; margin-bottom: 40px; }
    .hero-title { font-size: clamp(2.8rem, 5vw, 4.2rem); color: #fff; margin-bottom: 20px; font-weight: 800; letter-spacing: -1px; text-shadow: 0 4px 20px rgba(0,0,0,0.5); line-height: 1.1; }
    .hero-subtitle { font-size: 1.15rem; line-height: 1.8; max-width: 680px; color: rgba(255,255,255,0.85); text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
    
    .premium-glass-card { 
      padding: 35px; 
      border-radius: 20px; 
      background: rgba(255, 255, 255, 0.08); /* Dark glass */
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.05);
      color: #fff;
      transform: translateY(10px);
    }
    .premium-glass-card .panel-icon {
      font-size: 2.5rem;
      margin-bottom: 15px;
      display: inline-block;
      padding: 12px;
      background: rgba(255,255,255,0.1);
      border-radius: 16px;
      border: 1px solid rgba(255,255,255,0.15);
    }
    .premium-glass-card h3 { color: #fff; font-size: 1.6rem; font-weight: 800; margin-bottom: 12px; }
    .premium-glass-card p { color: rgba(255, 255, 255, 0.75); line-height: 1.6; font-size: 1rem; margin-bottom: 25px; }
    
    .pill.outline-white {
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.3);
      color: #fff;
      backdrop-filter: blur(4px);
    }

    .pill-row { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 30px; }
    .section-space { margin: 100px auto; }
    .section-headline { margin-bottom: 28px; }
    .module-card, .department-card { height: 100%; border-radius: 24px; }
    .module-top { display: flex; justify-content: space-between; gap: 12px; align-items: center; margin-bottom: 16px; }
    .module-card p, .department-card p { color: var(--ink-muted); line-height: 1.75; }
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
    @media (max-width: 900px) {
      .hero-grid { grid-template-columns: 1fr; }
      .solutions-hero { padding: 100px 0 60px 0; }
    }

    .anim-up { animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(20px); }
    @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
  `]
})
export class PublicSolutionsComponent implements OnInit {
  tagline = 'Plataforma digital de gestao ambiental e agricola';
  summary = 'Transforme o portal numa solucao de operacao tecnica, coordenacao interdepartamental e servico publico digital.';
  audiences: string[] = ['Tecnicos ambientais', 'Extensionistas agricolas', 'Gestores publicos'];
  modules: PlatformModuleItem[] = this.getDefaultModules();
  departments: DepartmentItem[] = this.getDefaultDepartments();

  constructor(
    private settingsService: SettingsService,
    private seo: SeoService
  ) {}

  ngOnInit(): void {
    this.seo.updatePage({
      title: 'Plataforma de Solucoes',
      description: 'Conheca a plataforma MAB preparada para ambiente, agricultura e departamentos publicos ligados a gestao territorial.'
    });

    this.settingsService.getSettings().subscribe((settings) => {
      this.tagline = settings.platform_tagline || this.tagline;
      this.summary = settings.platform_summary || this.summary;
      this.audiences = settings.target_audiences?.length ? settings.target_audiences : this.audiences;
      this.modules = settings.solution_modules?.length ? settings.solution_modules : this.modules;
      this.departments = settings.state_departments?.length ? settings.state_departments : this.departments;
    });
  }

  getModuleStatusLabel(status?: string): string {
    if (status === 'pilot') return 'Piloto';
    if (status === 'planned') return 'Planeado';
    return 'Ativo';
  }

  getModuleLink(module: PlatformModuleItem): string | any[] {
    if (module.link) return module.link;
    return ['/solutions', 'module', this.slugify(module.name)];
  }

  getDepartmentLink(department: DepartmentItem): string | any[] {
    if (department.link) return department.link;
    return ['/solutions', 'department', this.slugify(department.name)];
  }

  private slugify(value: string): string {
    return (value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private getDefaultModules(): PlatformModuleItem[] {
    return [
      { name: 'Fiscalizacao ambiental', summary: 'Registo de ocorrencias, alertas e acompanhamento de casos em campo.', link: '/ocorrencias', audience: 'Inspecao e controlo', status: 'active' },
      { name: 'Extensao agricola', summary: 'Campanhas, orientacoes tecnicas e disseminacao de boas praticas para produtores.', link: '/extensao-agricola', audience: 'Agricultura e desenvolvimento rural', status: 'pilot' },
      { name: 'Biblioteca tecnico-legal', summary: 'Centralize legislacao, relatorios, manuais e anexos PDF num ambiente unico.', link: '/biblioteca-legal', audience: 'Tecnicos e juristas', status: 'active' },
      { name: 'Coordenacao interdepartamental', summary: 'Hub de integracao ministerial, partilha de recursos tecnicos e coordenacao de projetos.', link: '/interdepartamental', audience: 'Gestao institucional', status: 'active' }
    ];
  }

  private getDefaultDepartments(): DepartmentItem[] {
    return [
      { name: 'Ambiente e Biodiversidade', summary: 'Conservacao, monitorizacao e controlo ambiental.', focus: 'Conservacao e clima', link: '/biodiversity' },
      { name: 'Agricultura Sustentável', summary: 'Apoio tecnico, conhecimento agricola e resiliencia produtiva.', focus: 'Extensao e producao', link: '/extensao-agricola' },
      { name: 'Recursos Hídricos e Solo', summary: 'Gestao de areas, uso do solo e informacao territorial.', focus: 'Territorio e recursos', link: '/recursos-hidricos' }
    ];
  }
}
