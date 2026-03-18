import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

import type { Fund, NotificationMethod } from '../../core/models';
import { CopCurrencyPipe } from '../../shared/pipes/cop-currency.pipe';

const NOTIFICATION_OPTIONS: { value: NotificationMethod; label: string }[] = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
];

@Component({
  selector: 'app-subscribe-dialog',
  imports: [CopCurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './subscribe-dialog.component.html',
})
export class SubscribeDialogComponent {
  readonly fund = input.required<Fund>();

  readonly confirmed = output<NotificationMethod>();
  readonly cancelled = output();

  protected readonly notificationOptions = NOTIFICATION_OPTIONS;
  protected readonly selectedMethod = signal<NotificationMethod>('email');

  protected selectMethod(method: NotificationMethod): void {
    this.selectedMethod.set(method);
  }

  protected confirm(): void {
    this.confirmed.emit(this.selectedMethod());
  }
}
