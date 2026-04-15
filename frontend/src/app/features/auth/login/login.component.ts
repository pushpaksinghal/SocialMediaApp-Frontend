import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex" style="background: linear-gradient(135deg, #0a2a1a 0%, #0c1f3f 50%, #0a2a1a 100%);">

      <!-- Left decorative panel -->
      <div class="hidden lg:flex flex-col justify-center items-center flex-1 relative overflow-hidden p-12">
        <!-- Animated Earth SVG -->
        <div class="animate-float mb-10">
          <svg viewBox="0 0 200 200" class="w-52 h-52 drop-shadow-2xl" style="filter: drop-shadow(0 0 30px rgba(34,197,94,0.4))">
            <defs>
              <radialGradient id="earthGrad" cx="40%" cy="35%">
                <stop offset="0%" stop-color="#22c55e"/>
                <stop offset="50%" stop-color="#0891b2"/>
                <stop offset="100%" stop-color="#0a2a1a"/>
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="90" fill="url(#earthGrad)" opacity="0.9"/>
            <ellipse cx="80" cy="75" rx="18" ry="22" fill="#1a7a45" opacity="0.8"/>
            <ellipse cx="115" cy="65" rx="12" ry="16" fill="#1a7a45" opacity="0.7"/>
            <ellipse cx="95" cy="110" rx="22" ry="15" fill="#1a7a45" opacity="0.75"/>
            <ellipse cx="60" cy="115" rx="10" ry="12" fill="#1a7a45" opacity="0.6"/>
            <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(134,239,172,0.25)" stroke-width="2"/>
            <ellipse cx="100" cy="100" rx="90" ry="30" fill="none" stroke="rgba(56,189,248,0.2)" stroke-width="1.5"/>
          </svg>
        </div>

        <h2 class="text-4xl font-bold text-white text-center mb-4" style="font-family:'Sora',sans-serif;">
          Connect with the<br/>
          <span style="background: linear-gradient(90deg,#22c55e,#38bdf8); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">
            World
          </span>
        </h2>
        <p class="text-center" style="color: rgba(186,230,253,0.6); max-width: 280px; line-height: 1.7;">
          Join millions of people sharing ideas, stories and moments that matter.
        </p>

        <!-- Floating orbs -->
        <div class="absolute top-20 left-10 w-3 h-3 rounded-full" style="background:#22c55e; opacity:0.4; animation: float 3s ease-in-out infinite;"></div>
        <div class="absolute bottom-32 left-20 w-2 h-2 rounded-full" style="background:#38bdf8; opacity:0.3; animation: float 4s ease-in-out infinite 1s;"></div>
        <div class="absolute top-40 right-16 w-4 h-4 rounded-full" style="background:#0891b2; opacity:0.3; animation: float 5s ease-in-out infinite 0.5s;"></div>
      </div>

      <!-- Divider -->
      <div class="hidden lg:block w-px" style="background: linear-gradient(to bottom, transparent, rgba(34,197,94,0.3), transparent);"></div>

      <!-- Right form panel -->
      <div class="flex flex-col justify-center items-center flex-1 p-8">
        <div class="w-full max-w-md animate-fade-in">

          <!-- Logo -->
          <div class="flex items-center gap-3 mb-10 justify-center lg:justify-start">
            <div class="w-10 h-10 rounded-full flex items-center justify-center"
                 style="background: linear-gradient(135deg, #22c55e, #0891b2); box-shadow: 0 0 20px rgba(34,197,94,0.4);">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
              </svg>
            </div>
            <span class="text-2xl font-bold" style="font-family:'Sora',sans-serif; background: linear-gradient(90deg, #22c55e, #38bdf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
              ConnectSphere
            </span>
          </div>

          <h1 class="text-3xl font-bold text-white mb-1" style="font-family:'Sora',sans-serif;">Welcome back</h1>
          <p class="mb-8" style="color: rgba(186,230,253,0.6);">Sign in to continue your journey</p>

          <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-5">
            <div>
              <label class="text-sm font-medium mb-2 block" style="color: #86efac;">Email</label>
              <input formControlName="email" type="email" placeholder="you@example.com"
                     class="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"
                     style="background: rgba(255,255,255,0.06); border: 1px solid rgba(134,239,172,0.2); color: white;"
                     onfocus="this.style.borderColor='rgba(34,197,94,0.6)'; this.style.boxShadow='0 0 0 3px rgba(34,197,94,0.1)'"
                     onblur="this.style.borderColor='rgba(134,239,172,0.2)'; this.style.boxShadow='none'"/>
            </div>
            <div>
              <label class="text-sm font-medium mb-2 block" style="color: #86efac;">Password</label>
              <input formControlName="password" type="password" placeholder="••••••••"
                     class="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"
                     style="background: rgba(255,255,255,0.06); border: 1px solid rgba(134,239,172,0.2); color: white;"
                     onfocus="this.style.borderColor='rgba(34,197,94,0.6)'; this.style.boxShadow='0 0 0 3px rgba(34,197,94,0.1)'"
                     onblur="this.style.borderColor='rgba(134,239,172,0.2)'; this.style.boxShadow='none'"/>
            </div>

            <p *ngIf="error" class="text-sm text-center py-2 px-4 rounded-xl"
               style="color: #fca5a5; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2);">
              {{ error }}
            </p>

            <button type="submit" [disabled]="loading"
                    class="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50 mt-2"
                    style="background: linear-gradient(135deg, #22c55e, #0891b2); box-shadow: 0 4px 20px rgba(34,197,94,0.3);"
                    onmouseover="this.style.boxShadow='0 4px 30px rgba(34,197,94,0.5)'; this.style.transform='translateY(-1px)'"
                    onmouseout="this.style.boxShadow='0 4px 20px rgba(34,197,94,0.3)'; this.style.transform='translateY(0)'">
              {{ loading ? 'Signing in…' : 'Sign In' }}
            </button>
          </form>

          <!-- Divider -->
          <div class="flex items-center gap-3 my-6">
            <div class="flex-1 h-px" style="background: rgba(134,239,172,0.15);"></div>
            <span class="text-xs" style="color: rgba(186,230,253,0.4);">or continue with</span>
            <div class="flex-1 h-px" style="background: rgba(134,239,172,0.15);"></div>
          </div>

          <div class="space-y-3">
            <button (click)="auth.loginWithGoogle()"
                    class="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium transition-all"
                    style="background: rgba(255,255,255,0.05); border: 1px solid rgba(134,239,172,0.15); color: rgba(255,255,255,0.8);"
                    onmouseover="this.style.background='rgba(255,255,255,0.1)'"
                    onmouseout="this.style.background='rgba(255,255,255,0.05)'">
              <svg class="w-4 h-4" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.29-8.16 2.29-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
              Continue with Google
            </button>
            <button (click)="auth.loginWithGitHub()"
                    class="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium transition-all"
                    style="background: rgba(255,255,255,0.05); border: 1px solid rgba(134,239,172,0.15); color: rgba(255,255,255,0.8);"
                    onmouseover="this.style.background='rgba(255,255,255,0.1)'"
                    onmouseout="this.style.background='rgba(255,255,255,0.05)'">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              Continue with GitHub
            </button>
          </div>

          <p class="text-center text-sm mt-6" style="color: rgba(186,230,253,0.5);">
            Don't have an account?
            <a routerLink="/auth/register" class="font-semibold ml-1 transition-all" style="color: #22c55e;"
               onmouseover="this.style.color='#86efac'"
               onmouseout="this.style.color='#22c55e'">Sign up free</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    // Check for errors from OAuth callbacks
    const errorParam = this.router.parseUrl(this.router.url).queryParams['error'];
    if (errorParam) {
      this.error = errorParam;
    }
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    const { email, password } = this.form.value;
    this.auth.login({ email: email!, password: password! }).subscribe({
      next: () => this.router.navigate(['/feed']),
      error: err => { this.error = err.error?.message ?? 'Login failed'; this.loading = false; },
    });
  }
}
