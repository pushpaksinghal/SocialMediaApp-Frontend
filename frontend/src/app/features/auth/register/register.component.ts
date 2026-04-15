import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex" style="background: linear-gradient(135deg, #0a2a1a 0%, #0c1f3f 50%, #0a2a1a 100%);">

      <!-- Left form panel -->
      <div class="flex flex-col justify-center items-center flex-1 p-8">
        <div class="w-full max-w-md animate-fade-in">

          <!-- Logo -->
          <div class="flex items-center gap-3 mb-8 justify-center lg:justify-start">
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

          <h1 class="text-3xl font-bold text-white mb-1" style="font-family:'Sora',sans-serif;">Create account</h1>
          <p class="mb-7" style="color: rgba(186,230,253,0.6);">Join the global community today</p>

          <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs font-medium mb-1.5 block" style="color: #86efac;">Username</label>
                <input formControlName="userName" placeholder="john_doe"
                       class="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"
                       style="background: rgba(255,255,255,0.06); border: 1px solid rgba(134,239,172,0.2); color: white;"
                       onfocus="this.style.borderColor='rgba(34,197,94,0.6)'; this.style.boxShadow='0 0 0 3px rgba(34,197,94,0.1)'"
                       onblur="this.style.borderColor='rgba(134,239,172,0.2)'; this.style.boxShadow='none'"/>
              </div>
              <div>
                <label class="text-xs font-medium mb-1.5 block" style="color: #86efac;">Full Name</label>
                <input formControlName="fullName" placeholder="John Doe"
                       class="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"
                       style="background: rgba(255,255,255,0.06); border: 1px solid rgba(134,239,172,0.2); color: white;"
                       onfocus="this.style.borderColor='rgba(34,197,94,0.6)'; this.style.boxShadow='0 0 0 3px rgba(34,197,94,0.1)'"
                       onblur="this.style.borderColor='rgba(134,239,172,0.2)'; this.style.boxShadow='none'"/>
              </div>
            </div>
            <div>
              <label class="text-xs font-medium mb-1.5 block" style="color: #86efac;">Email</label>
              <input formControlName="email" type="email" placeholder="you@example.com"
                     class="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"
                     style="background: rgba(255,255,255,0.06); border: 1px solid rgba(134,239,172,0.2); color: white;"
                     onfocus="this.style.borderColor='rgba(34,197,94,0.6)'; this.style.boxShadow='0 0 0 3px rgba(34,197,94,0.1)'"
                     onblur="this.style.borderColor='rgba(134,239,172,0.2)'; this.style.boxShadow='none'"/>
            </div>
            <div>
              <label class="text-xs font-medium mb-1.5 block" style="color: #86efac;">Password</label>
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
                    class="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50"
                    style="background: linear-gradient(135deg, #22c55e, #0891b2); box-shadow: 0 4px 20px rgba(34,197,94,0.3);"
                    onmouseover="this.style.boxShadow='0 4px 30px rgba(34,197,94,0.5)'; this.style.transform='translateY(-1px)'"
                    onmouseout="this.style.boxShadow='0 4px 20px rgba(34,197,94,0.3)'; this.style.transform='translateY(0)'">
              {{ loading ? 'Creating account…' : 'Create Account' }}
            </button>
          </form>

          <p class="text-center text-sm mt-6" style="color: rgba(186,230,253,0.5);">
            Already have an account?
            <a routerLink="/auth/login" class="font-semibold ml-1" style="color: #22c55e;"
               onmouseover="this.style.color='#86efac'"
               onmouseout="this.style.color='#22c55e'">Sign in</a>
          </p>
        </div>
      </div>

      <!-- Divider -->
      <div class="hidden lg:block w-px" style="background: linear-gradient(to bottom, transparent, rgba(34,197,94,0.3), transparent);"></div>

      <!-- Right decorative panel -->
      <div class="hidden lg:flex flex-col justify-center items-center flex-1 relative overflow-hidden p-12">
        <div class="animate-float mb-10">
          <svg viewBox="0 0 200 200" class="w-52 h-52" style="filter: drop-shadow(0 0 30px rgba(56,189,248,0.4))">
            <defs>
              <radialGradient id="earthGrad2" cx="60%" cy="40%">
                <stop offset="0%" stop-color="#38bdf8"/>
                <stop offset="50%" stop-color="#0891b2"/>
                <stop offset="100%" stop-color="#0c1f3f"/>
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="90" fill="url(#earthGrad2)" opacity="0.9"/>
            <ellipse cx="75" cy="80" rx="20" ry="25" fill="#22c55e" opacity="0.7"/>
            <ellipse cx="120" cy="70" rx="14" ry="18" fill="#22c55e" opacity="0.65"/>
            <ellipse cx="95" cy="115" rx="24" ry="16" fill="#22c55e" opacity="0.7"/>
            <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(56,189,248,0.3)" stroke-width="2"/>
          </svg>
        </div>
        <h2 class="text-3xl font-bold text-white text-center mb-4" style="font-family:'Sora',sans-serif;">
          Your voice<br/>
          <span style="background: linear-gradient(90deg,#38bdf8,#22c55e); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">
            Matters Here
          </span>
        </h2>
        <div class="grid grid-cols-1 gap-3 mt-4 w-full max-w-xs">
          <div class="flex items-center gap-3 p-3 rounded-xl" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(134,239,172,0.15);">
            <span style="color:#22c55e;">✦</span>
            <span class="text-sm" style="color: rgba(186,230,253,0.8);">Share ideas globally</span>
          </div>
          <div class="flex items-center gap-3 p-3 rounded-xl" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(56,189,248,0.15);">
            <span style="color:#38bdf8;">✦</span>
            <span class="text-sm" style="color: rgba(186,230,253,0.8);">Connect with communities</span>
          </div>
          <div class="flex items-center gap-3 p-3 rounded-xl" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(134,239,172,0.15);">
            <span style="color:#22c55e;">✦</span>
            <span class="text-sm" style="color: rgba(186,230,253,0.8);">Build your network</span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      userName: ['', Validators.required],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    this.auth.register(this.form.value as any).subscribe({
      next: () => this.router.navigate(['/feed']),
      error: err => {
        this.error = err.error?.message ?? 'Registration failed';
        this.loading = false;
      },
    });
  }
}
