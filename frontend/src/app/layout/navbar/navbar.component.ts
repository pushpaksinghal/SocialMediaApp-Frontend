import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, AvatarComponent, FormsModule],
  template: `
    <nav class="glass-navbar fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-5 gap-4">
      <!-- Logo -->
      <a routerLink="/feed" class="flex items-center gap-2 mr-3 group">
        <div class="accent-gradient w-8 h-8 rounded-full flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-12 shadow-lg shadow-emerald-500/20">
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
          </svg>
        </div>
        <span class="font-bold text-lg hidden sm:block text-gradient" style="font-family:'Sora',sans-serif;">
          ConnectSphere
        </span>
      </a>

      <!-- Search -->
      <div class="flex-1 max-w-sm hidden md:block">
        <div class="relative group">
          <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 group-focus-within:text-emerald-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="search"
            placeholder="Search people or posts…"
            [(ngModel)]="searchQuery"
            (keyup.enter)="onSearch()"
            class="input-premium w-full rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none"
          />
        </div>
      </div>

      <span class="flex-1"></span>

      <ng-container *ngIf="auth.isLoggedIn()">
        <a routerLink="/feed" [routerLinkActiveOptions]="{exact:true}" routerLinkActive="nav-active" class="nav-icon" title="Home">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
        </a>
        <a routerLink="/explore" routerLinkActive="nav-active" class="nav-icon" title="Explore">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </a>
        <a routerLink="/notifications" routerLinkActive="nav-active" class="nav-icon" title="Notifications">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
        </a>
        <a [routerLink]="['/profile', auth.currentUser()?.userName]" class="ml-1 hover:scale-105 transition-transform">
          <div class="accent-gradient rounded-full p-0.5">
            <app-avatar [src]="auth.currentUser()?.avatarUrl"
                        [name]="auth.currentUser()?.userName || ''"
                        [size]="30" />
          </div>
        </a>
        <button (click)="logout()"
                class="text-xs px-4 py-1.5 rounded-full transition-all ml-1 font-medium text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/10 hover:border-emerald-500/50">
          Logout
        </button>
      </ng-container>

      <ng-container *ngIf="!auth.isLoggedIn()">
        <a routerLink="/auth/login"
           class="text-sm font-medium px-4 py-1.5 rounded-full transition-all text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/10 hover:border-emerald-500/50">
          Login
        </a>
        <a routerLink="/auth/register"
           class="accent-gradient text-sm font-semibold px-4 py-1.5 rounded-full transition-all text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5">
          Sign up
        </a>
      </ng-container>
    </nav>

    <div class="h-14"></div>

    <style>
      .nav-icon {
        color: rgba(186,230,253,0.6);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        padding: 8px;
        border-radius: 12px;
      }
      .nav-icon:hover, .nav-active {
        color: #22c55e !important;
        background: rgba(34,197,94,0.08) !important;
        transform: translateY(-1px);
      }
    </style>
  `,
})
export class NavbarComponent {
  auth = inject(AuthService);
  private router = inject(Router);
  searchQuery = '';

  onSearch() {
    const q = this.searchQuery.trim();
    if (!q) return;
    this.router.navigate(['/explore'], { queryParams: { q } });
    this.searchQuery = '';
  }

  logout() {
    this.auth.logout();
  }
}
