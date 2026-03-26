import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PublicInspectionDashboardComponent } from './public-inspection-dashboard.component';

@Component({
  standalone: true,
  selector: 'app-public-inspection-hub',
  imports: [CommonModule, RouterModule, PublicInspectionDashboardComponent],
  template: `
    <div class="page-header inspection-hero">
      <div class="container">
        <span class="badge">SaaS Ambiental v1.0</span>
        <h1>Inspeção e Controlo Ambiental</h1>
        <p>Monitorização em tempo real, gestão de missões de campo e proteção ativa do património natural.</p>
        <div class="cta-group mt-8">
          <a routerLink="/ocorrencias/relatar" class="btn primary lg shadow-xl">Reportar Incidente Ambiental</a>
          <a href="#fluxo" class="btn outline white lg scroll-link">Como funciona</a>
        </div>
      </div>
    </div>

    <section class="container py-16">
      <div class="grid lg:grid-cols-3 gap-12">
        <div class="lg:col-span-2">
          <h2 class="section-title mb-8">Estado da Monitorização</h2>
          <app-public-inspection-dashboard></app-public-inspection-dashboard>
          
          <div id="fluxo" class="mt-20">
            <h2 class="section-title mb-10 text-center">O Fluxo de Processo Técnico</h2>
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
              <a routerLink="/admin" class="btn ghost sm full-width">Aceder ao Painel Técnico</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .inspection-hero { 
      background: linear-gradient(rgba(10, 36, 26, 0.8), rgba(10, 36, 26, 0.95)), url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80');
      background-size: cover;
      background-position: center;
      color: #fff;
      padding: 120px 0;
      text-align: center;
    }
    .badge { background: var(--brand); color: #fff; padding: 6px 16px; border-radius: 99px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; display: inline-block; }
    .inspection-hero h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: 20px; line-height: 1.1; }
    .inspection-hero p { font-size: 1.25rem; opacity: 0.85; max-width: 700px; margin: 0 auto; }
    
    .workflow-steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 30px; }
    .step { position: relative; padding: 30px; background: var(--bg-card); border-radius: 20px; border: 1px solid rgba(0,0,0,0.05); transition: 0.3s; }
    .step:hover { transform: translateY(-5px); border-color: var(--brand); box-shadow: var(--shadow-lg); }
    .step-num { font-size: 3rem; font-weight: 900; color: rgba(10, 60, 46, 0.05); position: absolute; top: 10px; right: 20px; z-index: 0; }
    .step h4 { font-weight: 800; position: relative; z-index: 1; margin-bottom: 10px; color: var(--brand); }
    .step p { font-size: 0.85rem; color: var(--ink-muted); position: relative; z-index: 1; margin: 0; }
    
    .btn.full-width { width: 100%; text-align: center; }
  `]
})
export class PublicInspectionHubComponent {}
