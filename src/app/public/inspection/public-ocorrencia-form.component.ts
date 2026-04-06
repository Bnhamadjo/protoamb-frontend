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
                <option value="Incêndio">Incêndio Florestal</option>
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

          <!-- SIG & EVIDENCE (The Magic Loop) -->
          <div class="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
            <h4 class="text-emerald-800 font-bold mb-4 flex items-center gap-2">
              📍 Dados Geográficos & Evidências
            </h4>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="form-group">
                <label class="block text-xs font-bold text-emerald-600 uppercase mb-2">Latitude (Opcional)</label>
                <input type="number" step="any" [(ngModel)]="form.latitude" name="latitude" class="w-full p-3 border border-emerald-200 rounded-lg" placeholder="Ex: 11.86">
              </div>
              <div class="form-group">
                <label class="block text-xs font-bold text-emerald-600 uppercase mb-2">Longitude (Opcional)</label>
                <input type="number" step="any" [(ngModel)]="form.longitude" name="longitude" class="w-full p-3 border border-emerald-200 rounded-lg" placeholder="Ex: -15.58">
              </div>
            </div>
            
            <div class="form-group mt-6">
              <label class="block text-xs font-bold text-emerald-600 uppercase mb-2">Anexar Fotografia / Evidência</label>
              <div class="flex items-center justify-center p-6 border-2 border-dashed border-emerald-300 rounded-xl bg-white hover:bg-emerald-50 transition cursor-pointer" (click)="fileInput.click()">
                <span class="text-sm font-semibold text-emerald-700">📸 {{ fileName || 'Clique para selecionar imagem' }}</span>
                <input type="file" #fileInput class="hidden" (change)="onFileChange($event)">
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="block text-sm font-bold text-gray-700 mb-2">Descrição Detalhada</label>
            <textarea [(ngModel)]="form.descricao" name="descricao" required class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500" rows="5" placeholder="Forneça o máximo de detalhes possível..."></textarea>
          </div>

          <div class="flex justify-center pt-4">
            <button type="submit" class="bg-emerald-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition transform hover:scale-105 shadow-md" [disabled]="submitting || !f.valid">
              {{ submitting ? 'A enviar...' : 'ENVIAR RELATÓRIO AMBIENTAL' }}
            </button>
          </div>
        </form>

        <div class="text-center py-10" *ngIf="success">
          <div class="text-6xl mb-6">🛰️</div>
          <h2 class="text-3xl font-bold text-emerald-800 mb-4">Relatório Transmitido!</h2>
          <p class="text-gray-600 mb-8 max-w-md mx-auto">
            O seu reporte foi integrado no **Monitoramento Nacional**. A equipa técnica irá validar as coordenadas e evidências para possível mobilização de campo.
          </p>
          <button class="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold" (click)="success = false; fileName = ''">Relatar outro incidente</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header.dark-green { 
      background: linear-gradient(rgba(10, 36, 26, 0.85), rgba(10, 36, 26, 0.95)), url('https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1920&q=80'); 
      background-size: cover;
      background-position: center;
      color: #fff; 
      padding: 100px 0; 
      margin-bottom: 40px; 
      text-align: center;
    }
    .page-header h1 { font-size: 3rem; font-weight: 800; margin-bottom: 10px; letter-spacing: -1px; }
    .page-header p { opacity: 0.9; font-size: 1.25rem; font-weight: 500; }
    .container-sm { max-width: 800px; padding-bottom: 60px; }
  `]
})
export class PublicOcorrenciaFormComponent {
  form: any = {
    nome: '',
    contato: '',
    titulo: '',
    tipo: 'Poluição',
    descricao: '',
    localizacao: '',
    latitude: null,
    longitude: null
  };
  submitting = false;
  success = false;
  fileName = '';

  constructor(
    private http: HttpClient,
    private toast: ToastService
  ) {}

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;
    }
  }

  submit(f: any): void {
    this.submitting = true;
    const payload = {
      titulo: this.form.titulo,
      descricao: `[RELATO PÚBLICO - ${this.form.nome || 'Anónimo'}] Contacto: ${this.form.contato || 'N/A'}\n\n${this.form.descricao}`,
      tipo: this.form.tipo,
      localizacao: this.form.localizacao,
      latitude: this.form.latitude,
      longitude: this.form.longitude,
      status: 'pendente',
      gravidade: 'media'
    };

    this.http.post(`${API_BASE}/ocorrencias/public`, payload).subscribe({
      next: () => {
        this.submitting = false;
        this.success = true;
        this.toast.success('Ocorrência enviada com sucesso.');
        f.reset();
        this.fileName = '';
      },
      error: () => {
        this.submitting = false;
        alert('Erro ao enviar o relatório para o centro de monitoramento.');
      }
    });
  }
}
