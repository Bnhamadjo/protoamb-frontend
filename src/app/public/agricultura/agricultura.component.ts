import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../services/seo.service';

@Component({
  standalone: true,
  selector: 'app-agricultura',
  imports: [CommonModule, RouterLink],
  template: `
    <section class="hero">
      <div class="container">
        <span class="section-kicker">Modulo MAB</span>
        <h1>Agricultura Sustentavel</h1>
        <p class="lead">Apoio tecnico, conhecimento agricola e resiliencia produtiva para o sector.</p>
      </div>
    </section>

    <section class="container section-content">
      <h2>Boas Praticas Agricolas</h2>
      <p>Explore as melhores praticas para uma agricultura sustentavel, incluindo tecnicas de cultivo, gestao de solo e uso eficiente de recursos.</p>
      <ul>
        <li>Rotacao de culturas</li>
        <li>Adubacao organica</li>
        <li>Controlo integrado de pragas</li>
        <li>Irrigacao eficiente</li>
      </ul>

      <h2>Extensao e Capacitacao</h2>
      <p>Programas de capacitacao e extensao rural para agricultores, promovendo a adocao de inovacoes e o desenvolvimento de habilidades.</p>
      <a routerLink="/posts" class="btn primary">Ver publicacoes</a>
    </section>
  `,
  styles: [`
    .hero { padding: 80px 0; background: linear-gradient(135deg, #2b5800 0%, #6d9f3d 100%); color: #fff; text-align: center; }
    .hero h1 { color: #fff; font-size: clamp(2.5rem, 5vw, 4.5rem); margin-bottom: 15px; }
    .hero .lead { max-width: 800px; margin: 0 auto; font-size: 1.2rem; line-height: 1.6; }
    .section-content { padding: 50px 0; }
    .section-content h2 { margin-top: 40px; margin-bottom: 20px; color: var(--brand); }
    .section-content p { margin-bottom: 15px; line-height: 1.7; }
    .section-content ul { list-style: disc; padding-left: 20px; margin-bottom: 20px; }
    .section-content li { margin-bottom: 8px; }
  `]
})
export class AgriculturaComponent implements OnInit {
  constructor(private seo: SeoService) { }

  ngOnInit(): void {
    this.seo.updatePage({
      title: 'Agricultura Sustentavel',
      description: 'Modulo de Agricultura Sustentavel da plataforma MAB, com foco em boas praticas e extensao agricola.'
    });
  }
}
