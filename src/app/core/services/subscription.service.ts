import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { concatMap, finalize, tap } from 'rxjs';

import type { Fund, NotificationMethod, Subscription } from '../models';
import { UserService } from './user.service';
import { TransactionService } from './transaction.service';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private readonly http = inject(HttpClient);
  private readonly userService = inject(UserService);
  private readonly transactionService = inject(TransactionService);
  private readonly notificationService = inject(NotificationService);

  private readonly subscriptionsResource = httpResource<Subscription[]>(
    () => '/subscriptions',
  );

  private readonly _operationLoading = signal(false);

  readonly subscriptions = computed(() => this.subscriptionsResource.value() ?? []);
  readonly loading = computed(
    () => this.subscriptionsResource.isLoading() || this._operationLoading(),
  );
  readonly error = this.subscriptionsResource.error;

  readonly subscribedFundIds = computed(
    () => new Set(this.subscriptions().map((s) => s.fundId)),
  );

  isSubscribed(fundId: number): boolean {
    return this.subscribedFundIds().has(fundId);
  }

  canSubscribe(fund: Fund): boolean {
    return !this.isSubscribed(fund.id) && this.userService.balance() >= fund.minimumAmount;
  }

  subscribe(fund: Fund, notificationMethod: NotificationMethod): void {
    if (this._operationLoading()) return;

    if (this.isSubscribed(fund.id)) {
      this.notificationService.showError(`Ya se encuentra vinculado al fondo ${fund.name}.`);
      return;
    }

    const balance = this.userService.balance();
    if (balance < fund.minimumAmount) {
      this.notificationService.showError(
        `No tiene saldo suficiente para vincularse al fondo ${fund.name}.`,
      );
      return;
    }

    this._operationLoading.set(true);
    const now = new Date().toISOString();

    this.http
      .post<Subscription>('/subscriptions', {
        fundId: fund.id,
        fundName: fund.name,
        amount: fund.minimumAmount,
        notificationMethod,
        subscribedAt: now,
      })
      .pipe(
        tap((created) =>
          this.subscriptionsResource.update((list) => [...(list ?? []), created]),
        ),
        concatMap(() => this.userService.updateBalance(balance - fund.minimumAmount)),
        concatMap(() =>
          this.transactionService.createTransaction({
            fundId: fund.id,
            fundName: fund.name,
            type: 'subscription',
            amount: fund.minimumAmount,
            notificationMethod,
            timestamp: now,
          }),
        ),
        finalize(() => this._operationLoading.set(false)),
      )
      .subscribe({
        next: () => {
          const method = notificationMethod === 'email' ? 'email' : 'SMS';
          this.notificationService.showSuccess(
            `Suscripción exitosa al fondo ${fund.name}. Se le notificará por ${method}.`,
          );
        },
        error: () =>
          this.notificationService.showError(
            'Error al procesar la suscripción. Intente de nuevo.',
          ),
      });
  }

  cancel(subscription: Subscription): void {
    if (this._operationLoading()) return;

    const balance = this.userService.balance();
    this._operationLoading.set(true);

    this.http
      .delete(`/subscriptions/${subscription.id}`)
      .pipe(
        tap(() =>
          this.subscriptionsResource.update((list) =>
            (list ?? []).filter((s) => s.id !== subscription.id),
          ),
        ),
        concatMap(() => this.userService.updateBalance(balance + subscription.amount)),
        concatMap(() =>
          this.transactionService.createTransaction({
            fundId: subscription.fundId,
            fundName: subscription.fundName,
            type: 'cancellation',
            amount: subscription.amount,
            notificationMethod: null,
            timestamp: new Date().toISOString(),
          }),
        ),
        finalize(() => this._operationLoading.set(false)),
      )
      .subscribe({
        next: () =>
          this.notificationService.showSuccess(
            `Cancelación exitosa del fondo ${subscription.fundName}.`,
          ),
        error: () =>
          this.notificationService.showError(
            'Error al cancelar la suscripción. Intente de nuevo.',
          ),
      });
  }

  reload(): void {
    this.subscriptionsResource.reload();
  }
}
