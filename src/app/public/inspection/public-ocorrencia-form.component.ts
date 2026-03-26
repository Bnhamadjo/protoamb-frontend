import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../api-config';
import { ToastService } from '../../services/toast.service';

@Component({
  standalone: true,
  selector: 'app-public-ocorrencia-form',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header dark-green">
      <div class="container">
        <h1>Relatar Ocorrência Ambiental</h1>
        <p>Ajude-nos a proteger o nosso meio ambiente relatando incidentes, caça ilegal ou poluição.</p>
      </div>
    </div>

    <div class="container container-sm">
      <div class="card p-8 shadow-lg border-green-100">
        <form #f="ngForm" (ngSubmit)="submit(f)" *ngIf="!success" class="space-y-6">
          <div class="grid md:grid-cols-2 gap-6">
            <div class="form-group">
              <label class="block text-sm font-bold text-gray-700 mb-2">Seu Nome (Opcional)</label>
              <input [(ngModel)]="form.nome" name="nome" class="w-full p-3 border rounded-lg" placeholder="Ex: João Silva">
            </div>
            <div class="form-group">
              <label class="block text-sm font-bold text-gray-700 mb-2">Contacto/Email (Opcional)</label>
              <input [(ngModel)]="form.contato" name="contato" class="w-full p-3 border rounded-lg" placeholder="Ex: joao@email.com">
            </div>
          </div>

          <div class="form-group">
            <label class="block text-sm font-bold text-gray-700 mb-2">O que aconteceu? (Título)</label>
            <input [(ngModel)]="form.titulo" name="titulo" required class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Ex: Mancha de óleo no rio Geba">
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <div class="form-group">
              <label class="block text-sm font-bold text-gray-700 mb-2">Tipo de Incidente</label>
              <select [(ngModel)]="form.tipo" name="tipo" required class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500">
                <option value="Poluição">Poluição / Descarga</option>
                <option value="Incêncio">Incêndio Florestal</option>
                <option value="Desmatamento">Corte de Árvores / Desmatamento</option>
                <option value="Caça Ilegal">Caça Ilegal / Braconagem</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            <div class="form-group">
              <label class="block text-sm font-bold text-gray-700 mb-2">Localização aproximada</label>
              <input [(ngModel)]="form.localizacao" name="localizacao" required class="w-full p-3 border rounded-lg" placeholder="Ex: Parque de Cantanhez, entrada sul">
            </div>
          </div>

          <div class="form-group">
            <label class="block text-sm font-bold text-gray-700 mb-2">Descrição Detalhada</label>
            <textarea [(ngModel)]="form.descricao" name="descricao" required class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500" rows="5" placeholder="Forneça o máximo de detalhes possível..."></textarea>
          </div>

          <div class="flex justify-center pt-4">
            <button type="submit" class="bg-green-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition transform hover:scale-105 shadow-md" [disabled]="submitting || !f.valid">
              {{ submitting ? 'A enviar...' : 'ENVIAR RELATÓRIO' }}
            </button>
          </div>
        </form>

        <div class="text-center py-10" *ngIf="success">
          <div class="text-6xl mb-6">🌿</div>
          <h2 class="text-3xl font-bold text-green-700 mb-4">Relatório Recebido!</h2>
          <p class="text-gray-600 mb-8 max-w-md mx-auto">
            Obrigado por ajudar a proteger o património natural da Guiné-Bissau. A nossa equipa técnica irá analisar a sua ocorrência o mais brevemente possível.
          </p>
          <button class="bg-green-600 text-white px-6 py-2 rounded-lg font-bold" (click)="success = false">Relatar outro incidente</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header.dark-green { 
      background: linear-gradient(135deg, #1a472a 0%, #2d5a27 100%); 
      color: #fff; 
      padding: 80px 0; 
      margin-bottom: 40px; 
      text-align: center;
    }
    .page-header h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 10px; }
    .page-header p { opacity: 0.8; font-size: 1.1rem; }
    .container-sm { max-width: 900px; padding-bottom: 60px; }
  `]
})
export class PublicOcorrenciaFormComponent {
  form: any = {
    nome: '',
    contato: '',
    titulo: '',
    tipo: 'Poluição',
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
      titulo: this.form.titulo,
      descricao: `[RELATO PÚBLICO - ${this.form.nome || 'Anónimo'}] Contacto: ${this.form.contato || 'N/A'}\n\n${this.form.descricao}`,
      tipo: this.form.tipo,
      localizacao: this.form.localizacao,
      status: 'pendente',
      gravidade: 'media' // Default for public submissions
    };

    this.http.post(`${API_BASE}/ocorrencias/public`, payload).subscribe({
      next: () => {
        this.submitting = false;
        this.success = true;
        this.toast.success('Ocorrência enviada com sucesso.');
        f.reset();
      },
      error: () => {
        this.submitting = false;
        alert('Erro ao enviar o relatório. Por favor tente mais tarde.');
      }
    });
  }
}
