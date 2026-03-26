import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';
import { API_BASE } from '../../api-config';

@Component({
  selector: 'app-water-hub',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <!-- Hero Header using the slider pattern -->
    <div class="home-slider" style="height: 50vh; min-height: 400px;">
      <div class="slides-container">
        <div class="slide active" style="background-image: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop'); background-position: center;">
          <div class="slide-content anim-up">
            <h1 class="logo-text" style="font-size: 3rem;">Recursos Hídricos e Solo</h1>
            <p class="subtitle">Gestão Territorial e Monitorização Hidro-ambiental</p>
            <div class="slider-actions">
              <button (click)="activeTab = 'mapa'" class="btn primary lg">🌍 Visualizador Geoespacial</button>
              <button (click)="activeTab = 'licenca'" class="btn outline lg white">📝 Licenciamento Hídrico</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats using the action blocks pattern -->
    <section class="container" style="margin-top: -60px; position: relative; z-index: 10;">
      <div class="grid-4">
        <div class="action-card anim-up cursor-pointer text-center py-5" style="background: var(--bg-card); color: var(--text-dark); border: 1px solid var(--border-color); border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); display: flex; flex-direction: column; justify-content: center; min-height: 140px;">
           <span style="font-size: 2.5rem; font-weight: 800; color: var(--primary);">{{ stats.bacias }}</span>
           <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--ink-muted); margin-top: 10px;">Bacias Monitorizadas</span>
        </div>
        <div class="action-card anim-up cursor-pointer text-center py-5" style="background: var(--bg-card); color: var(--text-dark); border: 1px solid var(--border-color); border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); display: flex; flex-direction: column; justify-content: center; min-height: 140px; animation-delay: 0.1s;">
           <span style="font-size: 2.5rem; font-weight: 800; color: #16a34a;">{{ stats.qualidade }}%</span>
           <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--ink-muted); margin-top: 10px;">Índice de Qualidade</span>
        </div>
        <div class="action-card anim-up cursor-pointer text-center py-5" style="background: var(--bg-card); color: var(--text-dark); border: 1px solid var(--border-color); border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); display: flex; flex-direction: column; justify-content: center; min-height: 140px; animation-delay: 0.2s;">
           <span style="font-size: 2.5rem; font-weight: 800; color: #d97706;">{{ stats.planos }}</span>
           <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--ink-muted); margin-top: 10px;">Planos em Vigor</span>
        </div>
        <div class="action-card anim-up cursor-pointer text-center py-5" style="background: var(--bg-card); color: var(--text-dark); border: 1px solid var(--border-color); border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); display: flex; flex-direction: column; justify-content: center; min-height: 140px; animation-delay: 0.3s;">
           <span style="font-size: 2.5rem; font-weight: 800; color: #7c3aed;">{{ stats.dados }}k</span>
           <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--ink-muted); margin-top: 10px;">Registos Espaciais</span>
        </div>
      </div>
    </section>

    <div class="container" style="margin-top: 50px;">
       <div style="display: flex; gap: 20px; border-bottom: 2px solid var(--border-color); padding-bottom: 15px; overflow-x: auto;">
          <button (click)="activeTab = 'instrumentos'" [style.color]="activeTab === 'instrumentos' ? 'var(--primary)' : 'var(--ink-muted)'" [style.border-bottom]="activeTab === 'instrumentos' ? '3px solid var(--primary)' : 'none'" style="background: none; border: none; font-size: 1.1rem; font-weight: 700; cursor: pointer; padding-bottom: 5px; margin-bottom: -18px;">📊 Instrumentos Oficiais</button>
          <button (click)="activeTab = 'mapa'" [style.color]="activeTab === 'mapa' ? 'var(--primary)' : 'var(--ink-muted)'" [style.border-bottom]="activeTab === 'mapa' ? '3px solid var(--primary)' : 'none'" style="background: none; border: none; font-size: 1.1rem; font-weight: 700; cursor: pointer; padding-bottom: 5px; margin-bottom: -18px;">🌍 Visualizador Geoespacial</button>
          <button (click)="activeTab = 'licenca'" [style.color]="activeTab === 'licenca' ? 'var(--primary)' : 'var(--ink-muted)'" [style.border-bottom]="activeTab === 'licenca' ? '3px solid var(--primary)' : 'none'" style="background: none; border: none; font-size: 1.1rem; font-weight: 700; cursor: pointer; padding-bottom: 5px; margin-bottom: -18px;">📝 Licenciamento Hídrico</button>
       </div>
    </div>

    <section class="container" style="margin: 60px auto; min-height: 500px;">
      
      <!-- TAB: Instrumentos de Gestão -->
      <div *ngIf="activeTab === 'instrumentos'" class="anim-up">
         <div class="section-headline">
            <div>
               <span class="section-kicker">Repositório Oficial</span>
               <h2 class="section-title">Instrumentos de Ordenamento</h2>
            </div>
            <div style="position: relative; width: 300px;">
               <input type="text" [(ngModel)]="searchQuery" placeholder="Pesquisar instrumentos..." style="width: 100%; padding: 12px 15px 12px 40px; border: 1px solid var(--border-color); border-radius: 8px; font-size: 1rem;">
               <span style="position: absolute; left: 15px; top: 12px; color: var(--ink-muted);">🔍</span>
            </div>
         </div>

         <div class="glass-card" style="padding: 0; overflow: hidden;">
            <table style="width: 100%; border-collapse: collapse; text-align: left;">
               <thead>
                  <tr style="background: var(--bg-alt); border-bottom: 1px solid var(--border-color); text-transform: uppercase; font-size: 0.8rem; color: var(--ink-muted);">
                     <th style="padding: 20px;">Tipo</th>
                     <th style="padding: 20px;">Documento / Título</th>
                     <th style="padding: 20px;">Ano Referência</th>
                     <th style="padding: 20px; text-align: right;">Ação</th>
                  </tr>
               </thead>
               <tbody>
                  <tr *ngFor="let item of filteredInstruments()" style="border-bottom: 1px solid var(--border-color);">
                     <td style="padding: 20px;">
                        <span class="status-pill" style="font-size: 0.7rem; background: rgba(22,96,72,0.1);">{{ item.type }}</span>
                     </td>
                     <td style="padding: 20px;">
                        <p style="font-weight: 700; font-size: 1.1rem; margin: 0; color: var(--ink-dark);">{{ item.name }}</p>
                        <p style="font-size: 0.9rem; color: var(--ink-muted); margin-top: 5px;">{{ item.summary }}</p>
                     </td>
                     <td style="padding: 20px; font-weight: 600; color: var(--ink);">{{ item.year }}</td>
                     <td style="padding: 20px; text-align: right;">
                        <button class="btn outline sm">Abrir PDF</button>
                     </td>
                  </tr>
                  <tr *ngIf="filteredInstruments().length === 0">
                     <td colspan="4" style="padding: 40px; text-align: center; color: var(--ink-muted);">Nenhum instrumento encontrado.</td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>

      <!-- TAB: Visualizador Geoespacial (Simulado Interativo) -->
      <div *ngIf="activeTab === 'mapa'" class="anim-up glass-card" style="position: relative; height: 600px; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #111;">
         <div style="position: absolute; inset: 0; background-image: url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop'); background-size: cover; background-position: center; opacity: 0.4;"></div>
         
         <div style="position: relative; z-index: 10; text-align: center; background: rgba(0,0,0,0.6); backdrop-filter: blur(10px); padding: 40px; border-radius: 20px; color: #fff; max-width: 500px; border: 1px solid rgba(255,255,255,0.1);">
            <span style="font-size: 3rem; margin-bottom: 20px; display: block;">🗺️</span>
            <h3 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 10px; color: #fff;">Módulo SIG-MAB</h3>
            <p style="font-size: 1rem; color: #ccc; margin-bottom: 30px; line-height: 1.6;">O carregamento das camadas geoespaciais e da rede hidrográfica requer autenticação de nível técnico.</p>
            <button class="btn primary lg" style="width: 100%;">Solicitar Acesso ao Mapa</button>
         </div>
      </div>

      <!-- TAB: Licenciamento Hídrico -->
      <div *ngIf="activeTab === 'licenca'" class="anim-up">
         <div class="module-row" style="background: var(--bg-card); padding: 40px; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid var(--border-color); max-width: 800px; margin: 0 auto; display: block;">
            
            <div style="display: flex; gap: 20px; margin-bottom: 40px; align-items: center;">
               <div style="width: 60px; height: 60px; background: rgba(22,96,72,0.1); color: var(--primary); border-radius: 12px; display: flex; justify-content: center; align-items: center; font-size: 1.8rem;">📝</div>
               <div>
                  <h2 style="font-size: 2rem; font-weight: 800; margin-bottom: 5px;">Licenciamento Hídrico</h2>
                  <p style="color: var(--ink-muted); margin: 0;">Submissão de processo formal para captações ou furos.</p>
               </div>
            </div>

            <div *ngIf="licencaSuccess" style="background: rgba(22,163,74,0.1); color: #166534; padding: 25px; border-radius: 12px; border: 1px solid rgba(22,163,74,0.2); margin-bottom: 30px; display: flex; gap: 20px; align-items: center;">
               <span style="font-size: 2rem;">✅</span>
               <div>
                  <h3 style="margin: 0 0 5px 0; font-size: 1.2rem; font-weight: 800; color: #166534;">O seu pedido (Proc. #{{ ticketNumber }}) foi submetido!</h3>
                  <p style="margin: 0; font-size: 0.95rem;">Acompanhe o estado na sua área reservada do portal.</p>
               </div>
            </div>

            <form (ngSubmit)="submitLicenca()" *ngIf="!licencaSuccess">
               <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 25px;">
                  <div>
                    <label style="display: block; font-weight: 700; margin-bottom: 10px; font-size: 0.9rem;">Entidade / Requerente</label>
                    <input type="text" [(ngModel)]="formData.requerente" name="requerente" required style="width: 100%; padding: 15px; border: 1px solid var(--border-color); border-radius: 8px; font-size: 1rem; background: var(--bg-body);">
                  </div>
                  <div>
                    <label style="display: block; font-weight: 700; margin-bottom: 10px; font-size: 0.9rem;">NIF / NIPC</label>
                    <input type="text" [(ngModel)]="formData.nif" name="nif" required style="width: 100%; padding: 15px; border: 1px solid var(--border-color); border-radius: 8px; font-size: 1rem; background: var(--bg-body);">
                  </div>
               </div>

               <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 25px;">
                  <div>
                    <label style="display: block; font-weight: 700; margin-bottom: 10px; font-size: 0.9rem;">Tipo de Captação</label>
                    <select [(ngModel)]="formData.tipo" name="tipo" style="width: 100%; padding: 15px; border: 1px solid var(--border-color); border-radius: 8px; font-size: 1rem; background: var(--bg-body);">
                       <option value="Furo Artesiano">Furo Artesiano (Subterrânea)</option>
                       <option value="Captação Superficial">Captação Superficial (Rio/Lagoa)</option>
                       <option value="Descarga de Efluentes">Descarga de Efluentes</option>
                    </select>
                  </div>
                  <div>
                    <label style="display: block; font-weight: 700; margin-bottom: 10px; font-size: 0.9rem;">Caudal Estimado (m³/dia)</label>
                    <input type="number" [(ngModel)]="formData.caudal" name="caudal" style="width: 100%; padding: 15px; border: 1px solid var(--border-color); border-radius: 8px; font-size: 1rem; background: var(--bg-body);">
                  </div>
               </div>

               <div style="margin-bottom: 30px;">
                  <label style="display: block; font-weight: 700; margin-bottom: 10px; font-size: 0.9rem;">Localização Exata (Coordenadas ou Descrição)</label>
                  <input type="text" [(ngModel)]="formData.localizacao" name="localizacao" required style="width: 100%; padding: 15px; border: 1px solid var(--border-color); border-radius: 8px; font-size: 1rem; background: var(--bg-body);">
               </div>

               <div style="background: rgba(22,96,72,0.05); padding: 20px; border-radius: 10px; border: 1px solid rgba(22,96,72,0.1); margin-bottom: 30px; display: flex; gap: 15px;">
                  <span style="font-size: 1.2rem; color: var(--primary);">ℹ️</span>
                  <p style="margin: 0; font-size: 0.85rem; color: var(--ink); line-height: 1.5;">Ao submeter, concorda que os peritos da Agência de Águas efetuarão uma avaliação de impacto hidrológico preliminar com base na localização especificada.</p>
               </div>

               <button type="submit" class="btn primary lg" style="width: 100%; font-size: 1.1rem; padding: 20px;" [disabled]="isSubmitting">
                  {{ isSubmitting ? 'A processar submissão oficial...' : 'Enviar Requerimento Formal' }}
               </button>
            </form>
         </div>
      </div>
    </section>
  `
})
export class WaterHubComponent implements OnInit {
  activeTab: 'instrumentos' | 'mapa' | 'licenca' = 'instrumentos';
  searchQuery = '';
  
  stats = { bacias: 0, qualidade: 0, planos: 0, dados: 0 };
  statLabels = {
    bacias: 'Bacias Monitorizadas',
    qualidade: 'Índice de Qualidade',
    planos: 'Planos em Vigor',
    dados: 'Registos Espaciais',
  };
  
  formData = { requerente: '', nif: '', tipo: 'Furo Artesiano', caudal: null, localizacao: '' };
  isSubmitting = false;
  licencaSuccess = false;
  ticketNumber = '';

  instruments = [
    { type: 'Plano Diretor', name: 'Plano Nacional Integrado de Bacias (PNIB)', summary: 'Estratégia nacional atualizada para a gestão.', year: 2024 },
    { type: 'Cartografia', name: 'Carta de Aptidão de Solos e Uso da Terra', summary: 'Mapeamento das capacidades produtivas.', year: 2025 },
    { type: 'Manual Técnico', name: 'Guia Base de Controlo de Erosão Costeira', summary: 'Intervenções de engenharia natural.', year: 2023 },
    { type: 'Dados / Relatório', name: 'Atlas Geoespacial Hídrico Integrado', summary: 'Base de dados espaciais consolidada.', year: 2026 },
    { type: 'Normativa', name: 'Regulamento de Captação Subterrânea', summary: 'Regras de perfuração de furos.', year: 2022 },
  ];

  constructor(private http: HttpClient, private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.settingsService.getSettings().subscribe(settings => {
      const s = settings.water_hub_stats;
      const targets = {
        bacias: s?.value1 !== undefined ? Number(s.value1) : 12,
        qualidade: s?.value2 !== undefined ? Number(s.value2) : 85,
        planos: s?.value3 !== undefined ? Number(s.value3) : 24,
        dados: s?.value4 !== undefined ? Number(s.value4) : 5.2,
      };
      this.statLabels = {
        bacias: s?.label1 || 'Bacias Monitorizadas',
        qualidade: s?.label2 || 'Índice de Qualidade',
        planos: s?.label3 || 'Planos em Vigor',
        dados: s?.label4 || 'Registos Espaciais',
      };
      this.animateStats(targets);
    });
  }

  animateStats(targets: { bacias: number; qualidade: number; planos: number; dados: number }) {
    let step = 0;
    const interval = setInterval(() => {
      if (step < 20) {
        this.stats.bacias = Math.round((targets.bacias / 20) * step);
        this.stats.qualidade = Math.round((targets.qualidade / 20) * step);
        this.stats.planos = Math.round((targets.planos / 20) * step);
        this.stats.dados = Number(((targets.dados / 20) * step).toFixed(1));
        step++;
      } else {
        clearInterval(interval);
        this.stats = targets;
      }
    }, 40);
  }

  filteredInstruments() {
    if (!this.searchQuery) return this.instruments;
    const q = this.searchQuery.toLowerCase();
    return this.instruments.filter(i => 
      i.name.toLowerCase().includes(q) || 
      i.summary.toLowerCase().includes(q) ||
      i.type.toLowerCase().includes(q)
    );
  }

  submitLicenca() {
    if (!this.formData.requerente || !this.formData.nif) return;
    this.isSubmitting = true;
    
    setTimeout(() => {
      this.isSubmitting = false;
      this.licencaSuccess = true;
      this.ticketNumber = 'RH-' + Math.floor(100000 + Math.random() * 900000);
      
      const payload = {
        titulo: `Licenciamento Hídrico: ${this.formData.tipo} - ${this.formData.requerente}`,
        descricao: `NIF: ${this.formData.nif}\nCaudal: ${this.formData.caudal} m3/d\nLocalização: ${this.formData.localizacao}`,
        tipo: 'licenciamento_hidrico',
        status: 'pendente'
      };
      
      this.http.post(`${API_BASE}/ocorrencias/public`, payload).subscribe();
    }, 1200);
  }
}
