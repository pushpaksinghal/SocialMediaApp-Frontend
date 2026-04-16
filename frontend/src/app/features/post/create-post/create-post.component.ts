import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from '../../../core/services/post.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="glass-card max-w-xl mx-auto rounded-2xl p-6 shadow-xl shadow-emerald-500/5 animate-fade-in">
      <div class="flex items-center gap-3 mb-6">
        <div class="accent-gradient p-2 rounded-xl text-white shadow-lg shadow-emerald-500/20">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
        </div>
        <h2 class="font-bold text-xl text-gray-900" style="font-family:'Sora',sans-serif;">Create New Post</h2>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-6">
        <div class="relative group">
          <textarea formControlName="content" rows="4"
                    placeholder="Share something with the world…"
                    class="w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-5 py-4 text-[15px] resize-none focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 focus:bg-white transition-all"></textarea>
          <div class="absolute bottom-3 right-4 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
            {{ form.get('content')?.value?.length || 0 }} characters
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Visibility</label>
            <div class="relative">
              <select formControlName="visibility"
                      class="w-full appearance-none rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all cursor-pointer">
                <option value="PUBLIC">🌍 Public Feed</option>
                <option value="FOLLOWERS">👥 Followers only</option>
                <option value="PRIVATE">🔒 Only me</option>
              </select>
              <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="flex-1">
            <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Hashtags</label>
            <input formControlName="hashtags" placeholder="e.g. nature, tech, travel"
                   class="w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all" />
          </div>
        </div>

        <!-- Media upload -->
        <div class="group/upload">
          <label class="cursor-pointer flex items-center justify-center gap-3 w-full py-8 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/30 hover:bg-emerald-50/30 hover:border-emerald-200 transition-all duration-300 group">
            <div class="p-2.5 rounded-full bg-white shadow-sm group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <div class="text-left">
              <p class="text-xs font-bold text-gray-700">{{ mediaFile ? mediaFile.name : 'Upload Media' }}</p>
              <p class="text-[10px] text-gray-400 font-medium">Click to browse images or video</p>
            </div>
            <input type="file" class="hidden" accept="image/*,video/*" (change)="onFile($event)" />
          </label>
          
          <div *ngIf="preview" class="mt-4 relative rounded-2xl overflow-hidden border border-emerald-100 group/preview animate-fade-in">
            <img *ngIf="mediaFile?.type?.startsWith('image')" [src]="preview" class="w-full max-h-64 object-cover" />
            <video *ngIf="mediaFile?.type?.startsWith('video')" [src]="preview" class="w-full max-h-64 bg-black" controls></video>
            
            <button (click)="mediaFile=undefined; preview=undefined" class="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-rose-500 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        <p *ngIf="error" class="text-rose-500 text-xs font-bold text-center bg-rose-50 py-2 rounded-lg border border-rose-100">{{ error }}</p>

        <div class="flex items-center justify-end gap-4 pt-2">
          <button type="button" (click)="router.navigate(['/feed'])"
                  class="px-5 py-2.5 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">Discard</button>
          <button type="submit" [disabled]="loading || form.invalid"
                  class="accent-gradient px-8 py-2.5 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none transition-all">
            {{ loading ? 'Publishing…' : 'Publish Post' }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class CreatePostComponent {
  private postSv = inject(PostService);
  router = inject(Router);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    content:    ['', Validators.required],
    visibility: ['PUBLIC'],
    hashtags:   [''],
  });

  mediaFile?: File;
  preview?: string;
  loading = false;
  error = '';

  onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    this.mediaFile = f;
    const reader = new FileReader();
    reader.onload = ev => this.preview = ev.target?.result as string;
    reader.readAsDataURL(f);
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    if (this.mediaFile) {
      this.postSv.uploadToCloudinary(this.mediaFile).subscribe({
        next: (res) => this.finalizePost(res.secure_url),
        error: (err) => {
          this.error = 'Upload failed. Please try again.';
          this.loading = false;
        }
      });
    } else {
      this.finalizePost();
    }
  }

  private finalizePost(mediaUrl?: string) {
    const { content, visibility, hashtags } = this.form.value;
    this.postSv.createPost(
      { content: content!, visibility: visibility!, hashtags: hashtags || undefined, mediaUrl },
      undefined // No binary file sent to backend anymore
    ).subscribe({
      next: post => this.router.navigate(['/post', post.postId]),
      error: err => {
        this.error = err.error?.message ?? 'Failed to post';
        this.loading = false;
      },
    });
  }
}