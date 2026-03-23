import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-page-not-found',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="not-found-container anim-fade-in">
      <div class="content">
        <div class="error-code">404</div>
        <h1>Página Não Encontrada</h1>
        <p class="muted">Desculpe, a página que procura não existe ou foi movida.</p>
        <div class="actions">
          <a routerLink="/" class="btn primary lg">Voltar ao Início</a>
          <a routerLink="/biodiversity" class="btn outline lg">Ver Biodiversidade</a>
        </div>
      </div>
      
      <div class="illustration">
        <div class="leaf leaf-1">🍃</div>
        <div class="leaf leaf-2">🌿</div>
        <div class="leaf leaf-3">🌵</div>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container { 
      min-height: 80vh; display: flex; align-items: center; justify-content: center; 
      padding: 40px; text-align: center; position: relative; overflow: hidden;
    }
    .content { max-width: 500px; z-index: 2; }
    .error-code { 
      font-size: 8rem; font-weight: 900; color: var(--brand-light); line-height: 1; margin-bottom: 20px;
      background: linear-gradient(var(--brand), var(--brand-dark));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      opacity: 0.2;
    }
    h1 { font-size: 2.5rem; margin-bottom: 15px; color: var(--ink); }
    p { font-size: 1.1rem; margin-bottom: 30px; }
    .actions { display: flex; gap: 15px; justify-content: center; }

    .illustration { position: absolute; inset: 0; pointer-events: none; z-index: 1; }
    .leaf { position: absolute; font-size: 4rem; opacity: 0.1; transition: 0.5s; }
    .leaf-1 { top: 20%; left: 15%; transform: rotate(15deg); }
    .leaf-2 { bottom: 20%; right: 15%; transform: rotate(-15deg); }
    .leaf-3 { top: 60%; left: 80%; transform: rotate(45deg); }

    @keyframes leafFloat {
      0% { transform: translateY(0) rotate(0); }
      50% { transform: translateY(-20px) rotate(10deg); }
      100% { transform: translateY(0) rotate(0); }
    }
  `]
})
export class PageNotFoundComponent {}
