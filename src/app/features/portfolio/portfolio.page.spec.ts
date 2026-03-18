import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import type { Subscription } from '../../core/models';
import { PortfolioPage } from './portfolio.page';

const MOCK_SUBSCRIPTION: Subscription = {
  id: 1,
  fundId: 1,
  fundName: 'FPV_BTG_PACTUAL_RECAUDADORA',
  amount: 75000,
  notificationMethod: 'email',
  subscribedAt: '2026-03-17T12:00:00.000Z',
};

describe('PortfolioPage', () => {
  let component: PortfolioPage;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioPage],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(PortfolioPage);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpMock.match(() => true);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set subscriptionToCancel when opening cancel dialog', () => {
    expect(component['subscriptionToCancel']()).toBeNull();

    component['openCancelDialog'](MOCK_SUBSCRIPTION);
    expect(component['subscriptionToCancel']()).toEqual(MOCK_SUBSCRIPTION);
  });

  it('should clear subscriptionToCancel when closing cancel dialog', () => {
    component['openCancelDialog'](MOCK_SUBSCRIPTION);
    component['closeCancelDialog']();
    expect(component['subscriptionToCancel']()).toBeNull();
  });

  it('should clear subscriptionToCancel after confirming cancel', () => {
    component['openCancelDialog'](MOCK_SUBSCRIPTION);
    component['confirmCancel']();
    expect(component['subscriptionToCancel']()).toBeNull();
  });
});
