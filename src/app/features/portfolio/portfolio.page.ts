import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p>Portfolio page</p>`,
})
export class PortfolioPage {}
