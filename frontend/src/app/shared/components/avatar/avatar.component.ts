import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <img *ngIf="src; else initials"
         [src]="src" [alt]="name"
         [style.width.px]="size" [style.height.px]="size"
         (error)="src = null"
         class="rounded-full object-cover" />
    <ng-template #initials>
      <div class="rounded-full flex items-center justify-center bg-indigo-500 text-white font-semibold"
           [style.width.px]="size" [style.height.px]="size"
           [style.font-size.px]="size * 0.4">
        {{ name | slice:0:1 | uppercase }}
      </div>
    </ng-template>
  `,
})
export class AvatarComponent {
  @Input() src?: string | null;
  @Input() name = '?';
  @Input() size = 40;
}