import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SettingsService } from '../../../services/settings.service';
import { PublicMenuComponent } from '../../../components/public-menu/public-menu.component';
import { AuthService } from '../../../core/auth';

@Component({
  standalone: true,
  selector: 'app-public-header',
  imports: [CommonModule, RouterLink, PublicMenuComponent],
  template: `
    <header class="public-header" [class.mobile-menu-active]="menuOpen">
      <div class="container container-header">
        <div class="logo-area" routerLink="/" (click)="menuOpen = false">
          <img *ngIf="settings.logo_header" [src]="settings.logo_header" [alt]="settings.site_name" (error)="onLogoError($event)">
          <img *ngIf="!settings.logo_header" src="/logo.png" [alt]="settings.site_name || 'protoAmb'">
        </div>
        
        <button class="mobile-toggle" (click)="toggleMenu()" [class.active]="menuOpen">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div class="nav-area" [class.open]="menuOpen">
          <app-public-menu location="header" [lang]="currentLang" (click)="menuOpen = false"></app-public-menu>

          <div class="nav-extras">
            <a routerLink="/solutions" class="platform-link" (click)="menuOpen = false">Plataforma</a>
            
            <div class="lang-switcher">
              <button *ngFor="let l of activeLanguages" 
                      [class.active]="currentLang === l"
                      (click)="setLang(l)">
                {{ l | uppercase }}
              </button>
            </div>
            
            <div class="auth-btn">
              <a [routerLink]="auth.isLogged() ? '/admin' : '/login'" class="btn primary sm" (click)="menuOpen = false">
                {{ auth.isLogged() ? 'Aceder ao Portal' : 'Acesso Admin' }}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="mobile-overlay" *ngIf="menuOpen" (click)="menuOpen = false"></div>
    </header>
  `,
  styles: [`
    .public-header {
      background: var(--glass);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      box-shadow: 0 10px 40px rgba(0,0,0,0.04);
      border-bottom: 1px solid var(--glass-border);
      position: sticky;
      top: 0;
      z-index: 1000;
      padding: 12px 0;
      transition: var(--transition);
    }
    .container-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo-area { cursor: pointer; display: flex; align-items: center; transition: var(--transition-fast); }
    .logo-area:hover { opacity: 0.8; transform: scale(0.98); }
    .logo-area img { max-height: 52px; width: auto; object-fit: contain; }
    
    .nav-area { display: flex; align-items: center; gap: 40px; }
    .nav-extras { display: flex; align-items: center; gap: 40px; }

    .platform-link {
      color: var(--brand);
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-size: 0.75rem;
      position: relative;
      opacity: 0.8;
      transition: var(--transition-fast);
    }
    .platform-link:hover { opacity: 1; }
    .platform-link::after { 
      content: ''; position: absolute; bottom: -8px; left: 50%; width: 0; height: 3px; 
      background: var(--accent); transition: var(--transition-fast); transform: translateX(-50%); border-radius: 10px;
    }
    .platform-link:hover::after { width: 100%; }
    
    .lang-switcher { display: flex; gap: 4px; background: rgba(0,0,0,0.03); padding: 4px; border-radius: 12px; }
    .lang-switcher button { 
      background: none; border: none; padding: 6px 12px; 
      font-size: 0.7rem; font-weight: 800; border-radius: 8px; cursor: pointer; color: var(--ink-muted);
      transition: var(--transition-fast);
    }
    .lang-switcher button.active { background: #fff; color: var(--brand); box-shadow: var(--shadow-sm); }
    
    /* Mobile Toggle */
    .mobile-toggle {
      display: none;
      flex-direction: column;
      justify-content: space-between;
      width: 30px;
      height: 20px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      z-index: 1001;
    }
    .mobile-toggle span {
      width: 100%;
      height: 3px;
      background: var(--brand);
      border-radius: 10px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .mobile-toggle.active span:nth-child(1) { transform: translateY(8.5px) rotate(45deg); }
    .mobile-toggle.active span:nth-child(2) { opacity: 0; }
    .mobile-toggle.active span:nth-child(3) { transform: translateY(-8.5px) rotate(-45deg); }

    .mobile-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(6, 38, 29, 0.3);
      backdrop-filter: blur(4px);
      z-index: 998;
      animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .container { max-width: 1400px; margin: 0 auto; padding: 0 40px; }

    @media (max-width: 1100px) {
      .nav-area { gap: 20px; }
      .nav-extras { gap: 20px; }
      .container { padding: 0 20px; }
    }

    @media (max-width: 900px) {
      .mobile-toggle { display: flex; }
      .nav-area {
        position: fixed; top: 0; right: -100%; width: 85%; max-width: 350px; height: 100vh;
        background: white; flex-direction: column; align-items: flex-start;
        padding: 100px 40px; box-shadow: -20px 0 50px rgba(0,0,0,0.1);
        z-index: 999; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        overflow-y: auto; gap: 40px;
      }
      .nav-area.open { right: 0; }
      .nav-extras { flex-direction: column; align-items: flex-start; width: 100%; }
      .lang-switcher { width: 100%; justify-content: flex-start; }
      .auth-btn { width: 100%; }
      .auth-btn .btn { width: 100%; justify-content: center; padding: 16px; border-radius: 16px; }
    }
  `]
})
export class PublicHeaderComponent implements OnInit {
  settings: any = {};
  currentLang = 'pt';
  activeLanguages: string[] = ['pt'];
  private _menuOpen = false;
  get menuOpen() { return this._menuOpen; }
  set menuOpen(v: boolean) {
    this._menuOpen = v;
    if (v) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  constructor(
    private settingsService: SettingsService,
    public auth: AuthService
  ) { }

  onLogoError(event: any): void {
    event.target.src = '/logo.png';
  }

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

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  setLang(l: string): void {
    this.currentLang = l;
    localStorage.setItem('portal_lang', l);
  }
}
