import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { PostService } from '../posts/services/post.service';
import { BiodiversityService } from '../biodiversity/services/biodiversity.service';
import { AreaService } from '../areas/services/area.service';
import { ComplaintService, Complaint } from '../complaints/services/complaint.service';
import { DepartmentItem, PlatformModuleItem, SettingsService, SiteSettings } from '../../services/settings.service';

@Component({
  standalone: true,
  selector: 'admin-dashboard',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <div>
          <span class="section-kicker">Centro de Operacoes</span>
          <h1>Visao geral do portal administrativo</h1>
          <p class="muted">Um panorama rapido para publicar, monitorizar e manter o portal coerente todos os dias.</p>
        </div>
        <div class="header-actions">
          <a routerLink="/admin/posts/new" class="btn primary">Nova publicacao</a>
          <a routerLink="/admin/settings" class="btn outline">Ajustar plataforma</a>
        </div>
      </header>

      <div *ngIf="loading" class="center-box">
        <div class="spinner"></div>
        <p class="muted">Carregando painel...</p>
      </div>

      <div *ngIf="!loading && !hasData" class="card empty-state">
        <h3>Painel sem dados ainda</h3>
        <p class="muted">Assim que houver publicacoes, especies, areas ou denuncias, os indicadores aparecem aqui.</p>
      </div>

      <div class="stats-grid" *ngIf="!loading && hasData">
        <div class="stat-card">
          <div class="icon">Bio</div>
          <div class="info">
            <span class="label">Biodiversidade</span>
            <h2 class="value">{{ bioCount }}</h2>
            <span class="trend success">Especies registadas</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="icon">Areas</div>
          <div class="info">
            <span class="label">Areas Protegidas</span>
            <h2 class="value">{{ areaCount }}</h2>
            <span class="trend">Parques e reservas</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="icon">Den</div>
          <div class="info">
            <span class="label">Denuncias</span>
            <h2 class="value">{{ complaintCount }}</h2>
            <span class="trend danger">{{ pendingComplaints }} pendentes</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="icon">Posts</div>
          <div class="info">
            <span class="label">Publicacoes</span>
            <h2 class="value">{{ postCount }}</h2>
            <span class="trend">Artigos e noticias</span>
          </div>
        </div>
      </div>

      <div class="dashboard-grid" *ngIf="!loading && hasData">
        <div class="card quick-actions">
          <div class="card-header">
            <h3>Acoes rapidas</h3>
          </div>
          <div class="action-grid">
            <a routerLink="/admin/posts/new" class="action-tile">
              <strong>Publicar noticia</strong>
              <span>Criar novo artigo com imagem ou PDF.</span>
            </a>
            <a routerLink="/admin/pages/new" class="action-tile">
              <strong>Nova pagina</strong>
              <span>Adicionar conteudo institucional ou informativo.</span>
            </a>
            <a routerLink="/admin/media" class="action-tile">
              <strong>Biblioteca media</strong>
              <span>Organizar imagens e documentos do portal.</span>
            </a>
            <a routerLink="/admin/complaints" class="action-tile">
              <strong>Rever denuncias</strong>
              <span>Acompanhar casos pendentes e novos registos.</span>
            </a>
          </div>
        </div>

        <div class="card saas-vision">
          <div class="card-header">
            <h3>Visao MAB do Estado</h3>
            <a routerLink="/solutions" class="btn ghost sm">Ver publico</a>
          </div>
          <p class="muted" style="margin-bottom: 18px;">{{ platformSummary }}</p>
          <div class="list-stack" *ngIf="solutionModules.length; else noModules">
            <div class="list-row" *ngFor="let module of solutionModules.slice(0, 4)">
              <div>
                <strong>{{ module.name }}</strong>
                <span class="muted">{{ module.audience || 'Operacao tecnica' }}</span>
              </div>
              <span class="badge">{{ getModuleStatusLabel(module.status) }}</span>
            </div>
          </div>
          <ng-template #noModules>
            <p class="muted">Configure os modulos da plataforma nas configuracoes gerais.</p>
          </ng-template>
        </div>

        <div class="card recent-complaints">
          <div class="card-header">
            <h3>Denuncias recentes</h3>
            <a routerLink="/admin/complaints" class="btn ghost sm">Ver todas</a>
          </div>
          <div class="table-container" *ngIf="recentComplaints.length > 0; else noComplaints">
            <table class="table">
              <thead>
                <tr>
                  <th>Assunto</th>
                  <th>Status</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let complaint of recentComplaints">
                  <td>{{ complaint.subject }}</td>
                  <td>
                    <span class="badge" [class]="complaint.status">{{ complaint.status }}</span>
                  </td>
                  <td>{{ complaint.created_at | date:'dd/MM' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <ng-template #noComplaints>
            <p class="muted">Sem denuncias recentes.</p>
          </ng-template>
        </div>

        <div class="card activity-visual">
          <h3>Saude editorial do portal</h3>
          <div class="simulated-chart">
            <div class="bar" style="height: 80%"><span>Set</span></div>
            <div class="bar" style="height: 65%"><span>Out</span></div>
            <div class="bar" style="height: 90%"><span>Nov</span></div>
            <div class="bar" style="height: 75%"><span>Dez</span></div>
            <div class="bar" style="height: 85%"><span>Jan</span></div>
          </div>
          <p class="muted center">Pulso visual do conteudo e da atividade operacional.</p>
        </div>

        <div class="card recent-posts">
          <div class="card-header">
            <h3>Publicacoes recentes</h3>
            <a routerLink="/admin/posts" class="btn ghost sm">Ver lista</a>
          </div>
          <div class="list-stack" *ngIf="recentPosts.length; else noPosts">
            <div class="list-row" *ngFor="let post of recentPosts">
              <div>
                <strong>{{ post.title }}</strong>
                <span class="muted">{{ post.created_at | date:'dd/MM/yyyy' }}</span>
              </div>
              <span class="badge">{{ post.status || 'published' }}</span>
            </div>
          </div>
          <ng-template #noPosts>
            <p class="muted">Sem publicacoes recentes.</p>
          </ng-template>
        </div>

        <div class="card departments-card">
          <div class="card-header">
            <h3>Departamentos preparados</h3>
            <a routerLink="/admin/settings" class="btn ghost sm">Gerir</a>
          </div>
          <div class="list-stack" *ngIf="stateDepartments.length; else noDepartments">
            <div class="list-row" *ngFor="let department of stateDepartments.slice(0, 5)">
              <div>
                <strong>{{ department.name }}</strong>
                <span class="muted">{{ department.focus }}</span>
              </div>
            </div>
          </div>
          <ng-template #noDepartments>
            <p class="muted">Adicione departamentos e direcoes para crescer alem do portal atual.</p>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { animation: fadeIn 0.5s ease-out; }
    .dashboard-header { margin-bottom: 32px; display: flex; justify-content: space-between; gap: 24px; align-items: flex-end; }
    .header-actions { display: flex; gap: 12px; flex-wrap: wrap; }
    .dashboard-header h1 { font-size: 2rem; margin-bottom: 4px; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 32px; }
    .stat-card {
      background: #fff; padding: 24px; border-radius: var(--radius-md);
      display: flex; align-items: center; gap: 20px; box-shadow: var(--shadow-sm);
      border: 1px solid var(--border); transition: var(--transition);
    }
    .stat-card:hover { transform: translateY(-3px); box-shadow: var(--shadow); }
    .stat-card .icon {
      font-size: 1rem; font-weight: 700; background: var(--bg-app); width: 64px; height: 64px;
      display: flex; align-items: center; justify-content: center; border-radius: 16px;
    }
    .stat-card .info .label { font-size: 0.85rem; color: var(--ink-muted); font-weight: 600; text-transform: uppercase; }
    .stat-card .info h2 { margin: 4px 0; font-size: 1.8rem; line-height: 1; }
    .stat-card .info .trend { font-size: 0.75rem; font-weight: 700; }
    .stat-card .info .trend.success { color: var(--success); }
    .stat-card .info .trend.danger { color: var(--danger); }
    .dashboard-grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: 24px; }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .empty-state { padding: 32px; text-align: center; margin-bottom: 24px; }
    .quick-actions { grid-column: 1 / -1; }
    .action-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .action-tile { display: block; padding: 18px; border-radius: 20px; background: linear-gradient(180deg, #f8faf7, #eef4ee); border: 1px solid var(--border); }
    .action-tile strong { display: block; margin-bottom: 8px; color: var(--brand); }
    .action-tile span { color: var(--ink-muted); line-height: 1.6; }
    .list-stack { display: grid; gap: 12px; }
    .list-row { display: flex; justify-content: space-between; gap: 16px; align-items: center; padding: 14px 0; border-top: 1px solid var(--border); }
    .list-row:first-child { border-top: 0; padding-top: 0; }
    .list-row strong { display: block; margin-bottom: 4px; }
    .simulated-chart { height: 200px; display: flex; align-items: flex-end; justify-content: space-between; gap: 10px; padding: 20px 10px; margin-top: 20px; }
    .simulated-chart .bar { flex: 1; background: var(--brand); border-radius: 4px 4px 0 0; position: relative; transition: height 1s ease-in-out; }
    .simulated-chart .bar span { position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); font-size: 0.7rem; color: var(--ink-muted); }
    @media (max-width: 1100px) {
      .stats-grid, .action-grid, .dashboard-grid { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 800px) {
      .dashboard-header, .stats-grid, .action-grid, .dashboard-grid { grid-template-columns: 1fr; display: grid; }
      .dashboard-header { align-items: start; }
    }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class DashboardComponent implements OnInit {
  bioCount = 0;
  areaCount = 0;
  postCount = 0;
  complaintCount = 0;
  pendingComplaints = 0;
  recentComplaints: Complaint[] = [];
  recentPosts: any[] = [];
  platformSummary = 'Estruture uma unica plataforma para ambiente, agricultura e coordenacao entre departamentos.';
  solutionModules: PlatformModuleItem[] = [];
  stateDepartments: DepartmentItem[] = [];
  loading = true;

  constructor(
    private postService: PostService,
    private bioService: BiodiversityService,
    private areaService: AreaService,
    private complaintService: ComplaintService,
    private settingsService: SettingsService
  ) {}

  get hasData(): boolean {
    return this.bioCount > 0 || this.areaCount > 0 || this.postCount > 0 || this.complaintCount > 0;
  }

  ngOnInit(): void {
    forkJoin({
      posts: this.postService.all().pipe(catchError(() => of([]))),
      bio: this.bioService.all().pipe(catchError(() => of([]))),
      areas: this.areaService.all().pipe(catchError(() => of([]))),
      complaints: this.complaintService.all().pipe(catchError(() => of([]))),
      settings: this.settingsService.getSettings().pipe(catchError(() => of({} as SiteSettings)))
    }).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (res) => {
        this.postCount = Array.isArray(res.posts) ? res.posts.length : 0;
        this.bioCount = Array.isArray(res.bio) ? res.bio.length : 0;
        this.areaCount = Array.isArray(res.areas) ? res.areas.length : 0;
        this.complaintCount = Array.isArray(res.complaints) ? res.complaints.length : 0;
        this.recentPosts = Array.isArray(res.posts) ? res.posts.slice(0, 5) : [];
        this.pendingComplaints = Array.isArray(res.complaints)
          ? res.complaints.filter((complaint: Complaint) => complaint.status === 'pending').length
          : 0;
        this.recentComplaints = Array.isArray(res.complaints) ? res.complaints.slice(0, 5) : [];
        this.platformSummary = res.settings?.platform_summary || this.platformSummary;
        this.solutionModules = Array.isArray(res.settings?.solution_modules) ? res.settings.solution_modules : [];
        this.stateDepartments = Array.isArray(res.settings?.state_departments) ? res.settings.state_departments : [];
      },
      error: () => {
        this.recentComplaints = [];
      }
    });
  }

  getModuleStatusLabel(status?: string): string {
    if (status === 'pilot') return 'Piloto';
    if (status === 'planned') return 'Planeado';
    return 'Ativo';
  }
}
