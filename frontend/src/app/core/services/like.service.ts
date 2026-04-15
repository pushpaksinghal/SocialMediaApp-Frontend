import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LikeService {
  private readonly base = environment.likeApi;

  private postLikedSource = new Subject<{ postId: number; liked: boolean; likeCount: number }>();
  postLiked$ = this.postLikedSource.asObservable();

  constructor(private http: HttpClient) {}

  toggle(postId: number, targetType = 'POST') {
    return this.http.post<{ liked: boolean; likeCount: number }>(
      `${this.base}/toggle`, { targetId: postId, targetType }
    ).pipe(
      tap(res => this.postLikedSource.next({ postId, ...res }))
    );
  }

  hasLiked(userId: number, targetId: number, targetType = 'POST') {
    return this.http.get<{ liked: boolean }>(
      `${this.base}/has/${userId}/${targetId}/${targetType}`
    );
  }

  getCount(targetId: number, targetType = 'POST') {
    return this.http.get<{ count: number }>(
      `${this.base}/count/${targetId}/${targetType}`
    );
  }

  getLikedPosts(userId: number) {
    return this.http.get<any[]>(`${this.base}/user/${userId}/posts`);
  }
}