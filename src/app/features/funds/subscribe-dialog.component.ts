import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

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
export class SubscribeDialogComponent implements AfterViewInit, OnDestroy {
  readonly fund = input.required<Fund>();
  readonly loading = input(false);
  readonly balance = input(0);

  readonly confirmed = output<NotificationMethod>();
  readonly cancelled = output();

  protected readonly notificationOptions = NOTIFICATION_OPTIONS;
  protected readonly selectedMethod = signal<NotificationMethod>('email');

  protected readonly dialogPanel = viewChild<ElementRef<HTMLElement>>('dialogPanel');

  private previouslyFocusedElement: HTMLElement | null = null;

  ngAfterViewInit(): void {
    this.previouslyFocusedElement = document.activeElement as HTMLElement;
    const panel = this.dialogPanel()?.nativeElement;
    if (panel) {
      const firstFocusable = panel.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      firstFocusable?.focus();
    }
  }

  ngOnDestroy(): void {
    this.previouslyFocusedElement?.focus();
  }

  @HostListener('keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.cancelled.emit();
      return;
    }

    if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  }

  protected selectMethod(method: NotificationMethod): void {
    this.selectedMethod.set(method);
  }

  protected confirm(): void {
    this.confirmed.emit(this.selectedMethod());
  }

  private trapFocus(event: KeyboardEvent): void {
    const panel = this.dialogPanel()?.nativeElement;
    if (!panel) return;

    const focusableElements = panel.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (focusableElements.length === 0) return;

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}
