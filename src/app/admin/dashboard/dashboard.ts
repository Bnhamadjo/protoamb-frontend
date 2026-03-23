import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../posts/services/post.service';
import { BiodiversityService } from '../biodiversity/services/biodiversity.service';
import { AreaService } from '../areas/services/area.service';
import { ComplaintService, Complaint } from '../complaints/services/complaint.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'admin-dashboard',
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Bem-vindo, Administrador</h1>
        <p class="muted">Eis o resumo da preservação e gestão ambiental em tempo real.</p>
      </header>

      <div *ngIf="loading" class="center-box">
        <div class="spinner"></div>
        <p class="muted">Carregando painel...</p>
      </div>

      <div class="stats-grid" *ngIf="!loading">
        <div class="stat-card">
          <div class="icon">🌿</div>
          <div class="info">
            <span class="label">Biodiversidade</span>
            <h2 class="value">{{ bioCount }}</h2>
            <span class="trend success">Espécies Registadas</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="icon">🗺️</div>
          <div class="info">
            <span class="label">Áreas Protegidas</span>
            <h2 class="value">{{ areaCount }}</h2>
            <span class="trend">Parques e Reservas</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="icon">📢</div>
          <div class="info">
            <span class="label">Denúncias</span>
            <h2 class="value">{{ complaintCount }}</h2>
            <span class="trend danger">{{ pendingComplaints }} Pendentes</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="icon">✍️</div>
          <div class="info">
            <span class="label">Publicações</span>
            <h2 class="value">{{ postCount }}</h2>
            <span class="trend">Artigos e Notícias</span>
          </div>
        </div>
      </div>

      <div class="dashboard-grid" *ngIf="!loading">
        <div class="card recent-complaints">
          <div class="card-header">
            <h3>Denúncias Recentes</h3>
            <button class="btn ghost sm">Ver todas</button>
          </div>
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Assunto</th>
                  <th>Status</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let c of recentComplaints">
                  <td>{{ c.subject }}</td>
                  <td>
                    <span class="badge" [class]="c.status">{{ c.status }}</span>
                  </td>
                  <td>{{ c.created_at | date:'dd/MM' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="card activity-visual">
          <h3>Integridade do Ecossistema</h3>
          <div class="simulated-chart">
            <div class="bar" style="height: 80%"><span>Set</span></div>
            <div class="bar" style="height: 65%"><span>Out</span></div>
            <div class="bar" style="height: 90%"><span>Nov</span></div>
            <div class="bar" style="height: 75%"><span>Dez</span></div>
            <div class="bar" style="height: 85%"><span>Jan</span></div>
          </div>
          <p class="muted center">Monitorização de atividade e denúncias mensais.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { animation: fadeIn 0.5s ease-out; }
    .dashboard-header { margin-bottom: 32px; }
    .dashboard-header h1 { font-size: 2rem; margin-bottom: 4px; }

    .stats-grid { 
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 32px; 
    }
    .stat-card {
      background: #fff; padding: 24px; border-radius: var(--radius-md); 
      display: flex; align-items: center; gap: 20px; box-shadow: var(--shadow-sm);
      border: 1px solid var(--border); transition: var(--transition);
    }
    .stat-card:hover { transform: translateY(-3px); box-shadow: var(--shadow); }
    .stat-card .icon { 
      font-size: 2.5rem; background: var(--bg-app); width: 64px; height: 64px; 
      display: flex; align-items: center; justify-content: center; border-radius: 16px; 
    }
    .stat-card .info .label { font-size: 0.85rem; color: var(--ink-muted); font-weight: 600; text-transform: uppercase; }
    .stat-card .info h2 { margin: 4px 0; font-size: 1.8rem; line-height: 1; }
    .stat-card .info .trend { font-size: 0.75rem; font-weight: 700; }
    .stat-card .info .trend.success { color: var(--success); }
    .stat-card .info .trend.danger { color: var(--danger); }

    .dashboard-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    
    .simulated-chart {
      height: 200px; display: flex; align-items: flex-end; justify-content: space-between;
      gap: 10px; padding: 20px 10px; margin-top: 20px;
    }
    .simulated-chart .bar {
      flex: 1; background: var(--brand); border-radius: 4px 4px 0 0;
      position: relative; transition: height 1s ease-in-out;
    }
    .simulated-chart .bar span {
      position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%);
      font-size: 0.7rem; color: var(--ink-muted);
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
  loading = true;

  constructor(
    private postService: PostService,
    private bioService: BiodiversityService,
    private areaService: AreaService,
    private complaintService: ComplaintService
  ) {}

  ngOnInit() {
    forkJoin({
      posts: this.postService.all().pipe(catchError(() => of([]))),
      bio: this.bioService.all().pipe(catchError(() => of([]))),
      areas: this.areaService.all().pipe(catchError(() => of([]))),
      complaints: this.complaintService.all().pipe(catchError(() => of([])))
    }).subscribe({
      next: (res) => {
        this.postCount = res.posts.length;
        this.bioCount = res.bio.length;
        this.areaCount = res.areas.length;
        this.complaintCount = res.complaints.length;
        this.pendingComplaints = res.complaints.filter(c => c.status === 'pending').length;
        this.recentComplaints = res.complaints.slice(0, 5);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        console.error('Falha crítica ao carregar dashboard.');
      }
    });
  }
}