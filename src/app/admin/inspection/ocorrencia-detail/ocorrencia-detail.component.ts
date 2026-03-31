import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { InspectionService, Ocorrencia } from '../services/inspection.service';
import { UploadService } from '../../../services/upload.service';
import { ToastService } from '../../../services/toast.service';
import { AuthService } from '../../../core/auth';

@Component({
  selector: 'app-ocorrencia-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="content-view anim-up" *ngIf="ocorrencia">
      <header class="section-header">
        <div class="header-left">
          <a routerLink="/admin/inspection/ocorrencias" class="back-link">← Voltar à listagem</a>
          <h1 class="section-title mt-2">{{ ocorrencia.titulo }}</h1>
          <div class="meta-pills">
             <span class="badge" [ngClass]="getStatusClass(ocorrencia.status)">{{ ocorrencia.status }}</span>
             <span class="badge" [ngClass]="getGravidadeClass(ocorrencia.gravidade)">{{ ocorrencia.gravidade }}</span>
          </div>
        </div>
        <div class="header-right actions">
          <button class="btn outline" [routerLink]="['/admin/inspection/ocorrencias', ocorrencia.id, 'edit']">
            <span>✏️</span> Editar Registo
          </button>
          <button class="btn danger" (click)="delete()">
             Eliminar
          </button>
        </div>
      </header>

      <div class="grid-layout mt-10">
        <div class="main-column">
          <section class="card mb-8">
            <h2 class="card-title">Relatório Detalhado</h2>
            <div class="description-box">
              {{ ocorrencia.descricao }}
            </div>
          </section>

          <section class="card">
            <div class="flex-between mb-6">
              <h2 class="card-title">Evidências e Documentação Visual</h2>
              <button class="btn primary sm" (click)="fileInput.click()">
                + Adicionar Evidência
              </button>
              <input #fileInput type="file" (change)="onFileSelected($event)" class="hidden" accept="image/*">
            </div>
            
            <div class="gallery-grid" *ngIf="ocorrencia.evidencias?.length; else noEvidencias">
              <div *ngFor="let ev of ocorrencia.evidencias" class="gallery-item">
                <img [src]="ev.arquivo_path" class="gallery-img">
                <div class="gallery-overlay">
                   <a [href]="ev.arquivo_path" target="_blank" class="btn sm glass">Ver Original</a>
                </div>
              </div>
            </div>
            <ng-template #noEvidencias>
              <div class="empty-illustration">
                <p class="muted">Nenhuma foto ou documento anexado a esta ocorrência.</p>
              </div>
            </ng-template>
          </section>
        </div>

        <aside class="side-column">
          <div class="card info-sticky">
            <h2 class="card-title mb-6">Metadados e Rastreio</h2>
            <div class="info-list">
              <div class="info-item">
                 <label>Localização Geográfica</label>
                 <p>{{ ocorrencia.localizacao || 'Coordenadas: ' + ocorrencia.latitude + ', ' + ocorrencia.longitude }}</p>
              </div>
              <div class="info-item">
                 <label>Equipa Responsável</label>
                 <p class="text-brand font-bold" *ngIf="ocorrencia.equipa; else noEquipa">
                   {{ ocorrencia.equipa.nome }}
                 </p>
                 <ng-template #noEquipa>
                   <p class="muted italic">Pendente de atribuição</p>
                 </ng-template>
              </div>
              <div class="info-item">
                 <label>Data Crítica</label>
                 <p>{{ (ocorrencia.data_ocorrencia || ocorrencia.created_at) | date:'dd MMMM yyyy, HH:mm' }}</p>
              </div>
              <div class="info-item">
                 <label>ID de Auditoria</label>
                 <p class="muted font-mono text-xs">{{ ocorrencia.id }}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    .section-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 1px solid var(--border); padding-bottom: 30px; }
    .back-link { font-weight: 800; color: var(--ink-light); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; }
    .back-link:hover { color: var(--brand); }
    .meta-pills { display: flex; gap: 10px; margin-top: 15px; }

    .grid-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 40px; }
    .card-title { font-size: 1.25rem; font-weight: 800; color: var(--brand); font-family: 'Fraunces'; margin-bottom: 20px; }
    .description-box { font-size: 1.1rem; line-height: 1.8; color: var(--ink-muted); white-space: pre-wrap; }

    .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
    .gallery-item { border-radius: var(--radius-md); overflow: hidden; position: relative; aspect-ratio: 4/3; box-shadow: var(--shadow); }
    .gallery-img { width: 100%; height: 100%; object-fit: cover; transition: var(--transition); }
    .gallery-item:hover .gallery-img { transform: scale(1.05); }
    .gallery-overlay { position: absolute; inset: 0; background: rgba(6, 38, 29, 0.4); display: flex; align-items: center; justify-content: center; opacity: 0; transition: var(--transition-fast); }
    .gallery-item:hover .gallery-overlay { opacity: 1; }

    .info-list { display: flex; flex-direction: column; gap: 20px; }
    .info-item label { color: var(--ink-light); text-transform: uppercase; font-size: 0.65rem; font-weight: 900; letter-spacing: 1.5px; margin-bottom: 5px; display: block; }
    .info-item p { margin: 0; font-size: 0.95rem; font-weight: 600; color: var(--brand); }

    .badge { padding: 6px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; }
    .status-pendente { background: #fef3c7; color: #92400e; }
    .status-analise { background: #dbeafe; color: #1e40af; }
    .status-resolvida { background: #dcfce7; color: #166534; }
    .grav-critica, .grav-alta { background: #fee2e2; color: #991b1b; }
    .grav-media { background: #ffedd5; color: #9a3412; }
    .grav-baixa { background: #f0fdf4; color: #166534; }

    @media (max-width: 1024px) { .grid-layout { grid-template-columns: 1fr; } }
  `]
})
export class OcorrenciaDetailComponent implements OnInit {
  ocorrencia?: Ocorrencia;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private inspectionService: InspectionService,
    private uploadService: UploadService,
    private toast: ToastService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.inspectionService.getOcorrencia(id).subscribe((data: Ocorrencia) => {
        this.ocorrencia = data;
      });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadService.upload(file).subscribe((res: any) => {
        this.inspectionService.addEvidencia({
          ocorrencia_id: this.ocorrencia!.id,
          arquivo_path: res.url,
          tipo: 'foto',
          user_id: this.auth.getUser()?.id
        }).subscribe(() => {
          this.toast.success('Evidência adicionada com sucesso');
          this.ngOnInit();
        });
      });
    }
  }

  delete() {
    if (confirm('Tem a certeza que deseja eliminar esta ocorrência?')) {
      this.inspectionService.deleteOcorrencia(this.ocorrencia!.id!).subscribe(() => {
        this.router.navigate(['/admin/inspection/ocorrencias']);
      });
    }
  }

  getStatusClass(status: string) {
    switch (status?.toLowerCase()) {
      case 'pendente': return 'status-pendente';
      case 'em analise': return 'status-analise';
      case 'resolvida': return 'status-resolvida';
      default: return 'status-pendente';
    }
  }

  getGravidadeClass(gravidade: string) {
    switch (gravidade?.toLowerCase()) {
      case 'alta':
      case 'critica': return 'grav-critica';
      case 'media': return 'grav-media';
      default: return 'grav-baixa';
    }
  }
}
