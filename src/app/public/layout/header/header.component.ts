import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SettingsService } from '../../../services/settings.service';
import { PublicMenuComponent } from '../../../components/public-menu/public-menu.component';

@Component({
  standalone: true,
  selector: 'app-public-header',
  imports: [CommonModule, RouterLink, PublicMenuComponent],
  template: `
    <header class="public-header">
      <div class="container container-header">
        <div class="logo-area" routerLink="/">
          <img *ngIf="settings.logo_header" [src]="settings.logo_header" [alt]="settings.site_name">
          <img *ngIf="!settings.logo_header" src="/logo.png" [alt]="settings.site_name || 'protoAmb'">
        </div>
        
        <div class="nav-area">
          <!-- O PublicMenuComponent precisa de location e lang -->
          <app-public-menu location="header" [lang]="currentLang"></app-public-menu>

          <a routerLink="/solutions" class="platform-link">Plataforma</a>
          
          <div class="lang-switcher">
            <button *ngFor="let l of activeLanguages" 
                    [class.active]="currentLang === l"
                    (click)="setLang(l)">
              {{ l | uppercase }}
            </button>
          </div>
          
          <div class="auth-btn">
            <a routerLink="/login" class="btn primary sm">Acesso Admin</a>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .public-header {
      background: #fff;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      position: sticky;
      top: 0;
      z-index: 1000;
      padding: 10px 0;
    }
    .container-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo-area { cursor: pointer; display: flex; align-items: center; }
    .logo-area img { max-height: 50px; }
    .site-name { font-size: 1.5rem; font-weight: 800; color: var(--primary, #2d5a27); }
    
    .nav-area { display: flex; align-items: center; gap: 30px; }
    .platform-link {
      color: var(--brand);
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      font-size: 0.78rem;
    }
    .platform-link:hover { color: var(--leaf); }
    
    .lang-switcher { display: flex; gap: 5px; }
    .lang-switcher button { 
      background: none; border: 1px solid var(--border); padding: 2px 6px; 
      font-size: 0.7rem; border-radius: 4px; cursor: pointer; color: var(--ink-muted);
    }
    .lang-switcher button.active { background: var(--primary); color: #fff; border-color: var(--primary); }
    
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    @media (max-width: 980px) {
      .nav-area { gap: 14px; flex-wrap: wrap; justify-content: flex-end; }
    }
  `]
})
export class PublicHeaderComponent implements OnInit {
  settings: any = {};
  currentLang = 'pt';
  activeLanguages: string[] = ['pt'];

  constructor(private settingsService: SettingsService) { }

  ngOnInit(): void {
    this.currentLang = localStorage.getItem('portal_lang') || 'pt';
    this.settingsService.getSettings().subscribe({
      next: (res) => {
        try {
          if (!res) return;
          this.settings = res;
          if (res.active_languages) {
            try {
              this.activeLanguages = typeof res.active_languages === 'string'
                ? JSON.parse(res.active_languages)
                : res.active_languages;
            } catch (e) {
              this.activeLanguages = ['pt'];
            }
          }
        } catch (err) {
          console.error('Error loading header settings:', err);
        }
      },
      error: (err) => {
        console.error('Failed to load settings', err);
      }
    });
  }

  setLang(l: string): void {
    this.currentLang = l;
    localStorage.setItem('portal_lang', l);
  }
}
