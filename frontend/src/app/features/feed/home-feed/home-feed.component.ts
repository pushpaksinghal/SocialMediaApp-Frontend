import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FeedService } from '../../../core/services/feed.service';
import { LikeService } from '../../../core/services/like.service';
import { PostService } from '../../../core/services/post.service';
import { AuthService } from '../../../core/services/auth.service';
import { PostCardComponent } from '../../../shared/components/post-card/post-card.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { FeedPost } from '../../../shared/models/post.model';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-home-feed',
  standalone: true,
  imports: [CommonModule, RouterModule, PostCardComponent, LoaderComponent],
  template: `
    <div class="space-y-4">
      <!-- Create post prompt -->
      <a routerLink="/post/create"
         class="flex items-center gap-3 rounded-2xl p-4 cursor-pointer transition-all group"
         style="background: white; border: 1px solid rgba(34,197,94,0.15); box-shadow: 0 2px 12px rgba(10,42,26,0.05);"
         onmouseover="this.style.borderColor='rgba(34,197,94,0.35)'; this.style.boxShadow='0 4px 20px rgba(10,42,26,0.1)'"
         onmouseout="this.style.borderColor='rgba(34,197,94,0.15)'; this.style.boxShadow='0 2px 12px rgba(10,42,26,0.05)'">
        <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
             style="background: linear-gradient(135deg, rgba(34,197,94,0.15), rgba(8,145,178,0.15)); border: 1px solid rgba(34,197,94,0.25);">
          <svg class="w-5 h-5" style="color: #22c55e;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
        </div>
        <span class="text-sm" style="color: #94a3b8;">What's on your mind?</span>
      </a>

      <app-loader *ngIf="loading" />

      <ng-container *ngIf="!loading">
        <div *ngIf="posts.length === 0" class="text-center py-16 rounded-2xl"
             style="background: white; border: 1px solid rgba(34,197,94,0.1);">
          <div class="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
               style="background: linear-gradient(135deg, rgba(34,197,94,0.1), rgba(8,145,178,0.1));">
            <svg class="w-8 h-8" style="color: #22c55e;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"/>
            </svg>
          </div>
          <p class="font-semibold" style="color: #0a1f12; font-family:'Sora',sans-serif;">No posts yet</p>
          <p class="text-sm mt-1" style="color: #94a3b8;">Follow people to see their posts!</p>
        </div>

        <app-post-card
          *ngFor="let post of posts"
          [post]="post"
          (likeToggle)="toggleLike($event)"
          (share)="sharePost($event)" />

        <div *ngIf="hasMore" class="text-center py-2">
          <button (click)="loadMore()"
                  class="text-sm font-semibold px-6 py-2.5 rounded-full transition-all"
                  style="color: #0891b2; border: 1px solid rgba(8,145,178,0.3);"
                  onmouseover="this.style.background='rgba(8,145,178,0.08)'"
                  onmouseout="this.style.background='transparent'">
            Load more
          </button>
        </div>
      </ng-container>
    </div>
  `,
})
export class HomeFeedComponent implements OnInit {
  private feed    = inject(FeedService);
  private likes   = inject(LikeService);
  private posts$  = inject(PostService);
  private auth    = inject(AuthService);
  private dr      = inject(DestroyRef);

  posts: FeedPost[] = [];
  loading = true;
  page = 1;
  hasMore = false;

  ngOnInit() {
    this.loadFeed();
    this.likes.postLiked$.pipe(takeUntilDestroyed(this.dr)).subscribe(update => {
      const post = this.posts.find(p => p.postId === update.postId);
      if (post) { post.isLiked = update.liked; post.likeCount = update.likeCount; }
    });
  }

  loadFeed() {
    const userId = this.auth.currentUser()?.userId;
    if (!userId) return;
    this.feed.getHomeFeed(userId, this.page).pipe(
      switchMap((res: any) => {
        const newPosts: FeedPost[] = Array.isArray(res) ? res : (res.posts ?? []);
        const total = res.total ?? newPosts.length;
        return this.posts$.enrichPosts(newPosts).pipe(
          switchMap(enriched => {
            this.posts = [...this.posts, ...enriched];
            this.hasMore = this.posts.length < total;
            this.loading = false;
            return of(null);
          })
        );
      })
    ).subscribe({
      error: () => {
        this.posts$.getPublicFeed().pipe(switchMap(p => this.posts$.enrichPosts(p))).subscribe({
          next: p => { this.posts = p; this.loading = false; },
          error: () => { this.loading = false; },
        });
      },
    });
  }

  loadMore() { this.page++; this.loadFeed(); }

  toggleLike(post: FeedPost) {
    this.likes.toggle(post.postId).subscribe(res => {
      post.isLiked = res.liked;
      post.likeCount = res.likeCount;
    });
  }

  sharePost(post: FeedPost) {
    this.posts$.sharePost(post.postId).subscribe(() => post.shareCount++);
  }
}
