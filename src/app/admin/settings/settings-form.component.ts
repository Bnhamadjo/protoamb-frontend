import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DepartmentItem, GalleryItem, HomeActionCard, HomeSliderItem, HubStats, MapMarker, PlatformModuleItem, SettingsService, SiteSettings } from '../../services/settings.service';
import { MediaPickerComponent, MediaPickerSelection } from '../../shared/media-picker/media-picker.component';
import { ToastService } from '../../services/toast.service';

@Component({
  standalone: true,
  selector: 'app-settings-form',
  imports: [CommonModule, FormsModule, MediaPickerComponent],
  template: `
    <div class="settings-page p-8 max-w-6xl mx-auto page-anim-fade-in">
      <div class="page-header mb-10">
        <h1 class="text-4xl font-serif text-brand mb-3">Painel de Configuração</h1>
        <p class="text-ink-muted text-lg">Gestão centralizada do ecossistema digital e identidade institucional.</p>
      </div>

      <nav class="settings-tabs glass-card mb-10 p-1 flex gap-1 sticky top-4 z-10 shadow-lg">
        <button [class.active]="activeTab === 'geral'" (click)="activeTab = 'geral'">Geral & Identidade</button>
        <button [class.active]="activeTab === 'homepage'" (click)="activeTab = 'homepage'">Capa do Portal</button>
        <button [class.active]="activeTab === 'hubs'" (click)="activeTab = 'hubs'">Hubs & Direções</button>
        <button [class.active]="activeTab === 'sig'" (click)="activeTab = 'sig'">Recursos SIG</button>
        <button [class.active]="activeTab === 'galeria'" (click)="activeTab = 'galeria'">Acervo & Galeria</button>
      </nav>

      <div *ngIf="loading" class="flex flex-col items-center justify-center py-32 opacity-50">
        <div class="spinner mb-4"></div>
        <p class="font-serif italic text-brand">Sincronizando dados mestre...</p>
      </div>

      <div class="settings-content" *ngIf="!loading">
        <form (ngSubmit)="save()">
          
          <!-- TAB: GERAL -->
          <div class="tab-pane tab-anim-up" *ngIf="activeTab === 'geral'">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="impeccable-card p-8">
                <h3 class="text-xl font-serif text-brand mb-6 border-b pb-4">Identidade Básica</h3>
                <div class="form-group mb-6">
                  <label class="block text-sm font-bold text-brand uppercase tracking-wider mb-2">Título do Portal</label>
                  <input [(ngModel)]="settings.site_name" name="site_name" placeholder="Ex: MAB - Ministério do Ambiente" class="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-brand outline-none transition-all bg-slate-50/50">
                </div>
                <div class="grid grid-cols-3 gap-6">
                  <div class="logo-upload">
                    <label class="block text-xs font-bold text-ink-muted uppercase mb-3">Header (Public)</label>
                    <div class="preview-box compact group" (click)="openImagePicker('logo_header', 'Logotipo do Header')">
                      <img *ngIf="settings.logo_header" [src]="settings.logo_header" class="max-h-full object-contain">
                      <div class="overlay group-hover:opacity-100">Alterar</div>
                    </div>
                  </div>
                  <div class="logo-upload">
                    <label class="block text-xs font-bold text-ink-muted uppercase mb-3">Footer (Public)</label>
                    <div class="preview-box compact group" (click)="openImagePicker('logo_footer', 'Logotipo do Rodapé')">
                      <img *ngIf="settings.logo_footer" [src]="settings.logo_footer" class="max-h-full object-contain">
                      <div class="overlay group-hover:opacity-100">Alterar</div>
                    </div>
                  </div>
                  <div class="logo-upload">
                    <label class="block text-xs font-bold text-ink-muted uppercase mb-3">Back-Office (Admin)</label>
                    <div class="preview-box compact group" (click)="openImagePicker('logo_admin', 'Logotipo Administrativo')">
                      <img *ngIf="settings.logo_admin" [src]="settings.logo_admin" class="max-h-full object-contain">
                      <div class="overlay group-hover:opacity-100">Alterar</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="impeccable-card p-8">
                <h3 class="text-xl font-serif text-brand mb-6 border-b pb-4">Idiomas Ativos</h3>
                <p class="text-sm text-ink-muted mb-6">Selecione as localizações disponíveis para os cidadãos no portal público.</p>
                <div class="space-y-4">
                  <label class="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-50 hover:border-brand/20 hover:bg-brand/5 cursor-pointer transition-all" [class.active-lang]="isLangActive('pt')">
                    <input type="checkbox" [checked]="isLangActive('pt')" (change)="toggleLang('pt')" class="w-5 h-5 accent-brand">
                    <div class="flex-grow">
                      <span class="block font-bold text-brand">Português</span>
                      <span class="text-xs text-ink-muted">Idioma nativo e oficial do Estado.</span>
                    </div>
                  </label>
                  <label class="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-50 hover:border-brand/20 hover:bg-brand/5 cursor-pointer transition-all" [class.active-lang]="isLangActive('en')">
                    <input type="checkbox" [checked]="isLangActive('en')" (change)="toggleLang('en')" class="w-5 h-5 accent-brand">
                    <div class="flex-grow">
                      <span class="block font-bold text-brand">English</span>
                      <span class="text-xs text-ink-muted">International business and cooperation.</span>
                    </div>
                  </label>
                  <label class="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-50 hover:border-brand/20 hover:bg-brand/5 cursor-pointer transition-all" [class.active-lang]="isLangActive('fr')">
                    <input type="checkbox" [checked]="isLangActive('fr')" (change)="toggleLang('fr')" class="w-5 h-5 accent-brand">
                    <div class="flex-grow">
                      <span class="block font-bold text-brand">Français</span>
                      <span class="text-xs text-ink-muted">Relations diplomatiques et régionales.</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB: HOMEPAGE -->
          <div class="tab-pane tab-anim-up" *ngIf="activeTab === 'homepage'">
            <section class="impeccable-card p-8 mb-8">
              <div class="flex justify-between items-center mb-8 border-b pb-4">
                <div>
                  <h3 class="text-2xl font-serif text-brand">Hero Storytelling</h3>
                  <p class="text-sm text-ink-muted">Narrativas visuais de impacto na entrada do portal.</p>
                </div>
                <button type="button" class="btn primary sm" (click)="addSlide()">+ Adicionar Slide</button>
              </div>

              <div class="grid grid-cols-1 gap-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                <div *ngFor="let slide of settings.home_slider; let i = index" class="slide-item-card glass-card p-6 border group relative">
                  <button type="button" class="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg flex items-center justify-center z-10" (click)="removeSlide(i)">&times;</button>
                  <div class="flex flex-col md:flex-row gap-6">
                    <div class="w-full md:w-60 h-40 rounded-2xl overflow-hidden bg-slate-100 cursor-pointer relative" (click)="openImagePicker('slide', 'Imagem do Slide', i)">
                      <img *ngIf="slide.image" [src]="slide.image" class="w-full h-full object-cover">
                      <div class="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-all flex items-center justify-center text-white text-xs font-bold uppercase tracking-widest">Alterar Fundo</div>
                    </div>
                    <div class="flex-grow space-y-4">
                      <div>
                        <label class="block text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-1">Título Principal</label>
                        <input [(ngModel)]="slide.title" [name]="'s_t_'+i" class="w-full p-3 rounded-xl border bg-white/50 focus:bg-white transition-all text-brand font-serif text-lg">
                      </div>
                      <div>
                        <label class="block text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-1">Texto de Apoio</label>
                        <input [(ngModel)]="slide.subtitle" [name]="'s_s_'+i" class="w-full p-3 rounded-xl border bg-white/50 focus:bg-white transition-all text-ink-muted">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="impeccable-card p-8">
                <h3 class="text-xl font-serif text-brand mb-6 border-b pb-4">Manifesto Institucional</h3>
                <div class="space-y-4">
                  <div>
                    <label class="block text-xs font-bold text-ink-muted uppercase mb-2">Título da Secção</label>
                    <input [(ngModel)]="settings.about_section_title" name="abs_t" class="w-full p-3 rounded-xl border bg-slate-50 focus:bg-white transition-all font-serif">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-ink-muted uppercase mb-2">Corpo do Manifesto</label>
                    <textarea [(ngModel)]="settings.about_section_text" name="abs_x" rows="6" class="w-full p-3 rounded-xl border bg-slate-50 focus:bg-white transition-all leading-relaxed"></textarea>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-bold text-ink-muted uppercase mb-2">Label do Botão</label>
                      <input [(ngModel)]="settings.about_section_button_text" name="abs_bt" class="w-full p-3 rounded-xl border bg-slate-50 focus:bg-white transition-all">
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-ink-muted uppercase mb-2">Link de Destino</label>
                      <input [(ngModel)]="settings.about_section_button_link" name="abs_bl" class="w-full p-3 rounded-xl border bg-slate-50 focus:bg-white transition-all">
                    </div>
                  </div>
                </div>
              </div>
              <div class="impeccable-card p-8 flex flex-col">
                <h3 class="text-xl font-serif text-brand mb-6 border-b pb-4">Imagem de Destaque</h3>
                <div class="flex-grow rounded-3xl overflow-hidden border-4 border-slate-50 bg-slate-100 cursor-pointer relative group min-h-[300px]" (click)="openImagePicker('about_section_image', 'Imagem do Manifesto')">
                  <img *ngIf="settings.about_section_image" [src]="settings.about_section_image" class="w-full h-full object-cover">
                  <div class="absolute inset-0 bg-brand/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white font-bold uppercase tracking-widest">Atualizar Imagem Institucional</div>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB: HUBS -->
          <div class="tab-pane tab-anim-up" *ngIf="activeTab === 'hubs'">
            <div class="impeccable-card p-8 mb-8">
              <div class="flex justify-between items-center mb-10 border-b pb-4">
                <div>
                  <h3 class="text-2xl font-serif text-brand">Arquitetura Interdepartamental</h3>
                  <p class="text-sm text-ink-muted">Direções e órgãos integrados ao ecossistema MAB.</p>
                </div>
                <button type="button" class="btn primary sm" (click)="addDepartment()">+ Integrar Direção</button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div *ngFor="let dep of settings.state_departments; let i = index" class="glass-card p-6 border-2 border-slate-50 hover:border-brand/20 transition-all relative group">
                  <button type="button" class="absolute -top-3 -right-3 w-7 h-7 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md flex items-center justify-center z-10" (click)="removeDepartment(i)">&times;</button>
                  <div class="mb-4">
                    <label class="block text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-1">Nome da Entidade</label>
                    <input [(ngModel)]="dep.name" [name]="'dn_'+i" class="w-full p-2 border-b-2 border-slate-100 bg-transparent focus:border-brand outline-none transition-all font-bold text-brand">
                  </div>
                  <div class="mb-4">
                    <label class="block text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-1">Foco Estratégico</label>
                    <input [(ngModel)]="dep.focus" [name]="'df_'+i" class="w-full p-2 border-b-2 border-slate-100 bg-transparent focus:border-brand outline-none transition-all text-sm italic">
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-1">Missão Resumida</label>
                    <textarea [(ngModel)]="dep.summary" [name]="'ds_'+i" rows="3" class="w-full p-3 rounded-xl border bg-slate-50/50 focus:bg-white text-xs leading-relaxed"></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div class="impeccable-card p-8">
              <h3 class="text-2xl font-serif text-brand mb-8 border-b pb-4">Indicadores de Desempenho (Hubs)</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div class="space-y-6">
                  <div class="flex items-center gap-4 mb-4">
                    <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><i class="fas fa-water"></i></div>
                    <h4 class="font-bold text-brand uppercase tracking-widest text-sm">Painel: Recursos Hídricos</h4>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="form-group"><label class="text-[10px] uppercase font-bold text-ink-muted">KPI Principal (Status)</label><input [(ngModel)]="settings.water_hub_stats.label1" name="whl1" class="w-full p-3 border rounded-xl bg-slate-50"></div>
                    <div class="form-group"><label class="text-[10px] uppercase font-bold text-ink-muted">Valor</label><input type="number" [(ngModel)]="settings.water_hub_stats.value1" name="whv1" class="w-full p-3 border rounded-xl bg-slate-50"></div>
                  </div>
                </div>
                <div class="space-y-6">
                  <div class="flex items-center gap-4 mb-4">
                    <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600"><i class="fas fa-leaf"></i></div>
                    <h4 class="font-bold text-brand uppercase tracking-widest text-sm">Painel: Extensão Agrícola</h4>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="form-group"><label class="text-[10px] uppercase font-bold text-ink-muted">KPI Principal (Status)</label><input [(ngModel)]="settings.agriculture_hub_stats.label1" name="ahl1" class="w-full p-3 border rounded-xl bg-slate-50"></div>
                    <div class="form-group"><label class="text-[10px] uppercase font-bold text-ink-muted">Valor</label><input type="number" [(ngModel)]="settings.agriculture_hub_stats.value1" name="ahv1" class="w-full p-3 border rounded-xl bg-slate-50"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB: SIG -->
          <div class="tab-pane tab-anim-up" *ngIf="activeTab === 'sig'">
            <div class="impeccable-card p-8 mb-8">
              <div class="flex justify-between items-center mb-10 border-b pb-4">
                <div>
                  <h3 class="text-2xl font-serif text-brand">Geospacial & SIG</h3>
                  <p class="text-sm text-ink-muted">Gestão de pontos de interesse e infraestruturas no mapa oficial.</p>
                </div>
                <button type="button" class="btn primary sm" (click)="addMapMarker()">+ Novo Ponto SIG</button>
              </div>

              <div class="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                <div *ngFor="let m of settings.map_markers; let i = index" class="glass-card p-6 border-2 border-slate-50 hover:border-brand/20 transition-all relative group">
                  <button type="button" class="absolute -top-3 -right-3 w-7 h-7 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md flex items-center justify-center z-10" (click)="removeMapMarker(i)">&times;</button>
                  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div class="col-span-1">
                      <label class="block text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-1">Tipo de Recurso</label>
                      <select [(ngModel)]="m.type" [name]="'mt_'+i" class="w-full p-2 border rounded-lg bg-white text-sm">
                        <option value="furo">💧 Furo Artesiano</option>
                        <option value="basin">🌊 Bacia Hidrográfica</option>
                        <option value="station">📡 Estação Monitoria</option>
                        <option value="project">🏗️ Projeto MAB</option>
                      </select>
                    </div>
                    <div class="col-span-1 md:col-span-2">
                      <label class="block text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-1">Nome / Identificador</label>
                      <input [(ngModel)]="m.title" [name]="'mti_'+i" class="w-full p-2 border rounded-lg bg-white text-sm" placeholder="Ex: Furo Pitche #1">
                    </div>
                    <div class="col-span-1 flex gap-2">
                       <div class="flex-1">
                          <label class="block text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-1">Lat</label>
                          <input type="number" [(ngModel)]="m.lat" [name]="'mla_'+i" class="w-full p-2 border rounded-lg bg-white text-sm" step="0.000001">
                       </div>
                       <div class="flex-1">
                          <label class="block text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-1">Lng</label>
                          <input type="number" [(ngModel)]="m.lng" [name]="'mln_'+i" class="w-full p-2 border rounded-lg bg-white text-sm" step="0.000001">
                       </div>
                    </div>
                  </div>
                  <div class="mt-4">
                    <label class="block text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-1">Informação Adicional (Popup)</label>
                    <input [(ngModel)]="m.description" [name]="'md_'+i" class="w-full p-2 border rounded-lg bg-white text-sm" placeholder="Breve resumo sobre o estado ou capacidade...">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB: GALERIA -->
          <div class="tab-pane tab-anim-up" *ngIf="activeTab === 'galeria'">
            <div class="impeccable-card p-8">
              <div class="flex justify-between items-center mb-10 border-b pb-4">
                <div>
                  <h3 class="text-2xl font-serif text-brand">Acervo Visual Institucional</h3>
                  <p class="text-sm text-ink-muted">Imagens que compõem a vitrine pública do Ministério.</p>
                </div>
                <button type="button" class="btn primary sm" (click)="addGalleryItem()">+ Nova Imagem</button>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <div *ngFor="let item of settings.home_gallery; let i = index" class="gallery-edit-card glass-card overflow-hidden group shadow-md hover:shadow-xl transition-all">
                  <div class="h-48 bg-slate-100 relative cursor-pointer" (click)="openImagePicker('gallery', 'Imagem da Galeria', i)">
                    <img *ngIf="item.url" [src]="item.url" class="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500">
                    <div *ngIf="!item.url" class="w-full h-full flex flex-col items-center justify-center opacity-30">
                      <i class="fas fa-image text-4xl mb-2"></i>
                      <span class="text-xs font-bold uppercase">Selecionar</span>
                    </div>
                    <div class="absolute inset-0 bg-brand/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white text-xs font-bold uppercase tracking-widest shadow-inner">Substituir</div>
                  </div>
                  <div class="p-5 bg-white">
                    <input [(ngModel)]="item.caption" [name]="'g_c_'+i" placeholder="Legenda da imagem..." class="w-full p-2 border-b-2 border-slate-50 focus:border-brand outline-none transition-all text-sm mb-4">
                    <div class="flex justify-between items-center">
                      <div class="flex gap-2">
                        <button type="button" class="w-8 h-8 rounded-lg border hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none" [disabled]="i === 0" (click)="moveGalleryItem(i, -1)"><i class="fas fa-arrow-left"></i></button>
                        <button type="button" class="w-8 h-8 rounded-lg border hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none" [disabled]="i === settings.home_gallery.length - 1" (click)="moveGalleryItem(i, 1)"><i class="fas fa-arrow-right"></i></button>
                      </div>
                      <button type="button" class="text-red-500 hover:text-red-700 p-2 text-sm font-bold uppercase tracking-widest transition-all" (click)="removeGalleryItem(i)">Remover</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="sticky h-32 pointer-events-none"></div>
          
          <div class="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-8 z-30 pointer-events-none">
            <div class="glass-card p-6 flex justify-between items-center shadow-2xl pointer-events-auto border-t-4 border-brand">
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 rounded-full bg-brand animate-pulse"></div>
                <p class="text-ink-muted text-sm font-serif">Modo de edição ativo. As alterações serão publicadas instantaneamente.</p>
              </div>
              <button type="submit" class="btn primary lg px-10 shadow-lg hover:scale-105 transition-all text-xl" [disabled]="saving">
                {{ saving ? 'Sincronizando...' : 'Publicar Alterações' }}
              </button>
            </div>
          </div>
          
        </form>
      </div>

      <app-media-picker
        [visible]="pickerOpen"
        mode="image"
        [title]="pickerTitle"
        (close)="pickerOpen = false"
        (selected)="onImageSelected($event)">
      </app-media-picker>
    </div>
  `,
  styles: [`
    .settings-page {
      --primary: #2d4f3b; /* Replicating brand colors */
      --brand: #2d4f3b;
      --accent: #d2a679;
    }
    
    .settings-tabs button {
      flex: 1;
      padding: 1rem;
      border-radius: 0.75rem;
      font-weight: 600;
      color: #718096;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 2px solid transparent;
      font-size: 0.95rem;
    }
    
    .settings-tabs button.active {
      background: white;
      color: var(--brand);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      border-color: rgba(45, 79, 59, 0.1);
      transform: translateY(-2px);
    }

    .preview-box {
      height: 100px;
      border: 2px dashed #e2e8f0;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      overflow: hidden;
      position: relative;
      background: #f8fafc;
      transition: all 0.3s;
    }

    .preview-box:hover { border-color: var(--brand); background: white; }

    .overlay {
      position: absolute; inset: 0; background: rgba(45, 79, 59, 0.85);
      display: flex; align-items: center; justify-content: center;
      color: white; font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.1em; opacity: 0; transition: all 0.3s;
    }

    .active-lang {
      border-color: var(--brand) !important;
      background: var(--brand) / 0.05;
    }

    .spinner {
      width: 40px; height: 40px; border: 4px solid rgba(45, 79, 59, 0.1);
      border-left-color: var(--brand); border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    .page-anim-fade-in { animation: fadeIn 0.6s ease-out forwards; }
    .tab-anim-up { animation: up 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }

    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 20px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e0; }

    @media (max-width: 768px) {
      .settings-page { padding: 1rem; }
      .settings-tabs { 
        position: sticky; top: 0; 
        margin-left: -1rem; margin-right: -1rem; 
        border-radius: 0; 
        overflow-x: auto; 
        padding: 0.5rem;
      }
      .settings-tabs button { padding: 0.75rem 1rem; font-size: 0.85rem; }
      .page-header h1 { font-size: 2rem; }
      .impeccable-card { padding: 1.5rem !important; }
    }
  `]
})
export class SettingsFormComponent implements OnInit {
  activeTab: 'geral' | 'homepage' | 'hubs' | 'sig' | 'galeria' = 'geral';
  
  settings: SiteSettings & {
    active_languages: string[];
    solution_modules: PlatformModuleItem[];
    state_departments: DepartmentItem[];
    target_audiences: string[];
    home_slider: Array<HomeSliderItem & { uploading?: boolean }>;
    home_action_cards: Array<HomeActionCard & { uploading?: boolean }>;
    water_hub_stats: HubStats;
    agriculture_hub_stats: HubStats;
    home_gallery: GalleryItem[];
    map_markers: MapMarker[];
    logo_admin: string;
  } = {
    site_name: '',
    logo_header: '',
    logo_footer: '',
    logo_admin: '',
    active_languages: ['pt'],
    home_slider: [],
    home_action_cards: [],
    platform_tagline: '',
    platform_summary: '',
    platform_cta_text: '',
    platform_cta_link: '',
    target_audiences: [],
    solution_modules: [],
    state_departments: [],
    about_section_title: '',
    about_section_text: '',
    about_section_button_text: '',
    about_section_button_link: '',
    about_section_image: '',
    water_hub_stats: { label1: '', value1: undefined, label2: '', value2: undefined, label3: '', value3: undefined, label4: '', value4: undefined },
    agriculture_hub_stats: { label1: '', value1: undefined, label2: '', value2: undefined, label3: '', value3: undefined, label4: '', value4: undefined },
    home_gallery: [],
    map_markers: [],
  };

  loading = true;
  saving = false;
  pickerOpen = false;
  pickerTitle = '';
  audienceDraft = '';

  pickerTarget: 'logo_header' | 'logo_footer' | 'logo_admin' | 'about_section_image' | 'slide' | 'action_card' | 'gallery' = 'logo_header';
  pickerIndex = -1;

  constructor(
    private settingsService: SettingsService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  openImagePicker(
    target: 'logo_header' | 'logo_footer' | 'logo_admin' | 'about_section_image' | 'slide' | 'action_card' | 'gallery',
    title: string,
    index = -1
  ): void {
    this.pickerTarget = target;
    this.pickerTitle = title;
    this.pickerIndex = index;
    this.pickerOpen = true;
  }

  onImageSelected(selection: MediaPickerSelection): void {
    if (this.pickerTarget === 'slide' && this.pickerIndex >= 0) {
      if (this.settings.home_slider[this.pickerIndex]) {
        this.settings.home_slider[this.pickerIndex].image = selection.url;
      }
    } else if (this.pickerTarget === 'action_card' && this.pickerIndex >= 0) {
      if (this.settings.home_action_cards[this.pickerIndex]) {
        this.settings.home_action_cards[this.pickerIndex].image = selection.url;
      }
    } else if (this.pickerTarget === 'logo_header') {
      this.settings.logo_header = selection.url;
    } else if (this.pickerTarget === 'logo_footer') {
      this.settings.logo_footer = selection.url;
    } else if (this.pickerTarget === 'logo_admin') {
      this.settings.logo_admin = selection.url;
    } else if (this.pickerTarget === 'about_section_image') {
      this.settings.about_section_image = selection.url;
    } else if (this.pickerTarget === 'gallery' && this.pickerIndex >= 0) {
      if (this.settings.home_gallery[this.pickerIndex]) {
        this.settings.home_gallery[this.pickerIndex].url = selection.url;
      }
    }

    this.pickerOpen = false;
    this.pickerIndex = -1;
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

  addSlide(): void {
    this.settings.home_slider.push({ title: '', subtitle: '', image: '', uploading: false });
  }

  removeSlide(index: number): void {
    this.settings.home_slider.splice(index, 1);
  }

  addActionCard(): void {
    this.settings.home_action_cards.push({ icon: '', title: '', subtitle: '', link: '/', image: '', uploading: false });
  }

  removeActionCard(index: number): void {
    this.settings.home_action_cards.splice(index, 1);
  }

  addSolutionModule(): void {
    this.settings.solution_modules.push({ name: '', summary: '', link: '', audience: '', status: 'planned' });
  }

  removeSolutionModule(index: number): void {
    this.settings.solution_modules.splice(index, 1);
  }

  addDepartment(): void {
    this.settings.state_departments.push({ name: '', summary: '', focus: '', link: '' });
  }

  removeDepartment(index: number): void {
    this.settings.state_departments.splice(index, 1);
  }
  
  addGalleryItem(): void {
    this.settings.home_gallery.push({ url: '', caption: '' });
  }

  removeGalleryItem(index: number): void {
    if (confirm('Tem a certeza que deseja suprimir esta imagem do acervo?')) {
      this.settings.home_gallery.splice(index, 1);
    }
  }

  moveGalleryItem(index: number, direction: number): void {
    const newPos = index + direction;
    if (newPos < 0 || newPos >= this.settings.home_gallery.length) return;
    const temp = this.settings.home_gallery[index];
    this.settings.home_gallery[index] = this.settings.home_gallery[newPos];
    this.settings.home_gallery[newPos] = temp;
  }

  addMapMarker(): void {
    if (!this.settings.map_markers) this.settings.map_markers = [];
    this.settings.map_markers.push({ lat: 11.86, lng: -15.59, title: '', type: 'furo', description: '' });
  }

  removeMapMarker(index: number): void {
    if (this.settings.map_markers) {
      this.settings.map_markers.splice(index, 1);
    }
  }

  save(): void {
    this.saving = true;
    this.settings.target_audiences = this.audienceDraft
      ? this.audienceDraft.split(',').map((item) => item.trim()).filter(Boolean)
      : [];

    this.settingsService.updateSettings({
      ...this.settings,
      home_slider: (this.settings.home_slider || []).map((item: any) => {
        const { uploading, ...rest } = item;
        return rest;
      }),
      home_action_cards: (this.settings.home_action_cards || []).map((item: any) => {
        const { uploading, ...rest } = item;
        return rest;
      })
    } as any).subscribe({
      next: () => {
        this.settingsService.clearCache();
        this.saving = false;
        this.toast.success('Alterações publicadas com sucesso.');
      },
      error: () => {
        this.saving = false;
        this.toast.error('Erro ao guardar configurações. Tente novamente.');
      }
    });
  }

  loadSettings(): void {
    this.settingsService.getSettings().subscribe({
      next: (res) => {
        this.settings.site_name = res.site_name || '';
        this.settings.logo_header = res.logo_header || '';
        this.settings.logo_footer = res.logo_footer || '';
        this.settings.logo_admin = res.logo_admin || '';
        this.settings.active_languages = res.active_languages || ['pt'];
        this.settings.home_slider = (res.home_slider || []).map((slide) => ({ ...slide, uploading: false }));
        this.settings.home_action_cards = (res.home_action_cards?.length ? res.home_action_cards : this.createDefaultActionCards())
          .map((card) => ({ ...card, uploading: false }));
        this.settings.platform_tagline = res.platform_tagline || 'Plataforma digital de gestão ambiental e agrícola';
        this.settings.platform_summary = res.platform_summary || 'Centralize fiscalização, extensão agrícola, conteúdo técnico e colaboração interdepartamental.';
        this.settings.platform_cta_text = res.platform_cta_text || 'Explorar a plataforma';
        this.settings.platform_cta_link = res.platform_cta_link || '/solutions';
        this.settings.target_audiences = res.target_audiences?.length ? res.target_audiences : this.createDefaultAudiences();
        this.settings.solution_modules = res.solution_modules?.length ? res.solution_modules : this.createDefaultSolutionModules();
        this.settings.state_departments = res.state_departments?.length ? res.state_departments : this.createDefaultDepartments();
        this.settings.about_section_title = res.about_section_title || 'Sobre o MINISTÉRIO';
        this.settings.about_section_text = res.about_section_text || 'Missão de promoção do desenvolvimento sustentável através da preservação, proteção e conservação do ambiente.';
        this.settings.about_section_button_text = res.about_section_button_text || 'Ver Missão e Visão';
        this.settings.about_section_button_link = res.about_section_button_link || '/pages/quem-somos';
        this.settings.about_section_image = res.about_section_image || '';
        this.settings.water_hub_stats = {
          label1: res.water_hub_stats?.label1 || '',
          value1: res.water_hub_stats?.value1,
          label2: res.water_hub_stats?.label2 || '',
          value2: res.water_hub_stats?.value2,
          label3: res.water_hub_stats?.label3 || '',
          value3: res.water_hub_stats?.value3,
          label4: res.water_hub_stats?.label4 || '',
          value4: res.water_hub_stats?.value4,
        };
        this.settings.agriculture_hub_stats = {
          label1: res.agriculture_hub_stats?.label1 || '',
          value1: res.agriculture_hub_stats?.value1,
          label2: res.agriculture_hub_stats?.label2 || '',
          value2: res.agriculture_hub_stats?.value2,
          label3: res.agriculture_hub_stats?.label3 || '',
          value3: res.agriculture_hub_stats?.value3,
          label4: res.agriculture_hub_stats?.label4 || '',
          value4: res.agriculture_hub_stats?.value4,
        };
        this.settings.home_gallery = res.home_gallery || [];
        this.settings.map_markers = res.map_markers || [];
        this.audienceDraft = this.settings.target_audiences.join(', ');
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Settings load error:', err);
        this.toast.error('Erro ao conectar ao servidor de configurações.');
      }
    });
  }

  public createDefaultActionCards(): HomeActionCard[] {
    return [
      { icon: 'Den', title: 'Denúncias Ambientais', subtitle: 'Reporte irregularidades', link: '/denuncias' },
      { icon: 'Bio', title: 'Áreas Protegidas', subtitle: 'Explore a biodiversidade', link: '/biodiversity' },
      { icon: 'Lei', title: 'Legislação Ambiental', subtitle: 'Conheça as leis', link: '/posts' },
      { icon: 'Dados', title: 'Dados e Estatísticas', subtitle: 'Relatórios atualizados', link: '/biodiversity' }
    ];
  }

  private createDefaultAudiences(): string[] {
    return ['Técnicos ambientais', 'Extensionistas agrícolas', 'Gestores públicos', 'Departamentos parceiros'];
  }

  private createDefaultSolutionModules(): PlatformModuleItem[] {
    return [
      { name: 'Fiscalização ambiental', summary: 'Registo de ocorrências e missões em campo.', link: '/denuncias', audience: 'Inspeção e controlo', status: 'active' },
      { name: 'Extensão agrícola', summary: 'Orientação e campanhas para produtores.', link: '/posts', audience: 'Agricultura', status: 'pilot' },
      { name: 'Biblioteca técnico-legal', summary: 'Centralize legislação e manuais.', link: '/posts', audience: 'Direções técnicas', status: 'active' },
      { name: 'Gestão interdepartamental', summary: 'Estrutura para novos departamentos.', link: '/pages/quem-somos', audience: 'Administração do Estado', status: 'planned' }
    ];
  }

  private createDefaultDepartments(): DepartmentItem[] {
    return [
      { name: 'Ambiente e Biodiversidade', summary: 'Coordena conservação e fiscalização.', focus: 'Conservação, clima', link: '/biodiversity' },
      { name: 'Agricultura Sustentável', summary: 'Opera campanhas e extensão rural.', focus: 'Produção, solos', link: '/posts' },
      { name: 'Recursos Hídricos e Solo', summary: 'Acolhe dados de recursos naturais.', focus: 'Água, bacias', link: '/areas' }
    ];
  }
}
