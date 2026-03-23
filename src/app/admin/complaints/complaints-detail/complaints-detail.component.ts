import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ComplaintService, Complaint } from '../services/complaint.service';

@Component({
  standalone: true,
  selector: 'app-complaints-detail',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="complaint-detail" *ngIf="complaint">
      <div class="header">
        <div class="header-left">
          <a routerLink="/admin/complaints" class="btn sm">&larr; Voltar</a>
          <h1>Denúncia #{{ complaint.id }}</h1>
        </div>
        <div class="status-badge" [ngClass]="complaint.status">
          {{ translateStatus(complaint.status) }}
        </div>
      </div>

      <div class="grid-layout">
        <div class="main-info">
          <div class="card">
            <h2 style="color: var(--brand)">{{ complaint.subject }}</h2>
            <p class="description">{{ complaint.description }}</p>

            <div class="meta-item">
              <label>Localização</label>
              <strong>{{ complaint.location || 'Não especificada' }}</strong>
            </div>
            
            <div class="meta-item">
              <label>Data de Submissão</label>
              <strong>{{ complaint.created_at | date:'dd/MM/yyyy HH:mm' }}</strong>
            </div>
          </div>
        </div>

        <div class="sidebar-info">
          <div class="card">
            <h3 class="section-title">Denunciante</h3>
            <p style="margin: 0 0 8px"><strong>Nome:</strong> {{ complaint.reporter_name || 'Anónimo' }}</p>
            <p style="margin: 0"><strong>Email:</strong> {{ complaint.reporter_email || 'N/A' }}</p>
          </div>

          <div class="card">
            <h3 class="section-title">Ações de Gestão</h3>
            <label style="font-size: 0.85rem; color: var(--ink-muted);">Alterar Status</label>
            <select #statusSelect (change)="updateStatus(statusSelect.value)" [disabled]="updating">
              <option value="pending" [selected]="complaint.status === 'pending'">Pendente</option>
              <option value="investigating" [selected]="complaint.status === 'investigating'">Em Investigação</option>
              <option value="resolved" [selected]="complaint.status === 'resolved'">Resolvido</option>
              <option value="dismissed" [selected]="complaint.status === 'dismissed'">Arquivado</option>
            </select>
            <div *ngIf="updating" class="muted sm">Atualizando...</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .complaint-detail { max-width: 1000px; animation: fadeIn 0.4s ease-out; }
    .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; }
    .header-left { display: flex; align-items: center; gap: 20px; }
    
    .status-badge { padding: 6px 16px; border-radius: 99px; font-weight: 700; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.5px; }
    .status-badge.pending { background: #FEE2E2; color: #991B1B; }
    .status-badge.investigating { background: #FEF3C7; color: #92400E; }
    .status-badge.resolved { background: #D1FAE5; color: #065F46; }
    .status-badge.dismissed { background: #F3F4F6; color: #374151; }

    .grid-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 32px; }
    .main-info .card { padding: 32px; }
    .sidebar-info { display: flex; flex-direction: column; gap: 24px; }
    
    h2 { margin-top: 0; font-size: 1.5rem; }
    .description { font-size: 1.1rem; line-height: 1.7; margin: 24px 0; color: #334155; white-space: pre-wrap; }
    .meta-item { border-top: 1px solid var(--border); padding-top: 16px; margin-top: 16px; display: flex; justify-content: space-between; font-size: 0.9rem; }
    .meta-item label { margin:0; color: var(--ink-muted); }
    
    .section-title { font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; color: var(--ink-muted); margin-bottom: 12px; font-weight: 700; }
    select { margin-top: 8px; font-weight: 500; }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class ComplaintsDetailComponent implements OnInit {
  complaint: Complaint | null = null;
  updating = false;

  constructor(
    private route: ActivatedRoute,
    private service: ComplaintService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.service.show(+id).subscribe(res => this.complaint = res);
    }
  }

  updateStatus(status: string): void {
    if (!this.complaint) return;
    this.updating = true;
    this.service.updateStatus(this.complaint.id!, status).subscribe({
      next: (res) => { this.complaint = res; this.updating = false; },
      error: () => { alert('Erro ao atualizar status.'); this.updating = false; }
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
