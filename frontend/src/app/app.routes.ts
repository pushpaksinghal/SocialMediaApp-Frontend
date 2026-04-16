import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'feed', pathMatch: 'full' },

  // Auth (no guard)
  {
    path: 'auth',
    children: [
      { path: 'login',        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'register',     loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
      { path: 'callback',     loadComponent: () => import('./features/auth/auth-callback/auth-callback.component').then(m => m.AuthCallbackComponent) },
      { path: 'profile-edit', canActivate: [authGuard], loadComponent: () => import('./features/auth/profile-edit/profile-edit.component').then(m => m.ProfileEditComponent) },
    ],
  },

  // Protected routes
  { path: 'feed',          canActivate: [authGuard], loadComponent: () => import('./features/feed/home-feed/home-feed.component').then(m => m.HomeFeedComponent) },
  { path: 'explore',       loadComponent: () => import('./features/explore/explore.component').then(m => m.ExploreComponent) },
  { path: 'notifications', canActivate: [authGuard], loadComponent: () => import('./features/notifications/notifications.component').then(m => m.NotificationsComponent) },
  { path: 'post/create',   canActivate: [authGuard], loadComponent: () => import('./features/post/create-post/create-post.component').then(m => m.CreatePostComponent) },
  { path: 'post/:id',      loadComponent: () => import('./features/post/post-detail/post-detail.component').then(m => m.PostDetailComponent) },
  { path: 'profile/:userName', loadComponent: () => import('./features/profile/user-profile/user-profile.component').then(m => m.UserProfileComponent) },

  { path: '**', redirectTo: 'feed' },
];