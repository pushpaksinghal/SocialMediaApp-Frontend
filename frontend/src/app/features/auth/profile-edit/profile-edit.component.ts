import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-lg mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
      <h2 class="font-bold text-xl text-gray-900">Edit Profile</h2>

      <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
        <div>
          <label class="text-sm font-medium text-gray-700">Full Name</label>
          <input formControlName="fullName"
                 class="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700">Bio</label>
          <textarea formControlName="bio" rows="3"
                    class="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"></textarea>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700">Avatar</label>
          <input type="file" accept="image/*" (change)="onFile($event)"
                 class="mt-1 w-full text-sm text-gray-500" />
        </div>

        <p *ngIf="error" class="text-red-500 text-sm">{{ error }}</p>
        <p *ngIf="success" class="text-green-600 text-sm">Profile updated!</p>

        <div class="flex justify-end gap-3">
          <button type="button" (click)="router.navigate(['/feed'])"
                  class="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
          <button type="submit" [disabled]="loading"
                  class="px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50">
            {{ loading ? 'Saving…' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class ProfileEditComponent implements OnInit {
  private auth  = inject(AuthService);
  router        = inject(Router);
  private fb    = inject(FormBuilder);

  form = this.fb.group({ fullName: [''], bio: [''] });
  avatar?: File;
  loading = false;
  error   = '';
  success = false;

  ngOnInit() {
    const u = this.auth.currentUser();
    if (u) this.form.patchValue({ fullName: u.fullName, bio: u.bio ?? '' });
  }

  onFile(e: Event) {
    this.avatar = (e.target as HTMLInputElement).files?.[0];
  }

  submit() {
    const u = this.auth.currentUser();
    if (!u) return;
    this.loading = true;
    this.error = '';
    this.success = false;
    this.auth.updateProfile(u.userId, this.form.value as any, this.avatar).subscribe({
      next: () => { this.success = true; this.loading = false; },
      error: err => { this.error = err.error?.message ?? 'Update failed'; this.loading = false; },
    });
  }
}