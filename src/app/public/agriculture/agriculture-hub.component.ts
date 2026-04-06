import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';
import { ToastService } from '../../services/toast.service';
import { API_BASE } from '../../api-config';

@Component({
  selector: 'app-agriculture-hub',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <!-- Hero Header using the slider pattern -->
    <div class="home-slider" style="height: 48vh; min-height: 400px;">
      <div class="slides-container">
        <div class="slide active" style="background-image: linear-gradient(135deg, rgba(8, 25, 18, 0.9) 0%, rgba(18, 51, 38, 0.75) 50%, rgba(0, 0, 0, 0.85) 100%), url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop'); background-position: center;">
          <div class="slide-content anim-up">
            <h1 class="hero-title text-6xl md:text-8xl mb-6">Extensão <br> <span class="text-accent">Agrícola e Rural</span></h1>
            <p class="hero-subtitle mb-8 max-w-2xl mx-auto">Assistência técnica de proximidade, boas práticas produtivas e soberania alimentar para a Guiné-Bissau.</p>
            
            <div class="premium-glass-card" style="display: inline-flex; align-items: center; gap: 20px; padding: 15px 35px; border-radius: 50px; background: rgba(255,255,255,0.1); backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 8px 32px rgba(0,0,0,0.3);">
               <span style="font-size: 2rem;">🌧️</span>
               <div style="text-align: left;">
                  <span style="display: block; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1.5px; color: #a7f3d0; font-weight: 800;">Época Sazonal Atual</span>
                  <span style="display: block; font-size: 1.3rem; font-weight: 800; color: #fff;">Chuvas / Preparação</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats using the action blocks pattern -->
    <section class="container" style="margin-top: -60px; position: relative; z-index: 10;">
      <div class="grid-4" style="gap: 20px;">
        <div class="action-card anim-up" style="background: var(--bg-card); color: var(--text-dark); border: 1px solid var(--border-color); border-radius: 12px; box-shadow: 0 6px 25px rgba(0,0,0,0.06); display: flex; flex-direction: column; justify-content: center; min-height: 150px;">
           <span style="font-size: 3rem; font-weight: 800; color: var(--primary);">{{ stats.produtores }}k</span>
           <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--ink-muted); margin-top: 5px;">Produtores Assistidos</span>
        </div>
        <div class="action-card anim-up" style="background: var(--bg-card); color: var(--text-dark); border: 1px solid var(--border-color); border-radius: 12px; box-shadow: 0 6px 25px rgba(0,0,0,0.06); display: flex; flex-direction: column; justify-content: center; min-height: 150px; animation-delay: 0.1s;">
           <span style="font-size: 3rem; font-weight: 800; color: #0284c7;">{{ stats.campanhas }}</span>
           <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--ink-muted); margin-top: 5px;">Campanhas MAB</span>
        </div>
        <div class="action-card anim-up" style="background: var(--bg-card); color: var(--text-dark); border: 1px solid var(--border-color); border-radius: 12px; box-shadow: 0 6px 25px rgba(0,0,0,0.06); display: flex; flex-direction: column; justify-content: center; min-height: 150px; animation-delay: 0.2s;">
           <span style="font-size: 3rem; font-weight: 800; color: #d97706;">{{ stats.visitas }}</span>
           <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--ink-muted); margin-top: 5px;">Apoios no Terreno</span>
        </div>
        <div class="action-card anim-up" style="background: var(--bg-card); color: var(--text-dark); border: 1px solid var(--border-color); border-radius: 12px; box-shadow: 0 6px 25px rgba(0,0,0,0.06); display: flex; flex-direction: column; justify-content: center; min-height: 150px; animation-delay: 0.3s;">
           <span style="font-size: 3rem; font-weight: 800; color: #ca8a04;">{{ stats.sucesso }}%</span>
           <span style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--ink-muted); margin-top: 5px;">Eficiência no Foco</span>
        </div>
      </div>
    </section>

    <!-- Navigation Tabs -->
    <div class="container anim-up" style="margin-top: 60px; animation-delay: 0.4s;">
       <div style="display: flex; gap: 30px; border-bottom: 2px solid var(--border-color); padding-bottom: 20px; overflow-x: auto;">
          <button (click)="activeTab = 'campanhas'" [style.color]="activeTab === 'campanhas' ? 'var(--primary)' : 'var(--ink-muted)'" [style.border-bottom]="activeTab === 'campanhas' ? '3px solid var(--primary)' : 'none'" style="background: none; border: none; font-size: 1.15rem; font-weight: 700; cursor: pointer; padding-bottom: 15px; margin-bottom: -22px; transition: 0.2s;">📢 Campanhas e Avisos</button>
          <button (click)="activeTab = 'guias'" [style.color]="activeTab === 'guias' ? 'var(--primary)' : 'var(--ink-muted)'" [style.border-bottom]="activeTab === 'guias' ? '3px solid var(--primary)' : 'none'" style="background: none; border: none; font-size: 1.15rem; font-weight: 700; cursor: pointer; padding-bottom: 15px; margin-bottom: -22px; transition: 0.2s;">📚 Guias Técnicos</button>
          <button (click)="activeTab = 'apoio'" [style.color]="activeTab === 'apoio' ? 'var(--primary)' : 'var(--ink-muted)'" [style.border-bottom]="activeTab === 'apoio' ? '3px solid var(--primary)' : 'none'" style="background: none; border: none; font-size: 1.15rem; font-weight: 700; cursor: pointer; padding-bottom: 15px; margin-bottom: -22px; transition: 0.2s;">🤝 Solicitar Apoio Local</button>
       </div>
    </div>

    <!-- Main Content -->
    <section class="container" style="margin: 60px auto; min-height: 500px;">
      
      <!-- TAB: Campanhas & Guias -->
      <div *ngIf="activeTab === 'campanhas' || activeTab === 'guias'" class="anim-up">
        <div class="section-headline" style="margin-bottom: 40px;">
          <div>
            <span class="section-kicker">{{ activeTab === 'campanhas' ? 'Alertas Formais' : 'Conhecimento Oficial' }}</span>
            <h2 class="section-title">{{ activeTab === 'campanhas' ? 'Campanhas em Curso' : 'Biblioteca Agrícola' }}</h2>
          </div>
        </div>

        <div *ngIf="loading" style="text-align: center; padding: 60px;">
           <p style="color: var(--ink-muted); font-weight: 700;">A carregar atualizações técnicas...</p>
        </div>

        <div class="grid-3" *ngIf="!loading && getCurrentPosts().length > 0">
          <article class="impeccable-card" *ngFor="let post of getCurrentPosts()">
            <img [src]="post.featured_image || 'https://images.unsplash.com/photo-1592982537447-6f2c6c10b0a8?q=80&w=2070&auto=format&fit=crop'" class="card-img" alt="Post">
            <div class="card-content">
              <span class="status-pill" [style.background]="activeTab === 'campanhas' ? 'rgba(217,119,6,0.1)' : 'rgba(2,132,199,0.1)'" [style.color]="activeTab === 'campanhas' ? '#d97706' : '#0284c7'" style="font-size: 0.70rem; padding: 4px 10px; border-radius: 99px; margin-bottom: 12px; display: inline-block; font-weight: 800; text-transform: uppercase;">{{ post.document_label || 'Técnico' }}</span>
              <h4 style="font-size: 1.25rem; margin-bottom: 10px; font-weight: 800; line-height: 1.3; color: var(--ink-dark);">{{ post.title }}</h4>
              <p style="font-size: 0.95rem; line-height: 1.6; color: var(--ink-muted); margin-bottom: 25px;">{{ post.excerpt }}</p>
              
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 15px;">
                  <span style="font-size: 0.8rem; color: var(--ink-muted); font-weight: 700;">⏱️ {{ post.created_at | date }}</span>
                  <a [href]="post.document_file || '#'" target="_blank" class="btn outline sm">Ler Artigo 📄</a>
              </div>
            </div>
          </article>
        </div>

        <div *ngIf="!loading && getCurrentPosts().length === 0" style="text-align: center; padding: 80px 20px; background: var(--bg-card); border-radius: 20px; border: 1px dashed var(--border-color);">
           <span style="font-size: 3.5rem; margin-bottom: 15px; display: block; filter: grayscale(1); opacity: 0.5;">🌾</span>
           <h3 style="font-size: 1.3rem; font-weight: 800; color: var(--ink-dark); margin-bottom: 10px;">Sem publicações atuais nesta secção</h3>
           <p style="color: var(--ink-muted); font-size: 1rem; margin: 0;">Fique atento às próximas atualizações da Direção Nacional de Agricultura.</p>
        </div>
      </div>

      <!-- TAB: Apoio Técnico (Form) -->
      <div *ngIf="activeTab === 'apoio'" class="anim-up">
         <div class="module-row" style="background: var(--bg-card); padding: 50px; border-radius: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.05); border: 1px solid var(--border-color); max-width: 850px; margin: 0 auto; display: block;">
            
            <div style="display: flex; gap: 25px; margin-bottom: 40px; align-items: flex-start;">
               <div style="width: 70px; height: 70px; background: linear-gradient(135deg, rgba(217,119,6,0.15), rgba(22,163,74,0.15)); border: 1px solid rgba(22,163,74,0.2); border-radius: 16px; display: flex; justify-content: center; align-items: center; font-size: 2rem; flex-shrink: 0;">🤝</div>
               <div>
                  <h2 style="font-size: 2.2rem; font-weight: 800; margin-bottom: 8px; color: var(--ink-dark); letter-spacing: -0.5px;">Serviço Direto de Extensão</h2>
                  <p style="color: var(--ink-muted); font-size: 1.05rem; line-height: 1.6; margin: 0;">Preencha o formulário institucional para solicitar a deslocação gratuita de um técnico ou engenheiro agrónomo à sua exploração agrícola.</p>
               </div>
            </div>

            <div *ngIf="successMessage" class="anim-up" style="background: rgba(22,163,74,0.1); padding: 35px; border-radius: 16px; border: 1px solid rgba(22,163,74,0.3); margin-bottom: 30px; display: flex; gap: 25px; align-items: center;">
               <span style="font-size: 3.5rem;">✅</span>
               <div>
                  <h3 style="margin: 0 0 8px 0; font-size: 1.4rem; font-weight: 800; color: #166534;">Pedido de Assistência Confirmado!</h3>
                  <p style="margin: 0; font-size: 1rem; color: #166534; line-height: 1.6;">O seu caso foi reencaminhado para a triagem técnica. Deverá ser contactado no prazo legal de 48h. Proc. Oficial: <strong style="color: #000;">EXT-{{ mathRandom() }}</strong></p>
               </div>
            </div>

            <form (ngSubmit)="submitSupport()" *ngIf="!successMessage" style="margin-top: 10px;">
               <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
                  <div>
                    <label style="display: block; font-weight: 800; margin-bottom: 12px; font-size: 0.8rem; letter-spacing: 0.5px; color: var(--ink-muted); text-transform: uppercase;">Entidade / Produtor</label>
                    <input type="text" [(ngModel)]="formData.nome" name="nome" required style="width: 100%; padding: 18px 20px; border: 1px solid var(--border-color); border-radius: 12px; font-size: 1.05rem; background: var(--bg-body); transition: 0.2s; outline: none;">
                  </div>
                  <div>
                    <label style="display: block; font-weight: 800; margin-bottom: 12px; font-size: 0.8rem; letter-spacing: 0.5px; color: var(--ink-muted); text-transform: uppercase;">Número de Telemóvel</label>
                    <input type="text" [(ngModel)]="formData.telefone" name="telefone" required style="width: 100%; padding: 18px 20px; border: 1px solid var(--border-color); border-radius: 12px; font-size: 1.05rem; background: var(--bg-body); transition: 0.2s; outline: none;">
                  </div>
               </div>

               <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
                  <div>
                    <label style="display: block; font-weight: 800; margin-bottom: 12px; font-size: 0.8rem; letter-spacing: 0.5px; color: var(--ink-muted); text-transform: uppercase;">Morada Exata / Setor</label>
                    <input type="text" [(ngModel)]="formData.localizacao" name="localizacao" required style="width: 100%; padding: 18px 20px; border: 1px solid var(--border-color); border-radius: 12px; font-size: 1.05rem; background: var(--bg-body); transition: 0.2s; outline: none;">
                  </div>
                  <div>
                    <label style="display: block; font-weight: 800; margin-bottom: 12px; font-size: 0.8rem; letter-spacing: 0.5px; color: var(--ink-muted); text-transform: uppercase;">Área de Cultura Focada</label>
                    <input type="text" [(ngModel)]="formData.cultura" name="cultura" required style="width: 100%; padding: 18px 20px; border: 1px solid var(--border-color); border-radius: 12px; font-size: 1.05rem; background: var(--bg-body); transition: 0.2s; outline: none;" placeholder="Ex: Arroz, Caju">
                  </div>
               </div>

               <div style="margin-bottom: 35px;">
                  <label style="display: block; font-weight: 800; margin-bottom: 12px; font-size: 0.8rem; letter-spacing: 0.5px; color: var(--ink-muted); text-transform: uppercase;">Motivo da Apreciação / Diagnóstico</label>
                  <textarea [(ngModel)]="formData.descricao" name="descricao" rows="5" required style="width: 100%; padding: 18px 20px; border: 1px solid var(--border-color); border-radius: 12px; font-size: 1.05rem; background: var(--bg-body); resize: none; transition: 0.2s; outline: none;" placeholder="Descreva de forma clara o que está a afetar a sua plantação ou as dúvidas técnicas que pretende resolver no local."></textarea>
               </div>

               <div style="background: rgba(217,119,6,0.08); padding: 18px 25px; border-radius: 12px; border: 1px solid rgba(217,119,6,0.2); margin-bottom: 35px; display: flex; gap: 15px; align-items: center;">
                  <span style="font-size: 1.4rem;">🚜</span>
                  <p style="margin: 0; font-size: 0.9rem; color: var(--ink-dark); line-height: 1.5;">O serviço consultivo da Direção Nacional de Agricultura é gratuito e integrado na estratégia nacional de soberania alimentar.</p>
               </div>

               <button type="submit" class="btn primary lg" style="width: 100%; justify-content: center; font-size: 1.15rem; font-weight: 800; padding: 22px; border-radius: 16px; box-shadow: 0 10px 25px rgba(22,163,74,0.3);" [disabled]="isSubmitting">
                  {{ isSubmitting ? 'A encaminhar protocolo...' : 'Submeter Requerimento de Apoio Agrícola' }}
               </button>
            </form>
         </div>
      </div>
    </section>
  `,
  styles: [`
    .anim-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(20px); }
    @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
    input:focus, textarea:focus { border-color: var(--primary) !important; box-shadow: 0 0 0 3px rgba(22,163,74,0.1) !important; }
  `]
})
export class AgricultureHubComponent implements OnInit {
  posts: any[] = [];
  activeTab: 'campanhas' | 'guias' | 'apoio' = 'campanhas';
  loading = true;
  
  // Animated Stats
  stats = { produtores: 0, campanhas: 0, visitas: 0, sucesso: 0 };
  
  formData = { nome: '', telefone: '', localizacao: '', cultura: '', descricao: '' };
  isSubmitting = false;
  successMessage = false;

  constructor(
    private http: HttpClient, 
    private settingsService: SettingsService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.settingsService.getSettings().subscribe({
      next: settings => {
        const s = settings.agriculture_hub_stats;
        const targets = {
          produtores: s?.value1 !== undefined ? Number(s.value1) : 4.8,
          campanhas: s?.value2 !== undefined ? Number(s.value2) : 12,
          visitas: s?.value3 !== undefined ? Number(s.value3) : 1450,
          sucesso: s?.value4 !== undefined ? Number(s.value4) : 94,
        };
        this.animateStats(targets);
      },
      error: () => console.warn('Could not load hub stats')
    });

    this.http.get<any[]>(`${API_BASE}/posts?category=extensao-agricola&t=${new Date().getTime()}`).subscribe({
      next: (res) => {
        this.posts = res;
        this.loading = false;
      },
      error: () => {
        this.posts = [];
        this.loading = false;
      }
    });
  }

  animateStats(targets: { produtores: number; campanhas: number; visitas: number; sucesso: number }) {
    let step = 0;
    const interval = setInterval(() => {
      if (step < 20) {
        this.stats.produtores = Number(((targets.produtores / 20) * step).toFixed(1));
        this.stats.campanhas = Math.round((targets.campanhas / 20) * step);
        this.stats.visitas = Math.round((targets.visitas / 20) * step);
        this.stats.sucesso = Math.round((targets.sucesso / 20) * step);
        step++;
      } else {
        clearInterval(interval);
        this.stats = targets;
      }
    }, 40);
  }

  getPostsByLabel(label: string): any[] {
    return this.posts.filter(p => (p.document_label || '').toLowerCase().includes(label.toLowerCase()));
  }

  getCurrentPosts(): any[] {
    if (this.activeTab === 'campanhas') return this.getPostsByLabel('Campanha');
    if (this.activeTab === 'guias') return this.getPostsByLabel('Guia');
    return [];
  }

  mathRandom() {
    return Math.floor(1000 + Math.random() * 9000);
  }

  submitSupport() {
    if (!this.formData.nome || !this.formData.descricao || !this.formData.telefone) return;
    
    this.isSubmitting = true;
    
    const ocorrenciaData = {
      titulo: `Pedido de Apoio: ${this.formData.cultura} - ${this.formData.nome}`,
      descricao: `Contato: ${this.formData.telefone}\nCultura: ${this.formData.cultura}\n\nDescrição do Problema:\n${this.formData.descricao}`,
      tipo: 'apoio_tecnico',
      gravidade: 'media',
      status: 'pendente',
      localizacao: this.formData.localizacao
    };

    this.http.post(`${API_BASE}/ocorrencias/public`, ocorrenciaData).subscribe({
      next: () => {
        setTimeout(() => { // Simulando delay de processamento para UX
          this.isSubmitting = false;
          this.successMessage = true;
        }, 1200);
      },
      error: () => {
        this.isSubmitting = false;
        this.toast.error('Ocorreu um erro ao submeter o pedido. Verifique a ligação e tente novamente.');
      }
    });
  }
}
