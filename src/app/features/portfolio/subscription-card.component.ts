import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import type { Subscription } from '../../core/models';
import { CopCurrencyPipe } from '../../shared/pipes/cop-currency.pipe';

@Component({
  selector: 'app-subscription-card',
  imports: [DatePipe, CopCurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './subscription-card.component.html',
})
export class SubscriptionCardComponent {
  readonly subscription = input.required<Subscription>();
  readonly disabled = input(false);

  readonly cancel = output();
}
