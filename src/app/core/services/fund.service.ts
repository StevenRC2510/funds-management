import { computed, Injectable } from '@angular/core';
import { httpResource } from '@angular/common/http';

import type { Fund, FundCategory } from '../models';

@Injectable({ providedIn: 'root' })
export class FundService {
  private readonly fundsResource = httpResource<Fund[]>(() => '/funds');

  readonly funds = computed(() => this.fundsResource.value() ?? []);
  readonly loading = this.fundsResource.isLoading;
  readonly error = this.fundsResource.error;

  readonly fpvFunds = computed(() => this.funds().filter((f) => f.category === 'FPV'));
  readonly ficFunds = computed(() => this.funds().filter((f) => f.category === 'FIC'));

  fundsByCategory(category: FundCategory | 'ALL'): Fund[] {
    return category === 'ALL' ? this.funds() : this.funds().filter((f) => f.category === category);
  }

  reload(): void {
    this.fundsResource.reload();
  }
}
