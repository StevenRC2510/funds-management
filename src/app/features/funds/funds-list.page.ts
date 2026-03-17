import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-funds-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p>Funds page</p>`,
})
export class FundsListPage {}
