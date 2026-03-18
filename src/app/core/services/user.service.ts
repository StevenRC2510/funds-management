import { computed, inject, Injectable } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import type { User } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly userResource = httpResource<User>(() => '/user');

  readonly user = computed(() => this.userResource.value());
  readonly loading = this.userResource.isLoading;
  readonly balance = computed(() => this.userResource.value()?.balance ?? 0);

  updateBalance(newBalance: number): Observable<User> {
    return this.http
      .patch<User>('/user', { balance: newBalance })
      .pipe(tap((user) => this.userResource.set(user)));
  }

  reload(): void {
    this.userResource.reload();
  }
}
