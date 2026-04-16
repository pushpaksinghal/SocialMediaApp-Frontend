import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { filter, map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent, FooterComponent, CommonModule],
  template: `
    <ng-container *ngIf="!isAuthPage()">
      <app-navbar />
    </ng-container>
    <div [class]="isAuthPage() ? '' : 'max-w-5xl mx-auto px-4 flex gap-6 min-h-[calc(100vh-4rem)]'">
      <app-sidebar *ngIf="auth.isLoggedIn() && !isAuthPage()" />
      <main [class]="isAuthPage() ? '' : 'flex-1 min-w-0 pt-4 pb-24'">
        <router-outlet />
      </main>
    </div>
    <app-footer *ngIf="!isAuthPage()" />
  `,
})
export class AppComponent {
  isAuthPage: any;

  constructor(public auth: AuthService, private router: Router) {
    const url$ = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map((e: any) => e.urlAfterRedirects as string),
    );
    this.isAuthPage = () => {
      const url = this.router.url;
      return url.startsWith('/auth/login') || url.startsWith('/auth/register');
    };
  }
}
