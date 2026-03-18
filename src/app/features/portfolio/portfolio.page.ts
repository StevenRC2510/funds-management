import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import type { Subscription } from '../../core/models';
import { SubscriptionService } from '../../core/services/subscription.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog.component';
import { SubscriptionCardComponent } from './subscription-card.component';

@Component({
  selector: 'app-portfolio',
  imports: [LoadingSpinnerComponent, EmptyStateComponent, ConfirmDialogComponent, SubscriptionCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './portfolio.page.html',
})
export class PortfolioPage {
  protected readonly subscriptionService = inject(SubscriptionService);
  private readonly router = inject(Router);
  protected readonly subscriptionToCancel = signal<Subscription | null>(null);

  protected openCancelDialog(subscription: Subscription): void {
    this.subscriptionToCancel.set(subscription);
  }

  protected closeCancelDialog(): void {
    this.subscriptionToCancel.set(null);
  }

  protected confirmCancel(): void {
    const subscription = this.subscriptionToCancel();
    if (subscription) {
      this.subscriptionService.cancel(subscription);
      this.subscriptionToCancel.set(null);
    }
  }

  protected navigateToFunds(): void {
    this.router.navigate(['/funds']);
  }
}
