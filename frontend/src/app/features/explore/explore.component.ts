import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { FeedService } from '../../core/services/feed.service';
import { PostService } from '../../core/services/post.service';
import { LikeService } from '../../core/services/like.service';
import { PostCardComponent } from '../../shared/components/post-card/post-card.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { Post } from '../../shared/models/post.model';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PostCardComponent, LoaderComponent, AvatarComponent],
  template: `
    <div class="space-y-4">
      <!-- Search input -->
      <div class="relative">
        <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          [(ngModel)]="query"
          (ngModelChange)="onQueryChange($event)"
          (keydown.enter)="forceSearch()"
          placeholder="Search posts or people…"
          class="w-full rounded-2xl border border-gray-200 bg-white pl-11 pr-5 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        <button *ngIf="query" (click)="clearSearch()"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 text-lg leading-none">×</button>
      </div>

      <!-- Trending hashtags (shown when no query) -->
      <div *ngIf="!query.trim() && trending.length > 0" class="flex flex-wrap gap-2">
        <span class="text-xs text-gray-400 w-full">Trending</span>
        <button *ngFor="let t of trending"
                (click)="searchHashtag(t.tag)"
                class="text-xs px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors font-medium">
          #{{ t.tag }}
          <span class="text-gray-400 ml-0.5">{{ t.count }}</span>
        </button>
      </div>

      <!-- People results -->
      <ng-container *ngIf="users.length > 0">
        <h3 class="font-semibold text-gray-700 text-sm">People</h3>
        <div *ngFor="let u of users"
             class="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 p-3 shadow-sm">
          <app-avatar [src]="u.avatarUrl" [name]="u.userName" [size]="40"/>
          <div class="flex-1 min-w-0">
            <a [routerLink]="['/profile', u.userName]" class="font-semibold text-gray-900 text-sm hover:underline">
              {{ u.fullName }}
            </a>
            <p class="text-xs text-gray-400">{{ u.userName }}</p>
          </div>
        </div>
      </ng-container>

      <!-- Post results -->
      <app-loader *ngIf="loading" />
      <ng-container *ngIf="!loading">
        <h3 *ngIf="posts.length > 0 && query.trim()" class="font-semibold text-gray-700 text-sm">Posts</h3>
        <app-post-card
          *ngFor="let post of posts"
          [post]="post"
          (likeToggle)="toggleLike($event)" />
        <p *ngIf="posts.length === 0 && query.trim()" class="text-center text-gray-400 py-12">
          No results for "<strong>{{ query }}</strong>"
        </p>
      </ng-container>
    </div>
  `,
})
export class ExploreComponent implements OnInit, OnDestroy {
  private auth   = inject(AuthService);
  private feeds  = inject(FeedService);
  private postSv = inject(PostService);
  private likes  = inject(LikeService);
  private route  = inject(ActivatedRoute);

  query   = '';
  posts: Post[] = [];
  users:  User[] = [];
  trending: { tag: string; count: number }[] = [];
  loading = true;

  // Debounce subject: emits query string, fires search after 350ms of no typing
  private search$ = new Subject<string>();
  private subs    = new Subscription();

  ngOnInit() {
    // Wire up debounced search
    this.subs.add(
      this.search$.pipe(
        debounceTime(350),
        distinctUntilChanged(),
      ).subscribe(q => this.executeSearch(q))
    );

    // Warm up trending hashtags (fire-and-forget)
    this.feeds.getTrendingHashtags().subscribe({
      next: t => this.trending = t,
      error: () => {},
    });

    // If navbar passed ?q= param, search immediately
    const q = this.route.snapshot.queryParamMap.get('q');
    if (q) {
      this.query = q;
      this.executeSearch(q);
    } else {
      this.loadInitialData();
    }

    // Sync likes across views
    this.subs.add(
      this.likes.postLiked$.subscribe(update => {
        const post = this.posts.find(p => p.postId === update.postId);
        if (post) {
          post.isLiked = update.liked;
          post.likeCount = update.likeCount;
        }
      })
    );
  }

  ngOnDestroy() { this.subs.unsubscribe(); }

  // Called on every keypress — only pushes to debounce subject
  onQueryChange(q: string) {
    if (!q.trim()) {
      this.users = [];
      this.posts = [];
      this.loadInitialData();
      return;
    }
    this.search$.next(q.trim());
  }

  // Called on Enter key — bypasses debounce for immediate response
  forceSearch() {
    const q = this.query.trim();
    if (q) this.executeSearch(q);
  }

  clearSearch() {
    this.query = '';
    this.users = [];
    this.posts = [];
    this.loadInitialData();
  }

  searchHashtag(tag: string) {
    // Strip leading # if present, then search via hashtag endpoint
    const cleanTag = tag.replace(/^#/, '');
    this.query  = '#' + cleanTag;
    this.users  = [];
    this.loading = true;
    this.postSv.getByHashtag(cleanTag).pipe(
      switchMap(p => this.postSv.enrichPosts(p))
    ).subscribe({
      next: p => { this.posts = p; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  // ── private ──────────────────────────────────────────────────────────

  private executeSearch(q: string) {
    this.loading = true;
    this.users   = [];

    // If query starts with # → use hashtag endpoint instead of text search
    if (q.startsWith('#')) {
      const tag = q.slice(1).trim();
      if (!tag) { this.loadInitialData(); return; }
      this.postSv.getByHashtag(tag).pipe(
        switchMap(p => this.postSv.enrichPosts(p))
      ).subscribe({
        next: p => { this.posts = p; this.loading = false; },
        error: () => { this.loading = false; },
      });
      return;
    }

    // Text search: users + posts in parallel
    this.auth.searchUsers(q).subscribe({
      next: u => this.users = u,
      error: () => {},
    });

    this.postSv.search(q).pipe(
      switchMap(p => this.postSv.enrichPosts(p))
    ).subscribe({
      next: p => { this.posts = p; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  private loadInitialData() {
    this.loading = true;
    const uid = this.auth.currentUser()?.userId;

    const source$ = uid
      ? this.feeds.getExploreFeed(uid)
      : this.postSv.getTrending();

    source$.pipe(
      switchMap(p => this.postSv.enrichPosts(p as Post[]))
    ).subscribe({
      next: p => { this.posts = p; this.loading = false; },
      error: () => {
        // Fallback to trending if explore feed fails
        this.postSv.getTrending().pipe(
          switchMap(p => this.postSv.enrichPosts(p))
        ).subscribe({
          next: p => { this.posts = p; this.loading = false; },
          error: () => { this.loading = false; },
        });
      },
    });
  }

  toggleLike(post: Post) {
    this.likes.toggle(post.postId).subscribe(res => {
      post.isLiked   = res.liked;
      post.likeCount = res.likeCount;
    });
  }
}