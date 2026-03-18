import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import type { Fund } from '../../core/models';
import { CopCurrencyPipe } from '../../shared/pipes/cop-currency.pipe';

@Component({
  selector: 'app-fund-card',
  imports: [CopCurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fund-card.component.html',
})
export class FundCardComponent {
  readonly fund = input.required<Fund>();
  readonly subscribed = input(false);
  readonly disabled = input(false);

  readonly subscribe = output();
}
