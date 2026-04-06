import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ExplorerService, DataResource } from '../../../services/explorer.service';
import { ToastService } from '../../../services/toast.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-explorer-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="admin-container anim-up">
      <header class="premium-header">
        <div class="title-group">
          <h1 class="premium-title">{{ resource?.title }}</h1>
          <div class="subtitle-info">
            <span class="badge">{{ resource?.category || 'Geral' }}</span>
            <span class="source-tag">Fonte: {{ resource?.source }}</span>
            <span class="shared-tag" *ngIf="resource?.is_public">🔓 Público na Org</span>
          </div>
        </div>
        <div class="header-actions">
          <button (click)="toggleSatellite()" *ngIf="showMap" class="premium-btn outline sm">
            <span class="icon">🛰️</span> {{ isSatellite ? 'Mapa' : 'Satélite' }}
          </button>
          <button (click)="export('excel')" class="premium-btn outline sm">
            <span class="icon">📊</span> Excel
          </button>
          <button (click)="export('pdf')" class="premium-btn outline sm">
            <span class="icon">📄</span> PDF
          </button>
          <a routerLink="/admin/explorer" class="premium-btn secondary sm">Voltar</a>
        </div>
      </header>

      <!-- Magic Touch: Auto-generated Metrics -->
      <div *ngIf="metrics.length > 0" class="metrics-grid">
        <div *ngFor="let m of metrics" class="metric-tile glass-card anim-delayed-1">
          <div class="metric-label">{{ m.label }}</div>
          <div class="metric-value">{{ m.value | number:'1.2-2' }}</div>
          <div class="metric-trend" [class.up]="m.trend > 0">{{ m.trend > 0 ? '▲' : '▼' }} {{ m.trend }}%</div>
        </div>
      </div>

    <!-- Magic Touch: Smart Chart (Visualização Heurística) -->
    <div *ngIf="resource?.configuration?.visualization === 'chart' && chartData.length > 0" class="chart-container glass-card anim-delayed-2">
      <!-- Chart SVG Content -->
      <div class="chart-header">
        <h3>Visualização de Tendências</h3>
        <small>Sugestão automática baseada na estrutura dos dados.</small>
      </div>
      <div class="svg-chart">
        <svg width="100%" height="240">
          <g *ngFor="let d of chartData; let i = index">
            <rect [attr.x]="0" [attr.y]="i * 45" [attr.width]="(d.value / maxChartValue) * 80 + '%'" height="30" rx="8" class="bar-rect" [style.animation-delay]="(i * 0.1) + 's'"></rect>
            <text [attr.x]="10" [attr.y]="i * 45 + 20" class="bar-text">{{ d.label }} ({{ d.value }})</text>
          </g>
        </svg>
      </div>
    </div>

    <!-- Magic Touch: Interactive Map View (SIG) -->
    <div *ngIf="showMap" class="map-container glass-card anim-delayed-2">
      <div class="map-header">
        <h3>Vista Monitoramento Geográfico</h3>
        <small>Visualização SIG de alertas e sensores em tempo real.</small>
      </div>
      <div id="map" style="height: 400px; border-radius: 12px; z-index: 1;"></div>
    </div>

    <!-- Data Table -->
      <div class="data-view-card glass-card anim-delayed-3">
        <div class="table-container">
          <table class="premium-table explorer-table">
            <thead>
              <tr>
                <th *ngFor="let col of columns">{{ col | titlecase }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of data; let i = index" class="premium-row" [style.animation-delay]="(i * 0.05) + 's'">
                <td *ngFor="let col of columns">
                  <div [ngSwitch]="getFieldType(row[col], col)">
                    
                    <!-- Image Detection -->
                    <div *ngSwitchCase="'image'" class="table-img-wrapper">
                      <img [src]="row[col]" alt="Preview" class="table-thumb" (click)="openLightbox(row[col])">
                    </div>

                    <!-- Date Formatting -->
                    <span *ngSwitchCase="'date'" class="date-val">{{ row[col] | date:'shortDate' }}</span>
                    
                    <!-- Boolean Badges -->
                    <span *ngSwitchCase="'boolean'" class="bool-val" [class.true]="row[col]">
                      {{ row[col] ? 'Sim' : 'Não' }}
                    </span>
                    
                    <!-- Numeric Values -->
                    <span *ngSwitchCase="'number'" class="num-val">{{ row[col] | number }}</span>
                    
                    <!-- HTML Content (Magic Touch) -->
                    <div *ngSwitchCase="'html'" [innerHTML]="row[col]" class="html-cell-content"></div>

                    <!-- Default Text -->
                    <span *ngSwitchDefault>{{ row[col] }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="data.length === 0 && !loading" class="no-data">Nenhum registo encontrado para os critérios definidos.</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .subtitle-info { display: flex; gap: 12px; margin-top: 8px; align-items: center; }
    .badge { background: var(--brand-muted); color: white; padding: 2px 10px; border-radius: 4px; font-size: 0.75rem; text-transform: uppercase; }
    .source-tag, .shared-tag { font-size: 0.85rem; color: var(--ink-light); font-weight: 600; }

    .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 24px; }
    .metric-tile { padding: 24px; text-align: center; }
    .metric-label { font-size: 0.75rem; text-transform: uppercase; color: var(--ink-muted); font-weight: 800; margin-bottom: 8px; }
    .metric-value { font-size: 2rem; font-weight: 800; color: var(--brand); line-height: 1; }
    .metric-trend { margin-top: 8px; font-size: 0.8rem; font-weight: 700; }
    .metric-trend.up { color: #10b981; }

    .chart-container { padding: 32px; margin-bottom: 32px; }
    .chart-header h3 { margin-bottom: 4px; color: var(--brand); }
    .chart-header small { color: var(--ink-light); display: block; margin-bottom: 24px; }

    .bar-rect { fill: var(--brand); opacity: 0.8; animation: growBar 1s ease-out forwards; transform-origin: left; scale: 0 1; }
    @keyframes growBar { to { scale: 1 1; } }

    .bar-text { fill: white; font-size: 12px; font-weight: 700; pointer-events: none; }

    .explorer-table th { background: rgba(6, 38, 29, 0.05); }
    .no-data { padding: 48px; text-align: center; font-style: italic; color: var(--ink-light); }

    .date-val { color: var(--primary); font-weight: 600; }
    .bool-val { padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 800; }
    .bool-val.true { background: #d1fae5; color: #065f46; }
    .num-val { font-family: 'Monaco', monospace; font-weight: 700; }

    /* New Premium Rendering Styles */
    .table-thumb {
      max-width: 100px;
      max-height: 60px;
      border-radius: 8px;
      box-shadow: var(--shadow-sm);
      cursor: pointer;
      transition: var(--transition-fast);
      object-fit: cover;
    }
    .table-thumb:hover { transform: scale(1.1); box-shadow: var(--shadow-md); }

    .html-cell-content {
      max-width: 400px;
      max-height: 120px;
      overflow-y: auto;
      font-size: 0.85rem;
      line-height: 1.4;
      color: var(--ink-muted);
      border-left: 2px solid var(--border);
      padding-left: 12px;
      padding-right: 8px;
    }

    .html-cell-content h1, .html-cell-content h2, .html-cell-content h3 {
      font-size: 1rem;
      margin: 8px 0 4px;
      color: var(--brand);
    }

    .html-cell-content p { margin-bottom: 8px; }

    .table-img-wrapper { display: flex; align-items: center; justify-content: center; }
  `]
})
export class ExplorerViewComponent implements OnInit, OnDestroy {
  resource: DataResource | null = null;
  data: any[] = [];
  columns: string[] = [];
  loading = true;

  metrics: any[] = [];
  chartData: any[] = [];
  maxChartValue = 1;

  // Map related
  showMap = false;
  isSatellite = false;
  private map?: L.Map;
  private baseLayer?: L.TileLayer;
  private satelliteLayer?: L.TileLayer;

  constructor(
    private route: ActivatedRoute,
    private explorerService: ExplorerService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loadResource(id);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  loadResource(id: number): void {
    this.explorerService.getResources().subscribe(list => {
      this.resource = list.find(r => r.id == id) || null;
      if (this.resource) {
        this.fetchData(id);
      }
    });
  }

  fetchData(id: number): void {
    this.explorerService.getResourceData(id).subscribe({
      next: (res) => {
        this.data = res;
        if (this.data.length > 0) {
          this.columns = Object.keys(this.data[0]);
          this.generateMagicInsights();
          
          if (this.resource?.configuration?.visualization === 'map') {
            const hasCoords = this.data.some(r => r.latitude && r.longitude);
            if (hasCoords) {
              this.showMap = true;
              setTimeout(() => this.initMap(), 100);
            }
          }
        }
        this.loading = false;
      },
      error: () => this.toast.error('Erro ao buscar dados do recurso')
    });
  }

  private initMap(): void {
    if (this.map) this.map.remove();

    this.map = L.map('map').setView([11.86, -15.58], 8); // Centralized for Guinea-Bissau

    this.baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community'
    });

    this.addMarkers();
  }

  private addMarkers(): void {
    if (!this.map) return;

    const markers: L.LatLng[] = [];
    this.data.forEach(row => {
      if (row.latitude && row.longitude) {
        const lat = parseFloat(row.latitude);
        const lng = parseFloat(row.longitude);
        const marker = L.marker([lat, lng]).addTo(this.map!);
        
        const popupContent = `
          <div style="font-family: 'Outfit', sans-serif;">
            <strong style="color: var(--brand); display: block; margin-bottom: 4px;">${row.titulo || row.name || 'Alerta'}</strong>
            <p style="margin: 0; font-size: 11px;">Status: <b>${row.status || 'N/A'}</b></p>
            <p style="margin: 0; font-size: 11px;">Gravidade: <b>${row.gravidade || 'N/A'}</b></p>
          </div>
        `;
        marker.bindPopup(popupContent);
        markers.push(L.latLng(lat, lng));
      }
    });

    if (markers.length > 0) {
      const group = L.featureGroup(this.data.filter(r => r.latitude && r.longitude).map(r => L.marker([r.latitude, r.longitude])));
      this.map.fitBounds(L.latLngBounds(markers).pad(0.1));
    }
  }

  toggleSatellite(): void {
    if (!this.map || !this.baseLayer || !this.satelliteLayer) return;

    if (this.isSatellite) {
      this.map.removeLayer(this.satelliteLayer);
      this.baseLayer.addTo(this.map);
    } else {
      this.map.removeLayer(this.baseLayer);
      this.satelliteLayer.addTo(this.map);
    }
    this.isSatellite = !this.isSatellite;
  }

  getFieldType(val: any, col: string): string {
    if (val === null || val === undefined) return 'string';
    
    // Check if it's a URL ending or containing image-like patterns
    const strVal = String(val);
    if (strVal.startsWith('http') && (strVal.match(/\.(jpeg|jpg|gif|png|webp)/i) || col.toLowerCase().includes('image') || col.toLowerCase().includes('logo'))) {
      return 'image';
    }

    // Check for HTML tags
    if (typeof val === 'string' && /<[a-z][\s\S]*>/i.test(val)) {
      return 'html';
    }

    if (val instanceof Date) return 'date';
    if (typeof val === 'boolean') return 'boolean';
    if (typeof val === 'number') return 'number';
    if (typeof val === 'string' && val.includes('-') && !isNaN(Date.parse(val)) && val.length > 8) return 'date';
    
    return 'string';
  }

  openLightbox(url: string): void {
    window.open(url, '_blank');
  }

  generateMagicInsights(): void {
    // Simulated Magic: Find numeric columns for stats and charts
    const numCols = this.columns.filter(c => typeof this.data[0][c] === 'number');
    
    if (numCols.length > 0) {
      const mainCol = numCols[0];
      const sum = this.data.reduce((acc, row) => acc + (row[mainCol] || 0), 0);
      const avg = sum / this.data.length;
      
      this.metrics = [
        { label: 'Total ' + mainCol, value: sum, trend: 12.5 },
        { label: 'Média ' + mainCol, value: avg, trend: -3.2 },
        { label: 'Máximo', value: Math.max(...this.data.map(r => r[mainCol] || 0)), trend: 5.1 }
      ];

      // Chart: Top 5 entries
      this.chartData = this.data.slice(0, 5).map(r => ({
        label: r.name || r.title || r.id || 'Item',
        value: r[mainCol] || 0
      }));
      this.maxChartValue = Math.max(...this.chartData.map(d => d.value)) || 1;
    }
  }

  export(format: 'pdf' | 'excel'): void {
    const id = this.route.snapshot.params['id'];
    this.toast.success(`A preparar o seu ficheiro ${format.toUpperCase()}...`);
    
    this.explorerService.exportData(id, format).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.resource?.title || 'Relatorio'}_${new Date().getTime()}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.toast.success('Documento gerado com sucesso!');
      },
      error: () => this.toast.error(`Erro ao gerar o ficheiro ${format.toUpperCase()}`)
    });
  }
}
