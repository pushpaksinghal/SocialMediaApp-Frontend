import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, AvatarComponent],
  template: `
    <aside class="hidden lg:flex flex-col gap-2 w-64 pt-4 pr-4 sticky top-14 self-start h-[calc(100vh-8rem)] overflow-y-auto">

      <ng-container *ngIf="auth.currentUser() as user">
        <!-- Profile card -->
        <div class="glass-card rounded-2xl p-5 mb-4 group relative overflow-hidden transition-all hover:shadow-xl hover:shadow-emerald-500/10">
          <div class="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-[0.03] transition-opacity"></div>
          
          <div class="relative flex flex-col items-center text-center">
            <div class="accent-gradient rounded-full p-1 mb-3 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <app-avatar [src]="user.avatarUrl" [name]="user.userName" [size]="56"/>
            </div>
            <div class="min-w-0">
              <p class="font-bold text-gray-900 text-base truncate mb-0.5" style="font-family:'Sora',sans-serif;">{{ user.fullName }}</p>
              <p class="text-xs font-medium text-emerald-600">&#64;{{ user.userName }}</p>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-emerald-100">
            <div>
              <p class="font-bold text-gray-900 text-sm" style="font-family:'Sora',sans-serif;">{{ user.postCount }}</p>
              <p class="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Posts</p>
            </div>
            <div>
              <p class="font-bold text-gray-900 text-sm" style="font-family:'Sora',sans-serif;">{{ user.followerCount }}</p>
              <p class="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Fans</p>
            </div>
            <div>
              <p class="font-bold text-gray-900 text-sm" style="font-family:'Sora',sans-serif;">{{ user.followingCount }}</p>
              <p class="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Stars</p>
            </div>
          </div>
        </div>
      </ng-container>

      <!-- Nav -->
      <nav class="flex flex-col gap-1.5 px-1">
        <a routerLink="/feed" [routerLinkActiveOptions]="{exact:true}" routerLinkActive="sidebar-active"
           class="sidebar-link flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm transition-all hover:translate-x-1">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg> <span class="font-medium">Home Feed</span>
        </a>
        <a routerLink="/explore" routerLinkActive="sidebar-active"
           class="sidebar-link flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm transition-all hover:translate-x-1">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg> <span class="font-medium">Discovery</span>
        </a>
        <a routerLink="/notifications" routerLinkActive="sidebar-active"
           class="sidebar-link flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm transition-all hover:translate-x-1">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg> <span class="font-medium">Alerts</span>
        </a>
        <a routerLink="/post/create" routerLinkActive="sidebar-active"
           class="sidebar-link mt-4 flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm transition-all accent-gradient text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg> <span class="font-bold">Create Post</span>
        </a>
      </nav>

      <style>
        .sidebar-link { color: var(--text-secondary); }
        .sidebar-link:hover:not(.accent-gradient) { color: var(--earth-green); background: rgba(34,197,94,0.06); }
        .sidebar-active:not(.accent-gradient) { color: var(--earth-green) !important; background: rgba(34,197,94,0.1) !important; font-weight: 700; }
      </style>
    </aside>
  `,
})
export class SidebarComponent {
  auth = inject(AuthService);
}
