import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ComplaintService, Complaint } from '../services/complaint.service';

@Component({
  standalone: true,
  selector: 'app-complaints-list',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="complaints-list anim-fade-in">
      <header class="list-header" style="margin-bottom: 30px;">
        <h1>Gestão de Denúncias</h1>
        <p class="muted">Monitore e responda às preocupações ambientais reportadas.</p>
      </header>

      <div *ngIf="loading" class="center-box card">
        <div class="spinner"></div>
        <p class="muted">Buscando denúncias...</p>
      </div>

      <div *ngIf="error" class="error-banner card" style="background: #FEF2F2; color: #DC2626; padding: 20px; text-align: center; margin-bottom: 20px;">
        {{ error }}
      </div>

      <div class="table-container" *ngIf="!loading && complaints.length > 0">
        <table class="table">
          <thead>
            <tr>
              <th>Assunto / Reporte</th>
              <th>Denunciante</th>
              <th>Status</th>
              <th>Data</th>
              <th style="text-align: right;">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of complaints">
              <td>
                <div style="font-weight: 600;">{{ c.subject }}</div>
                <div class="muted" style="font-size: 0.8rem;">📦 Referência: #{{ c.id }}</div>
              </td>
              <td>
                <div>{{ c.reporter_name || '👤 Anónimo' }}</div>
                <div class="muted" style="font-size: 0.8rem;">{{ c.reporter_email || '-' }}</div>
              </td>
              <td>
                <span class="badge" [ngClass]="c.status">
                  {{ translateStatus(c.status) }}
                </span>
              </td>
              <td>{{ c.created_at | date:'dd MMM, HH:mm' }}</td>
              <td style="text-align: right;">
                <a [routerLink]="['/admin/complaints', c.id]" class="btn sm outline">🔎 Ver Detalhes</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="!loading && complaints.length === 0" class="empty card center-box">
        <div style="font-size: 3rem; margin-bottom: 20px;">🛡️</div>
        <h3>Tudo tranquilo</h3>
        <p class="muted">Não há denúncias pendentes de momento.</p>
      </div>
    </div>
  `,
  styles: [`
    .badge { padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
    .badge.pending { background: #fee2e2; color: #991b1b; }
    .badge.investigating { background: #fef3c7; color: #92400e; }
    .badge.resolved { background: #d1fae5; color: #065f46; }
    .badge.dismissed { background: #f3f4f6; color: #374151; }
  `]
})
export class ComplaintsListComponent implements OnInit {
  complaints: Complaint[] = [];
  loading = true;
  error = '';

  constructor(private service: ComplaintService) {}

  ngOnInit(): void {
    this.service.all().subscribe({
      next: (res) => { this.complaints = res; this.loading = false; },
      error: () => { this.error = 'Falha ao carregar denúncias.'; this.loading = false; }
    });
  }

  translateStatus(status: string): string {
    const map: any = {
      'pending': 'Pendente',
      'investigating': 'Em Investigação',
      'resolved': 'Resolvido',
      'dismissed': 'Arquivado'
    };
    return map[status] || status;
  }
}
