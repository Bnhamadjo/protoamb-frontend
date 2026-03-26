import { Routes } from '@angular/router';
import { authGuard } from './core/auth-guard';
import { LayoutComponent } from './admin/layout/layout';
import { DashboardComponent } from './admin/dashboard/dashboard';
import { LoginComponent } from './auth/login/login.component';
import { PublicLayoutComponent } from './public/layout/public-layout.component';

export const routes: Routes = [
  // -------------------------------------------------------------------------
  // PUBLIC PORTAL ROUTES
  // -------------------------------------------------------------------------
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { 
        path: '', 
        loadComponent: () => import('./public/home/public-home.component').then(m => m.PublicHomeComponent) 
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
        path: 'denuncias', 
        loadComponent: () => import('./public/complaints/complaint-form.component').then(m => m.PublicComplaintFormComponent) 
      },
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
        path: '404',
        loadComponent: () => import('./public/pages/page-not-found.component').then(m => m.PageNotFoundComponent)
      }
    ]
  },

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
        loadComponent: () => import('./admin/pages/pages-list/page-list.component').then(m => m.PagesListComponent)
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
        loadComponent: () => import('./admin/posts/posts-list/posts-list.component').then(m => m.PostsListComponent)
      },
      { 
        path: 'posts/new', 
        loadComponent: () => import('./admin/posts/posts-form/posts-form.component').then(m => m.PostsFormComponent)
      },
      { 
        path: 'posts/:slug', 
        loadComponent: () => import('./admin/posts/posts-form/posts-form.component').then(m => m.PostsFormComponent)
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

      // Configurações
      {
        path: 'settings',
        loadComponent: () => import('./admin/settings/settings-form.component').then(m => m.SettingsFormComponent)
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

      // Inspeção e Controlo
      {
        path: 'inspection',
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

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: '/404' }
];
