import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../../services/settings.service';
import { API_BASE } from '../../api-config';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-interdepartmental-hub',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Hero Header -->
    <div class="home-slider" style="height: 50vh; min-height: 450px;">
      <div class="slides-container">
        <div class="slide active" style="background-image: linear-gradient(135deg, rgba(8, 25, 18, 0.9) 0%, rgba(18, 51, 38, 0.75) 50%, rgba(0, 0, 0, 0.85) 100%), url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop'); background-position: center;">
          <div class="slide-content anim-up">
            <span class="section-kicker" style="color: #a7f3d0; margin-bottom: 15px; display: block;">Governação Digital</span>
            <h1 class="logo-text" style="font-size: clamp(2rem, 5vw, 3.5rem); line-height: 1.1; color: #fff !important; text-shadow: 0 2px 15px rgba(0,0,0,0.5);">Gestão Interdepartamental</h1>
            <p class="subtitle" style="max-width: 850px; margin: 0 auto 35px auto; font-size: 1.2rem; opacity: 0.95; color: rgba(255,255,255,0.9) !important; text-shadow: 0 1px 5px rgba(0,0,0,0.3);">
              Hub de integração ministerial para coordenação de projetos transversais, 
              partilha de recursos técnicos e monitorização unificada das metas do Estado.
            </p>
            
            <div class="premium-glass-card" style="display: inline-flex; align-items: center; gap: 20px; padding: 15px 35px; border-radius: 50px; background: rgba(255,255,255,0.05); backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.2);">
               <span style="font-size: 1.8rem;">🏛️</span>
               <div style="text-align: left;">
                  <span style="display: block; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 2px; color: #a7f3d0; font-weight: 800;">Estado da Plataforma</span>
                  <span style="display: block; font-size: 1.2rem; font-weight: 800; color: #fff;">Integração Total Ativa</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Integration Stats -->
    <section class="container" style="margin-top: -60px; position: relative; z-index: 10;">
      <div class="grid-4" style="gap: 20px;">
        <div class="action-card anim-up" style="background: #fff; padding: 30px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); text-align: center; border: 1px solid rgba(0,0,0,0.05);">
           <span style="font-size: 2.8rem; font-weight: 800; color: #166534; display: block;">{{ activeDepartments }}</span>
           <span style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: #64748b; margin-top: 10px; display: block; letter-spacing: 1px;">Direções Ativas</span>
        </div>
        <div class="action-card anim-up" style="background: #fff; padding: 30px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); text-align: center; border: 1px solid rgba(0,0,0,0.05); animation-delay: 0.1s;">
           <span style="font-size: 2.8rem; font-weight: 800; color: #0369a1; display: block;">24/7</span>
           <span style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: #64748b; margin-top: 10px; display: block; letter-spacing: 1px;">Sincronização</span>
        </div>
        <div class="action-card anim-up" style="background: #fff; padding: 30px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); text-align: center; border: 1px solid rgba(0,0,0,0.05); animation-delay: 0.2s;">
           <span style="font-size: 2.8rem; font-weight: 800; color: #b45309; display: block;">100%</span>
           <span style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: #64748b; margin-top: 10px; display: block; letter-spacing: 1px;">Nuvem Estatal</span>
        </div>
        <div class="action-card anim-up" style="background: #fff; padding: 30px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); text-align: center; border: 1px solid rgba(0,0,0,0.05); animation-delay: 0.3s;">
           <span style="font-size: 2.8rem; font-weight: 800; color: #7c3aed; display: block;">🔒</span>
           <span style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: #64748b; margin-top: 10px; display: block; letter-spacing: 1px;">Segurança Dados</span>
        </div>
      </div>
    </section>

    <!-- Main Navigation Hub -->
    <section class="container section-space" style="margin: 100px auto;">
      <div class="section-headline">
        <div class="reveal-up">
          <span class="section-kicker">Hubs de Operação</span>
          <h2 class="section-title">Central de Gestão Técnica</h2>
          <p class="muted" style="max-width: 600px; margin-top: 10px;">Interligação direta entre as unidades territoriais e as direções nacionais.</p>
        </div>
      </div>

      <div class="grid-3" style="gap: 25px; margin-top: 40px;">
        <a routerLink="/recursos-hidricos" class="hub-card anim-up">
          <div class="hub-icon water">💧</div>
          <div class="hub-info">
            <h3>Recursos Hídricos</h3>
            <p>Monitorização de bacias, qualidade da água e gestão de licenças de uso.</p>
            <span class="hub-link">Aceder Unidade -></span>
          </div>
        </a>

        <a routerLink="/extensao-agricola" class="hub-card anim-up" style="animation-delay: 0.1s;">
          <div class="hub-icon agri">🌾</div>
          <div class="hub-info">
            <h3>Extensão Agrícola</h3>
            <p>Coordenação de campanhas rurais e apoio direto ao produtor nacional.</p>
            <span class="hub-link">Aceder Unidade -></span>
          </div>
        </a>

        <a routerLink="/waste" class="hub-card anim-up" style="animation-delay: 0.2s;">
          <div class="hub-icon waste">♻️</div>
          <div class="hub-info">
            <h3>Gestão de Resíduos</h3>
            <p>Controlo de manifestos, operadores licenciados e fluxos de logística.</p>
            <span class="hub-link">Aceder Unidade -></span>
          </div>
        </a>

        <a routerLink="/ocorrencias" class="hub-card anim-up" style="animation-delay: 0.3s;">
          <div class="hub-icon inspect">🛡️</div>
          <div class="hub-info">
            <h3>Fiscalização e Inspeção</h3>
            <p>Gestão de equipas de campo, ocorrências e autos de notícia ambientais.</p>
            <span class="hub-link">Aceder Unidade -></span>
          </div>
        </a>

        <a routerLink="/biodiversity" class="hub-card anim-up" style="animation-delay: 0.4s;">
          <div class="hub-icon bio">🌳</div>
          <div class="hub-info">
            <h3>Biodiversidade</h3>
            <p>Inventário de fauna e flora e gestão de áreas protegidas do Estado.</p>
            <span class="hub-link">Aceder Unidade -></span>
          </div>
        </a>

        <a routerLink="/biblioteca-legal" class="hub-card anim-up" style="animation-delay: 0.5s;">
          <div class="hub-icon legal">📜</div>
          <div class="hub-info">
            <h3>Acervo Técnico-Legal</h3>
            <p>Base de dados de legislação, decretos e manuais técnicos do setor.</p>
            <span class="hub-link">Aceder Unidade -></span>
          </div>
        </a>
      </div>
    </section>

    <!-- Ministerial Policies Section -->
    <section class="policy-section" style="background: #f8fafc; padding: 100px 0; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
      <div class="container hero-grid" style="grid-template-columns: 1fr 1fr; gap: 60px; align-items: flex-start;">
        <div class="anim-up">
           <span class="section-kicker">Governação Ministerial</span>
           <h2 class="section-title" style="font-size: 2.8rem; margin-bottom: 25px;">Política de Dados Partilhados</h2>
           <p style="color: #64748b; font-size: 1.1rem; line-height: 1.8; margin-bottom: 30px;">
             A plataforma MAB garante que todos os departamentos operam sobre uma "Single Source of Truth". 
             Isto elimina redundâncias, acelera a tomada de decisão política e assegura que os cidadãos 
             recebem serviços integrados.
           </p>
           
           <ul style="list-style: none; padding: 0; margin-bottom: 40px;">
              <li style="margin-bottom: 15px; display: flex; gap: 12px; align-items: center; color: #334155; font-weight: 700;">
                 <span style="color: #16a34a;">✓</span> Interoperabilidade entre Agricultura e Ambiente
              </li>
              <li style="margin-bottom: 15px; display: flex; gap: 12px; align-items: center; color: #334155; font-weight: 700;">
                 <span style="color: #16a34a;">✓</span> Repositório unificado de Geoinformação
              </li>
              <li style="margin-bottom: 15px; display: flex; gap: 12px; align-items: center; color: #334155; font-weight: 700;">
                 <span style="color: #16a34a;">✓</span> Gestão centralizada de utilizadores e permissões
              </li>
           </ul>
           
           <a routerLink="/institucional" class="btn outline lg">Manual de Governança 📄</a>
        </div>
        
        <div class="premium-glass-card anim-up" style="background: #fff; padding: 40px; box-shadow: 0 20px 50px rgba(0,0,0,0.1); border: none; color: #1e293b; animation-delay: 0.3s; border-radius: 30px;">
           <h3 style="color: #1e293b; margin-bottom: 20px; font-weight: 800;">Central de Notificações</h3>
           <div class="activity-feed">
              <div class="activity-item">
                 <div class="activity-dot blue"></div>
                 <div class="activity-body">
                    <strong>Coordenação Waste/Hidricos</strong>
                    <p>Atualização de protocolo de descargas em bacias monitorizadas.</p>
                    <span class="time">Há 2 horas</span>
                 </div>
              </div>
              <div class="activity-item">
                 <div class="activity-dot green"></div>
                 <div class="activity-body">
                    <strong>Relatório de Biodiversidade</strong>
                    <p>Partilhado com Direção de Inspecção para missões em Bijagós.</p>
                    <span class="time">Ontem</span>
                 </div>
              </div>
              <div class="activity-item">
                 <div class="activity-dot orange"></div>
                 <div class="activity-body">
                    <strong>Novo Decreto Ministerial</strong>
                    <p>Publicado na Biblioteca Legal: Regras de Pesticidas 2024.</p>
                    <span class="time">Há 3 dias</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </section>

    <!-- Footer-style CTA -->
    <section class="container section-space anim-up" style="text-align: center; padding: 100px 0;">
       <h2 class="section-title" style="margin-bottom: 20px;">Dúvidas sobre Interoperabilidade?</h2>
       <p class="muted" style="max-width: 600px; margin: 0 auto 40px auto;">Consulte o suporte técnico da plataforma para saber como integrar um novo departamento ou serviço.</p>
       <a href="mailto:suporte@mab.gov" class="btn primary lg">Contactar Suporte IT</a>
    </section>
  `,
  styles: [`
    .hub-card {
      background: #fff;
      padding: 30px;
      border-radius: 20px;
      border: 1px solid #e2e8f0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      gap: 20px;
      align-items: flex-start;
      text-decoration: none;
      color: inherit;
    }
    .hub-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.06);
      border-color: #166534;
    }
    .hub-icon {
      width: 60px; height: 60px;
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.8rem;
      flex-shrink: 0;
      background: #f1f5f9;
    }
    .hub-icon.water { background: #e0f2fe; }
    .hub-icon.agri { background: #ecfdf5; }
    .hub-icon.waste { background: #fef2f2; }
    .hub-icon.inspect { background: #fef3c7; }
    .hub-icon.bio { background: #f0fdf4; }
    .hub-icon.legal { background: #fafaf9; }
    
    .hub-info h3 { margin: 0 0 8px 0; font-size: 1.25rem; font-weight: 800; color: #1e293b; }
    .hub-info p { margin: 0 0 15px 0; font-size: 0.95rem; color: #64748b; line-height: 1.5; }
    .hub-link { font-size: 0.85rem; font-weight: 700; color: #166534; }

    .activity-feed { display: flex; flex-direction: column; gap: 20px; }
    .activity-item { display: flex; gap: 15px; }
    .activity-dot { width: 10px; height: 10px; border-radius: 50%; margin-top: 6px; flex-shrink: 0; }
    .activity-dot.blue { background: #0ea5e9; box-shadow: 0 0 10px #0ea5e9; }
    .activity-dot.green { background: #22c55e; box-shadow: 0 0 10px #22c55e; }
    .activity-dot.orange { background: #f59e0b; box-shadow: 0 0 10px #f59e0b; }
    .activity-body strong { display: block; font-size: 0.95rem; color: #1e293b; margin-bottom: 2px; }
    .activity-body p { margin: 0; font-size: 0.85rem; color: #64748b; line-height: 1.4; }
    .activity-body .time { font-size: 0.75rem; color: #94a3b8; font-weight: 600; }

    .anim-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(20px); }
    @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
    
    @media (max-width: 900px) {
      .hero-grid { grid-template-columns: 1fr !important; }
    }

    @media (max-width: 768px) {
      .grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
      .grid-3 { grid-template-columns: 1fr !important; }
    }

    @media (max-width: 480px) {
      .grid-4 { grid-template-columns: 1fr !important; }
    }
  `]
})
export class InterdepartmentalComponent implements OnInit {
  activeDepartments = 0;

  constructor(
    private settingsService: SettingsService,
    private seo: SeoService
  ) {}

  ngOnInit(): void {
    this.seo.updatePage({
      title: 'Gestão Interdepartamental - Hub de Integração',
      description: 'Central de coordenação ministerial e integração de departamentos do Estado.'
    });

    this.settingsService.getSettings().subscribe(settings => {
      this.activeDepartments = settings.state_departments?.length || 3;
    });
  }
}
