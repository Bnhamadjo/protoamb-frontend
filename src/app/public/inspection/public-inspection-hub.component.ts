import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PublicInspectionDashboardComponent } from './public-inspection-dashboard.component';
import { InspectionService, Ocorrencia } from '../../admin/inspection/services/inspection.service';
import { AuthService } from '../../core/auth';
import * as L from 'leaflet';

@Component({
  standalone: true,
  selector: 'app-public-inspection-hub',
  imports: [CommonModule, RouterModule, PublicInspectionDashboardComponent],
  template: `
    <div class="page-header inspection-hero">
      <div class="container relative z-10">
        <span class="badge" style="background: var(--accent); color: var(--brand); font-weight: 900;">Monitorização Nacional v2.0</span>
        <h1 class="hero-title text-6xl md:text-8xl mb-6">Inspeção e Controlo de <br><span class="text-accent">Ocorrências Ambientais</span></h1>
        <p class="hero-subtitle max-w-3xl mx-auto">Acompanhe e reporte em tempo real alertas de desmatamento, focos de incêndio e crimes contra a biodiversidade em todo o território nacional.</p>
        <div class="cta-group mt-12">
          <a routerLink="/ocorrencias/relatar" class="btn primary lg shadow-xl">Reportar Incidente Ambiental</a>
          <a href="#mapa-alertas" class="btn outline white lg scroll-link ml-4">Ver Mapa de Alertas</a>
        </div>
      </div>
    </div>

    <!-- Public Alert Map (The SIG Transparency Layer) -->
    <section id="mapa-alertas" class="container -mt-16 relative z-20 mb-20">
      <div class="impeccable-card glass-card p-0 overflow-hidden shadow-2xl relative">
        <div class="map-overlay absolute top-6 left-6 z-[1000] pointer-events-none">
          <div class="bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl">
            <h3 class="text-white font-bold text-lg mb-1">Mapa Nacional de Alertas</h3>
            <p class="text-white/50 text-[10px] font-black uppercase tracking-widest">Atualizado a cada 15 minutos</p>
          </div>
        </div>
        <div id="alert-map" style="height: 600px; width: 100%; z-index: 10;"></div>
        
        <!-- Map Legend & Layer Toggle -->
        <div class="absolute bottom-6 left-6 z-[1000] flex gap-2">
          <button (click)="setMapLayer('streets')" [class.active]="currentLayer === 'streets'" class="layer-btn">Rua</button>
          <button (click)="setMapLayer('satellite')" [class.active]="currentLayer === 'satellite'" class="layer-btn">Satélite</button>
        </div>

        <div class="absolute bottom-6 right-6 z-[1000] bg-black/60 backdrop-blur-xl p-4 rounded-xl border border-white/10 flex gap-6">
          <div class="flex items-center gap-2"><span class="text-xl">🔥</span> <span class="text-white text-[10px] font-bold uppercase">Incêndios</span></div>
          <div class="flex items-center gap-2"><span class="text-xl">🪓</span> <span class="text-white text-[10px] font-bold uppercase">Desmatamento</span></div>
          <div class="flex items-center gap-2"><span class="text-xl">📍</span> <span class="text-white text-[10px] font-bold uppercase">Outros</span></div>
        </div>
      </div>
    </section>

    <section class="container py-10">
      <div class="grid lg:grid-cols-3 gap-12">
        <div class="lg:col-span-2">
          <h2 class="section-title mb-8">Estatísticas de Proteção Natura</h2>
          <app-public-inspection-dashboard></app-public-inspection-dashboard>
          
          <div id="fluxo" class="mt-20">
            <h2 class="section-title mb-10">O Fluxo de Processo Técnico</h2>
            <div class="workflow-steps">
              <div class="step">
                <div class="step-num">01</div>
                <h4>Relato</h4>
                <p>O cidadão ou sensor remoto envia um alerta através da plataforma pública.</p>
              </div>
              <div class="step">
                <div class="step-num">02</div>
                <h4>Análise Técnica</h4>
                <p>Especialistas validam a ocorrência e definem o nível de gravidade.</p>
              </div>
              <div class="step">
                <div class="step-num">03</div>
                <h4>Missão de Campo</h4>
                <p>Uma equipa técnica é mobilizada para o local com ferramentas digitais.</p>
              </div>
              <div class="step">
                <div class="step-num">04</div>
                <h4>Relatório e Resolução</h4>
                <p>Evidências são colhidas e o caso é encerrado com relatório técnico.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="side-panel">
          <div class="card p-8 bg-gray-50 border-none sticky top-24">
            <h3 class="font-bold text-xl mb-6">Equipas Capacitadas</h3>
            <ul class="space-y-4">
              <li class="flex items-center gap-3">
                <span class="text-green-600">✔</span>
                <span class="text-sm font-medium">Uso de GPS e Mobile na Missão</span>
              </li>
              <li class="flex items-center gap-3">
                <span class="text-green-600">✔</span>
                <span class="text-sm font-medium">Upload de Evidências em Tempo Real</span>
              </li>
              <li class="flex items-center gap-3">
                <span class="text-green-600">✔</span>
                <span class="text-sm font-medium">Role-Based Access Control</span>
              </li>
              <li class="flex items-center gap-3">
                <span class="text-green-600">✔</span>
                <span class="text-sm font-medium">Relatórios Automatizados</span>
              </li>
            </ul>
            <div class="mt-8 pt-8 border-t border-gray-200">
              <h4 class="font-bold mb-4">Área Restrita</h4>
              <p class="text-xs text-gray-400 mb-4">Acesso exclusivo para técnicos e fiscais do Ministério.</p>
              <a routerLink="/admin" class="btn ghost sm full-width">
                 {{ auth.isLogged() ? 'Ir para o Dashboard' : 'Aceder ao Painel Técnico' }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .inspection-hero { 
      background: linear-gradient(rgba(10, 36, 26, 0.75), rgba(10, 36, 26, 0.9)), url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1920&q=80');
      background-size: cover;
      background-position: center;
      color: #fff;
      padding: 160px 0 200px;
      text-align: center;
    }
    .badge { background: var(--brand); color: #fff; padding: 10px 24px; border-radius: 99px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 30px; display: inline-block; backdrop-filter: blur(10px); box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
    .inspection-hero h1 { 
      font-size: 4.5rem; font-weight: 920; margin-bottom: 25px; line-height: 1.1; letter-spacing: -3px; 
      text-shadow: 0 0 20px rgba(255,255,255,0.2), 0 10px 30px rgba(0,0,0,0.6); 
      -webkit-text-stroke: 0.5px rgba(255,255,255,0.1);
    }
    .inspection-hero h1 .text-emerald-400 {
      text-shadow: 0 0 30px rgba(52, 211, 153, 0.4), 0 0 10px rgba(255,255,255,0.2);
    }
    .inspection-hero p { font-size: 1.5rem; opacity: 0.95; max-width: 800px; margin: 0 auto; color: white !important; font-weight: 500; text-shadow: 0 2px 10px rgba(0,0,0,0.3); }
    
    .workflow-steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 30px; }
    .step { position: relative; padding: 30px; background: white; border-radius: 20px; border: 1px solid rgba(0,0,0,0.05); transition: 0.3s; }
    .step:hover { transform: translateY(-5px); border-color: var(--brand); box-shadow: var(--shadow-lg); }
    .step-num { font-size: 3rem; font-weight: 900; color: rgba(10, 60, 46, 0.05); position: absolute; top: 10px; right: 20px; z-index: 0; }
    .step h4 { font-weight: 800; position: relative; z-index: 1; margin-bottom: 10px; color: var(--brand); }
    .step p { font-size: 0.85rem; color: var(--ink-muted); position: relative; z-index: 1; margin: 0; }
    
    .btn.full-width { width: 100%; text-align: center; }

    .glass-card { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.2); }

    .layer-btn { 
      background: rgba(0,0,0,0.6); backdrop-filter: blur(10px); color: white; border: 1px solid rgba(255,255,255,0.1);
      padding: 6px 16px; border-radius: 12px; font-size: 10px; font-weight: 800; text-transform: uppercase; cursor: pointer; transition: 0.2s;
    }
    .layer-btn.active { background: #10b981; border-color: #10b981; }
  `]
})
export class PublicInspectionHubComponent implements OnInit, OnDestroy {
  ocorrencias: Ocorrencia[] = [];
  private map?: L.Map;
  currentLayer: 'streets' | 'satellite' = 'streets';
  private layers: { [key: string]: L.TileLayer } = {};

  constructor(
    private inspectionService: InspectionService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAlerts();
  }

  ngOnDestroy(): void {
    if (this.map) this.map.remove();
  }

  loadAlerts(): void {
    this.inspectionService.getOcorrencias().subscribe({
      next: (data: Ocorrencia[]) => {
        // Filter for active alerts that should be public
        this.ocorrencias = data.filter((o: Ocorrencia) => o.status !== 'arquivada' && o.status !== 'resolvida');
        setTimeout(() => this.initMap(), 100);
      }
    });
  }

  private initMap(): void {
    if (this.map) return;

    this.map = L.map('alert-map', { scrollWheelZoom: false }).setView([11.86, -15.58], 8);

    this.layers['streets'] = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    });

    this.layers['satellite'] = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community'
    });

    this.layers['streets'].addTo(this.map);
    this.addMarkers();
  }

  setMapLayer(type: 'streets' | 'satellite'): void {
    if (!this.map) return;
    this.currentLayer = type;
    Object.values(this.layers).forEach(l => this.map?.removeLayer(l));
    this.layers[type].addTo(this.map);
  }

  private addMarkers(): void {
    if (!this.map) return;

    this.ocorrencias.forEach(o => {
      if (o.latitude && o.longitude) {
        let emoji = '📍';
        if (o.tipo === 'Incêndio') emoji = '🔥';
        if (o.tipo === 'Desmatamento') emoji = '🪓';

        const icon = L.divIcon({
          className: 'custom-alert-icon',
          html: `<div style="font-size: 24px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));" class="${o.gravidade}">${emoji}</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        const marker = L.marker([o.latitude, o.longitude], { icon }).addTo(this.map!);
        
        const popupContent = `
          <div style="font-family: 'Outfit', sans-serif; min-width: 200px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-size: 10px; font-weight: 900; text-transform: uppercase; color: #dc2626;">${o.tipo}</span>
              <span style="padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 800; background: #fee2e2; color: #991b1b;">${o.gravidade.toUpperCase()}</span>
            </div>
            <h4 style="margin: 0 0 4px; font-weight: 800; color: #0f172a;">${o.titulo}</h4>
            <p style="margin: 0 0 10px; font-size: 12px; color: #64748b; line-height: 1.4;">${o.descricao.substring(0, 100)}...</p>
            <div style="font-size: 10px; color: #94a3b8; font-weight: 700;">REGISTADO EM: ${new Date(o.data_ocorrencia || '').toLocaleDateString()}</div>
          </div>
        `;
        marker.bindPopup(popupContent);
      }
    });
  }
}
