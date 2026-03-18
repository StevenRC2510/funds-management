import { Injectable, signal } from '@angular/core';

import type { Toast, ToastType } from '../models';

const AUTO_DISMISS_MS = 5000;

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly _toasts = signal<Toast[]>([]);
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();
  private nextId = 0;

  readonly toasts = this._toasts.asReadonly();

  showSuccess(message: string): void {
    this.addToast('success', message);
  }

  showError(message: string): void {
    this.addToast('error', message);
  }

  dismiss(id: number): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
    this._toasts.update((list) => list.filter((t) => t.id !== id));
  }

  private addToast(type: ToastType, message: string): void {
    const id = this.nextId++;
    this._toasts.update((list) => [...list, { id, type, message }]);
    this.timers.set(id, setTimeout(() => this.dismiss(id), AUTO_DISMISS_MS));
  }
}
