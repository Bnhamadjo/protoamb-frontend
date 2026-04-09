import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { PostService } from '../posts/services/post.service';
import { BiodiversityService } from '../biodiversity/services/biodiversity.service';
import { AreaService } from '../areas/services/area.service';
import { ComplaintService, Complaint } from '../complaints/services/complaint.service';
import { InspectionService, Missao, Ocorrencia } from '../inspection/services/inspection.service';
import { StatsService, TrafficStats, ActivityLog } from '../../services/stats.service';
import { DepartmentItem, MapMarker, PlatformModuleItem, SettingsService, SiteSettings } from '../../services/settings.service';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

@Component({
  standalone: true,
  selector: 'admin-dashboard',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-hub anim-fade-in">
      
      <!-- TOP STATUS BAR: User & Weather -->
      <header class="hub-header">
        <div class="header-main">
          <div class="welcome-box">
             <span class="hub-kicker">Guiné-Bissau • Sistema Integrado de Gestão</span>
             <h1>Olá, <span class="text-gradient">Admin MAB</span></h1>
             <p class="muted">Centro de Comando e Monitorização Ambiental Integrada</p>
          </div>
          
          <div class="weather-widget" *ngIf="weatherData">
             <div class="weather-main">
                <span class="temp">{{ weatherData.current_weather.temperature }}°C</span>
                <span class="city">Bissau</span>
             </div>
             <div class="weather-meta">
                <span class="wind">🌬️ {{ weatherData.current_weather.windspeed }} km/h</span>
                <span class="status">Céu Limpo</span>
             </div>
          </div>
        </div>
        
        <div class="header-actions">
           <a routerLink="/admin/inspection/ocorrencias" class="btn primary">
             <span class="icon">🚨</span> Novo Alerta
           </a>
        </div>
      </header>

      <div *ngIf="loading" class="hub-loading">
        <div class="pulse-loader"></div>
        <p>Sincronizando centros de dados...</p>
      </div>

      <!-- MAIN OPERATIONAL GRID (12 Cols) -->
      <div class="hub-grid" *ngIf="!loading">
        
        <!-- ROW 1: CORE KPIs -->
        <section class="kpi-row col-span-12">
          <div class="kpi-card" routerLink="/admin/complaints">
             <div class="kpi-icon orange">🚨</div>
             <div class="kpi-data">
                <span class="kpi-label">Denúncias Ativas</span>
                <h3 class="kpi-value">{{ complaintCount }}</h3>
                <span class="kpi-trend danger" *ngIf="pendingComplaints > 0">! {{ pendingComplaints }} Pendentes</span>
             </div>
          </div>
          <div class="kpi-card" routerLink="/admin/inspection/missoes">
             <div class="kpi-icon green">🏗️</div>
             <div class="kpi-data">
                <span class="kpi-label">Missões de Campo</span>
                <h3 class="kpi-value">{{ missionCount }}</h3>
                <span class="kpi-trend success">Operacionais</span>
             </div>
          </div>
          <div class="kpi-card" routerLink="/admin/biodiversity">
             <div class="kpi-icon blue">🦋</div>
             <div class="kpi-data">
                <span class="kpi-label">Base Bibliográfica</span>
                <h3 class="kpi-value">{{ bioCount }}</h3>
                <span class="kpi-trend">Espécies em Catálogo</span>
             </div>
          </div>
          <div class="kpi-card" routerLink="/admin/waste">
             <div class="kpi-icon purple">♻️</div>
             <div class="kpi-data">
                <span class="kpi-label">Resíduos (Planos)</span>
                <h3 class="kpi-value">24</h3>
                <span class="kpi-trend">Unidades Ativas</span>
             </div>
          </div>
        </section>

        <!-- ROW 2: CRITICAL OPERATIONS (LEFT) & ANALYTICS (RIGHT) -->
        <section class="col-span-12 lg:col-span-8 command-panel">
          <div class="panel-head">
             <h2>Registo de Atividades Recentes</h2>
             <a routerLink="/admin/users/activities" class="text-link">Ver histórico total</a>
          </div>
          
          <div class="alerts-list">
             <div class="alert-item" *ngFor="let log of recentLogs">
                <div class="user-avatar-mini">{{ (log.user?.name || log.causer_name).charAt(0) }}</div>
                <div class="alert-body">
                   <div class="alert-top">
                      <strong>{{ log.user?.name || log.causer_name }}</strong>
                      <span class="alert-time">{{ log.created_at | date:'HH:mm' }}</span>
                   </div>
                   <p class="text-sm">
                      <span class="badge sm mr-2" [class]="log.action">{{ log.action }}</span>
                      {{ log.description }}
                   </p>
                </div>
             </div>
          </div>
          
          <div *ngIf="recentLogs.length === 0" class="empty-mini">Nenhuma atividade registada hoje.</div>
        </section>

        <!-- TRAFFIC PANEL (RIGHT) -->
        <section class="col-span-12 lg:col-span-4 analytics-panel">
          <div class="panel-head">
             <h2>Tráfego de Hoje</h2>
             <span class="live-pulse"></span>
          </div>
          
          <div class="stats-box" *ngIf="trafficData">
             <div class="traffic-main">
                <div class="t-stat">
                   <span class="t-lbl">Cliques (Hits)</span>
                   <span class="t-val">{{ trafficData.today.hits }}</span>
                </div>
                <div class="t-stat">
                   <span class="t-lbl">Visitantes Únicos</span>
                   <span class="t-val">{{ trafficData.today.uniques }}</span>
                </div>
             </div>
             
             <!-- Sparkline Simulation -->
             <div class="sparkline mt-8">
                <svg viewBox="0 0 100 30" class="spark-svg">
                   <path d="M0,25 L10,20 L20,28 L30,15 L40,22 L50,10 L60,18 L70,5 L80,12 L90,15 L100,2" fill="none" stroke="var(--brand)" stroke-width="2" stroke-linecap="round"/>
                </svg>
             </div>
             <p class="muted text-xs center mt-4">Tendência de audiência (7 dias)</p>
          </div>
        </section>

        <!-- ROW 3: RECENT MISSIONS & MAP -->
        <section class="col-span-12 lg:col-span-6 missions-panel">
          <div class="panel-head">
             <h2>Missões de Trabalho</h2>
             <span class="status-indicator live">LIVE</span>
          </div>
          <div class="missions-grid">
             <div class="mission-mini-card" *ngFor="let m of recentMissions">
                <div class="mission-m-ico">🏗️</div>
                <div class="mission-m-data">
                   <strong class="text-sm">{{ m.titulo }}</strong>
                   <span class="text-xs muted">{{ m.status | titlecase }}</span>
                </div>
                <div class="progress-bar-mini">
                   <div class="prog-fill" [style.width.%]="m.status === 'concluida' ? 100 : 45"></div>
                </div>
             </div>
          </div>
        </section>

        <section class="col-span-12 lg:col-span-6 map-panel">
           <div id="admin-map" class="mini-map"></div>
           <div class="map-tag">SIG Geospacial Consolidado</div>
        </section>

      </div>
    </div>
  `,
  styles: [`
    .dashboard-hub { padding: 40px; background: #fdfefc; min-height: 100vh; }
    
    .hub-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
    .hub-kicker { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: var(--brand); letter-spacing: 2px; }
    .hub-header h1 { font-size: 2.2rem; margin: 5px 0; font-family: 'Fraunces', serif; font-weight: 900; }
    
    .weather-widget { background: #fff; padding: 15px 25px; border-radius: 20px; border: 1.5px solid var(--border); display: flex; align-items: center; gap: 20px; box-shadow: var(--shadow-sm); }
    .weather-main { display: flex; flex-direction: column; border-right: 1px solid var(--border); padding-right: 20px; }
    .temp { font-size: 1.8rem; font-weight: 900; color: var(--brand); }
    .city { font-size: 0.75rem; font-weight: 700; color: var(--ink-muted); text-transform: uppercase; }
    .weather-meta { display: flex; flex-direction: column; font-size: 0.8rem; font-weight: 600; color: var(--ink-muted); }

    .hub-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 30px; }
    
    /* KPI ROW */
    .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 10px; }
    .kpi-card { background: #fff; padding: 25px; border-radius: 20px; border: 1.5px solid var(--border); display: flex; align-items: center; gap: 20px; transition: var(--transition); cursor: pointer; }
    .kpi-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-lg); border-color: var(--brand); }
    .kpi-icon { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; }
    .kpi-icon.orange { background: #fff7ed; }
    .kpi-icon.green { background: #f0fdf4; }
    .kpi-icon.blue { background: #eff6ff; }
    .kpi-icon.purple { background: #faf5ff; }
    .kpi-label { font-size: 0.75rem; font-weight: 800; color: var(--ink-muted); text-transform: uppercase; letter-spacing: 1px; }
    .kpi-value { font-size: 1.8rem; font-weight: 900; margin: 4px 0; color: var(--brand); }
    .kpi-trend { font-size: 0.7rem; font-weight: 800; padding: 2px 8px; border-radius: 100px; display: inline-block; }
    .kpi-trend.danger { background: #fef2f2; color: #dc2626; }
    .kpi-trend.success { background: #f0fdf4; color: #16a34a; }

    /* PANELS */
    .command-panel, .analytics-panel, .missions-panel, .map-panel { background: #fff; padding: 30px; border-radius: 24px; border: 1.5px solid var(--border); box-shadow: var(--shadow-sm); }
    .panel-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 1px solid var(--border); padding-bottom: 15px; }
    .panel-head h2 { font-size: 1.1rem; font-weight: 900; color: var(--brand); text-transform: uppercase; letter-spacing: 1px; }

    /* ALERTS LIST */
    .alerts-list { display: flex; flex-direction: column; gap: 15px; margin-bottom: 20px; }
    .alert-item { padding: 15px; border: 1px solid var(--border); border-radius: 16px; display: flex; align-items: center; gap: 15px; transition: 0.2s; cursor: pointer; }
    .alert-item:hover { background: #f8fafc; border-color: var(--brand); }
    .alert-status { width: 8px; height: 8px; border-radius: 50%; background: #cbd5e1; flex-shrink: 0; }
    .alert-status.pending { background: #f97316; animation: pulse 2s infinite; }
    .alert-status.resolved { background: #22c55e; }
    .alert-body { flex-grow: 1; }
    .alert-top { display: flex; justify-content: space-between; margin-bottom: 4px; }
    .alert-time { font-size: 0.7rem; color: var(--ink-muted); font-weight: 700; }

    /* CHART BOX (Donut) */
    .chart-box { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 260px; }
    .donut-chart { width: 180px; transform: rotate(-90deg); }
    .donut-bg { fill: none; stroke: #f1f5f9; stroke-width: 8; }
    .donut-segment { fill: none; stroke-width: 8; stroke-linecap: round; }
    .donut-segment.bio { stroke: var(--brand); }
    .donut-segment.area { stroke: var(--accent); }
    .chart-text { transform: rotate(90deg); transform-origin: center; text-anchor: middle; }
    .chart-val { font-size: 1.2rem; font-weight: 950; fill: var(--brand); }
    .chart-lbl { font-size: 0.5rem; font-weight: 700; fill: var(--ink-muted); text-transform: uppercase; }
    .chart-legend { display: flex; gap: 20px; margin-top: 20px; font-size: 0.75rem; font-weight: 700; color: var(--ink-muted); }
    .dot { width: 10px; height: 10px; border-radius: 3px; display: inline-block; margin-right: 5px; }
    .dot.bio { background: var(--brand); }
    .dot.area { background: var(--accent); }

    /* MISSIONS */
    .missions-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
    .mission-mini-card { background: #f8fafc; padding: 15px; border-radius: 16px; border: 1px solid var(--border); display: flex; flex-direction: column; gap: 8px; }
    .mission-m-ico { font-size: 1.2rem; }
    .progress-bar-mini { height: 4px; background: #e2e8f0; border-radius: 10px; overflow: hidden; margin-top: 8px; }
    .prog-fill { height: 100%; background: var(--brand); border-radius: 10px; transition: 1s; }

    .mini-map { height: 220px; border-radius: 16px; overflow: hidden; position: relative; }
    .map-tag { position: absolute; bottom: 10px; right: 10px; background: rgba(0,0,0,0.6); color: #fff; padding: 4px 10px; border-radius: 6px; font-size: 0.65rem; font-weight: 700; z-index: 10; }

    .user-avatar-mini {
       width: 32px; height: 32px; border-radius: 50%;
       background: var(--brand); color: #fff;
       display: flex; align-items: center; justify-content: center;
       font-weight: 800; font-size: 11px; flex-shrink: 0;
    }
    .badge.created { background: #dcfce7; color: #166534; }
    .badge.updated { background: #fef9c3; color: #854d0e; }
    .badge.deleted { background: #fee2e2; color: #991b1b; }
    
    .traffic-main { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .t-stat { display: flex; flex-direction: column; }
    .t-lbl { font-size: 0.65rem; font-weight: 800; color: var(--ink-muted); text-transform: uppercase; }
    .t-val { font-size: 1.6rem; font-weight: 900; color: var(--brand); }
    .sparkline { height: 60px; display: flex; align-items: flex-end; }
    .spark-svg { width: 100%; height: 100%; filter: drop-shadow(0 4px 4px rgba(0,0,0,0.05)); }
    .live-pulse { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2); animation: pulseGreen 2s infinite; }
    @keyframes pulseGreen { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }

    @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4); } 70% { box-shadow: 0 0 0 8px rgba(249, 115, 22, 0); } 100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0); } }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .anim-fade-in { animation: fadeIn 0.4s ease-out; }

    .text-gradient { background: linear-gradient(135deg, var(--brand), #4a7c59); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .col-span-12 { grid-column: span 12; }
    @media (min-width: 1024px) {
       .lg\\:col-span-8 { grid-column: span 8; }
       .lg\\:col-span-4 { grid-column: span 4; }
       .lg\\:col-span-6 { grid-column: span 6; }
    }
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
  weatherData: any = null;
  trafficData: TrafficStats | null = null;
  missionCount = 0;
  occurrenceCount = 0;
  recentMissions: Missao[] = [];
  recentOccurrences: Ocorrencia[] = [];
  recentLogs: ActivityLog[] = [];

  constructor(
    private postService: PostService,
    private bioService: BiodiversityService,
    private areaService: AreaService,
    private complaintService: ComplaintService,
    private inspectionService: InspectionService,
    private settingsService: SettingsService,
    private statsService: StatsService,
    private http: HttpClient
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
      missions: this.inspectionService.getMissoes().pipe(catchError(() => of([]))),
      occurrences: this.inspectionService.getOcorrencias().pipe(catchError(() => of([]))),
      settings: this.settingsService.getSettings().pipe(catchError(() => of({} as SiteSettings))),
      weather: this.http.get('https://api.open-meteo.com/v1/forecast?latitude=11.86&longitude=-15.58&current_weather=true').pipe(catchError(() => of(null))),
      traffic: this.statsService.getTraffic().pipe(catchError(() => of(null))),
      logs: this.statsService.getActivities().pipe(catchError(() => of(null)))
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
        this.missionCount = Array.isArray(res.missions) ? res.missions.length : 0;
        this.occurrenceCount = Array.isArray(res.occurrences) ? res.occurrences.length : 0;
        this.recentMissions = Array.isArray(res.missions) ? res.missions.slice(0, 3) : [];
        this.recentOccurrences = Array.isArray(res.occurrences) ? res.occurrences.slice(0, 3) : [];
        this.weatherData = res.weather;
        this.trafficData = res.traffic;
        this.recentLogs = res.logs?.data ? res.logs.data.slice(0, 5) : [];
        
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
