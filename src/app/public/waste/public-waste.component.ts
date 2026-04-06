import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WasteService, WasteStat } from '../../services/waste.service';

@Component({
  standalone: true,
  selector: 'app-public-waste',
  imports: [CommonModule],
  template: `
    <div class="public-waste-portal anim-up">
      <!-- Header Section -->
      <section class="public-hero" style="background-image: linear-gradient(135deg, rgba(6, 38, 29, 0.92) 0%, rgba(13, 61, 48, 0.8) 50%, rgba(0, 0, 0, 0.9) 100%), url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop')">
        <div class="hero-bg"></div>
        <div class="hero-content text-center">
          <div class="section-kicker" style="color: var(--accent); background: rgba(255,255,255,0.05); border: 1px solid rgba(234, 179, 8, 0.3); display: inline-block; margin-bottom: 20px; font-weight: 900;">Monitorização Ambiental</div>
          <h1 class="hero-title text-6xl md:text-8xl mb-6">Transparência na <span class="text-accent">Gestão de Resíduos</span></h1>
          <p class="hero-subtitle max-w-3xl mx-auto">
            Acompanhe em tempo real os indicadores de produção e reciclagem do Ministério do Ambiente. 
            Promovemos a economia circular para uma Guiné-Bissau mais sustentável.
          </p>
        </div>
      </section>

      <div class="container" style="margin-top: -80px; position: relative; z-index: 10; padding-bottom: 80px;">
        <!-- Main Stats Summary -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8" *ngIf="!loading">
          <div class="glass-card p-8 rounded-2xl flex flex-col items-center text-center">
            <div class="icon-circle mb-4 text-3xl">♻️</div>
            <div class="text-3xl font-black text-brand">{{ recyclingRate | number:'1.0-0' }}%</div>
            <div class="text-xs uppercase font-extrabold tracking-widest muted">Taxa de Reciclagem</div>
          </div>
          
          <div class="glass-card p-8 rounded-2xl flex flex-col items-center text-center border-b-8 border-accent">
            <div class="icon-circle mb-4 text-3xl">📊</div>
            <div class="text-3xl font-black text-brand">{{ totalQuantity | number:'1.0-2' }}</div>
            <div class="text-xs uppercase font-extrabold tracking-widest muted">Total Processado (kg)</div>
          </div>

          <div class="glass-card p-8 rounded-2xl flex flex-col items-center text-center">
            <div class="icon-circle mb-4 text-3xl">🚛</div>
            <div class="text-3xl font-black text-brand">{{ stats.length }}</div>
            <div class="text-xs uppercase font-extrabold tracking-widest muted">Categorias Monitorizadas</div>
          </div>
        </div>

        <div *ngIf="loading" class="text-center py-20 bg-white rounded-2xl shadow-sm">
          <div class="spinner mx-auto mb-4"></div>
          <p class="muted">A carregar indicadores...</p>
        </div>

        <!-- Detailed Categories -->
        <div class="mt-20" *ngIf="!loading">
          <div class="section-header mb-12 text-center">
            <h2 class="section-title">Produção por Categoria</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div *ngFor="let stat of stats" class="impeccable-card">
              <div class="card-content p-6">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <span class="tag bg-gray-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{{ stat.category }}</span>
                    <h4 class="mt-2 text-2xl font-bold">{{ stat.total | number:'1.0-2' }} <small class="text-sm font-normal text-gray-400">kg</small></h4>
                  </div>
                  <div class="category-icon text-3xl opacity-40">{{ getIcon(stat.category) }}</div>
                </div>
                
                <div class="progress-wrapper mt-6">
                  <div class="flex justify-between text-xs mb-2">
                    <span class="muted">Impacto no Total MAB</span>
                    <span class="font-bold">{{ getPercentage(stat.total) | number:'1.0-1' }}%</span>
                  </div>
                  <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-1000" 
                         [style.width.%]="getPercentage(stat.total)"
                         [style.background]="getCategoryColor(stat.category)">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Call to Action / Info -->
        <div class="mt-32 p-12 rounded-3xl bg-brand text-white overflow-hidden relative" *ngIf="!loading">
          <div class="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
            <span style="font-size: 20rem;">♻️</span>
          </div>
          <div class="relative z-10 max-w-2xl text-left">
            <h3 class="text-white text-4xl mb-6 italic font-serif">Rumo ao Lixo Zero</h3>
            <p class="text-xl opacity-90 mb-8 leading-relaxed">
              O nosso compromisso é reduzir a produção de resíduos não recicláveis em 30% até o final de 2026. 
              Através do SIRE, garantimos que cada grama de resíduo é rastreado desde a origem até ao seu destino final ambientalmente correto.
            </p>
            <button class="btn secondary px-8 py-4 font-bold rounded-xl bg-white text-brand hover:bg-gray-100 transition-colors">Saiba mais sobre o SIRE</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .public-waste-portal { min-height: 100vh; background: #f8fafc; }
    .public-hero { height: 600px; display: flex; align-items: center; justify-content: center; background-size: cover; background-position: center; position: relative; padding-bottom: 80px; }
    .hero-bg { position: absolute; inset: 0; z-index: 1; }
    .hero-content { position: relative; z-index: 2; color: white; }
    .icon-circle { width: 64px; height: 64px; background: rgba(59, 130, 246, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
    .text-brand { color: #1e293b; }
    .fraunces { font-family: 'Fraunces', serif; }
    .glass-card { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.4); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
  `]
})
export class PublicWasteComponent implements OnInit {
  stats: WasteStat[] = [];
  loading = true;
  totalQuantity = 0;
  recyclingRate = 0;

  constructor(private wasteService: WasteService) {}

  ngOnInit(): void {
    this.wasteService.getStats().subscribe({
      next: (res: WasteStat[]) => {
        this.stats = res;
        this.totalQuantity = res.reduce((acc: number, curr: WasteStat) => acc + Number(curr.total), 0);
        this.calculateRecyclingRate();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  calculateRecyclingRate(): void {
    const recyclable = this.stats.filter(s => 
      s.category.toLowerCase().includes('reciclavel') || 
      s.category.toLowerCase().includes('organico')
    ).reduce((acc, curr) => acc + Number(curr.total), 0);
    
    this.recyclingRate = this.totalQuantity > 0 ? (recyclable / this.totalQuantity) * 100 : 0;
  }

  getPercentage(total: number): number {
    if (this.totalQuantity === 0) return 0;
    return (total / this.totalQuantity) * 100;
  }

  getIcon(category: string): string {
    const cat = category.toLowerCase();
    if (cat.includes('perigoso')) return '☣️';
    if (cat.includes('reciclavel')) return '♻️';
    if (cat.includes('organico')) return '🍎';
    if (cat.includes('construcao')) return '🏗️';
    if (cat.includes('e-waste')) return '💻';
    return '📦';
  }

  getCategoryColor(category: string): string {
    const cat = category.toLowerCase();
    if (cat.includes('perigoso')) return '#ef4444';
    if (cat.includes('reciclavel')) return '#22c55e';
    if (cat.includes('organico')) return '#eab308';
    if (cat.includes('construcao')) return '#f97316';
    if (cat.includes('e-waste')) return '#06b6d4';
    return '#64748b';
  }
}
