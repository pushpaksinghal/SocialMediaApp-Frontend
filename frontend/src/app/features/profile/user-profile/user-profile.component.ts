import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { PostService } from '../../../core/services/post.service';
import { FollowService } from '../../../core/services/follow.service';
import { LikeService } from '../../../core/services/like.service';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { PostCardComponent } from '../../../shared/components/post-card/post-card.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { User } from '../../../shared/models/user.model';
import { Post } from '../../../shared/models/post.model';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, AvatarComponent, PostCardComponent, LoaderComponent],
  template: `
    <div class="max-w-xl mx-auto space-y-4">
      <app-loader *ngIf="loading" />
      <ng-container *ngIf="!loading && user">
        <!-- Profile header -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div class="flex items-center gap-4">
            <app-avatar [src]="user.avatarUrl" [name]="user.userName" [size]="72" />
            <div class="flex-1 min-w-0">
              <h2 class="font-bold text-xl text-gray-900">{{ user.fullName }}</h2>
              <p class="text-gray-400 text-sm">{{ user.userName }}</p>
              <p *ngIf="user.bio" class="text-gray-600 text-sm mt-1">{{ user.bio }}</p>
            </div>
          </div>

          <div class="grid grid-cols-3 text-center border-t border-gray-50 pt-4">
            <div><p class="font-bold text-gray-900">{{ user.postCount }}</p><p class="text-xs text-gray-400">Posts</p></div>
            <div><p class="font-bold text-gray-900">{{ user.followerCount }}</p><p class="text-xs text-gray-400">Followers</p></div>
            <div><p class="font-bold text-gray-900">{{ user.followingCount }}</p><p class="text-xs text-gray-400">Following</p></div>
          </div>

          <div class="flex gap-3 justify-end">
            <ng-container *ngIf="isOwnProfile">
              <a routerLink="/auth/profile-edit"
                 class="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                Edit Profile
              </a>
            </ng-container>
            <ng-container *ngIf="!isOwnProfile">
              <button (click)="toggleFollow()"
                      [class.bg-indigo-600]="!isFollowing"
                      [class.text-white]="!isFollowing"
                      [class.border-indigo-600]="!isFollowing"
                      [class.border-gray-200]="isFollowing"
                      class="px-5 py-2 text-sm border rounded-xl font-semibold transition-colors hover:opacity-80">
                {{ isFollowing ? 'Unfollow' : 'Follow' }}
              </button>
            </ng-container>
          </div>
        </div>

        <!-- Posts -->
        <app-post-card *ngFor="let p of posts" [post]="p"
          (likeToggle)="toggleLike($event)" />
        <p *ngIf="posts.length === 0 && !loading" class="text-center text-gray-400 py-8">No posts yet.</p>
      </ng-container>
    </div>
  `,
})
export class UserProfileComponent implements OnInit {
  private route    = inject(ActivatedRoute);
  private authSv   = inject(AuthService);
  private postSv   = inject(PostService);
  private followSv = inject(FollowService);
  private likes    = inject(LikeService);

  user?: User;
  posts: Post[] = [];
  loading = true;
  isFollowing = false;
  isOwnProfile = false;
  private dr = inject(DestroyRef);

  ngOnInit() {
    const userName = this.route.snapshot.paramMap.get('userName')!;

    // Sync likes across views
    this.likes.postLiked$.pipe(
      takeUntilDestroyed(this.dr)
    ).subscribe(update => {
      const post = this.posts.find(p => p.postId === update.postId);
      if (post) {
        post.isLiked = update.liked;
        post.likeCount = update.likeCount;
      }
    });

    this.authSv.getProfile(userName).subscribe(u => {
      this.user = u;
      this.loading = false;
      this.authSv.cacheUser(u); // cache for enrichment

      const me = this.authSv.currentUser();
      this.isOwnProfile = me?.userId === u.userId;
      if (!this.isOwnProfile && me) {
        this.followSv.isFollowing(u.userId).subscribe(r => this.isFollowing = r.isFollowing);
      }

      // Load user's posts & enrich with this user as author + isLiked
      this.postSv.getPostsByUser(u.userId).pipe(
        switchMap(posts => {
          // We know the author — enrich immediately
          const withAuthor = this.postSv.enrichPostsWithAuthor(posts, {
            userName: u.userName,
            fullName: u.fullName,
            avatarUrl: u.avatarUrl,
          });
          return this.postSv.enrichPosts(withAuthor);
        })
      ).subscribe(p => this.posts = p);
    });
  }

  toggleFollow() {
    if (!this.user) return;
    if (this.isFollowing) {
      this.followSv.unfollow(this.user.userId).subscribe(() => {
        this.isFollowing = false;
        this.user!.followerCount--;
        // Update currentUser signal → sidebar updates instantly
        this.authSv.adjustFollowingCount(-1);
      });
    } else {
      this.followSv.follow({
        followeeId: this.user.userId,
        isPrivate: this.user.isPrivate,
      }).subscribe(() => {
        this.isFollowing = true;
        this.user!.followerCount++;
        // Update currentUser signal → sidebar updates instantly
        this.authSv.adjustFollowingCount(1);
      });
    }
  }

  toggleLike(post: Post) {
    this.likes.toggle(post.postId).subscribe(res => {
      post.isLiked = res.liked;
      post.likeCount = res.likeCount;
    });
  }
}