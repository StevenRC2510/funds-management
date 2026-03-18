import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import type { Fund } from '../../core/models';
import { FundService } from '../../core/services/fund.service';
import { SubscriptionService } from '../../core/services/subscription.service';
import { FundsListPage } from './funds-list.page';

const MOCK_FUNDS: Fund[] = [
  { id: 1, name: 'FPV_BTG_PACTUAL_RECAUDADORA', minimumAmount: 75000, category: 'FPV' },
  { id: 2, name: 'FPV_BTG_PACTUAL_ECOPETROL', minimumAmount: 125000, category: 'FPV' },
  { id: 3, name: 'DEUDAPRIVADA', minimumAmount: 50000, category: 'FIC' },
];

describe('FundsListPage', () => {
  let component: FundsListPage;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FundsListPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(FundsListPage);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpMock.match(() => true);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should default to ALL category filter', () => {
    expect(component['selectedCategory']()).toBe('ALL');
  });

  it('should change category filter', () => {
    component['selectCategory']('FIC');
    expect(component['selectedCategory']()).toBe('FIC');
  });

  it('should filter funds by category using fundService.fundsByCategory', () => {
    const fundService = TestBed.inject(FundService);

    expect(component['selectedCategory']()).toBe('ALL');
    expect(fundService.fundsByCategory('ALL')).toEqual(fundService.funds());

    component['selectCategory']('FIC');
    expect(component['selectedCategory']()).toBe('FIC');
    expect(component['filteredFunds']()).toEqual(fundService.fundsByCategory('FIC'));
  });

  it('should set selectedFund when opening subscribe dialog', () => {
    expect(component['selectedFund']()).toBeNull();

    component['openSubscribeDialog'](MOCK_FUNDS[0]);
    expect(component['selectedFund']()).toEqual(MOCK_FUNDS[0]);
  });

  it('should clear selectedFund when closing subscribe dialog', () => {
    component['openSubscribeDialog'](MOCK_FUNDS[0]);
    component['closeSubscribeDialog']();
    expect(component['selectedFund']()).toBeNull();
  });

  it('should clear selectedFund after confirming subscription', () => {
    component['openSubscribeDialog'](MOCK_FUNDS[0]);
    component['confirmSubscription']('email');
    expect(component['selectedFund']()).toBeNull();
  });
});
