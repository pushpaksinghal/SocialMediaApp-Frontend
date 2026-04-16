import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PostService } from '../../../core/services/post.service';
import { CommentService } from '../../../core/services/comment.service';
import { LikeService } from '../../../core/services/like.service';
import { AuthService } from '../../../core/services/auth.service';
import { PostCardComponent } from '../../../shared/components/post-card/post-card.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { Post } from '../../../shared/models/post.model';
import { Comment } from '../../../shared/models/comment.model';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, PostCardComponent, AvatarComponent, TimeAgoPipe, LoaderComponent],
  template: `
    <div class="max-w-xl mx-auto space-y-4">
      <app-loader *ngIf="loading" />
      <ng-container *ngIf="!loading && post">
        <app-post-card [post]="post" (likeToggle)="toggleLike()" />

        <!-- Comments -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
          <h3 class="font-semibold text-gray-700 text-sm">Comments ({{ comments.length }})</h3>

          <!-- Add comment -->
          <form [formGroup]="commentForm" (ngSubmit)="addComment()" class="flex gap-3 items-start">
            <app-avatar [src]="auth.currentUser()?.avatarUrl" [name]="auth.currentUser()?.userName || ''" [size]="32"/>
            <div class="flex-1">
              <textarea formControlName="content" rows="2"
                        placeholder="Write a comment…"
                        class="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"></textarea>
              <div class="flex justify-end mt-1">
                <button type="submit" [disabled]="commentForm.invalid"
                        class="text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-lg disabled:opacity-40 hover:bg-indigo-700 transition-colors">
                  Reply
                </button>
              </div>
            </div>
          </form>

          <!-- Comment list -->
          <div *ngFor="let c of comments" class="flex gap-3">
            <app-avatar [src]="c.author?.avatarUrl" [name]="c.author?.userName || ''" [size]="32"/>
            <div class="flex-1 bg-gray-50 rounded-xl p-3">
              <div class="flex items-baseline gap-2">
                <span class="text-sm font-semibold text-gray-800">{{ c.author?.userName || 'User #' + c.userId }}</span>
                <span class="text-xs text-gray-400">{{ c.createdAt | timeAgo }}</span>
              </div>
              <p class="text-sm text-gray-700 mt-0.5">{{ c.content }}</p>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `,
})
export class PostDetailComponent implements OnInit {
  private route    = inject(ActivatedRoute);
  private postSv   = inject(PostService);
  private commentSv= inject(CommentService);
  private likeSv   = inject(LikeService);
  auth             = inject(AuthService);
  private fb       = inject(FormBuilder);

  private dr = inject(DestroyRef);

  post?: Post;
  comments: Comment[] = [];
  loading = true;

  commentForm = this.fb.group({ content: ['', Validators.required] });

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;

    // Sync likes across views
    this.likeSv.postLiked$.pipe(
      takeUntilDestroyed(this.dr)
    ).subscribe(update => {
      if (this.post && this.post.postId === update.postId) {
        this.post.isLiked = update.liked;
        this.post.likeCount = update.likeCount;
      }
    });

    // Load post and enrich with isLiked
    this.postSv.getPost(id).pipe(
      switchMap(p => this.postSv.enrichPosts([p]))
    ).subscribe(posts => {
      this.post = posts[0];
      this.loading = false;
    });

    // Load comments (backend CommentDto has no author — show userId as fallback)
    this.commentSv.getTopLevel(id).subscribe(c => this.comments = c);
  }

  toggleLike() {
    if (!this.post) return;
    this.likeSv.toggle(this.post.postId).subscribe(res => {
      this.post!.isLiked = res.liked;
      this.post!.likeCount = res.likeCount;
    });
  }

  addComment() {
    if (!this.post || this.commentForm.invalid) return;
    const { content } = this.commentForm.value;
    this.commentSv.addComment({ postId: this.post.postId, content: content! }).subscribe(c => {
      // Set author from current user for immediate display
      const me = this.auth.currentUser();
      if (me) {
        c.author = { userName: me.userName, avatarUrl: me.avatarUrl };
      }
      this.comments.unshift(c);
      this.post!.commentCount++;
      this.commentForm.reset();
    });
  }
}