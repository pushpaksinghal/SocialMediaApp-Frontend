import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="glass-navbar fixed bottom-0 left-0 right-0 z-40 py-4 px-6 animate-fade-in shadow-[0_-2px_20px_rgba(0,0,0,0.2)]">
      <div class="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <div class="accent-gradient w-6 h-6 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
              </svg>
            </div>
            <span class="font-bold text-base text-gradient" style="font-family:'Sora',sans-serif;">
              ConnectSphere
            </span>
          </div>
          <p class="text-[11px] font-medium text-gray-400">
            A premium space for meaningful connections.
          </p>
        </div>

        <nav class="flex flex-wrap justify-center gap-x-8 gap-y-2">
          <a routerLink="/" class="footer-link">About</a>
          <a routerLink="/" class="footer-link">Privacy Policy</a>
          <a routerLink="/" class="footer-link">Terms of Service</a>
          <a routerLink="/" class="footer-link">Help Center</a>
          <a routerLink="/" class="footer-link">Community Guildlines</a>
        </nav>

        <div class="text-right">
          <p class="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
            © 2026 ConnectSphere Inc.
          </p>
          <div class="flex gap-3 justify-end mt-2">
             <div class="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></div>
             <p class="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">All Services Operational</p>
          </div>
        </div>
      </div>
    </footer>

    <style>
      .footer-link {
        font-size: 12px;
        font-weight: 600;
        color: rgba(186,230,253,0.6);
        transition: all 0.2s ease;
      }
      .footer-link:hover {
        color: var(--earth-green);
        text-decoration: underline;
        text-underline-offset: 4px;
      }
    </style>
  `,
})
export class FooterComponent {}
