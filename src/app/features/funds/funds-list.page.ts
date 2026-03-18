import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import type { Fund, FundCategory, NotificationMethod } from '../../core/models';
import { FundService } from '../../core/services/fund.service';
import { SubscriptionService } from '../../core/services/subscription.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { FundCardComponent } from './fund-card.component';
import { SubscribeDialogComponent } from './subscribe-dialog.component';

type CategoryFilter = FundCategory | 'ALL';

const CATEGORY_FILTERS: { value: CategoryFilter; label: string }[] = [
  { value: 'ALL', label: 'Todos' },
  { value: 'FPV', label: 'FPV' },
  { value: 'FIC', label: 'FIC' },
];

@Component({
  selector: 'app-funds-list',
  imports: [LoadingSpinnerComponent, EmptyStateComponent, FundCardComponent, SubscribeDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './funds-list.page.html',
})
export class FundsListPage {
  protected readonly fundService = inject(FundService);
  protected readonly subscriptionService = inject(SubscriptionService);

  protected readonly categoryFilters = CATEGORY_FILTERS;
  protected readonly selectedCategory = signal<CategoryFilter>('ALL');
  protected readonly selectedFund = signal<Fund | null>(null);

  protected readonly filteredFunds = computed(() =>
    this.fundService.fundsByCategory(this.selectedCategory()),
  );

  protected selectCategory(category: CategoryFilter): void {
    this.selectedCategory.set(category);
  }

  protected openSubscribeDialog(fund: Fund): void {
    this.selectedFund.set(fund);
  }

  protected closeSubscribeDialog(): void {
    this.selectedFund.set(null);
  }

  protected confirmSubscription(method: NotificationMethod): void {
    const fund = this.selectedFund();
    if (fund) {
      this.subscriptionService.subscribe(fund, method);
      this.selectedFund.set(null);
    }
  }
}
