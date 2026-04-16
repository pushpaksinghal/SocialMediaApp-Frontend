import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
  User,
} from '../../shared/models/user.model';

const TOKEN_KEY   = 'cs_access_token';
const REFRESH_KEY = 'cs_refresh_token';
const USER_KEY    = 'cs_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly base = environment.authApi;
  currentUser = signal<User | null>(this.loadUser());

  // ── user cache for enrichment ─────────────────────────
  private userCache = new Map<number, User>();

  constructor(private http: HttpClient, private router: Router) {}

  // ── helpers ────────────────────────────────────────────
  getAccessToken(): string | null   { return localStorage.getItem(TOKEN_KEY); }
  getRefreshToken(): string | null  { return localStorage.getItem(REFRESH_KEY); }
  isLoggedIn(): boolean             { return !!this.getAccessToken(); }

  private loadUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  persist(res: AuthResponse) {
    localStorage.setItem(TOKEN_KEY,   res.accessToken);
    localStorage.setItem(REFRESH_KEY, res.refreshToken);
    localStorage.setItem(USER_KEY,    JSON.stringify(res.user));
    this.currentUser.set(res.user);
  }

  // ── API calls ──────────────────────────────────────────
  register(req: RegisterRequest) {
    return this.http.post<AuthResponse>(`${this.base}/register`, req)
      .pipe(tap(res => this.persist(res)));
  }

  login(req: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.base}/login`, req)
      .pipe(tap(res => this.persist(res)));
  }

  logout() {
    const body = { refreshToken: this.getRefreshToken() };
    // Clear local session IMMEDIATELY so the user is always logged out
    this.clearSession();
    // Best-effort: tell backend to blacklist the token (fire-and-forget)
    this.http.post(`${this.base}/logout`, body).subscribe({
      error: () => { /* already cleared locally, ignore server errors */ }
    });
  }

  refresh() {
    return this.http.post<AuthResponse>(`${this.base}/refresh`, {
      refreshToken: this.getRefreshToken(),
    }).pipe(tap(res => this.persist(res)));
  }

  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  /** Increment or decrement followingCount on the current user signal + localStorage */
  adjustFollowingCount(delta: 1 | -1) {
    const user = this.currentUser();
    if (!user) return;
    const updated = { ...user, followingCount: Math.max(0, user.followingCount + delta) };
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
    this.currentUser.set(updated);
  }

  /** Increment or decrement followerCount on the current user signal + localStorage */
  adjustFollowerCount(delta: 1 | -1) {
    const user = this.currentUser();
    if (!user) return;
    const updated = { ...user, followerCount: Math.max(0, user.followerCount + delta) };
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
    this.currentUser.set(updated);
  }

  /** Increment or decrement postCount on the current user signal + localStorage */
  adjustPostCount(delta: 1 | -1) {
    const user = this.currentUser();
    if (!user) return;
    const updated = { ...user, postCount: Math.max(0, user.postCount + delta) };
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
    this.currentUser.set(updated);
  }

  getProfile(userName: string) {
    return this.http.get<User>(`${this.base}/${userName}`);
  }
  searchUsers(q: string) {
    return this.http.get<User[]>(`${this.base}/search`, { params: { q } });
  }

  getSuggestions() {
    return this.http.get<User[]>(`${this.base}/suggestions`);
  }

  /**
   * Batch-fetch user profiles by IDs from Auth API.
   * Checks cache first, only requests uncached IDs.
   * Returns a Map<userId, user> for O(1) lookup.
   */
  getUsersByIds(userIds: number[]): Observable<Map<number, User>> {
    const result    = new Map<number, User>();
    const uncached  = userIds.filter(id => !this.userCache.has(id));

    // Populate result with already-cached users
    userIds.forEach(id => {
      const u = this.userCache.get(id);
      if (u) result.set(id, u);
    });

    if (uncached.length === 0) return of(result);

    return this.http.post<User[]>(`${this.base}/users/batch`, uncached).pipe(
      map(users => {
        users.forEach(u => {
          this.userCache.set(u.userId, u);
          result.set(u.userId, u);
        });
        return result;
      }),
      // If batch endpoint fails, return whatever we have from cache
      catchError(() => of(result))
    );
  }

  /** Cache a user (used during enrichment) */
  cacheUser(user: User) {
    this.userCache.set(user.userId, user);
  }

  /** Get cached user by ID (synchronous, returns undefined if not cached) */
  getCachedUser(userId: number): User | undefined {
    return this.userCache.get(userId);
  }

  updateProfile(id: number, data: UpdateProfileRequest, avatar?: File) {
    const form = new FormData();
    if (data.fullName) form.append('fullName', data.fullName);
    if (data.bio)      form.append('bio', data.bio);
    if (avatar)        form.append('avatar', avatar);
    return this.http.put<User>(`${this.base}/profile/${id}`, form).pipe(
      tap(user => {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        this.currentUser.set(user);
      })
    );
  }

  changePassword(id: number, req: ChangePasswordRequest) {
    return this.http.put(`${this.base}/password/${id}`, req);
  }

  togglePrivacy(id: number) {
    return this.http.patch(`${this.base}/privacy/${id}`, {});
  }

  deactivate() {
    return this.http.delete(`${this.base}/deactivate`).pipe(
      tap(() => this.clearSession())
    );
  }

  loginWithGoogle() {
    window.location.href = `${this.base}/login/google`;
  }

  loginWithGitHub() {
    window.location.href = `${this.base}/login/github`;
  }
}