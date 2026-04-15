import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AuthResponse, User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center" style="background: linear-gradient(135deg, #0a2a1a 0%, #0c1f3f 100%);">
      <div class="text-center animate-fade-in">
        <div class="relative w-20 h-20 mx-auto mb-6">
          <div class="absolute inset-0 rounded-full border-4 border-emerald-500/20"></div>
          <div class="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
        </div>
        <h2 class="text-2xl font-bold text-white mb-2" style="font-family:'Sora',sans-serif;">Completing Login...</h2>
        <p style="color: rgba(186,230,253,0.6);">Please wait while we finalize your secure connection.</p>
      </div>
    </div>
  `,
})
export class AuthCallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AuthService);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const accessToken = params['accessToken'];
      const refreshToken = params['refreshToken'];
      const userJson = params['user'];

      if (accessToken && refreshToken && userJson) {
        try {
          const user: User = JSON.parse(userJson);
          const response: AuthResponse = { accessToken, refreshToken, user };
          
          this.auth.persist(response);
          
          // Small delay for smooth transition
          setTimeout(() => {
            this.router.navigate(['/feed']);
          }, 800);
        } catch (e) {
          console.error('Failed to parse user data from callback', e);
          this.router.navigate(['/auth/login'], { queryParams: { error: 'Invalid authentication data' } });
        }
      } else {
        console.error('Missing tokens in callback URL');
        this.router.navigate(['/auth/login'], { queryParams: { error: 'Authentication failed' } });
      }
    });
  }
}
