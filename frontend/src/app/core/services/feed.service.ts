import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FeedResponse, FeedPost } from '../../shared/models/post.model';

@Injectable({ providedIn: 'root' })
export class FeedService {
  private readonly base = environment.feedApi;
  constructor(private http: HttpClient) {}

  getHomeFeed(userId: number, page = 1, size = 20) {
    return this.http.get<FeedResponse>(`${this.base}/${userId}`, {
      params: { page, size },
    });
  }

  getExploreFeed(userId: number) {
    return this.http.get<FeedPost[]>(`${this.base}/explore/${userId}`);
  }

  getTimeline(userId: number) {
    return this.http.get<FeedPost[]>(`${this.base}/timeline/${userId}`);
  }

  getTrendingHashtags(n = 10) {
    return this.http.get<{ tag: string; count: number }[]>(
      `${this.base}/trending-hashtags`, { params: { n } }
    );
  }

  invalidateCache(userId: number) {
    return this.http.delete(`${this.base}/cache/${userId}`);
  }
}