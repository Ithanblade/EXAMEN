import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./pages/auth/auth.page').then((m) => m.AuthPage),
  },
  {
    path: 'blog-create',
    loadComponent: () => import('./pages/blog/blog.page').then( m => m.BlogCreatePage)
  },
  {
    path: 'blog-feed',
    loadComponent: () => import('./blog-feed/blog-feed.page').then( m => m.BlogFeedPage)
  },
  { 
    path: 'blog-feed',
    loadComponent: () => import('./blog-feed/blog-feed.page').then(m => m.BlogFeedPage) 
  },



];

export const appRouting = provideRouter(routes);