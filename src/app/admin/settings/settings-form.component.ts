import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';
import { UploadService } from '../../services/upload.service';

@Component({
  standalone: true,
  selector: 'app-settings-form',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-container">
      <h1>Configurações do Portal</h1>
      <p class="muted">Gerencie as informações básicas e identidade visual do portal público.</p>

      <div *ngIf="loading" class="muted center" style="padding: 40px">Carregando configurações...</div>

      <div class="card settings-card" *ngIf="!loading">
        <form (ngSubmit)="save()">
          <!-- Nome do Site -->
          <div class="form-group">
            <label>Nome do Site</label>
            <input [(ngModel)]="settings.site_name" name="site_name" class="form-control" placeholder="Ex: ProtoAmb - Portal de Biodiversidade">
          </div>

          <div class="grid-2">
            <!-- Logo Header -->
            <div class="logo-upload">
              <label>Logotipo do Header</label>
              <div class="preview-box" (click)="headerInput.click()">
                <img *ngIf="settings.logo_header" [src]="settings.logo_header" alt="Header Logo">
                <div *ngIf="!settings.logo_header" class="placeholder">Clique para carregar</div>
                <div class="overlay" *ngIf="uploadingHeader">Enviando...</div>
              </div>
              <input type="file" #headerInput hidden (change)="uploadLogo($event, 'header')" accept="image/*">
            </div>

            <!-- Logo Footer -->
            <div class="logo-upload">
              <label>Logotipo do Rodapé</label>
              <div class="preview-box" (click)="footerInput.click()">
                <img *ngIf="settings.logo_footer" [src]="settings.logo_footer" alt="Footer Logo">
                <div *ngIf="!settings.logo_footer" class="placeholder">Clique para carregar</div>
                <div class="overlay" *ngIf="uploadingFooter">Enviando...</div>
              </div>
              <input type="file" #footerInput hidden (change)="uploadLogo($event, 'footer')" accept="image/*">
            </div>
          </div>

          <!-- Home Slider -->
          <div class="form-group slider-section">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
              <label style="margin: 0;">Slides do Banner Principal (Home)</label>
              <button type="button" class="btn sm outline" (click)="addSlide()">+ Adicionar Slide</button>
            </div>
            
            <div *ngFor="let slide of settings.home_slider; let i = index" class="slide-item card">
              <div class="slide-header">
                <strong>Slide #{{ i + 1 }}</strong>
                <button type="button" class="btn btn-icon danger" (click)="removeSlide(i)">🗑️</button>
              </div>
              
              <div class="grid-2" style="gap: 20px; margin-top: 15px;">
                <div class="slide-info">
                  <div class="form-group">
                    <label class="sm">Título</label>
                    <input [(ngModel)]="slide.title" [name]="'slide_title_' + i" class="form-control sm">
                  </div>
                  <div class="form-group">
                    <label class="sm">Subtítulo</label>
                    <input [(ngModel)]="slide.subtitle" [name]="'slide_sub_' + i" class="form-control sm">
                  </div>
                </div>

                <div class="slide-image">
                  <div class="preview-mini" (click)="slideInput.click()">
                    <img *ngIf="slide.image" [src]="slide.image" alt="Slide Image">
                    <div *ngIf="!slide.image" class="placeholder sm">Imagem</div>
                    <div class="overlay sm" *ngIf="slide.uploading">...</div>
                  </div>
                  <input type="file" #slideInput hidden (change)="uploadSlideImage($event, i)" accept="image/*">
                </div>
              </div>
            </div>
          </div>

          <!-- Idiomas Ativos -->
          <div class="form-group languages-section">
            <label>Idiomas Ativos</label>
            <div class="checkbox-group">
              <label class="checkbox-item">
                <input type="checkbox" [checked]="isLangActive('pt')" (change)="toggleLang('pt')"> Português (PT)
              </label>
              <label class="checkbox-item">
                <input type="checkbox" [checked]="isLangActive('en')" (change)="toggleLang('en')"> English (EN)
              </label>
              <label class="checkbox-item">
                <input type="checkbox" [checked]="isLangActive('fr')" (change)="toggleLang('fr')"> Français (FR)
              </label>
            </div>
          </div>

          <div class="actions">
            <button type="submit" class="btn primary" [disabled]="saving">
              {{ saving ? 'Guardando...' : 'Guardar Configurações' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .settings-container { animation: fadeIn 0.4s ease-out; max-width: 800px; }
    .settings-card { padding: 30px; margin-top: 24px; }
    .form-group { margin-bottom: 24px; }
    
    .logo-upload { margin-bottom: 24px; }
    .preview-box { 
      height: 120px; border: 2px dashed var(--border); border-radius: 8px;
      display: flex; align-items: center; justify-content: center; cursor: pointer;
      overflow: hidden; position: relative; background: var(--bg-app);
      transition: var(--transition);
    }
    .preview-box:hover { border-color: var(--primary); }
    .preview-box img { max-height: 90%; max-width: 90%; object-fit: contain; }
    .placeholder { color: var(--ink-muted); font-size: 0.85rem; }
    .overlay { 
      position: absolute; inset: 0; background: rgba(255,255,255,0.8); 
      display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 600;
    }

    .languages-section { border-top: 1px solid var(--border); padding-top: 24px; }
    
    .slider-section { border-top: 1px solid var(--border); padding-top: 24px; }
    .slide-item { padding: 15px; margin-bottom: 15px; border: 1px solid var(--border); background: #fafafa; }
    .slide-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 10px; }
    .preview-mini { 
      height: 100px; border: 1px dashed var(--border); border-radius: 6px;
      display: flex; align-items: center; justify-content: center; cursor: pointer;
      overflow: hidden; position: relative; background: #fff;
    }
    .preview-mini img { max-height: 100%; max-width: 100%; object-fit: cover; }
    .btn-icon { background: none; border: none; cursor: pointer; font-size: 1.1rem; padding: 4px; border-radius: 4px; transition: 0.2s; }
    .btn-icon:hover { background: #fee2e2; }
    
    .checkbox-group { display: flex; gap: 20px; margin-top: 10px; }

    .actions { border-top: 1px solid var(--border); padding-top: 24px; display: flex; justify-content: flex-end; }
    
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class SettingsFormComponent implements OnInit {
  settings: any = {
    site_name: '',
    logo_header: '',
    logo_footer: '',
    active_languages: ['pt'],
    home_slider: []
  };
  loading = true;
  saving = false;
  uploadingHeader = false;
  uploadingFooter = false;

  constructor(
    private settingsService: SettingsService,
    private uploadService: UploadService
  ) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.settingsService.getSettings().subscribe({
      next: (res) => {
        // Hydrate settings
        this.settings.site_name = res.site_name || '';
        this.settings.logo_header = res.logo_header || '';
        this.settings.logo_footer = res.logo_footer || '';
        
        if (res.active_languages) {
          try {
            this.settings.active_languages = typeof res.active_languages === 'string' 
              ? JSON.parse(res.active_languages) 
              : res.active_languages;
          } catch(e) {
            this.settings.active_languages = ['pt'];
          }
        }

        if (res.home_slider) {
          try {
            this.settings.home_slider = typeof res.home_slider === 'string'
              ? JSON.parse(res.home_slider)
              : res.home_slider;
          } catch(e) {
            this.settings.home_slider = [];
          }
        }
        
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Erro ao carregar configurações.');
      }
    });
  }

  uploadLogo(event: any, target: 'header' | 'footer'): void {
    const file = event.target.files[0];
    if (!file) return;

    if (target === 'header') this.uploadingHeader = true;
    else this.uploadingFooter = true;

    this.uploadService.upload(file).subscribe({
      next: (res) => {
        if (target === 'header') {
          this.settings.logo_header = res.url;
          this.uploadingHeader = false;
        } else {
          this.settings.logo_footer = res.url;
          this.uploadingFooter = false;
        }
      },
      error: () => {
        this.uploadingHeader = this.uploadingFooter = false;
        alert('Erro ao fazer upload da imagem.');
      }
    });
  }

  isLangActive(lang: string): boolean {
    return this.settings.active_languages.includes(lang);
  }

  toggleLang(lang: string): void {
    const idx = this.settings.active_languages.indexOf(lang);
    if (idx > -1) {
      if (this.settings.active_languages.length > 1) {
        this.settings.active_languages.splice(idx, 1);
      }
    } else {
      this.settings.active_languages.push(lang);
    }
  }

  uploadSlideImage(event: any, index: number): void {
    const file = event.target.files[0];
    if (!file) return;

    this.settings.home_slider[index].uploading = true;
    this.uploadService.upload(file).subscribe({
      next: (res) => {
        this.settings.home_slider[index].image = res.url;
        this.settings.home_slider[index].uploading = false;
      },
      error: () => {
        this.settings.home_slider[index].uploading = false;
        alert('Erro ao fazer upload da imagem.');
      }
    });
  }

  addSlide(): void {
    if (!this.settings.home_slider) this.settings.home_slider = [];
    this.settings.home_slider.push({ title: '', subtitle: '', image: '', uploading: false });
  }

  removeSlide(index: number): void {
    this.settings.home_slider.splice(index, 1);
  }

  save(): void {
    this.saving = true;
    this.settingsService.updateSettings(this.settings).subscribe({
      next: () => {
        this.saving = false;
        alert('Configurações atualizadas com sucesso!');
      },
      error: () => {
        this.saving = false;
        alert('Erro ao guardar configurações.');
      }
    });
  }
}
