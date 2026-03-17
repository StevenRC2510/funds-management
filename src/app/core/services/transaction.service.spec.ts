import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { TransactionService } from './transaction.service';

describe('TransactionService', () => {
  let service: TransactionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TransactionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.match(() => true);
  });

  it('should start with empty transactions', () => {
    expect(service.transactions()).toEqual([]);
  });

  it('should start with empty sorted transactions', () => {
    expect(service.sortedTransactions()).toEqual([]);
  });

  it('should create a transaction via POST and update signal', () => {
    const newTx = {
      fundId: 1,
      fundName: 'FPV_BTG_PACTUAL_RECAUDADORA',
      type: 'subscription' as const,
      amount: 75000,
      notificationMethod: 'sms' as const,
      timestamp: '2026-03-17T14:00:00.000Z',
    };

    service.createTransaction(newTx).subscribe((created) => {
      expect(created.id).toBe(3);
    });

    const postReq = httpMock.expectOne('/transactions');
    expect(postReq.request.method).toBe('POST');
    postReq.flush({ ...newTx, id: 3 });

    expect(service.transactions()).toHaveLength(1);
  });
});
