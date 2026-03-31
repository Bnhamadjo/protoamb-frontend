import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartnerService, Partner } from '../../services/partner.service';

@Component({
  standalone: true,
  selector: 'app-public-partners',
  imports: [CommonModule],
  template: `
    <div class="public-partners-page">
      <section class="hero-section">
        <div class="container">
          <h1>Parceiros Institucionais</h1>
          <p>Trabalhando em conjunto para um futuro sustentável na Guiné-Bissau.</p>
        </div>
      </section>

      <div class="container main-content">
        <div *ngIf="loading" class="loading-state">
          <div class="spinner"></div>
          <p>A carregar parceiros...</p>
        </div>

        <div class="partners-grid" *ngIf="!loading">
          <div class="partner-item card" *ngFor="let p of activePartners">
            <a [href]="p.url" target="_blank" [title]="p.name" class="partner-link">
              <div class="logo-wrapper">
                <img *ngIf="p.logo" [src]="p.logo" [alt]="p.name">
                <span *ngIf="!p.logo" class="fallback-name">{{ p.name }}</span>
              </div>
              <div class="partner-hover-info">
                <h3>{{ p.name }}</h3>
                <span class="visit-btn">Visitar Website →</span>
              </div>
            </a>
          </div>
        </div>

        <div *ngIf="!loading && !activePartners.length" class="empty-msg card">
          <p>De momento não existem parceiros listados.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .public-partners-page { min-height: 80vh; padding-bottom: 80px; }
    .hero-section { background: var(--bg-app); padding: 80px 0; text-align: center; border-bottom: 1px solid var(--border); margin-bottom: 60px; }
    .hero-section h1 { font-size: 3rem; color: var(--brand); margin-bottom: 16px; }
    .hero-section p { font-size: 1.2rem; color: var(--ink-muted); max-width: 600px; margin: 0 auto; }
    
    .partners-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 30px; }
    .partner-item { padding: 0; overflow: hidden; transition: all 0.3s ease; border: 1px solid var(--border); }
    .partner-item:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.06); border-color: var(--brand); }
    
    .partner-link { text-decoration: none; color: inherit; display: block; height: 100%; }
    .logo-wrapper { height: 200px; display: flex; align-items: center; justify-content: center; background: white; padding: 40px; }
    .logo-wrapper img { max-width: 100%; max-height: 100%; filter: grayscale(100%); transition: filter 0.3s ease; }
    .partner-item:hover .logo-wrapper img { filter: grayscale(0%); }
    
    .partner-hover-info { padding: 20px; text-align: center; background: #fdfdfd; border-top: 1px solid #f0f0f0; }
    .partner-hover-info h3 { font-size: 1.1rem; color: var(--ink); margin-bottom: 8px; }
    .visit-btn { font-size: 0.8rem; font-weight: 700; color: var(--brand); text-transform: uppercase; }
    
    .loading-state { padding: 100px; text-align: center; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
  `]
})
export class PublicPartnersComponent implements OnInit {
  activePartners: Partner[] = [];
  loading = true;

  constructor(private partnerService: PartnerService) {}

  ngOnInit(): void {
    this.partnerService.all().subscribe({
      next: (res: Partner[]) => {
        this.activePartners = res.filter(p => p.is_active);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}
