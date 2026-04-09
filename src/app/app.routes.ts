import { Routes } from '@angular/router';
import { authGuard } from './core/auth-guard';
import { LayoutComponent } from './admin/layout/layout';
import { DashboardComponent } from './admin/dashboard/dashboard';
import { LoginComponent } from './auth/login/login.component';
import { PublicLayoutComponent } from './public/layout/public-layout.component';

export const routes: Routes = [


  // -------------------------------------------------------------------------
  // AUTH ROUTES
  // -------------------------------------------------------------------------
  { path: 'login', component: LoginComponent },

  // -------------------------------------------------------------------------
  // ADMIN ROUTES
  // -------------------------------------------------------------------------
  {
    path: 'admin',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      
      // Páginas
      {
        path: 'pages',
        loadComponent: () => import('./admin/pages/pages-list/page-list.component').then(m => m.PagesListComponent),
        data: { roles: ['admin', 'tecnico'] }
      },
      {
        path: 'pages/new',
        loadComponent: () => import('./admin/pages/pages-form/page-form.component').then(m => m.PagesFormComponent)
      },
      {
        path: 'pages/:slug',
        loadComponent: () => import('./admin/pages/pages-form/page-form.component').then(m => m.PagesFormComponent)
      },

      // Publicações (Posts)
      { 
        path: 'posts', 
        loadComponent: () => import('./admin/posts/posts-list/posts-list.component').then(m => m.PostsListComponent),
        data: { roles: ['admin', 'tecnico'] }
      },
      { 
        path: 'posts/new', 
        loadComponent: () => import('./admin/posts/posts-form/posts-form.component').then(m => m.PostsFormComponent)
      },
      { 
        path: 'posts/:slug', 
        loadComponent: () => import('./admin/posts/posts-form/posts-form.component').then(m => m.PostsFormComponent)
      },

      // Biblioteca Legal
      {
        path: 'legal',
        loadComponent: () => import('./admin/legal/legal-list/legal-list.component').then(m => m.LegalListComponent),
        data: { roles: ['admin', 'tecnico'] }
      },
      {
        path: 'legal/new',
        loadComponent: () => import('./admin/legal/legal-form/legal-form.component').then(m => m.LegalFormComponent)
      },
      {
        path: 'legal/:slug',
        loadComponent: () => import('./admin/legal/legal-form/legal-form.component').then(m => m.LegalFormComponent)
      },

      // Biodiversidade
      { 
        path: 'biodiversity', 
        loadComponent: () => import('./admin/biodiversity/biodiversity-list/biodiversity-list.component').then(m => m.BiodiversityListComponent)
      },
      { 
        path: 'biodiversity/new', 
        loadComponent: () => import('./admin/biodiversity/biodiversity-form/biodiversity-form.component').then(m => m.BiodiversityFormComponent)
      },
      { 
        path: 'biodiversity/:id', 
        loadComponent: () => import('./admin/biodiversity/biodiversity-form/biodiversity-form.component').then(m => m.BiodiversityFormComponent)
      },

      // Áreas Protegidas
      { 
        path: 'areas', 
        loadComponent: () => import('./admin/areas/areas-list/areas-list.component').then(m => m.AreasListComponent)
      },
      {
        path: 'areas/new',
        loadComponent: () => import('./admin/areas/areas-form/areas-form.component').then(m => m.AreasFormComponent)
      },
      {
        path: 'areas/:id',
        loadComponent: () => import('./admin/areas/areas-form/areas-form.component').then(m => m.AreasFormComponent)
      },

      // Gestão de Menus
      {
        path: 'menus',
        children: [
          { path: '', loadComponent: () => import('./admin/menus/menus-list/menus-list.component').then(m => m.MenusListComponent) },
          { path: 'new', loadComponent: () => import('./admin/menus/menus-form/menus-form.component').then(m => m.MenusFormComponent) },
          { path: ':id', loadComponent: () => import('./admin/menus/menus-form/menus-form.component').then(m => m.MenusFormComponent) },
          { path: ':id/items', loadComponent: () => import('./admin/menus/menu-editor/menu-editor.component').then(m => m.MenuEditorComponent) },
        ]
      },

      // Gestão de Utilizadores
      {
        path: 'users',
        data: { roles: ['admin'] },
        children: [
          { 
            path: '', 
            loadComponent: () => import('./admin/users/users-list/users-list.component').then(m => m.UsersListComponent) 
          },
          { 
            path: 'new', 
            loadComponent: () => import('./admin/users/user-form/user-form.component').then(m => m.UserFormComponent) 
          },
          { 
            path: 'edit/:id', 
            loadComponent: () => import('./admin/users/user-form/user-form.component').then(m => m.UserFormComponent) 
          },
          { 
            path: 'activities', 
            loadComponent: () => import('./admin/users/activity-log/activity-log.component').then(m => m.ActivityLogComponent) 
          },
        ]
      },

      // Integrações & API
      {
        path: 'integrations',
        loadComponent: () => import('./admin/integrations/integrations.component').then(m => m.IntegrationsComponent),
        data: { roles: ['admin'] }
      },

      // Configurações
      {
        path: 'settings',
        loadComponent: () => import('./admin/settings/settings-form.component').then(m => m.SettingsFormComponent),
        data: { roles: ['admin'] }
      },

      // Media
      {
        path: 'media',
        loadComponent: () => import('./admin/media/media-list.component').then(m => m.MediaListComponent)
      },

      // Parceiros
      {
        path: 'partners',
        loadComponent: () => import('./admin/partners/partner-list/partner-list.component').then(m => m.PartnerListComponent)
      },

      // Inventário Químico
      {
        path: 'chemicals',
        data: { roles: ['admin', 'tecnico'] },
        children: [
          { 
            path: '', 
            loadComponent: () => import('./admin/chemicals/chemicals-list/chemicals-list.component').then(m => m.ChemicalsListComponent) 
          },
          { 
            path: 'new', 
            loadComponent: () => import('./admin/chemicals/chemical-form/chemical-form.component').then(m => m.ChemicalFormComponent) 
          },
          { 
            path: 'edit/:id', 
            loadComponent: () => import('./admin/chemicals/chemical-form/chemical-form.component').then(m => m.ChemicalFormComponent) 
          },
        ]
      },
      {
        path: 'partners/new',
        loadComponent: () => import('./admin/partners/partner-form/partner-form.component').then(m => m.PartnerFormComponent)
      },
      {
        path: 'partners/edit/:id',
        loadComponent: () => import('./admin/partners/partner-form/partner-form.component').then(m => m.PartnerFormComponent)
      },

      // Convenções
      {
        path: 'conventions',
        loadComponent: () => import('./admin/conventions/convention-list/convention-list.component').then(m => m.ConventionListComponent)
      },
      {
        path: 'conventions/new',
        loadComponent: () => import('./admin/conventions/convention-form/convention-form.component').then(m => m.ConventionFormComponent)
      },
      {
        path: 'conventions/edit/:id',
        loadComponent: () => import('./admin/conventions/convention-form/convention-form.component').then(m => m.ConventionFormComponent)
      },

      // Denúncias
      { 
        path: 'complaints', 
        loadComponent: () => import('./admin/complaints/complaints-list/complaints-list.component').then(m => m.ComplaintsListComponent)
      },
      {
        path: 'complaints/:id',
        loadComponent: () => import('./admin/complaints/complaints-detail/complaints-detail.component').then(m => m.ComplaintsDetailComponent)
      },

      // Gestão de Resíduos
      {
        path: 'waste',
        loadComponent: () => import('./admin/waste/waste-list/waste-list.component').then(m => m.WasteListComponent)
      },
      {
        path: 'waste/new',
        loadComponent: () => import('./admin/waste/waste-form/waste-form.component').then(m => m.WasteFormComponent)
      },
      {
        path: 'waste/edit/:id',
        loadComponent: () => import('./admin/waste/waste-form/waste-form.component').then(m => m.WasteFormComponent)
      },
      {
        path: 'waste/manifest/:id',
        loadComponent: () => import('./admin/waste/waste-manifest/waste-manifest.component').then(m => m.WasteManifestComponent)
      },
      {
        path: 'waste/reports',
        loadComponent: () => import('./admin/waste/waste-reports/waste-reports.component').then(m => m.WasteReportsComponent)
      },
      {
        path: 'waste/transporters',
        loadComponent: () => import('./admin/waste/waste-transporters/waste-transporters.component').then(m => m.WasteTransportersComponent)
      },

      // Monitorização de Qualidade Ambiental
      {
        path: 'quality',
        loadComponent: () => import('./admin/quality/quality-list/quality-list.component').then(m => m.AdminQualityListComponent),
        data: { roles: ['admin', 'tecnico', 'auditor'] }
      },
      {
        path: 'quality/new',
        loadComponent: () => import('./admin/quality/quality-form/quality-form.component').then(m => m.AdminQualityFormComponent),
        data: { roles: ['admin', 'tecnico'] }
      },
      {
        path: 'quality/edit/:id',
        loadComponent: () => import('./admin/quality/quality-form/quality-form.component').then(m => m.AdminQualityFormComponent),
        data: { roles: ['admin', 'tecnico'] }
      },

      // Inspeção e Controlo
      {
        path: 'inspection',
        data: { roles: ['admin', 'tecnico'] },
        children: [
          // Ocorrências
          { 
            path: 'ocorrencias', 
            loadComponent: () => import('./admin/inspection/ocorrencias-list/ocorrencias-list.component').then(m => m.OcorrenciasListComponent) 
          },
          { 
            path: 'ocorrencias/new', 
            loadComponent: () => import('./admin/inspection/ocorrencia-form/ocorrencia-form.component').then(m => m.OcorrenciaFormComponent) 
          },
          { 
            path: 'ocorrencias/:id', 
            loadComponent: () => import('./admin/inspection/ocorrencia-detail/ocorrencia-detail.component').then(m => m.OcorrenciaDetailComponent) 
          },
          
          // Missões
          { 
            path: 'missoes', 
            loadComponent: () => import('./admin/inspection/missoes-list/missoes-list.component').then(m => m.MissoesListComponent) 
          },
          { 
            path: 'missoes/new', 
            loadComponent: () => import('./admin/inspection/missao-form/missao-form.component').then(m => m.MissaoFormComponent) 
          },
          { 
            path: 'missoes/:id', 
            loadComponent: () => import('./admin/inspection/missao-detail/missao-detail.component').then(m => m.MissaoDetailComponent) 
          },
          
          // Equipas
          { 
            path: 'teams', 
            loadComponent: () => import('./admin/inspection/teams-list/teams-list.component').then(m => m.TeamsListComponent) 
          },
          { 
            path: 'teams/new', 
            loadComponent: () => import('./admin/inspection/team-form/team-form.component').then(m => m.TeamFormComponent) 
          },
          { 
            path: 'teams/:id', 
            loadComponent: () => import('./admin/inspection/team-detail/team-detail.component').then(m => m.TeamDetailComponent) 
          },
        ]
      },

      // Agricultura
      { 
        path: 'agricultura', 
        loadComponent: () => import('./public/agricultura/agricultura.component').then(m => m.AgriculturaComponent)
      },

      // Explorador de Dados (Data Explorer)
      {
        path: 'explorer',
        data: { roles: ['admin', 'tecnico', 'auditor'] },
        children: [
          { 
            path: '', 
            loadComponent: () => import('./admin/explorer/explorer-list/explorer-list.component').then(m => m.ExplorerListComponent) 
          },
          { 
            path: 'new', 
            loadComponent: () => import('./admin/explorer/query-builder/query-builder.component').then(m => m.QueryBuilderComponent) 
          },
          { 
            path: ':id', 
            loadComponent: () => import('./admin/explorer/explorer-view/explorer-view.component').then(m => m.ExplorerViewComponent) 
          },
        ]
      },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // -------------------------------------------------------------------------
  // PUBLIC PORTAL ROUTES
  // -------------------------------------------------------------------------
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { 
        path: '', 
        pathMatch: 'full',
        loadComponent: () => import('./public/home/public-home.component').then(m => m.PublicHomeComponent) 
      },
      { path: 'pages/partners', redirectTo: 'partners', pathMatch: 'full' },
      { path: 'pages/conventions', redirectTo: 'conventions', pathMatch: 'full' },
      { 
        path: 'partners', 
        loadComponent: () => import('./public/partners/partners.component').then(m => m.PublicPartnersComponent) 
      },
      { 
        path: 'conventions', 
        loadComponent: () => import('./public/conventions/conventions.component').then(m => m.PublicConventionsComponent) 
      },
      {
        path: 'waste',
        loadComponent: () => import('./public/waste/public-waste.component').then(m => m.PublicWasteComponent)
      },
      { 
        path: 'pages/:slug', 
        loadComponent: () => import('./public/pages/public-page.component').then(m => m.PublicPageComponent) 
      },
      { 
        path: 'biodiversity', 
        loadComponent: () => import('./public/biodiversity/biodiversity.component').then(m => m.PublicBiodiversityComponent) 
      },

      {
        path: 'areas',
        loadComponent: () => import('./public/areas/areas.component').then(m => m.PublicAreasComponent)
      },
      {
        path: 'solutions',
        loadComponent: () => import('./public/solutions/solutions.component').then(m => m.PublicSolutionsComponent)
      },
      {
        path: 'interdepartamental',
        loadComponent: () => import('./public/solutions/interdepartmental.component').then(m => m.InterdepartmentalComponent)
      },
      {
        path: 'solutions/:kind/:slug',
        loadComponent: () => import('./public/solutions/solution-detail.component').then(m => m.SolutionDetailComponent)
      },
      { 
        path: 'posts', 
        loadComponent: () => import('./public/posts/posts.component').then(m => m.PublicPostsComponent) 
      },
      { 
        path: 'posts/:slug', 
        loadComponent: () => import('./public/posts/post-detail.component').then(m => m.PublicPostDetailComponent) 
      },
      { 
        path: 'denunciar', 
        loadComponent: () => import('./public/complaints/complaint-form.component').then(m => m.PublicComplaintFormComponent) 
      },
      { path: 'denuncias', redirectTo: 'denunciar', pathMatch: 'full' },
      { 
        path: 'ocorrencias', 
        loadComponent: () => import('./public/inspection/public-inspection-hub.component').then(m => m.PublicInspectionHubComponent) 
      },
      { 
        path: 'ocorrencias/relatar', 
        loadComponent: () => import('./public/inspection/public-ocorrencia-form.component').then(m => m.PublicOcorrenciaFormComponent) 
      },
      {
        path: 'biblioteca-legal',
        loadComponent: () => import('./public/legal/legal-library.component').then(m => m.LegalLibraryComponent)
      },
      {
        path: 'extensao-agricola',
        loadComponent: () => import('./public/agriculture/agriculture-hub.component').then(m => m.AgricultureHubComponent)
      },
      {
        path: 'recursos-hidricos',
        loadComponent: () => import('./public/water/water-hub.component').then(m => m.WaterHubComponent)
      },
      {
        path: 'qualidade-ambiental',
        loadComponent: () => import('./public/quality/public-quality.component').then(m => m.PublicQualityComponent)
      },
      {
        path: '404',
        loadComponent: () => import('./public/pages/page-not-found.component').then(m => m.PageNotFoundComponent)
      }
    ]
  },

  { path: '**', redirectTo: '/404' }
];
