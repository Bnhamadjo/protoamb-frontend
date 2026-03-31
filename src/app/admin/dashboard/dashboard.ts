import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { PostService } from '../posts/services/post.service';
import { BiodiversityService } from '../biodiversity/services/biodiversity.service';
import { AreaService } from '../areas/services/area.service';
import { ComplaintService, Complaint } from '../complaints/services/complaint.service';
import { DepartmentItem, MapMarker, PlatformModuleItem, SettingsService, SiteSettings } from '../../services/settings.service';
import * as L from 'leaflet';

@Component({
  standalone: true,
  selector: 'admin-dashboard',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-container anim-up">
      <header class="dashboard-header">
        <div class="header-left">
          <span class="section-kicker">Hub de Governação Digital</span>
          <h1 class="section-title">Centro de Comando MAB</h1>
          <p class="subtitle muted">Monitorize em tempo real a atividade do portal, biodiversidade e integridade territorial.</p>
        </div>
        <div class="header-right actions">
          <a routerLink="/admin/posts/new" class="btn primary lg">
            <span>✍️</span> Nova Publicação
          </a>
          <a routerLink="/admin/settings" class="btn outline lg ml-3 text-brand">
             Personalizar Portal
          </a>
        </div>
      </header>

      <div *ngIf="loading" class="center-box">
        <div class="spinner"></div>
        <p class="muted mt-4">Sincronizando dados estaduais...</p>
      </div>

      <div *ngIf="!loading && !hasData" class="card empty-state">
        <div class="empty-illustration">
          <h3>Painel à espera de dados</h3>
          <p class="muted">Assim que houver publicações, espécies, áreas ou denúncias, os indicadores aparecem aqui.</p>
          <button class="btn primary sm mt-4" routerLink="/admin/posts/new">Começar agora</button>
        </div>
      </div>

      <div class="stats-grid" *ngIf="!loading && hasData">
        <div class="stat-card cursor-pointer" routerLink="/admin/biodiversity">
          <div class="stat-icon bio">🌿</div>
          <div class="stat-info">
            <span class="stat-label">Biodiversidade</span>
            <h2 class="stat-value">{{ bioCount }}</h2>
            <span class="stat-trend trend-up">Espécies Registadas</span>
          </div>
        </div>
        <div class="stat-card cursor-pointer" routerLink="/admin/areas">
          <div class="stat-icon area">🗾</div>
          <div class="stat-info">
            <span class="stat-label">Áreas Protegidas</span>
            <h2 class="stat-value">{{ areaCount }}</h2>
            <span class="stat-trend transition">Parques & Reservas</span>
          </div>
        </div>
        <div class="stat-card cursor-pointer" routerLink="/admin/complaints">
          <div class="stat-icon alert">🚨</div>
          <div class="stat-info">
            <span class="stat-label">Denúncias</span>
            <h2 class="stat-value">{{ complaintCount }}</h2>
            <span class="stat-trend" [class.trend-down]="pendingComplaints > 0">
              {{ pendingComplaints }} Pendentes de Auditoria
            </span>
          </div>
        </div>
        <div class="stat-card cursor-pointer" routerLink="/admin/posts">
          <div class="stat-icon post">📰</div>
          <div class="stat-info">
            <span class="stat-label">Engajamento Digital</span>
            <h2 class="stat-value">{{ postCount }}</h2>
            <span class="stat-trend">Publicações Ativas</span>
          </div>
        </div>
      </div>

      <!-- MAP SECTION -->
      <section class="card mb-8 anim-up" *ngIf="!loading && hasData" style="padding: 0; overflow: hidden; height: 400px; position: relative;">
        <div id="admin-map" style="width: 100%; height: 100%; z-index: 1;"></div>
        <div class="map-overlay-admin">
          <h4>Vigilância Territorial SIG-MAB</h4>
          <p class="muted text-xs">Visualização consolidada de infraestruturas e sensores rurais.</p>
        </div>
      </section>

      <div class="dashboard-layout" *ngIf="!loading && hasData">
        <section class="card quick-actions-panel">
          <h2 class="card-title mb-8">Ferramentas de Gestão Rápida</h2>
          <div class="action-grid">
            <a routerLink="/admin/posts/new" class="action-tile">
              <div class="tile-icon">📝</div>
              <div class="tile-content">
                <strong>Publicar Notícia</strong>
                <p>Anuncie decisões ministeriais e eventos.</p>
              </div>
            </a>
            <a routerLink="/admin/pages/new" class="action-tile">
              <div class="tile-icon">🌎</div>
              <div class="tile-content">
                <strong>Página Institucional</strong>
                <p>Crie novos espaços informativos de Governo.</p>
              </div>
            </a>
            <a routerLink="/admin/media" class="action-tile">
              <div class="tile-icon">🖼️</div>
              <div class="tile-content">
                <strong>Biblioteca Técnica</strong>
                <p>Gestão central de ficheiros e imagens.</p>
              </div>
            </a>
            <a routerLink="/admin/complaints" class="action-tile">
               <div class="tile-icon">🕵️</div>
               <div class="tile-content">
                 <strong>Rever Alertas</strong>
                 <p>Controlo operacional de denúncias públicas.</p>
               </div>
            </a>
          </div>
        </section>

        <section class="card secondary-panel">
          <div class="card-header-flex">
            <h2 class="card-title">Módulos da Plataforma</h2>
            <a routerLink="/admin/settings" class="btn sm ghost">Gerir Todos</a>
          </div>
          <div class="list-container mt-6">
            <div class="list-item cursor-pointer" *ngFor="let module of solutionModules.slice(0, 4)" routerLink="/admin/settings">
              <div class="item-main">
                <strong>{{ module.name }}</strong>
                <span class="muted text-xs uppercase letter-spacing-1">{{ module.audience }}</span>
              </div>
              <span class="badge" [ngClass]="module.status">{{ getModuleStatusLabel(module.status) }}</span>
            </div>
          </div>
        </section>

        <section class="card secondary-panel">
          <div class="card-header-flex">
            <h2 class="card-title">Alertas Recentes</h2>
            <a routerLink="/admin/complaints" class="btn sm ghost">Ver Todos</a>
          </div>
          <div class="table-container mt-6" *ngIf="recentComplaints.length > 0; else noComplaints">
            <table class="table">
              <thead>
                <tr>
                  <th>Incidente</th>
                  <th>Estado</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let c of recentComplaints" class="cursor-pointer" [routerLink]="['/admin/complaints', c.id]">
                  <td class="font-bold">{{ c.subject }}</td>
                  <td><span class="badge sm" [class]="c.status">{{ c.status }}</span></td>
                  <td class="muted text-xs">{{ c.created_at | date:'dd/MM' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <ng-template #noComplaints>
            <div class="empty-mini">Nenhum alerta recente.</div>
          </ng-template>
        </section>

        <section class="card secondary-panel chart-panel">
           <h2 class="card-title">Atividade de Conteúdo</h2>
           <div class="bar-chart-visual mt-10">
              <div class="bar-group" *ngFor="let h of [80, 65, 90, 75, 85]; let i = index">
                 <div class="bar" [style.height.%]="h"></div>
                 <span class="bar-label">{{ ['Set', 'Out', 'Nov', 'Dez', 'Jan'][i] }}</span>
              </div>
           </div>
           <p class="muted center text-sm mt-10">Métrica de publicações e engajamento mensal.</p>
        </section>

        <section class="card secondary-panel">
          <div class="card-header-flex">
            <h2 class="card-title">Últimas Publicações</h2>
            <a routerLink="/admin/posts" class="btn sm ghost">Explorar Lista</a>
          </div>
          <div class="list-container mt-6">
            <div class="list-item cursor-pointer" *ngFor="let post of recentPosts" [routerLink]="['/admin/posts', post.id, 'edit']">
              <div class="item-main">
                <strong class="text-sm">{{ post.title }}</strong>
                <span class="muted text-xs">{{ post.created_at | date:'dd MMM yyyy' }}</span>
              </div>
               <span class="badge sm">{{ post.status || 'published' }}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 48px; border-bottom: 1px solid var(--border); padding-bottom: 40px; }
    .section-title { margin-bottom: 10px; }
    
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; margin-bottom: 48px; }
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
      .dashboard-header { flex-direction: column; align-items: flex-start; gap: 20px; margin-bottom: 30px; padding-bottom: 24px; }
      .stats-grid, .action-grid, .dashboard-grid { grid-template-columns: 1fr; }
      .stat-card { padding: 16px; gap: 12px; }
      .stat-card .info h2 { font-size: 1.5rem; }
    }
    .cursor-pointer { cursor: pointer; }
    .stat-card:hover, .action-tile:hover, .list-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.08);
      border-color: var(--brand);
    }
    .map-overlay-admin {
      position: absolute; top: 20px; left: 20px; z-index: 10;
      background: rgba(255,255,255,0.95); padding: 15px 20px; border-radius: 12px;
      box-shadow: var(--shadow); border: 1px solid var(--border);
      max-width: 280px;
    }
    .map-overlay-admin h4 { margin: 0; font-size: 0.9rem; color: var(--brand); }
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
  mapMarkers: MapMarker[] = [];
  adminMap?: L.Map;
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
        this.mapMarkers = res.settings?.map_markers || [];
        
        if (this.hasData) {
          setTimeout(() => this.initAdminMap(), 500);
        }
      },
      error: () => {
        this.recentComplaints = [];
      }
    });
  }

  initAdminMap() {
    if (this.adminMap) {
      this.adminMap.remove();
    }

    this.adminMap = L.map('admin-map', { zoomControl: false }).setView([11.86, -15.59], 8);
    L.control.zoom({ position: 'bottomright' }).addTo(this.adminMap);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.adminMap);

    const icons = {
      furo: L.divIcon({ html: '💧', className: 'map-icon' }),
      basin: L.divIcon({ html: '🌊', className: 'map-icon' }),
      station: L.divIcon({ html: '📡', className: 'map-icon' }),
      project: L.divIcon({ html: '🏗️', className: 'map-icon' }),
    };

    if (this.mapMarkers.length > 0) {
      this.mapMarkers.forEach(m => {
        const icon = (icons as any)[m.type] || icons.furo;
        L.marker([m.lat, m.lng], { icon }).addTo(this.adminMap!)
          .bindPopup(`<b>${m.title}</b><br>${m.description || ''}`);
      });
    }
  }

  getModuleStatusLabel(status?: string): string {
    if (status === 'pilot') return 'Piloto';
    if (status === 'planned') return 'Planeado';
    return 'Ativo';
  }
}
