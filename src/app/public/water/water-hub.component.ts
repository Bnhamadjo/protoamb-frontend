import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SettingsService, MapMarker } from '../../services/settings.service';
import { API_BASE } from '../../api-config';
import * as L from 'leaflet';

@Component({
  selector: 'app-water-hub',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <!-- Hero Header -->
    <div class="home-slider hero-sm">
      <div class="slides-container">
        <div class="slide active hero-bg-water">
          <div class="slide-content anim-up">
            <h1 class="hero-title text-6xl md:text-8xl mb-4">Recursos Hídricos <br> e <span class="text-accent">Solo</span></h1>
            <p class="hero-subtitle mb-8">Gestão Territorial e Monitorização Hidro-ambiental participativa</p>
            <div class="slider-actions">
              <button (click)="activeTab = 'mapa'" class="btn primary lg">🌍 Visualizador Geoespacial</button>
              <button (click)="activeTab = 'licenca'" class="btn outline lg white">📝 Licenciamento Hídrico</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <section class="container mt-neg">
      <div class="grid-4 stats-grid">
        <div class="action-card stat-card anim-up">
           <span class="stat-val">{{ stats.bacias }}</span>
           <span class="stat-lbl">{{ statLabels.bacias }}</span>
        </div>
        <div class="action-card stat-card anim-up" style="animation-delay: 0.1s;">
           <span class="stat-val">{{ stats.qualidade }}%</span>
           <span class="stat-lbl">{{ statLabels.qualidade }}</span>
        </div>
        <div class="action-card stat-card anim-up" style="animation-delay: 0.2s;">
           <span class="stat-val">{{ stats.planos }}</span>
           <span class="stat-lbl">{{ statLabels.planos }}</span>
        </div>
        <div class="action-card stat-card anim-up" style="animation-delay: 0.3s;">
           <span class="stat-val">{{ stats.dados }}k</span>
           <span class="stat-lbl">{{ statLabels.dados }}</span>
        </div>
      </div>
    </section>

    <div class="container tabs-wrapper">
       <div class="tabs-scroll">
          <button (click)="activeTab = 'instrumentos'" [class.active]="activeTab === 'instrumentos'">📊 Instrumentos Oficiais</button>
          <button (click)="activeTab = 'mapa'" [class.active]="activeTab === 'mapa'">🌍 Visualizador Geoespacial</button>
          <button (click)="activeTab = 'licenca'" [class.active]="activeTab === 'licenca'">📝 Licenciamento Hídrico</button>
       </div>
    </div>

    <section class="container section-spacing" style="min-height: 500px;">
      
      <!-- TAB: Instrumentos -->
      <div *ngIf="activeTab === 'instrumentos'" class="anim-up">
         <div class="section-headline flex-col md:flex-row gap-6">
            <div>
               <span class="section-kicker">Repositório Oficial</span>
               <h2 class="section-title">Instrumentos de Ordenamento</h2>
            </div>
            <div class="search-box">
               <input type="text" [(ngModel)]="searchQuery" placeholder="Pesquisar instrumentos...">
               <span class="search-icon">🔍</span>
            </div>
         </div>

         <div class="glass-card table-responsive">
            <table class="table-v2">
               <thead>
                  <tr>
                     <th>Tipo</th>
                     <th>Documento / Título</th>
                     <th class="hide-mobile">Ano</th>
                     <th class="text-right">Ação</th>
                  </tr>
               </thead>
               <tbody>
                  <tr *ngFor="let item of filteredInstruments()">
                     <td>
                        <span class="status-pill">{{ item.type }}</span>
                     </td>
                     <td>
                        <p class="doc-title">{{ item.name }}</p>
                        <p class="doc-summary">{{ item.summary }}</p>
                     </td>
                     <td class="hide-mobile font-bold">{{ item.year }}</td>
                     <td class="text-right">
                        <button class="btn outline sm">PDF</button>
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>

      <!-- TAB: Mapa -->
      <div *ngIf="activeTab === 'mapa'" class="anim-up glass-card map-container">
         <div id="map" style="width: 100%; height: 100%; z-index: 1;"></div>
         <div class="map-overlay">
            <p class="overlay-kicker">SIG-MAB: Rede Hidrográfica</p>
            <p class="overlay-text">Visualização em tempo real de furos e estações monitorizadas na Guiné-Bissau.</p>
         </div>
      </div>

      <!-- TAB: Licenciamento -->
      <div *ngIf="activeTab === 'licenca'" class="anim-up">
         <div class="form-card impeccable-card">
            
            <div class="form-header">
               <div class="form-icon">📝</div>
               <div>
                  <h2 class="form-title">Licenciamento Hídrico</h2>
                  <p class="form-subtitle">Submissão de processo formal para captações ou furos.</p>
               </div>
            </div>

            <div *ngIf="licencaSuccess" class="alert-success">
               <span class="alert-icon">✅</span>
               <div>
                  <h3 class="alert-title">O seu pedido (Proc. #{{ ticketNumber }}) foi submetido!</h3>
                  <p class="alert-text">Acompanhe o estado na sua área reservada do portal.</p>
               </div>
            </div>

            <form (ngSubmit)="submitLicenca()" *ngIf="!licencaSuccess">
               <div class="form-grid">
                  <div class="form-group">
                    <label>Entidade / Requerente</label>
                    <input type="text" [(ngModel)]="formData.requerente" name="requerente" required>
                  </div>
                  <div class="form-group">
                    <label>NIF / NIPC</label>
                    <input type="text" [(ngModel)]="formData.nif" name="nif" required>
                  </div>
               </div>

               <div class="form-grid">
                  <div class="form-group">
                    <label>Tipo de Captação</label>
                    <select [(ngModel)]="formData.tipo" name="tipo">
                       <option value="Furo Artesiano">Furo Artesiano (Subterrânea)</option>
                       <option value="Captação Superficial">Captação Superficial (Rio/Lagoa)</option>
                       <option value="Descarga de Efluentes">Descarga de Efluentes</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Caudal Estimado (m³/dia)</label>
                    <input type="number" [(ngModel)]="formData.caudal" name="caudal">
                  </div>
               </div>

               <div class="form-group mb-8">
                  <label>Localização Exata (Coordenadas ou Descrição)</label>
                  <input type="text" [(ngModel)]="formData.localizacao" name="localizacao" required>
               </div>

               <div class="form-info">
                  <span class="info-icon">ℹ️</span>
                  <p>Ao submeter, concorda que os peritos da Agência de Águas efetuarão uma avaliação de impacto hidrológico preliminar com base na localização especificada.</p>
               </div>

               <button type="submit" class="btn primary lg w-full" [disabled]="isSubmitting">
                  {{ isSubmitting ? 'A processar submissão oficial...' : 'Enviar Requerimento Formal' }}
               </button>
            </form>
         </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-sm { height: 50vh; min-height: 400px; }
    .hero-bg-water { background-image: linear-gradient(135deg, rgba(8, 25, 18, 0.9) 0%, rgba(18, 51, 38, 0.75) 50%, rgba(0, 0, 0, 0.85) 100%), url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop'); background-position: center; }
    
    .stats-grid { gap: 24px; }
    .stat-card { 
      background: #fff; color: var(--ink); border: 1px solid var(--border); 
      border-radius: 16px; box-shadow: var(--shadow); 
      display: flex; flex-direction: column; justify-content: center; 
      min-height: 140px; text-align: center; padding: 20px;
    }
    .stat-val { font-size: 2.5rem; font-weight: 800; color: var(--brand); font-family: 'Fraunces', serif; }
    .stat-lbl { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: var(--ink-muted); margin-top: 8px; letter-spacing: 1px; }

    .tabs-wrapper { margin-top: 50px; }
    .tabs-scroll { display: flex; gap: 30px; border-bottom: 2px solid var(--border); padding-bottom: 15px; overflow-x: auto; scrollbar-width: none; }
    .tabs-scroll::-webkit-scrollbar { display: none; }
    .tabs-scroll button { background: none; border: none; font-size: 1.1rem; font-weight: 700; cursor: pointer; padding-bottom: 10px; color: var(--ink-muted); white-space: nowrap; transition: all 0.3s; }
    .tabs-scroll button.active { color: var(--brand); border-bottom: 3px solid var(--brand); margin-bottom: -18px; }

    .search-box { position: relative; width: 100%; max-width: 400px; }
    .search-box input { padding: 12px 15px 12px 40px; border: 1px solid var(--border); border-radius: 8px; font-size: 1rem; width: 100%; }
    .search-icon { position: absolute; left: 15px; top: 14px; color: var(--ink-muted); }

    .table-v2 { width: 100%; border-collapse: collapse; }
    .table-v2 th { background: #f8fafc; padding: 20px; text-align: left; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; color: var(--ink-muted); border-bottom: 1px solid var(--border); }
    .table-v2 td { padding: 20px; border-bottom: 1px solid var(--border); vertical-align: middle; }
    .doc-title { font-weight: 800; font-size: 1.1rem; margin: 0; color: var(--brand); }
    .doc-summary { font-size: 0.85rem; color: var(--ink-muted); margin-top: 5px; line-height: 1.5; }

    .map-container { position: relative; height: 600px; overflow: hidden; background: #f8fafc; border: 1px solid var(--border); }
    .map-overlay { position: absolute; bottom: 20px; left: 20px; z-index: 10; background: rgba(255,255,255,0.9); padding: 20px; border-radius: 16px; border: 1px solid var(--border); box-shadow: var(--shadow-lg); max-width: 300px; }
    .overlay-kicker { margin: 0; font-size: 0.75rem; font-weight: 900; color: var(--brand); text-transform: uppercase; letter-spacing: 1.5px; }
    .overlay-text { margin: 8px 0 0 0; font-size: 0.85rem; color: var(--ink-muted); line-height: 1.5; }

    .form-card { max-width: 800px; margin: 0 auto; padding: 60px !important; }
    .form-header { display: flex; gap: 25px; margin-bottom: 50px; align-items: center; }
    .form-icon { width: 64px; height: 64px; background: rgba(6, 38, 29, 0.05); color: var(--brand); border-radius: 16px; display: flex; justify-content: center; align-items: center; font-size: 2rem; }
    .form-title { font-size: 2.2rem; font-weight: 800; margin: 0; color: var(--brand); }
    .form-subtitle { color: var(--ink-muted); margin: 5px 0 0 0; font-size: 1.1rem; }
    
    .alert-success { background: #f1fcf4; color: #166534; padding: 32px; border-radius: 20px; border: 1px solid #d1fae5; margin-bottom: 40px; display: flex; gap: 24px; align-items: center; }
    .alert-icon { font-size: 2.5rem; }
    .alert-title { margin: 0 0 8px 0; font-size: 1.3rem; font-weight: 800; }
    .alert-text { margin: 0; font-size: 1rem; opacity: 0.9; }

    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
    .form-group label { display: block; font-weight: 700; margin-bottom: 10px; font-size: 0.9rem; color: var(--brand); text-transform: uppercase; letter-spacing: 1px; }
    .form-group input, .form-group select { width: 100%; padding: 15px; border: 1px solid var(--border); border-radius: 8px; font-size: 1rem; background: #fff; }
    .form-info { background: #f8fafc; padding: 24px; border-radius: 16px; border: 1px solid var(--border); margin-bottom: 40px; display: flex; gap: 16px; }
    .info-icon { font-size: 1.4rem; color: var(--brand); }
    .form-info p { margin: 0; font-size: 0.9rem; color: var(--ink-muted); line-height: 1.6; }

    @media (max-width: 1024px) {
      .form-card { padding: 40px !important; }
      .map-container { height: 500px; }
    }

    @media (max-width: 768px) {
      .hero-sm { height: 40vh; min-height: 350px; }
      .form-grid { grid-template-columns: 1fr; gap: 20px; }
      .form-header { flex-direction: column; text-align: center; gap: 15px; }
      .form-title { font-size: 1.8rem; }
      .map-container { height: 400px; }
      .map-overlay { left: 10px; right: 10px; bottom: 10px; max-width: none; }
      .stat-card { min-height: 120px; }
      .stat-val { font-size: 2rem; }
      .tabs-scroll { gap: 20px; }
      .table-responsive { overflow-x: auto; }
      .hide-mobile { display: none; }
    }
  `]
})
export class WaterHubComponent implements OnInit {
  private _activeTab: 'instrumentos' | 'mapa' | 'licenca' = 'instrumentos';
  get activeTab() { return this._activeTab; }
  set activeTab(v) { 
    this._activeTab = v; 
    if (v === 'mapa') {
      setTimeout(() => this.initMap(), 100);
    }
  }

  map?: L.Map;
  mapMarkers: MapMarker[] = [];
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
      this.mapMarkers = settings.map_markers || [];
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

  initMap() {
    if (this.map) {
      this.map.remove();
    }

    // Guinea-Bissau view
    this.map = L.map('map').setView([11.8632, -15.5843], 8);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    const icons = {
      furo: L.divIcon({ html: '💧', className: 'map-icon' }),
      basin: L.divIcon({ html: '🌊', className: 'map-icon' }),
      station: L.divIcon({ html: '📡', className: 'map-icon' }),
      project: L.divIcon({ html: '🏗️', className: 'map-icon' }),
    };

    this.mapMarkers.forEach(m => {
      const icon = (icons as any)[m.type] || icons.furo;
      L.marker([m.lat, m.lng], { icon }).addTo(this.map!)
        .bindPopup(`<b>${m.title}</b><br>${m.description || ''}`);
    });
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
