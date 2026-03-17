import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { UserService } from '../../core/services/user.service';
import { CopCurrencyPipe } from '../pipes/cop-currency.pipe';

@Component({
  selector: 'app-balance-display',
  standalone: true,
  imports: [CopCurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './balance-display.component.html',
})
export class BalanceDisplayComponent {
  protected readonly userService = inject(UserService);
}
