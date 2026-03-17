import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-history',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p>History page</p>`,
})
export class HistoryPage {}
