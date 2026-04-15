import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of, Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Post, CreatePostRequest, UpdatePostRequest } from '../../shared/models/post.model';
import { AuthService } from './auth.service';
import { LikeService } from './like.service';

@Injectable({ providedIn: 'root' })
export class PostService {
  private readonly base = environment.postApi;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private likeService: LikeService,
  ) {}

  createPost(req: CreatePostRequest, media?: File) {
    const form = new FormData();
    form.append('content', req.content);
    if (req.visibility) form.append('visibility', req.visibility);
    if (req.hashtags)   form.append('hashtags', req.hashtags);
    if (req.mediaUrl)   form.append('mediaUrl', req.mediaUrl);
    if (media)          form.append('media', media);
    return this.http.post<Post>(this.base, form);
  }

  uploadToCloudinary(file: File): Observable<{ secure_url: string }> {
    const cloudName = 'dtwxq3geu'; 
    const uploadPreset = 'jbttcee5';
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', uploadPreset);

    return this.http.post<{ secure_url: string }>(url, data);
  }

  getPost(id: number) {
    return this.http.get<Post>(`${this.base}/${id}`);
  }

  getPostsByUser(userId: number) {
    return this.http.get<Post[]>(`${this.base}/user/${userId}`);
  }

  updatePost(id: number, req: UpdatePostRequest) {
    return this.http.put<Post>(`${this.base}/${id}`, req);
  }

  deletePost(id: number) {
    return this.http.delete(`${this.base}/${id}`);
  }

  getByHashtag(tag: string) {
    return this.http.get<Post[]>(`${this.base}/hashtag/${tag}`);
  }

  search(q: string) {
    return this.http.get<Post[]>(`${this.base}/search`, { params: { q } });
  }

  getTrending() {
    return this.http.get<Post[]>(`${this.base}/trending`);
  }

  sharePost(id: number) {
    return this.http.post<Post>(`${this.base}/share/${id}`, {});
  }

  getPublicFeed() {
    return this.http.get<Post[]>(`${this.base}/public`);
  }

  /**
   * Enrich posts with author info (from Auth API batch) and isLiked status.
   * If the post already has an author (populated by backend), skips the lookup.
   * Both author lookups and like checks run in parallel.
   */
  enrichPosts(posts: Post[]): Observable<Post[]> {
    if (!posts || posts.length === 0) return of([]);

    const currentUserId = this.authService.currentUser()?.userId;

    // ── 1. Author batch lookup ──────────────────────────────────────
    // Only look up IDs that the backend hasn't already populated
    const missingAuthorIds = [...new Set(
      posts.filter(p => !p.author).map(p => p.userId)
    )];

    const authors$ = missingAuthorIds.length > 0
      ? this.authService.getUsersByIds(missingAuthorIds)
      : of(new Map<number, any>());

    // ── 2. isLiked batch check ──────────────────────────────────────
    const likeLookups$ = currentUserId
      ? posts.map(p =>
          this.likeService.hasLiked(currentUserId, p.postId).pipe(
            map(r => ({ postId: p.postId, liked: r.liked })),
            catchError(() => of({ postId: p.postId, liked: false }))
          )
        )
      : [];

    const likes$ = likeLookups$.length > 0
      ? forkJoin(likeLookups$)
      : of([] as { postId: number; liked: boolean }[]);

    // ── 3. Merge both in parallel ───────────────────────────────────
    return forkJoin({ userMap: authors$, likeResults: likes$ }).pipe(
      map(({ userMap, likeResults }) => {
        const likeMap = new Map(likeResults.map(r => [r.postId, r.liked]));
        return posts.map(p => ({
          ...p,
          // Only set author if backend didn't already provide one
          author: p.author ?? (userMap.get(p.userId)
            ? {
                userName:  userMap.get(p.userId)!.userName,
                fullName:  userMap.get(p.userId)!.fullName,
                avatarUrl: userMap.get(p.userId)!.avatarUrl,
              }
            : undefined),
          isLiked: likeMap.get(p.postId) ?? p.isLiked ?? false,
        }));
      })
    );
  }

  /**
   * Enrich posts using a known author (when we already have
   * the user profile, e.g. on user-profile page).
   */
  enrichPostsWithAuthor(posts: Post[], author: { userName: string; fullName: string; avatarUrl?: string }): Post[] {
    return posts.map(p => ({
      ...p,
      author: p.author ?? author,
    }));
  }
}
