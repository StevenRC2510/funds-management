import { computed, inject, Injectable } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import type { Transaction } from '../models';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly http = inject(HttpClient);
  private readonly transactionsResource = httpResource<Transaction[]>(() => '/transactions');

  readonly transactions = computed(() => this.transactionsResource.value() ?? []);
  readonly loading = this.transactionsResource.isLoading;

  readonly sortedTransactions = computed(() =>
    [...this.transactions()].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    ),
  );

  createTransaction(tx: Omit<Transaction, 'id'>): Observable<Transaction> {
    return this.http
      .post<Transaction>('/transactions', tx)
      .pipe(
        tap((created) =>
          this.transactionsResource.update((list) => [...(list ?? []), created]),
        ),
      );
  }

  reload(): void {
    this.transactionsResource.reload();
  }
}
