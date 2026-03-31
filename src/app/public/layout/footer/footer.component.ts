import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DepartmentItem, PlatformModuleItem, SettingsService } from '../../../services/settings.service';

@Component({
  standalone: true,
  selector: 'app-public-footer',
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="public-footer">
      <div class="container footer-grid">
        <div class="footer-brand">
          <div class="logo-area">
             <img *ngIf="settings.logo_footer" [src]="settings.logo_footer" [alt]="settings.site_name">
             <h2 *ngIf="!settings.logo_footer" class="footer-title">{{ settings.site_name || 'protoAmb' }}</h2>
          </div>
          <p class="footer-tagline">{{ settings.platform_tagline || 'Excelência em governação ambiental e monitorização territorial para a Guiné-Bissau.' }}</p>
          <div class="social-mini">
            <span>Follow us:</span>
            <div class="icons">
              <a href="#">Fb</a> <a href="#">In</a> <a href="#">Tw</a>
            </div>
          </div>
        </div>

        <div class="footer-nav">
          <h4>Explorar</h4>
          <ul>
            <li><a routerLink="/solutions">Soluções</a></li>
            <li><a routerLink="/biodiversity">Biodiversidade</a></li>
            <li><a routerLink="/denuncias">Denúncias</a></li>
            <li><a routerLink="/posts">Notícias</a></li>
          </ul>
        </div>

        <div class="footer-nav">
          <h4>Plataforma</h4>
          <ul>
             <li *ngFor="let module of solutionModules.slice(0, 4)">
               <a [routerLink]="getModuleLink(module)">{{ module.name }}</a>
             </li>
          </ul>
        </div>

        <div class="footer-contact">
          <h4>Contacto</h4>
          <p>Coordenação Ministerial</p>
          <p class="email">geral&#64;protoamb.gov.gw</p>
          <a routerLink="/solutions" class="btn-footer-cta">Portal Técnico ↗</a>
        </div>
      </div>

      <div class="footer-copyright">
        <div class="container flex-between">
          <p>&copy; 2026 {{ settings.site_name || 'protoAmb' }}. Ministério do Ambiente e Biodiversidade.</p>
          <div class="legal-links">
             <a href="#">Termos</a>
             <a href="#">Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .public-footer {
      background: var(--brand);
      color: #fff;
      padding: 120px 0 0;
      position: relative;
      overflow: hidden;
    }
    .public-footer::before {
      content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(234, 179, 8, 0.3), transparent);
    }
    .footer-grid {
      display: grid;
      grid-template-columns: 1.8fr 0.8fr 1fr 1.2fr;
      gap: 80px;
      margin-bottom: 100px;
    }
    
    .logo-area { margin-bottom: 30px; }
    .logo-area img { max-height: 65px; width: auto; }
    .footer-title { font-family: 'Fraunces'; font-size: 2.2rem; color: #fff; margin: 0; letter-spacing: -1px; }
    .footer-tagline { color: rgba(255,255,255,0.7); font-size: 1.05rem; line-height: 1.8; margin-bottom: 40px; max-width: 380px; }
    
    .social-mini { display: flex; flex-direction: column; gap: 15px; }
    .social-mini span { font-size: 0.7rem; color: rgba(255,255,255,0.4); font-weight: 800; text-transform: uppercase; letter-spacing: 2px; }
    .social-mini .icons { display: flex; gap: 12px; }
    .social-mini a { 
      width: 40px; height: 40px; border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; 
      display: flex; align-items: center; justify-content: center; color: #fff; transition: var(--transition-fast);
      background: rgba(255,255,255,0.03); font-size: 0.9rem;
    }
    .social-mini a:hover { border-color: var(--accent); color: var(--accent); background: rgba(234, 179, 8, 0.05); transform: translateY(-3px); }

    h4 { font-family: 'Fraunces'; font-size: 1.4rem; margin-bottom: 35px; color: #fff; position: relative; }
    h4::after { content: ''; position: absolute; bottom: -12px; left: 0; width: 30px; height: 3px; background: var(--accent); border-radius: 10px; }
    
    ul { list-style: none; padding: 0; margin: 0; }
    ul li { margin-bottom: 16px; }
    ul li a { color: rgba(255,255,255,0.65); font-size: 0.95rem; transition: var(--transition-fast); display: inline-block; }
    ul li a:hover { color: var(--accent); transform: translateX(5px); }

    .footer-contact p { margin-bottom: 12px; color: rgba(255,255,255,0.7); font-size: 1rem; }
    .footer-contact .email { color: #fff; font-weight: 700; margin-bottom: 30px; font-size: 1.1rem; }
    .btn-footer-cta { 
      padding: 14px 28px; background: var(--accent); color: var(--brand); border-radius: 16px; 
      font-weight: 800; font-size: 0.85rem; text-transform: uppercase; display: inline-flex; align-items: center; gap: 10px; transition: var(--transition-fast);
    }
    .btn-footer-cta:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(234, 179, 8, 0.3); }

    .footer-copyright { border-top: 1px solid rgba(255,255,255,0.08); padding: 40px 0; font-size: 0.9rem; color: rgba(255,255,255,0.4); }
    .flex-between { display: flex; justify-content: space-between; align-items: center; }
    .legal-links { display: flex; gap: 30px; }
    .legal-links a { color: inherit; transition: var(--transition-fast); }
    .legal-links a:hover { color: #fff; }

    @media (max-width: 1200px) { .footer-grid { grid-template-columns: 1fr 1fr; gap: 60px; } }
    @media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr; gap: 50px; } .flex-between { flex-direction: column; gap: 20px; text-align: center; } .footer-tagline { max-width: 100%; } }
  `]
})
export class PublicFooterComponent implements OnInit {
  settings: any = {};
  solutionModules: PlatformModuleItem[] = [];
  departments: DepartmentItem[] = [];

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.settingsService.getSettings().subscribe((res) => {
      this.settings = res;
      this.solutionModules = res.solution_modules || [];
      this.departments = res.state_departments || [];
    });
  }

  getModuleLink(module: PlatformModuleItem): string[] {
    return ['/solutions', 'module', this.slugify(module.name)];
  }

  getDepartmentLink(department: DepartmentItem): string[] {
    return ['/solutions', 'department', this.slugify(department.name)];
  }

  private slugify(value: string): string {
    return (value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
