import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DepartmentItem, PlatformModuleItem, SettingsService } from '../../services/settings.service';
import { SeoService } from '../../services/seo.service';

@Component({
  standalone: true,
  selector: 'app-solution-detail',
  imports: [CommonModule, RouterLink],
  template: `
    <section class="detail-hero" *ngIf="item">
      <div class="container">
        <span class="section-kicker">{{ kind === 'module' ? 'Modulo MAB' : 'Departamento' }}</span>
        <h1>{{ item.name }}</h1>
        <p>{{ item.summary }}</p>
      </div>
    </section>

    <section class="container detail-layout" *ngIf="item; else notFound">
      <article class="card detail-card">
        <div class="meta-row" *ngIf="kind === 'module'">
          <span class="status-pill" [class.pilot]="moduleItem?.status === 'pilot'" [class.planned]="moduleItem?.status === 'planned'">
            {{ getModuleStatusLabel(moduleItem?.status) }}
          </span>
          <span class="muted">{{ moduleItem?.audience || 'Operacao tecnica' }}</span>
        </div>

        <div class="meta-row" *ngIf="kind === 'department'">
          <span class="status-pill">{{ departmentItem?.focus || 'Estrutura institucional' }}</span>
        </div>

        <h2 class="section-title">Visao Operacional</h2>
        <p class="lead">{{ item.summary }}</p>

        <div class="info-grid">
          <div class="info-box">
            <h3>O que esta pronto</h3>
            <p>{{ kind === 'module'
              ? 'Este modulo ja pode ser apresentado, configurado e expandido dentro da plataforma, servindo como ponto de entrada para fluxos tecnicos e operacionais.'
              : 'Este departamento ja pode ser incorporado ao ecossistema da plataforma com paginas, menus, conteudos, ficheiros e modulos especificos.' }}</p>
          </div>
          <div class="info-box">
            <h3>Proximo passo</h3>
            <p>{{ kind === 'module'
              ? 'Ligar este modulo a processos reais, formulários, dashboards, relatórios e permissões por equipa.'
              : 'Criar paginas proprias, fluxos internos, indicadores e equipas responsaveis por esta area institucional.' }}</p>
          </div>
        </div>

        <div class="detail-actions">
          <a routerLink="/solutions" class="btn outline">Voltar a plataforma</a>
          <a *ngIf="relatedLink" [routerLink]="relatedLink" class="btn primary">Abrir recurso relacionado</a>
        </div>
      </article>
    </section>

    <ng-template #notFound>
      <section class="container detail-layout">
        <div class="empty-illustration">
          <h3>Conteudo nao encontrado</h3>
          <p class="muted">Este item ainda nao foi configurado ou foi removido das configuracoes da plataforma.</p>
          <a routerLink="/solutions" class="btn outline">Voltar a plataforma</a>
        </div>
      </section>
    </ng-template>
  `,
  styles: [`
    .detail-hero { padding: 84px 0 72px; background: linear-gradient(135deg, #143326 0%, #1f6147 55%, #dbe7d0 100%); color: #fff; }
    .detail-hero h1 { color: #fff; font-size: clamp(2.3rem, 4vw, 4rem); margin-bottom: 16px; }
    .detail-hero p { max-width: 820px; font-size: 1.05rem; line-height: 1.85; }
    .detail-layout { margin: 60px auto 90px; }
    .detail-card { padding: 34px; border-radius: 28px; }
    .meta-row { display: flex; gap: 12px; align-items: center; margin-bottom: 18px; flex-wrap: wrap; }
    .lead { color: var(--ink-muted); line-height: 1.85; font-size: 1.02rem; margin-bottom: 28px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-top: 24px; }
    .info-box { padding: 22px; border-radius: 22px; background: linear-gradient(180deg, #f7faf6, #eef4ee); border: 1px solid var(--border); }
    .info-box p { color: var(--ink-muted); line-height: 1.75; }
    .detail-actions { display: flex; gap: 14px; flex-wrap: wrap; margin-top: 32px; }
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
    .container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }
    @media (max-width: 900px) {
      .info-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class SolutionDetailComponent implements OnInit {
  kind: 'module' | 'department' = 'module';
  item: (PlatformModuleItem & { name: string }) | (DepartmentItem & { name: string }) | null = null;
  moduleItem: PlatformModuleItem | null = null;
  departmentItem: DepartmentItem | null = null;
  relatedLink = '';

  constructor(
    private route: ActivatedRoute,
    private settingsService: SettingsService,
    private seo: SeoService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const kind = params['kind'] === 'department' ? 'department' : 'module';
      const slug = params['slug'] || '';
      this.kind = kind;

      this.settingsService.getSettings().subscribe((settings) => {
        if (kind === 'module') {
          const modules = settings.solution_modules?.length ? settings.solution_modules : this.getDefaultModules();
          this.moduleItem = modules.find((item) => this.slugify(item.name) === slug) || null;
          this.departmentItem = null;
          this.item = this.moduleItem;
          this.relatedLink = this.getRelatedLink(this.moduleItem?.link);
        } else {
          const departments = settings.state_departments?.length ? settings.state_departments : this.getDefaultDepartments();
          this.departmentItem = departments.find((item) => this.slugify(item.name) === slug) || null;
          this.moduleItem = null;
          this.item = this.departmentItem;
          this.relatedLink = this.getRelatedLink(this.departmentItem?.link);
        }

        this.seo.updatePage({
          title: this.item?.name || 'Detalhe da plataforma',
          description: this.item?.summary || 'Conheca este componente da plataforma digital governamental.'
        });
      });
    });
  }

  getModuleStatusLabel(status?: string): string {
    if (status === 'pilot') return 'Piloto';
    if (status === 'planned') return 'Planeado';
    return 'Ativo';
  }

  private slugify(value: string): string {
    return (value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private getRelatedLink(value?: string): string {
    if (!value || value.startsWith('/solutions/')) {
      return '';
    }

    return value;
  }

  private getDefaultModules(): PlatformModuleItem[] {
    return [
      { name: 'Fiscalizacao ambiental', summary: 'Registo de ocorrencias, alertas e acompanhamento de casos em campo.', link: '/denuncias', audience: 'Inspecao e controlo', status: 'active' },
      { name: 'Extensao agricola', summary: 'Campanhas, orientacoes tecnicas e disseminacao de boas praticas para produtores.', link: '/posts', audience: 'Agricultura e desenvolvimento rural', status: 'pilot' },
      { name: 'Biblioteca tecnico-legal', summary: 'Centralize legislacao, relatorios, manuais e anexos PDF num ambiente unico.', link: '/posts', audience: 'Tecnicos e juristas', status: 'active' },
      { name: 'Coordenacao interdepartamental', summary: 'Estrutura o portal para novos departamentos e linhas programaticas do Estado.', link: '/solutions', audience: 'Gestao institucional', status: 'planned' }
    ];
  }

  private getDefaultDepartments(): DepartmentItem[] {
    return [
      { name: 'Ambiente e Biodiversidade', summary: 'Conservacao, monitorizacao e controlo ambiental.', focus: 'Conservacao e clima', link: '/biodiversity' },
      { name: 'Agricultura Sustentavel', summary: 'Apoio tecnico, conhecimento agricola e resiliencia produtiva.', focus: 'Extensao e producao', link: '/posts' },
      { name: 'Territorio e Recursos Naturais', summary: 'Gestao de areas, uso do solo e informacao territorial.', focus: 'Territorio e recursos', link: '/areas' }
    ];
  }
}
