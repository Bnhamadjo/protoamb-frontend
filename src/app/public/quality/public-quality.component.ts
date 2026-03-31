import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnvironmentalService, EnvironmentalMetric, QualityStats } from '../../services/environmental.service';

@Component({
  standalone: true,
  selector: 'app-public-quality',
  imports: [CommonModule],
  template: `
    <div class="public-quality-container anim-up">
      <!-- Hero Section Premium -->
      <section class="hero-section m-6 p-12 rounded-[40px] relative overflow-hidden shadow-2xl">
        <!-- Animated Background Elements -->
        <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/20 blur-[120px] rounded-full -mr-48 -mt-48 animate-pulse"></div>
        <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/20 blur-[100px] rounded-full -ml-32 -mb-32"></div>
        
        <div class="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div class="text-content flex-1 text-center md:text-left">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 group cursor-default">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span class="text-[10px] font-black uppercase tracking-[3px] text-white/80">Dados em Tempo Real</span>
            </div>
            
            <h1 class="text-6xl md:text-8xl font-black text-white leading-[1.1] mb-8 drop-shadow-2xl">
              Monitorização <br>
              <span class="text-emerald-400 drop-shadow-[0_0_30px_rgba(52,211,153,0.3)]">Qualidade Ambiental</span>
            </h1>
            
            <p class="text-xl md:text-2xl text-white/95 max-w-2xl leading-relaxed font-semibold drop-shadow-lg">
              Transparência e dados precisos sobre o ecossistema da <span class="text-white border-b-4 border-emerald-500/50">Guiné-Bissau</span>. 
              Acompanhe a saúde do nosso ar, água e solo.
            </p>
          </div>

          <!-- Quick Pulse Info -->
          <div class="pulse-info hidden lg:flex flex-col gap-6 ml-auto">
            <div class="glass-pill p-5 flex items-center gap-5 border border-white/20 rounded-3xl min-w-[280px]">
              <div class="w-14 h-14 rounded-2xl bg-emerald-500/30 flex items-center justify-center text-3xl shadow-inner">🌬️</div>
              <div>
                <div class="text-xs uppercase font-black text-emerald-400 tracking-widest mb-1">Qualidade do Ar</div>
                <div class="text-xl font-black text-white">Excelente</div>
                <div class="text-[10px] text-white/50">Estação Bissau Central</div>
              </div>
            </div>
            
            <div class="glass-pill p-5 flex items-center gap-5 border border-white/20 rounded-3xl min-w-[280px]">
              <div class="w-14 h-14 rounded-2xl bg-blue-500/30 flex items-center justify-center text-3xl shadow-inner">💧</div>
              <div>
                <div class="text-xs uppercase font-black text-blue-400 tracking-widest mb-1">Recursos Hídricos</div>
                <div class="text-xl font-black text-white">Nível Ideal</div>
                <div class="text-[10px] text-white/50">Rio Geba / Monitorização</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Dashboard -->
      <div class="dashboard-grid px-6 pb-20">
        
        <!-- Air Quality Card -->
        <div class="impeccable-card glass-card p-8 group">
          <div class="flex justify-between items-start mb-8">
            <div>
              <h3 class="text-xl font-bold text-slate-800">🌬️ Qualidade do Ar</h3>
              <p class="text-sm text-slate-500">Índice de Pureza Atmosférica</p>
            </div>
            <span class="status-pill normal">Excelente</span>
          </div>
          
          <div class="metrics-stack space-y-6">
            <div *ngFor="let m of getMetricsByType('air')" class="metric-row">
              <div class="flex justify-between mb-2">
                <span class="text-sm font-semibold text-slate-600">{{ m.parameter }}</span>
                <span class="text-sm font-bold text-blue-600">{{ m.value }} {{ m.unit }}</span>
              </div>
              <div class="progress-bg h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div class="progress-fill h-full bg-blue-500 rounded-full transition-all duration-1000" [style.width.%]="getValuePercentage(m)"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Water Quality Card -->
        <div class="impeccable-card glass-card p-8 group">
          <div class="flex justify-between items-start mb-8">
            <div>
              <h3 class="text-xl font-bold text-slate-800">💧 Recursos Hídricos</h3>
              <p class="text-sm text-slate-500">Parâmetros de Potabilidade e Rios</p>
            </div>
            <span class="status-pill normal">Estável</span>
          </div>

          <div class="metrics-stack space-y-6">
            <div *ngFor="let m of getMetricsByType('water')" class="metric-row">
              <div class="flex justify-between mb-2">
                <span class="text-sm font-semibold text-slate-600">{{ m.parameter }}</span>
                <span class="text-sm font-bold text-emerald-600">{{ m.value }} {{ m.unit }}</span>
              </div>
              <div class="progress-bg h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div class="progress-fill h-full bg-emerald-500 rounded-full transition-all duration-1000" [style.width.%]="getValuePercentage(m)"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Climate Card -->
        <div class="impeccable-card glass-card p-8 group md:col-span-2 lg:col-span-1">
          <div class="flex justify-between items-start mb-8">
            <div>
              <h3 class="text-xl font-bold text-slate-800">🌡️ Clima Local</h3>
              <p class="text-sm text-slate-500">Estações Meteorológicas</p>
            </div>
            <span class="text-xs font-bold uppercase tracking-widest text-slate-400">Live</span>
          </div>

          <div class="climate-display grid grid-cols-2 gap-6">
             <div *ngFor="let m of getMetricsByType('climate')" class="climate-item p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50 flex flex-col items-center justify-center text-center">
                <span class="text-xs font-bold text-slate-400 uppercase mb-2">{{ m.parameter }}</span>
                <span class="text-2xl font-black text-slate-800">{{ m.value }}<span class="text-sm font-medium opacity-50 ml-0.5">{{ m.unit }}</span></span>
             </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .public-quality-container { min-height: 100vh; background: #f8fafc; }
    
    .hero-section {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.4);
      position: relative;
      color: white !important;
    }

    .hero-section h1, 
    .hero-section p,
    .hero-section span {
      color: white !important;
    }

    .hero-section .text-emerald-400 {
      color: #34d399 !important;
    }

    .hero-section::before {
      content: ''; position: absolute; inset: 0;
      background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0);
      background-size: 30px 30px;
      z-index: 1;
    }

    .glass-pill {
      background: rgba(255, 255, 255, 0.1) !important;
      backdrop-filter: blur(20px);
      box-shadow: 0 10px 30px -10px rgba(0,0,0,0.3);
      transition: all 0.3s ease;
      color: white !important;
    }
    .glass-pill:hover { background: rgba(255, 255, 255, 0.2) !important; transform: translateX(10px); }
    
    .glass-pill div { color: white !important; }
    .glass-pill .text-emerald-400 { color: #34d399 !important; }
    .glass-pill .text-blue-400 { color: #60a5fa !important; }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
    }

    .glass-card {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.5);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .glass-card:hover { transform: translateY(-10px); box-shadow: 0 30px 60px -15px rgba(0,0,0,0.1); }

    .status-pill { padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; }
    .status-pill.normal { background: #dcfce7; color: #15803d; }

    .progress-fill { position: relative; }
    .progress-fill::after {
      content: ''; position: absolute; top: 0; right: 0; bottom: 0; left: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
      animation: sweep 2s infinite linear;
    }

    @keyframes sweep { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }

    .climate-item { transition: all 0.3s; }
    .climate-item:hover { background: white; border-color: #3b82f6; box-shadow: 0 10px 20px -5px rgba(59,130,246,0.1); }
  `]
})
export class PublicQualityComponent implements OnInit {
  metrics: EnvironmentalMetric[] = [];
  stats?: QualityStats;

  constructor(private envService: EnvironmentalService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.envService.getStats().subscribe({
      next: (res) => {
        this.stats = res;
        this.metrics = res.latest;
      }
    });
  }

  getMetricsByType(type: string): EnvironmentalMetric[] {
    return this.metrics.filter(m => m.type === type);
  }

  getValuePercentage(m: EnvironmentalMetric): number {
    // Basic logic for visual representation
    if (m.parameter === 'CO2') return Math.min((m.value / 1000) * 100, 100);
    if (m.parameter === 'pH') return (m.value / 14) * 100;
    if (m.parameter.includes('PM')) return Math.min((m.value / 100) * 100, 100);
    return Math.min((m.value / 100) * 100, 100);
  }
}
