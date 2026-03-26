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
        <div class="footer-info">
          <img *ngIf="settings.logo_footer" [src]="settings.logo_footer" [alt]="settings.site_name">
          <h2 *ngIf="!settings.logo_footer">{{ settings.site_name || 'protoAmb' }}</h2>
          <p class="tagline">{{ settings.platform_tagline || 'Plataforma estatal para ambiente, agricultura e gestao territorial.' }}</p>
          <a routerLink="/solutions" class="btn outline sm footer-cta">Conhecer a plataforma</a>
        </div>

        <div class="footer-links">
          <h4>Navegacao</h4>
          <ul>
            <li><a routerLink="/solutions">Solucoes</a></li>
            <li><a routerLink="/biodiversity">Biodiversidade</a></li>
            <li><a routerLink="/areas">Areas Protegidas</a></li>
            <li><a routerLink="/denuncias">Denuncias</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Modulos</h4>
          <div class="footer-mini-list" *ngIf="solutionModules.length; else noModules">
            <a *ngFor="let module of solutionModules.slice(0, 3)" [routerLink]="getModuleLink(module)">
              {{ module.name }}
            </a>
          </div>
          <ng-template #noModules>
            <p>Configure os modulos MAB no painel administrativo.</p>
          </ng-template>
        </div>

        <div class="footer-section">
          <h4>Departamentos</h4>
          <div class="footer-mini-list" *ngIf="departments.length; else noDepartments">
            <a *ngFor="let department of departments.slice(0, 3)" [routerLink]="getDepartmentLink(department)">
              {{ department.name }}
            </a>
          </div>
          <ng-template #noDepartments>
            <p>Estrutura preparada para novas direcoes e institutos.</p>
          </ng-template>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="container">
          <p>&copy; 2026 {{ settings.site_name || 'protoAmb' }}. Solucao digital preparada para operacao publica multissetorial.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .public-footer {
      background: #15281e;
      color: #e7efe9;
      padding: 68px 0 0;
      margin-top: 80px;
    }
    .footer-grid {
      display: grid;
      grid-template-columns: 1.6fr 1fr 1fr 1fr;
      gap: 40px;
      margin-bottom: 46px;
    }
    .footer-info img { max-height: 76px; margin-bottom: 20px; filter: brightness(0) invert(1); }
    .footer-info h2 { color: #fff; margin-bottom: 10px; }
    .tagline { color: #a5bbad; font-size: 0.98rem; line-height: 1.75; margin-bottom: 18px; }
    .footer-cta { border-color: rgba(255,255,255,0.18); color: #fff; }
    .footer-cta:hover { border-color: #fff; background: rgba(255,255,255,0.08); }
    h4 { color: #fff; margin-bottom: 18px; font-size: 1.05rem; }
    ul { list-style: none; padding: 0; margin: 0; }
    ul li { margin-bottom: 10px; }
    ul li a, .footer-mini-list a, .footer-section p {
      color: #9ab0a1;
      text-decoration: none;
      line-height: 1.7;
    }
    ul li a:hover, .footer-mini-list a:hover { color: #fff; }
    .footer-mini-list { display: grid; gap: 10px; }
    .footer-bottom {
      border-top: 1px solid rgba(255,255,255,0.08);
      padding: 22px 0;
      text-align: center;
      font-size: 0.85rem;
      background: #102018;
    }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    @media (max-width: 1024px) {
      .footer-grid { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 680px) {
      .footer-grid { grid-template-columns: 1fr; }
    }
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
