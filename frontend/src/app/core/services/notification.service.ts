import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Notification } from '../../shared/models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly base = environment.notifApi;
  constructor(private http: HttpClient) {}

  getNotifications(userId: number, page = 1, pageSize = 20) {
    return this.http.get<Notification[]>(`${this.base}/${userId}`, {
      params: { page, pageSize },
    });
  }

  getUnread() {
    return this.http.get<Notification[]>(`${this.base}/unread`);
  }

  getUnreadCount() {
    return this.http.get<{ count: number }>(`${this.base}/unread/count`);
  }

  markAsRead(id: number) {
    return this.http.put(`${this.base}/${id}/read`, {});
  }

  markAllRead() {
    return this.http.put(`${this.base}/read-all`, {});
  }

  delete(id: number) {
    return this.http.delete(`${this.base}/${id}`);
  }
}