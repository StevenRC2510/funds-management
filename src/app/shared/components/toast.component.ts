import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LucideAngularModule, CircleCheck, CircleX, X } from 'lucide-angular';

import type { ToastType } from '../../core/models';
import { NotificationService } from '../../core/services/notification.service';

const TOAST_CONFIG: Record<ToastType, { icon: typeof CircleCheck; classes: string }> = {
  success: {
    icon: CircleCheck,
    classes: 'bg-green-50 text-green-800 border border-green-200',
  },
  error: {
    icon: CircleX,
    classes: 'bg-red-50 text-red-800 border border-red-200',
  },
};

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toast.component.html',
})
export class ToastComponent {
  protected readonly toastConfig = TOAST_CONFIG;
  protected readonly closeIcon = X;
  protected readonly notificationService = inject(NotificationService);
}
