import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { TransactionService } from '../../core/services/transaction.service';
import { HistoryPage } from './history.page';

describe('HistoryPage', () => {
  let component: HistoryPage;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(HistoryPage);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpMock.match(() => true);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should inject TransactionService', () => {
    const transactionService = TestBed.inject(TransactionService);
    expect(transactionService).toBeTruthy();
  });

  it('should have type config for subscription and cancellation', () => {
    expect(component['typeConfig']['subscription']).toEqual({
      label: 'Apertura',
      classes: 'bg-green-100 text-green-700',
    });
    expect(component['typeConfig']['cancellation']).toEqual({
      label: 'Cancelación',
      classes: 'bg-red-100 text-red-700',
    });
  });

  it('should start with empty transactions', () => {
    const transactionService = TestBed.inject(TransactionService);
    expect(transactionService.sortedTransactions()).toEqual([]);
  });
});
