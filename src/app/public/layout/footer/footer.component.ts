import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../../services/settings.service';

@Component({
  standalone: true,
  selector: 'app-public-footer',
  imports: [CommonModule],
  template: `
    <footer class="public-footer">
      <div class="container footer-grid">
        <div class="footer-info">
          <img *ngIf="settings.logo_footer" [src]="settings.logo_footer" [alt]="settings.site_name">
          <h2 *ngIf="!settings.logo_footer">{{ settings.site_name || 'protoAmb' }}</h2>
          <p class="tagline">Protegendo a biodiversidade da Guiné-Bissau.</p>
        </div>
        
        <div class="footer-links">
          <h4>Portal</h4>
          <ul>
            <li><a href="#">Biodiversidade</a></li>
            <li><a href="#">Áreas Protegidas</a></li>
            <li><a href="#">Denúncias</a></li>
          </ul>
        </div>
        
        <div class="footer-contact">
          <h4>Contacto</h4>
          <p>MAB / UNCCD Guiné-Bissau</p>
          <p>Email: contacto&#64;mab-gb.gw</p>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="container">
          <p>&copy; 2026 {{ settings.site_name }}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .public-footer {
      background: #1a2a1a;
      color: #e0e0e0;
      padding: 60px 0 0;
      margin-top: 80px;
    }
    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 50px;
      margin-bottom: 50px;
    }
    .footer-info img { max-height: 80px; margin-bottom: 20px; filter: brightness(0) invert(1); }
    .footer-info h2 { color: #fff; margin-bottom: 10px; }
    .tagline { color: #8fa38c; font-size: 0.95rem; }
    
    h4 { color: #fff; margin-bottom: 20px; font-size: 1.1rem; }
    ul { list-style: none; padding: 0; }
    ul li { margin-bottom: 10px; }
    ul li a { color: #8fa38c; text-decoration: none; transition: color 0.2s; }
    ul li a:hover { color: #fff; }
    
    .footer-bottom {
      border-top: 1px solid rgba(255,255,255,0.1);
      padding: 24px 0;
      text-align: center;
      font-size: 0.85rem;
      background: #152215;
    }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
  `]
})
export class PublicFooterComponent implements OnInit {
  settings: any = {};

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.settingsService.getSettings().subscribe(res => {
      this.settings = res;
    });
  }
}
