import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, Landmark, Briefcase, History } from 'lucide-angular';

import { BalanceDisplayComponent } from './balance-display.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule, BalanceDisplayComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  protected readonly navItems = [
    { path: '/funds', label: 'Fondos', icon: Landmark },
    { path: '/portfolio', label: 'Portafolio', icon: Briefcase },
    { path: '/history', label: 'Historial', icon: History },
  ];
}
