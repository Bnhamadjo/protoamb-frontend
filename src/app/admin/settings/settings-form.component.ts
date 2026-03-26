import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DepartmentItem, HomeActionCard, HomeSliderItem, HubStats, PlatformModuleItem, SettingsService, SiteSettings } from '../../services/settings.service';
import { MediaPickerComponent, MediaPickerSelection } from '../../shared/media-picker/media-picker.component';
import { ToastService } from '../../services/toast.service';

@Component({
  standalone: true, //
  selector: 'app-settings-form',
  imports: [CommonModule, FormsModule, RouterLink, MediaPickerComponent],
  template: `
    <div class="settings-container">
      <h1>Configuracoes do Portal</h1>
      <p class="muted">Gerencie as informacoes basicas e os blocos principais da home publica.</p>

      <div *ngIf="loading" class="muted center" style="padding: 40px">Carregando configuracoes...</div>

      <div class="card settings-card" *ngIf="!loading">
        <form (ngSubmit)="save()">
          <div class="form-group">
            <label>Nome do Site</label>
            <input [(ngModel)]="settings.site_name" name="site_name" class="form-control" placeholder="Ex: ProtoAmb - Portal de Biodiversidade">
          </div>

          <div class="form-group section-block">
            <label>Perfil da Plataforma MAB</label>
            <p class="muted sm" style="margin-bottom: 20px;">Defina a proposta da plataforma para ambiente, agricultura e futuras entidades do Estado.</p>

            <div class="form-group">
              <label>Tagline institucional</label>
              <input [(ngModel)]="settings.platform_tagline" name="platform_tagline" class="form-control" placeholder="Ex: Plataforma digital para ambiente, agricultura e gestao territorial">
            </div>

            <div class="form-group">
              <label>Resumo estrategico</label>
              <textarea [(ngModel)]="settings.platform_summary" name="platform_summary" class="form-control" rows="5" placeholder="Explique o valor da plataforma para tecnicos, direcoes nacionais e departamentos parceiros"></textarea>
            </div>

            <div class="grid-2" style="gap: 16px;">
              <div class="form-group">
                <label>Texto do CTA</label>
                <input [(ngModel)]="settings.platform_cta_text" name="platform_cta_text" class="form-control" placeholder="Ex: Explorar a plataforma">
              </div>
              <div class="form-group">
                <label>Link do CTA</label>
                <input [(ngModel)]="settings.platform_cta_link" name="platform_cta_link" class="form-control" placeholder="Ex: /solutions">
              </div>
            </div>

            <div class="form-group">
              <label>Audiencias-alvo</label>
              <textarea [(ngModel)]="audienceDraft" name="audience_draft" class="form-control" rows="3" placeholder="Separe por virgula. Ex: Tecnicos ambientais, extensionistas agricolas, decisores publicos"></textarea>
              <p class="muted sm" style="margin-top: 8px;">O texto sera convertido em etiquetas publicas da plataforma.</p>
            </div>
          </div>

          <div class="grid-2">
            <div class="logo-upload">
              <label>Logotipo do Header</label>
              <div class="preview-box" (click)="openImagePicker('logo_header', 'Selecionar logotipo do header')">
                <img *ngIf="settings.logo_header" [src]="settings.logo_header" alt="Header Logo">
                <div *ngIf="!settings.logo_header" class="placeholder">Abrir galeria</div>
              </div>
            </div>

            <div class="logo-upload">
              <label>Logotipo do Rodape</label>
              <div class="preview-box" (click)="openImagePicker('logo_footer', 'Selecionar logotipo do rodape')">
                <img *ngIf="settings.logo_footer" [src]="settings.logo_footer" alt="Footer Logo">
                <div *ngIf="!settings.logo_footer" class="placeholder">Abrir galeria</div>
              </div>
            </div>
          </div>

          <div class="form-group section-block">
            <div class="section-head">
              <label style="margin: 0;">Slides do Banner Principal</label>
              <button type="button" class="btn sm outline" (click)="addSlide()">+ Adicionar Slide</button>
            </div>

            <div *ngFor="let slide of settings.home_slider; let i = index" class="slide-item card">
              <div class="slide-header">
                <strong>Slide #{{ i + 1 }}</strong>
                <button type="button" class="btn btn-icon danger" (click)="removeSlide(i)">Remover</button>
              </div>

              <div class="grid-2" style="gap: 20px; margin-top: 15px;">
                <div>
                  <div class="form-group">
                    <label class="sm">Titulo</label>
                    <input [(ngModel)]="slide.title" [name]="'slide_title_' + i" class="form-control sm">
                  </div>
                  <div class="form-group">
                    <label class="sm">Subtitulo</label>
                    <input [(ngModel)]="slide.subtitle" [name]="'slide_sub_' + i" class="form-control sm">
                  </div>
                </div>

                <div>
                  <div class="preview-mini" (click)="openImagePicker('slide', 'Selecionar imagem do slide', i)">
                    <img *ngIf="slide.image" [src]="slide.image" alt="Slide Image">
                    <div *ngIf="!slide.image" class="placeholder sm">Imagem</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="form-group section-block">
            <div class="section-head">
              <label style="margin: 0;">Blocos de Acao da Home</label>
              <button type="button" class="btn sm outline" (click)="addActionCard()">+ Adicionar Bloco</button>
            </div>
            <p class="muted sm" style="margin-bottom: 20px;">O admin pode mudar icone curto, titulo, descricao e destino de cada cartao.</p>

            <div *ngFor="let card of settings.home_action_cards; let i = index" class="slide-item card">
              <div class="slide-header">
                <strong>Bloco #{{ i + 1 }}</strong>
                <button type="button" class="btn btn-icon danger" (click)="removeActionCard(i)">Remover</button>
              </div>

              <div class="grid-2" style="gap: 20px; margin-top: 15px;">
                <div class="form-group">
                  <label class="sm">Icone curto</label>
                  <input [(ngModel)]="card.icon" [name]="'card_icon_' + i" class="form-control sm" maxlength="10" placeholder="Ex: Den">
                </div>
                <div class="form-group">
                  <label class="sm">Link</label>
                  <input [(ngModel)]="card.link" [name]="'card_link_' + i" class="form-control sm" placeholder="Ex: /denuncias">
                </div>
                <div class="form-group">
                  <label class="sm">Titulo</label>
                  <input [(ngModel)]="card.title" [name]="'card_title_' + i" class="form-control sm" placeholder="Titulo do bloco">
                </div>
                <div class="form-group">
                  <label class="sm">Subtitulo</label>
                  <input [(ngModel)]="card.subtitle" [name]="'card_subtitle_' + i" class="form-control sm" placeholder="Texto curto do bloco">
                </div>
                <div class="form-group" style="grid-column: 1 / -1;">
                  <label class="sm">Imagem de Fundo</label>
                  <div class="preview-mini card-preview" (click)="openImagePicker('action_card', 'Selecionar imagem do bloco', i)">
                    <img *ngIf="card.image" [src]="card.image" alt="Imagem do bloco">
                    <div *ngIf="!card.image" class="placeholder sm">Clique para abrir a galeria</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="form-group section-block">
            <label>Secao Sobre o Ministerio</label>
            <p class="muted sm" style="margin-bottom: 20px;">Aqui o admin controla o texto, a imagem e o botao exibidos na home.</p>

            <div class="grid-2" style="gap: 24px;">
              <div>
                <div class="form-group">
                  <label>Titulo</label>
                  <input [(ngModel)]="settings.about_section_title" name="about_section_title" class="form-control" placeholder="Ex: Sobre o MINISTERIO">
                </div>

                <div class="form-group">
                  <label>Texto</label>
                  <textarea [(ngModel)]="settings.about_section_text" name="about_section_text" class="form-control" rows="6" placeholder="Descricao exibida na home"></textarea>
                </div>

                <div class="grid-2" style="gap: 16px;">
                  <div class="form-group">
                    <label>Texto do Botao</label>
                    <input [(ngModel)]="settings.about_section_button_text" name="about_section_button_text" class="form-control" placeholder="Ex: Ver Missao e Visao">
                  </div>
                  <div class="form-group">
                    <label>Link do Botao</label>
                    <input [(ngModel)]="settings.about_section_button_link" name="about_section_button_link" class="form-control" placeholder="Ex: /pages/sobre-nos">
                  </div>
                </div>
              </div>

              <div>
                <div class="logo-upload">
                  <label>Imagem da Secao</label>
                  <div class="preview-box about-preview" (click)="openImagePicker('about_section_image', 'Selecionar imagem da secao sobre')">
                    <img *ngIf="settings.about_section_image" [src]="settings.about_section_image" alt="Imagem da secao sobre">
                    <div *ngIf="!settings.about_section_image" class="placeholder">Abrir galeria</div>
                  </div>
                </div>

                <a *ngIf="settings.about_section_button_link" [routerLink]="settings.about_section_button_link" class="btn sm outline">
                  Testar destino do botao
                </a>
              </div>
            </div>
          </div>

          <div class="form-group section-block">
            <div class="section-head">
              <label style="margin: 0;">Modulos de Solucao</label>
              <button type="button" class="btn sm outline" (click)="addSolutionModule()">+ Adicionar Modulo</button>
            </div>
            <p class="muted sm" style="margin-bottom: 20px;">Liste os modulos MAB do portal de trabalho para ambiente e agricultura.</p>

            <div *ngFor="let module of settings.solution_modules; let i = index" class="slide-item card">
              <div class="slide-header">
                <strong>Modulo #{{ i + 1 }}</strong>
                <button type="button" class="btn btn-icon danger" (click)="removeSolutionModule(i)">Remover</button>
              </div>

              <div class="grid-2" style="gap: 20px; margin-top: 15px;">
                <div class="form-group">
                  <label class="sm">Nome</label>
                  <input [(ngModel)]="module.name" [name]="'module_name_' + i" class="form-control sm" placeholder="Ex: Fiscalizacao ambiental">
                </div>
                <div class="form-group">
                  <label class="sm">Publico principal</label>
                  <input [(ngModel)]="module.audience" [name]="'module_audience_' + i" class="form-control sm" placeholder="Ex: Inspetores, tecnicos de campo">
                </div>
                <div class="form-group">
                  <label class="sm">Estado</label>
                  <select [(ngModel)]="module.status" [name]="'module_status_' + i" class="form-control sm">
                    <option value="active">Ativo</option>
                    <option value="pilot">Piloto</option>
                    <option value="planned">Planeado</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="sm">Link complementar</label>
                  <input [(ngModel)]="module.link" [name]="'module_link_' + i" class="form-control sm" placeholder="Opcional: recurso relacionado, ex: /posts">
                </div>
                <div class="form-group" style="grid-column: 1 / -1;">
                  <label class="sm">Resumo</label>
                  <textarea [(ngModel)]="module.summary" [name]="'module_summary_' + i" class="form-control sm" rows="3" placeholder="Descreva a capacidade tecnica do modulo"></textarea>
                </div>
              </div>
            </div>
          </div>

          <div class="form-group section-block">
            <div class="section-head">
              <label style="margin: 0;">Departamentos do Estado</label>
              <button type="button" class="btn sm outline" (click)="addDepartment()">+ Adicionar Departamento</button>
            </div>
            <p class="muted sm" style="margin-bottom: 20px;">Prepare o portal para acomodar novas direcoes, institutos e organismos ligados ao tema.</p>

            <div *ngFor="let department of settings.state_departments; let i = index" class="slide-item card">
              <div class="slide-header">
                <strong>Departamento #{{ i + 1 }}</strong>
                <button type="button" class="btn btn-icon danger" (click)="removeDepartment(i)">Remover</button>
              </div>

              <div class="grid-2" style="gap: 20px; margin-top: 15px;">
                <div class="form-group">
                  <label class="sm">Nome</label>
                  <input [(ngModel)]="department.name" [name]="'department_name_' + i" class="form-control sm" placeholder="Ex: Direcao Geral de Agricultura">
                </div>
                <div class="form-group">
                  <label class="sm">Area de foco</label>
                  <input [(ngModel)]="department.focus" [name]="'department_focus_' + i" class="form-control sm" placeholder="Ex: Producao, solos, resiliencia climatica">
                </div>
                <div class="form-group">
                  <label class="sm">Link complementar</label>
                  <input [(ngModel)]="department.link" [name]="'department_link_' + i" class="form-control sm" placeholder="Opcional: pagina ou area relacionada">
                </div>
                <div class="form-group" style="grid-column: 1 / -1;">
                  <label class="sm">Resumo</label>
                  <textarea [(ngModel)]="department.summary" [name]="'department_summary_' + i" class="form-control sm" rows="3" placeholder="Descreva o papel do departamento na plataforma"></textarea>
                </div>
              </div>
            </div>
          </div>

          <div class="form-group section-block">
            <div class="section-head">
              <label style="margin: 0;">Indicadores do Hub: Recursos Hídricos</label>
            </div>
            <p class="muted sm" style="margin-bottom: 20px;">Edicione os valores dos KPIs apresentados no topo da pagina Recursos Hidricos (deixe em branco para usar os valores padrao).</p>
            <div class="grid-2" style="gap: 16px;">
              <div class="form-group">
                <label class="sm">KPI 1 - Etiqueta</label>
                <input [(ngModel)]="settings.water_hub_stats.label1" name="water_s_l1" class="form-control sm" placeholder="Ex: Bacias Monitorizadas">
              </div>
              <div class="form-group">
                <label class="sm">KPI 1 - Valor</label>
                <input type="number" [(ngModel)]="settings.water_hub_stats.value1" name="water_s_v1" class="form-control sm" placeholder="Ex: 12">
              </div>
              <div class="form-group">
                <label class="sm">KPI 2 - Etiqueta</label>
                <input [(ngModel)]="settings.water_hub_stats.label2" name="water_s_l2" class="form-control sm" placeholder="Ex: Indice de Qualidade">
              </div>
              <div class="form-group">
                <label class="sm">KPI 2 - Valor (%)</label>
                <input type="number" [(ngModel)]="settings.water_hub_stats.value2" name="water_s_v2" class="form-control sm" placeholder="Ex: 85">
              </div>
              <div class="form-group">
                <label class="sm">KPI 3 - Etiqueta</label>
                <input [(ngModel)]="settings.water_hub_stats.label3" name="water_s_l3" class="form-control sm" placeholder="Ex: Planos em Vigor">
              </div>
              <div class="form-group">
                <label class="sm">KPI 3 - Valor</label>
                <input type="number" [(ngModel)]="settings.water_hub_stats.value3" name="water_s_v3" class="form-control sm" placeholder="Ex: 24">
              </div>
              <div class="form-group">
                <label class="sm">KPI 4 - Etiqueta</label>
                <input [(ngModel)]="settings.water_hub_stats.label4" name="water_s_l4" class="form-control sm" placeholder="Ex: Registos Espaciais">
              </div>
              <div class="form-group">
                <label class="sm">KPI 4 - Valor (k)</label>
                <input type="number" step="0.1" [(ngModel)]="settings.water_hub_stats.value4" name="water_s_v4" class="form-control sm" placeholder="Ex: 5.2">
              </div>
            </div>
          </div>

          <div class="form-group section-block">
            <div class="section-head">
              <label style="margin: 0;">Indicadores do Hub: Extensao Agricola</label>
            </div>
            <p class="muted sm" style="margin-bottom: 20px;">Edite os valores dos KPIs apresentados no topo da pagina Extensao Agricola.</p>
            <div class="grid-2" style="gap: 16px;">
              <div class="form-group">
                <label class="sm">KPI 1 - Etiqueta</label>
                <input [(ngModel)]="settings.agriculture_hub_stats.label1" name="ag_s_l1" class="form-control sm" placeholder="Ex: Produtores Assistidos">
              </div>
              <div class="form-group">
                <label class="sm">KPI 1 - Valor (k)</label>
                <input type="number" step="0.1" [(ngModel)]="settings.agriculture_hub_stats.value1" name="ag_s_v1" class="form-control sm" placeholder="Ex: 4.8">
              </div>
              <div class="form-group">
                <label class="sm">KPI 2 - Etiqueta</label>
                <input [(ngModel)]="settings.agriculture_hub_stats.label2" name="ag_s_l2" class="form-control sm" placeholder="Ex: Campanhas MAB">
              </div>
              <div class="form-group">
                <label class="sm">KPI 2 - Valor</label>
                <input type="number" [(ngModel)]="settings.agriculture_hub_stats.value2" name="ag_s_v2" class="form-control sm" placeholder="Ex: 12">
              </div>
              <div class="form-group">
                <label class="sm">KPI 3 - Etiqueta</label>
                <input [(ngModel)]="settings.agriculture_hub_stats.label3" name="ag_s_l3" class="form-control sm" placeholder="Ex: Apoios no Terreno">
              </div>
              <div class="form-group">
                <label class="sm">KPI 3 - Valor</label>
                <input type="number" [(ngModel)]="settings.agriculture_hub_stats.value3" name="ag_s_v3" class="form-control sm" placeholder="Ex: 1450">
              </div>
              <div class="form-group">
                <label class="sm">KPI 4 - Etiqueta</label>
                <input [(ngModel)]="settings.agriculture_hub_stats.label4" name="ag_s_l4" class="form-control sm" placeholder="Ex: Eficiencia no Foco">
              </div>
              <div class="form-group">
                <label class="sm">KPI 4 - Valor (%)</label>
                <input type="number" [(ngModel)]="settings.agriculture_hub_stats.value4" name="ag_s_v4" class="form-control sm" placeholder="Ex: 94">
              </div>
            </div>
          </div>

          <div class="form-group languages-section">
            <label>Idiomas Ativos</label>
            <div class="checkbox-group">
              <label class="checkbox-item">
                <input type="checkbox" [checked]="isLangActive('pt')" (change)="toggleLang('pt')"> Portugues (PT)
              </label>
              <label class="checkbox-item">
                <input type="checkbox" [checked]="isLangActive('en')" (change)="toggleLang('en')"> English (EN)
              </label>
              <label class="checkbox-item">
                <input type="checkbox" [checked]="isLangActive('fr')" (change)="toggleLang('fr')"> Francais (FR)
              </label>
            </div>
          </div>

          <div class="actions">
            <button type="submit" class="btn primary" [disabled]="saving">
              {{ saving ? 'Guardando...' : 'Guardar Configuracoes' }}
            </button>
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
    .settings-container { animation: fadeIn 0.4s ease-out; max-width: 900px; }
    .settings-card { padding: 30px; margin-top: 24px; }
    .form-group { margin-bottom: 24px; }
    .section-block { border-top: 1px solid var(--border); padding-top: 24px; }
    .section-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; gap: 16px; }

    .logo-upload { margin-bottom: 24px; }
    .preview-box {
      height: 120px; border: 2px dashed var(--border); border-radius: 8px;
      display: flex; align-items: center; justify-content: center; cursor: pointer;
      overflow: hidden; position: relative; background: var(--bg-app);
      transition: var(--transition);
    }
    .preview-box:hover { border-color: var(--primary); }
    .preview-box img { max-height: 90%; max-width: 90%; object-fit: contain; }
    .about-preview { height: 260px; }
    .about-preview img { max-height: 100%; max-width: 100%; width: 100%; height: 100%; object-fit: cover; }
    .placeholder { color: var(--ink-muted); font-size: 0.85rem; }
    .overlay {
      position: absolute; inset: 0; background: rgba(255,255,255,0.8);
      display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 600;
    }

    .languages-section { border-top: 1px solid var(--border); padding-top: 24px; }
    .slide-item { padding: 15px; margin-bottom: 15px; border: 1px solid var(--border); background: #fafafa; }
    .slide-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 10px; gap: 12px; }
    .preview-mini {
      height: 100px; border: 1px dashed var(--border); border-radius: 6px;
      display: flex; align-items: center; justify-content: center; cursor: pointer;
      overflow: hidden; position: relative; background: #fff;
    }
    .preview-mini img { max-height: 100%; max-width: 100%; object-fit: cover; }
    .card-preview { height: 150px; }
    .card-preview img { width: 100%; height: 100%; max-width: none; max-height: none; object-fit: cover; }
    .btn-icon { background: none; border: none; cursor: pointer; font-size: 0.95rem; padding: 4px; border-radius: 4px; transition: 0.2s; }
    .btn-icon:hover { background: #fee2e2; }

    .checkbox-group { display: flex; gap: 20px; margin-top: 10px; flex-wrap: wrap; }
    .actions { border-top: 1px solid var(--border); padding-top: 24px; display: flex; justify-content: flex-end; }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class SettingsFormComponent implements OnInit {
  settings: SiteSettings & {
    active_languages: string[];
    solution_modules: PlatformModuleItem[];
    state_departments: DepartmentItem[];
    target_audiences: string[];
    home_slider: Array<HomeSliderItem & { uploading?: boolean }>;
    home_action_cards: Array<HomeActionCard & { uploading?: boolean }>;
    water_hub_stats: HubStats;
    agriculture_hub_stats: HubStats;
  } = {
    site_name: '',
    logo_header: '',
    logo_footer: '',
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
  };

  loading = true;
  saving = false; //
  pickerOpen = false;
  pickerTitle = '';
  audienceDraft = '';

  pickerTarget: 'logo_header' | 'logo_footer' | 'about_section_image' | 'slide' | 'action_card' = 'logo_header';
  pickerIndex = -1;

  constructor(
    private settingsService: SettingsService,
    private toast: ToastService
  ) {}


  ngOnInit(): void {
    this.loadSettings();
  }
  openImagePicker(
    target: 'logo_header' | 'logo_footer' | 'about_section_image' | 'slide' | 'action_card',
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
    } else if (this.pickerTarget === 'about_section_image') {
      this.settings.about_section_image = selection.url;
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



  save(): void {
    this.saving = true;
    this.settings.target_audiences = this.audienceDraft
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    this.settingsService.updateSettings({
      ...this.settings,
      home_slider: this.settings.home_slider.map((item: any) => {
        const { uploading, ...rest } = item;
        return rest;
      }),
      home_action_cards: this.settings.home_action_cards.map((item: any) => {
        const { uploading, ...rest } = item;
        return rest;
      })
    }).subscribe({
      next: () => {
        this.settingsService.clearCache();
        this.saving = false;
        this.toast.success('Configuracoes atualizadas com sucesso.');
      },
      error: () => {
        this.saving = false;
        this.toast.error('Erro ao guardar configuracoes.');
      }
    });
  }

  loadSettings(): void {
    this.settingsService.getSettings().subscribe({
      next: (res) => {
        this.settings.site_name = res.site_name || '';
        this.settings.logo_header = res.logo_header || '';
        this.settings.logo_footer = res.logo_footer || '';
        this.settings.active_languages = res.active_languages || ['pt'];
        this.settings.home_slider = (res.home_slider || []).map((slide) => ({ ...slide, uploading: false }));
        this.settings.home_action_cards = (res.home_action_cards?.length ? res.home_action_cards : this.createDefaultActionCards())
          .map((card) => ({ ...card, uploading: false }));
        this.settings.platform_tagline = res.platform_tagline || 'Plataforma digital de gestao ambiental e agricola';
        this.settings.platform_summary = res.platform_summary || 'Centralize fiscalizacao, extensao agricola, conteudo tecnico, bibliotecas documentais e colaboracao interdepartamental numa unica solucao estatal.';
        this.settings.platform_cta_text = res.platform_cta_text || 'Explorar a plataforma';
        this.settings.platform_cta_link = res.platform_cta_link || '/solutions';
        this.settings.target_audiences = res.target_audiences?.length ? res.target_audiences : this.createDefaultAudiences();
        this.settings.solution_modules = res.solution_modules?.length ? res.solution_modules : this.createDefaultSolutionModules();
        this.settings.state_departments = res.state_departments?.length ? res.state_departments : this.createDefaultDepartments();
        this.settings.about_section_title = res.about_section_title || 'Sobre o MINISTERIO';
        this.settings.about_section_text = res.about_section_text || 'MINISTERIO do Ambiente e Biodiversidade tem como missao a promocao do desenvolvimento sustentavel atraves da preservacao, protecao e conservacao do ambiente e da biodiversidade na Guine-Bissau.';
        this.settings.about_section_button_text = res.about_section_button_text || 'Ver Missao e Visao';
        this.settings.about_section_button_link = res.about_section_button_link || '/pages/sobre-nos';
        this.settings.about_section_image = res.about_section_image || '';
        // Hub stats — use stored values or empty (components use their own hardcoded fallbacks)
        this.settings.water_hub_stats = res.water_hub_stats || { label1: '', value1: undefined, label2: '', value2: undefined, label3: '', value3: undefined, label4: '', value4: undefined };
        this.settings.agriculture_hub_stats = res.agriculture_hub_stats || { label1: '', value1: undefined, label2: '', value2: undefined, label3: '', value3: undefined, label4: '', value4: undefined };
        this.audienceDraft = this.settings.target_audiences.join(', ');
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Settings load error:', err);
        this.toast.error('Erro ao carregar configuracoes.');
      }
    });
  }

  //
  // The createDefaultActionCards method is a public method that returns an array of HomeActionCard objects.
  // It provides default values for the action cards displayed on the home page.
  public createDefaultActionCards(): HomeActionCard[] {
    return [
      { icon: 'Den', title: 'Denuncias Ambientais', subtitle: 'Reporte irregularidades', link: '/denuncias' }, //
      { icon: 'Bio', title: 'Areas Protegidas', subtitle: 'Explore a biodiversidade', link: '/biodiversity' }, //
      { icon: 'Lei', title: 'Legislacao Ambiental', subtitle: 'Conheca as leis', link: '/posts' }, //
      { icon: 'Dados', title: 'Dados e Estatisticas', subtitle: 'Relatorios atualizados', link: '/biodiversity' } //
    ];
  }

  //
  // The createDefaultAudiences method is a private method that returns an array of strings.
  // It provides default target audiences for the platform.
  private createDefaultAudiences(): string[] {
    return ['Tecnicos ambientais', 'Extensionistas agricolas', 'Gestores publicos', 'Departamentos parceiros']; //
  }

  //
  // The createDefaultSolutionModules method is a private method that returns an array of PlatformModuleItem objects.
  // It provides default solution modules for the MAB portal.
  private createDefaultSolutionModules(): PlatformModuleItem[] {
    return [
      { name: 'Fiscalizacao ambiental', summary: 'Registo de ocorrencias, missoes, evidencias e acompanhamento tecnico em campo.', link: '/denuncias', audience: 'Inspecao e controlo', status: 'active' }, //
      { name: 'Extensao agricola', summary: 'Publicacao de orientacoes, campanhas, boas praticas e materiais de apoio a produtores.', link: '/posts', audience: 'Agricultura e desenvolvimento rural', status: 'pilot' }, //
      { name: 'Biblioteca tecnico-legal', summary: 'Centralize legislacao, manuais, pareceres, relatorios e anexos PDF numa base unica.', link: '/posts', audience: 'Direcoes tecnicas e juridicas', status: 'active' }, //
      { name: 'Gestao interdepartamental', summary: 'Estruture paginas, menus e servicos para novos departamentos sem refazer o portal.', link: '/pages/sobre-nos', audience: 'Administracao do Estado', status: 'planned' } //
    ];
  }

  //
  // The createDefaultDepartments method is a private method that returns an array of DepartmentItem objects.
  // It provides default state departments for the portal.
  private createDefaultDepartments(): DepartmentItem[] {
    return [
      { name: 'Ambiente e Biodiversidade', summary: 'Coordena conservacao, fiscalizacao e monitorizacao dos recursos naturais.', focus: 'Conservacao, clima, fiscalizacao', link: '/biodiversity' }, //
      { name: 'Agricultura Sustentavel', summary: 'Pode operar campanhas, extensao, conteudo tecnico e programas de resiliencia agricola.', focus: 'Producao, solos, extensao rural', link: '/posts' }, //
      { name: 'Recursos Hidricos e Solo', summary: 'Acolhe dados, publicacoes e instrumentos de gestao territorial e uso da terra.', focus: 'Agua, erosao, bacias, ordenamento', link: '/areas' } //
    ];
  }
}
