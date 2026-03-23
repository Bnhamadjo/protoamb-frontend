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
          <span *ngIf="!settings.logo_header" class="site-name">{{ settings.site_name || 'protoAmb' }}</span>
        </div>
        
        <div class="nav-area">
          <!-- O PublicMenuComponent precisa de location e lang -->
          <app-public-menu location="header" [lang]="currentLang"></app-public-menu>
          
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
    
    .lang-switcher { display: flex; gap: 5px; }
    .lang-switcher button { 
      background: none; border: 1px solid var(--border); padding: 2px 6px; 
      font-size: 0.7rem; border-radius: 4px; cursor: pointer; color: var(--ink-muted);
    }
    .lang-switcher button.active { background: var(--primary); color: #fff; border-color: var(--primary); }
    
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
  `]
})
export class PublicHeaderComponent implements OnInit {
  settings: any = {};
  currentLang = 'pt';
  activeLanguages: string[] = ['pt'];

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.settingsService.getSettings().subscribe(res => {
      this.settings = res;
      if (res.active_languages) {
        try {
          this.activeLanguages = typeof res.active_languages === 'string' 
            ? JSON.parse(res.active_languages) 
            : res.active_languages;
        } catch(e) {
          this.activeLanguages = ['pt'];
        }
      }
    });
  }

  setLang(l: string): void {
    this.currentLang = l;
    localStorage.setItem('portal_lang', l);
  }
}
