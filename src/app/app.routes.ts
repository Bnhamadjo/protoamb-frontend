import { Routes } from '@angular/router';
import { authGuard } from './core/auth-guard';
import { LayoutComponent } from './admin/layout/layout';
import { DashboardComponent } from './admin/dashboard/dashboard';
import { LoginComponent } from './auth/login/login';
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
        loadComponent: () => import('./public/home/home.component').then(m => m.PublicHomeComponent) 
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
        path: 'media', 
        loadComponent: () => import('./admin/media/media-list.component').then(m => m.MediaListComponent)
      },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: '/404' }
];