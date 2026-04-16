import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Follow, FollowRequest } from '../../shared/models/follow.model';
import { User } from '../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class FollowService {
  private readonly base = environment.followApi;
  constructor(private http: HttpClient) {}

  follow(req: FollowRequest) {
    return this.http.post<Follow>(this.base, req);
  }

  unfollow(followeeId: number) {
    return this.http.delete(`${this.base}/${followeeId}`);
  }

  accept(followId: number) {
    return this.http.put<Follow>(`${this.base}/${followId}/accept`, {});
  }

  reject(followId: number) {
    return this.http.put<Follow>(`${this.base}/${followId}/reject`, {});
  }

  getFollowers(userId: number) {
    return this.http.get<Follow[]>(`${this.base}/${userId}/followers`);
  }

  getFollowing(userId: number) {
    return this.http.get<Follow[]>(`${this.base}/${userId}/following`);
  }

  getPending() {
    return this.http.get<Follow[]>(`${this.base}/pending`);
  }

  isFollowing(followeeId: number) {
    return this.http.get<{ isFollowing: boolean }>(`${this.base}/is/${followeeId}`);
  }

  getFollowingIds(userId: number) {
    return this.http.get<number[]>(`${this.base}/ids/${userId}`);
  }
}