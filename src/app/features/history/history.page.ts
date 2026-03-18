import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import type { TransactionType } from '../../core/models';
import { TransactionService } from '../../core/services/transaction.service';
import { CopCurrencyPipe } from '../../shared/pipes/cop-currency.pipe';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';

const TRANSACTION_TYPE_LABELS: Record<TransactionType, { label: string; classes: string }> = {
  subscription: { label: 'Apertura', classes: 'bg-green-100 text-green-700' },
  cancellation: { label: 'Cancelación', classes: 'bg-red-100 text-red-700' },
};

@Component({
  selector: 'app-history',
  imports: [DatePipe, CopCurrencyPipe, LoadingSpinnerComponent, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './history.page.html',
})
export class HistoryPage {
  protected readonly transactionService = inject(TransactionService);
  protected readonly typeConfig = TRANSACTION_TYPE_LABELS;
}
