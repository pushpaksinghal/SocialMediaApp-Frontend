import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';
import { AuthService } from '../../core/services/auth.service';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';
import { Notification } from '../../shared/models/notification.model';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, TimeAgoPipe, LoaderComponent],
  template: `
    <div class="max-w-xl mx-auto space-y-2">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-bold text-xl text-gray-900">Notifications</h2>
        <button *ngIf="unreadCount > 0" (click)="markAllRead()"
                class="text-xs text-indigo-600 hover:underline">Mark all read</button>
      </div>

      <app-loader *ngIf="loading" />

      <div *ngFor="let n of notifications"
           (click)="markRead(n)"
           [class.bg-indigo-50]="!n.isRead"
           [class.bg-white]="n.isRead"
           class="flex items-start gap-3 rounded-2xl border border-gray-100 p-4 cursor-pointer hover:border-indigo-200 transition-all">
        <div class="w-2 h-2 rounded-full mt-2 flex-shrink-0"
             [class.bg-indigo-500]="!n.isRead"
             [class.bg-transparent]="n.isRead"></div>
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-800">{{ n.message }}</p>
          <p class="text-xs text-gray-400 mt-0.5">{{ n.createdAt | timeAgo }}</p>
        </div>
        <button (click)="$event.stopPropagation(); deleteNotif(n)"
                class="text-gray-300 hover:text-red-400 text-xs">✕</button>
      </div>

      <p *ngIf="!loading && notifications.length === 0"
         class="text-center text-gray-400 py-12">No notifications yet.</p>
    </div>
  `,
})
export class NotificationsComponent implements OnInit {
  private notifSv = inject(NotificationService);
  private auth    = inject(AuthService);

  notifications: Notification[] = [];
  loading = true;
  unreadCount = 0;

  ngOnInit() {
    const userId = this.auth.currentUser()?.userId;
    if (!userId) return;

    // Get unread count
    this.notifSv.getUnreadCount().subscribe({
      next: r => this.unreadCount = r.count,
      error: () => {},
    });

    // Load ALL notifications (paged), not just unread
    this.notifSv.getNotifications(userId).subscribe({
      next: n => {
        this.notifications = n;
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  markRead(n: Notification) {
    if (n.isRead) return;
    this.notifSv.markAsRead(n.notificationId).subscribe(() => {
      n.isRead = true;
      this.unreadCount = Math.max(0, this.unreadCount - 1);
    });
  }

  markAllRead() {
    this.notifSv.markAllRead().subscribe(() => {
      this.notifications.forEach(n => n.isRead = true);
      this.unreadCount = 0;
    });
  }

  deleteNotif(n: Notification) {
    this.notifSv.delete(n.notificationId).subscribe(() => {
      this.notifications = this.notifications.filter(x => x.notificationId !== n.notificationId);
    });
  }
}