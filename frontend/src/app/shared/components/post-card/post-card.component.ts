import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Post } from '../../models/post.model';
import { AvatarComponent } from '../avatar/avatar.component';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, RouterModule, AvatarComponent, TimeAgoPipe],
  template: `
    <div class="glass-card rounded-2xl p-6 transition-all hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-emerald-500/10 group animate-fade-in">
      
      <!-- Header -->
      <div class="flex items-center gap-3 mb-4">
        <div class="accent-gradient rounded-full p-0.5 group-hover:scale-110 transition-transform duration-300 shadow-md">
          <app-avatar [src]="post.author?.avatarUrl" [name]="post.author?.userName || '?'" [size]="42" />
        </div>
        <div class="flex-1 min-w-0">
          <a [routerLink]="['/profile', post.author?.userName]"
             class="font-bold text-sm text-gray-900 hover:text-emerald-600 transition-colors" style="font-family:'Sora',sans-serif;">
            {{ post.author?.fullName || 'Unknown User' }}
          </a>
          <p class="text-xs font-medium text-gray-400">
            &#64;{{ post.author?.userName }} · {{ post.createdAt | timeAgo }}
          </p>
        </div>
        <button class="text-gray-300 hover:text-emerald-500 transition-colors p-1.5 rounded-lg hover:bg-emerald-50">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"/>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="space-y-4">
        <p class="text-[15px] leading-relaxed text-gray-700 whitespace-pre-line">{{ post.content }}</p>

        <!-- Media: Image/GIF -->
        <div *ngIf="post.mediaUrl && isImage(post.mediaType) && !mediaError" class="relative overflow-hidden rounded-2xl border border-emerald-50/50 shadow-inner group/media">
          <img [src]="post.mediaUrl" alt="Post media" 
               (error)="handleMediaError()"
               class="w-full object-cover max-h-[500px] transition-transform duration-700 group-hover/media:scale-[1.02]" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity"></div>
        </div>

        <!-- Media: Video -->
        <div *ngIf="post.mediaUrl && isVideo(post.mediaType) && !mediaError" class="relative overflow-hidden rounded-2xl border border-emerald-50/50 shadow-inner group/media bg-black/5">
          <video [src]="post.mediaUrl" controls
                 (error)="handleMediaError()"
                 class="w-full max-h-[500px] rounded-2xl"></video>
        </div>

        <!-- Hashtags -->
        <div *ngIf="post.hashtags" class="flex flex-wrap gap-2">
          <span *ngFor="let tag of post.hashtags.split(',')"
                class="text-[11px] px-3 py-1 rounded-full font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100/50 hover:bg-emerald-100 transition-colors cursor-pointer">
            #{{ tag.trim() }}
          </span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-between pt-5 mt-5 border-t border-emerald-50">
        <div class="flex items-center gap-1 sm:gap-4">
          <button (click)="likeToggle.emit(post)"
                  class="flex items-center gap-2 text-sm transition-all rounded-xl px-3 py-2 group/action"
                  [ngClass]="post.isLiked ? 'bg-rose-50 text-rose-600' : 'text-gray-400 hover:bg-rose-50 hover:text-rose-600'">
            <svg class="w-5 h-5 transition-transform group-hover/action:scale-125" [attr.fill]="post.isLiked ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            <span class="font-bold">{{ post.likeCount }}</span>
          </button>

          <a [routerLink]="['/post', post.postId]"
             class="flex items-center gap-2 text-sm text-gray-400 transition-all rounded-xl px-3 py-2 hover:bg-sky-50 hover:text-sky-600 group/comment">
            <svg class="w-5 h-5 transition-transform group-hover/comment:scale-125" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            <span class="font-bold">{{ post.commentCount }}</span>
          </a>

          <button (click)="share.emit(post)"
                  class="flex items-center gap-2 text-sm text-gray-400 transition-all rounded-xl px-3 py-2 hover:bg-emerald-50 hover:text-emerald-600 group/share">
            <svg class="w-5 h-5 transition-transform group-hover/share:scale-125" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
            </svg>
            <span class="font-bold">{{ post.shareCount }}</span>
          </button>
        </div>

        <button class="p-2 text-gray-400 hover:text-emerald-600 transition-colors rounded-xl hover:bg-emerald-50">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
          </svg>
        </button>
      </div>
    </div>
  `,
})
export class PostCardComponent {
  @Input({ required: true }) post!: Post;
  @Output() likeToggle = new EventEmitter<Post>();
  @Output() share = new EventEmitter<Post>();

  mediaError = false;

  isImage(type?: string): boolean {
    if (!type) return false;
    const t = type.toUpperCase();
    return t === 'IMAGE' || t === 'GIF' || t.startsWith('IMAGE/');
  }

  isVideo(type?: string): boolean {
    if (!type) return false;
    const t = type.toUpperCase();
    return t === 'VIDEO' || t.startsWith('VIDEO/');
  }

  handleMediaError() {
    this.mediaError = true;
  }
}
