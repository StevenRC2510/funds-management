import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import type { Subscription } from '../../core/models';
import { SubscriptionCardComponent } from './subscription-card.component';

const MOCK_SUBSCRIPTION: Subscription = {
  id: 1,
  fundId: 1,
  fundName: 'FPV_BTG_PACTUAL_RECAUDADORA',
  amount: 75000,
  notificationMethod: 'email',
  subscribedAt: '2026-03-17T12:00:00.000Z',
};

describe('SubscriptionCardComponent', () => {
  let fixture: ComponentFixture<SubscriptionCardComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubscriptionCardComponent);
    fixture.componentRef.setInput('subscription', MOCK_SUBSCRIPTION);
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  it('should render the fund name', () => {
    expect(element.textContent).toContain('FPV_BTG_PACTUAL_RECAUDADORA');
  });

  it('should render the amount formatted', () => {
    expect(element.textContent).toContain('75.000');
  });

  it('should render the notification method', () => {
    expect(element.textContent).toContain('Email');
  });

  it('should render SMS when notification method is sms', () => {
    fixture.componentRef.setInput('subscription', { ...MOCK_SUBSCRIPTION, notificationMethod: 'sms' });
    fixture.detectChanges();
    expect(element.textContent).toContain('SMS');
  });

  it('should render the subscription date', () => {
    expect(element.textContent).toContain('17/03/2026');
  });

  it('should emit cancel event on button click', () => {
    const spy = vi.fn();
    fixture.componentInstance.cancel.subscribe(spy);

    element.querySelector('button')!.click();
    expect(spy).toHaveBeenCalledOnce();
  });

  it('should disable button when disabled input is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(element.querySelector('button')!.disabled).toBe(true);
  });
});
