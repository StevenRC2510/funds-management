import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { SubscriptionService } from './subscription.service';
import { UserService } from './user.service';
import { NotificationService } from './notification.service';
import type { Fund, Subscription, User } from '../models';

const MOCK_FUND: Fund = {
  id: 1,
  name: 'FPV_BTG_PACTUAL_RECAUDADORA',
  minimumAmount: 75000,
  category: 'FPV',
};

const MOCK_USER: User = { id: 1, name: 'Cliente BTG', balance: 500000 };

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let userService: UserService;
  let notificationService: NotificationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SubscriptionService);
    userService = TestBed.inject(UserService);
    notificationService = TestBed.inject(NotificationService);
    httpMock = TestBed.inject(HttpTestingController);

    // Flush all httpResource GET requests
    TestBed.flushEffects();
    httpMock.match((req) => req.method === 'GET').forEach((testReq) => {
      const url = testReq.request.url;
      if (url === '/user') testReq.flush(MOCK_USER);
      else if (url === '/subscriptions') testReq.flush([]);
      else if (url === '/transactions') testReq.flush([]);
      else if (url === '/funds') testReq.flush([]);
      else testReq.flush(null);
    });
  });

  afterEach(() => {
    httpMock.match(() => true);
  });

  it('should start with empty subscriptions', () => {
    expect(service.subscriptions()).toEqual([]);
  });

  it('should prevent subscription with insufficient balance', () => {
    const expensiveFund: Fund = {
      id: 4,
      name: 'FDO-ACCIONES',
      minimumAmount: 600000,
      category: 'FIC',
    };

    service.subscribe(expensiveFund, 'sms');

    const toasts = notificationService.toasts();
    expect(toasts).toHaveLength(1);
    expect(toasts[0].type).toBe('error');
    expect(toasts[0].message).toContain('No tiene saldo suficiente');
  });

  it('should execute full subscribe flow', () => {
    service.subscribe(MOCK_FUND, 'email');

    const postSub = httpMock.expectOne(
      (req) => req.url === '/subscriptions' && req.method === 'POST',
    );
    expect(postSub.request.body.fundId).toBe(1);
    postSub.flush({ ...postSub.request.body, id: 1 });

    const patchUser = httpMock.expectOne(
      (req) => req.url === '/user' && req.method === 'PATCH',
    );
    expect(patchUser.request.body.balance).toBe(425000);
    patchUser.flush({ ...MOCK_USER, balance: 425000 });

    const postTx = httpMock.expectOne(
      (req) => req.url === '/transactions' && req.method === 'POST',
    );
    expect(postTx.request.body.type).toBe('subscription');
    postTx.flush({ ...postTx.request.body, id: 1 });

    expect(service.subscriptions()).toHaveLength(1);
    expect(userService.balance()).toBe(425000);
    expect(notificationService.toasts().some((t) => t.type === 'success')).toBe(true);
  });

  it('should execute full cancel flow', () => {
    const activeSub: Subscription = {
      id: 1,
      fundId: 1,
      fundName: 'FPV_BTG_PACTUAL_RECAUDADORA',
      amount: 75000,
      notificationMethod: 'email',
      subscribedAt: '2026-03-17T10:00:00.000Z',
    };

    service.cancel(activeSub);

    const deleteReq = httpMock.expectOne(
      (req) => req.url === '/subscriptions/1' && req.method === 'DELETE',
    );
    deleteReq.flush(null);

    const patchUser = httpMock.expectOne(
      (req) => req.url === '/user' && req.method === 'PATCH',
    );
    expect(patchUser.request.body.balance).toBe(575000);
    patchUser.flush({ ...MOCK_USER, balance: 575000 });

    const postTx = httpMock.expectOne(
      (req) => req.url === '/transactions' && req.method === 'POST',
    );
    expect(postTx.request.body.type).toBe('cancellation');
    expect(postTx.request.body.notificationMethod).toBeNull();
    postTx.flush({ ...postTx.request.body, id: 2 });

    expect(userService.balance()).toBe(575000);
    expect(notificationService.toasts().some((t) => t.type === 'success')).toBe(true);
  });

  it('should correctly evaluate canSubscribe', () => {
    expect(service.canSubscribe(MOCK_FUND)).toBe(true);

    const expensiveFund: Fund = {
      id: 4,
      name: 'FDO-ACCIONES',
      minimumAmount: 600000,
      category: 'FIC',
    };
    expect(service.canSubscribe(expensiveFund)).toBe(false);
  });
});
