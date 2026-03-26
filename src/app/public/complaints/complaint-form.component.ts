import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { API_BASE } from '../../api-config';
import { ToastService } from '../../services/toast.service';

@Component({
  standalone: true,
  selector: 'app-public-complaint-form',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header dark">
      <div class="container">
        <h1>Canal de Denúncias</h1>
        <p>Relate atividades ilegais ou danos ambientais de forma segura.</p>
      </div>
    </div>

    <div class="container container-sm">
      <div class="complaint-card card">
        <form #f="ngForm" (ngSubmit)="submit(f)" *ngIf="!success">
          <div class="grid-2">
            <div class="form-group">
              <label>Nome (Opcional)</label>
              <input [(ngModel)]="form.nome" name="nome" class="form-control" placeholder="Seu nome">
            </div>
            <div class="form-group">
              <label>Contacto (Opcional)</label>
              <input [(ngModel)]="form.contato" name="contato" class="form-control" placeholder="Telefone ou Email">
            </div>
          </div>

          <div class="form-group">
            <label>Título da Ocorrência</label>
            <input [(ngModel)]="form.titulo" name="titulo" required class="form-control" placeholder="Ex: Corte de árvores em área protegida">
          </div>

          <div class="form-group">
            <label>Descrição Detalhada</label>
            <textarea [(ngModel)]="form.descricao" name="descricao" required class="form-control" rows="6" placeholder="Descreva o que viu, quando e onde..."></textarea>
          </div>

          <div class="form-group">
            <label>Localização (Distrito/Área)</label>
            <input [(ngModel)]="form.localizacao" name="localizacao" required class="form-control" placeholder="Onde ocorreu a infração?">
          </div>

          <div class="actions">
            <button type="submit" class="btn primary lg" [disabled]="submitting || !f.valid">
              {{ submitting ? 'A enviar...' : 'Enviar Denúncia' }}
            </button>
          </div>
        </form>

        <div class="success-msg" *ngIf="success">
          <span class="icon">✅</span>
          <h2>Denúncia Enviada!</h2>
          <p>Obrigado pela sua colaboração. A sua denúncia foi registada e será analisada pelas autoridades competentes.</p>
          <button class="btn primary" (click)="success = false">Enviar outra</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header.dark { background: #3c1e1e; color: #fff; padding: 60px 0; margin-bottom: 40px; }
    .container-sm { max-width: 800px; }
    .complaint-card { padding: 40px; }
    .form-group { margin-bottom: 24px; }
    .actions { display: flex; justify-content: center; margin-top: 30px; }
    
    .success-msg { text-align: center; padding: 40px 0; animation: fadeIn 0.4s; }
    .success-msg .icon { font-size: 4rem; display: block; margin-bottom: 20px; }
    .success-msg h2 { margin-bottom: 15px; color: var(--primary); }
    
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class PublicComplaintFormComponent {
  form: any = {
    nome: '',
    contato: '',
    titulo: '',
    descricao: '',
    localizacao: ''
  };
  submitting = false;
  success = false;

  constructor(
    private http: HttpClient,
    private toast: ToastService
  ) {}

  submit(f: any): void {
    this.submitting = true;
    const payload = {
      tipo_infracao: this.form.titulo,
      descricao: this.form.descricao,
      local: this.form.localizacao,
      nome: this.form.nome,
      contato: this.form.contato
    };

    this.http.post(`${API_BASE}/denuncias`, payload).subscribe({
      next: () => {
        this.submitting = false;
        this.success = true;
        this.toast.success('Denuncia enviada com sucesso.');
        f.reset();
      },
      error: () => {
        this.submitting = false;
        alert('Erro ao enviar a denúncia. Por favor tente mais tarde.');
      }
    });
  }
}
