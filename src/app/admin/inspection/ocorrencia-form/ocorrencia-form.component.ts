import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { InspectionService, Ocorrencia } from '../services/inspection.service';
import { TeamService, Equipa } from '../services/team.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ocorrencia-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="content-view anim-up">
      <header class="section-header">
        <div class="header-left">
          <a routerLink="/admin/inspection/ocorrencias" class="back-link">← Cancelar e Voltar</a>
          <h1 class="section-title mt-2">{{ isEdit ? 'Editar' : 'Registar Nova' }} Ocorrência</h1>
          <p class="subtitle muted">Preencha os detalhes técnicos do incidente para registo e monitorização governamental.</p>
        </div>
      </header>

      <div class="card shadow-lg mt-8 max-w-4xl">
        <form (ngSubmit)="save()" #form="ngForm" class="form-layout">
          <div class="form-grid">
            <div class="form-group full-width">
              <label>Título Descritivo do Incidente</label>
              <input type="text" name="titulo" [(ngModel)]="model.titulo" required 
                     placeholder="Ex: Detetada queima de resíduos ilegais em Buba">
            </div>

            <div class="form-group full-width">
              <label>Relatório Narrativo / Descrição Detalhada</label>
              <textarea name="descricao" [(ngModel)]="model.descricao" rows="6" required 
                        placeholder="Descreva as circunstâncias, localização exata e impacto observado..."></textarea>
            </div>

            <div class="form-group">
              <label>Categoria de Incidente</label>
              <select name="tipo" [(ngModel)]="model.tipo" required>
                <option value="Incêndio">Incêndio</option>
                <option value="Desmatamento">Desmatamento</option>
                <option value="Caça Ilegal">Caça Ilegal</option>
                <option value="Poluição">Poluição</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div class="form-group">
              <label>Nível de Gravidade</label>
              <select name="gravidade" [(ngModel)]="model.gravidade" required>
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
            </div>

            <div class="form-group">
              <label>Atribuição de Equipa (Opcional)</label>
              <select name="equipa_id" [(ngModel)]="model.equipa_id">
                <option [ngValue]="null">A aguardar atribuição técnica</option>
                <option *ngFor="let t of teams" [value]="t.id">{{ t.nome }}</option>
              </select>
            </div>

            <div class="form-group">
              <label>Localização (Referencial)</label>
              <input type="text" name="localizacao" [(ngModel)]="model.localizacao" 
                     placeholder="Ex: Província Sul, Setor de Buba">
            </div>
          </div>

          <div class="form-actions mt-10">
            <button type="button" routerLink="/admin/inspection/ocorrencias" class="btn outline lg">
              Descartar
            </button>
            <button type="submit" [disabled]="!form.valid" class="btn primary lg ml-4">
              {{ isEdit ? 'Atualizar Registo' : 'Confirmar e Publicar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .section-header { margin-bottom: 40px; border-bottom: 1px solid var(--border); padding-bottom: 30px; }
    .back-link { font-weight: 800; color: var(--ink-light); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; }
    .back-link:hover { color: var(--brand); }
    .subtitle { font-size: 1rem; margin-top: 10px; }

    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
    .full-width { grid-column: span 2; }

    .form-group label { display: block; font-weight: 800; font-size: 0.85rem; color: var(--brand); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
    
    .form-actions { display: flex; justify-content: flex-end; padding-top: 30px; border-top: 1px solid var(--border); }
    
    @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } .full-width { grid-column: auto; } }
  `]
})
export class OcorrenciaFormComponent implements OnInit {
  isEdit = false;
  model: Partial<Ocorrencia> = {
    status: 'pendente',
    gravidade: 'media'
  };
  teams: Equipa[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private inspectionService: InspectionService,
    private teamService: TeamService
  ) {}

  ngOnInit() {
    this.teamService.all().subscribe(data => this.teams = data);
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit = true;
      this.inspectionService.getOcorrencia(Number(id)).subscribe(data => {
        this.model = data;
      });
    }
  }

  save() {
    const obs = this.isEdit 
      ? this.inspectionService.updateOcorrencia(this.model.id!, this.model)
      : this.inspectionService.createOcorrencia(this.model);

    obs.subscribe(() => {
      this.router.navigate(['/admin/inspection/ocorrencias']);
    });
  }
}
