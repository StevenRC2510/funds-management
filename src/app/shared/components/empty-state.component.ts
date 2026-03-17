import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LucideAngularModule, PackageOpen } from 'lucide-angular';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './empty-state.component.html',
})
export class EmptyStateComponent {
  readonly message = input.required<string>();
  protected readonly icon = PackageOpen;
}
