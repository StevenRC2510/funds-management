import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import type { Fund } from '../../core/models';
import { FundCardComponent } from './fund-card.component';

const MOCK_FUND: Fund = {
  id: 1,
  name: 'FPV_BTG_PACTUAL_RECAUDADORA',
  minimumAmount: 75000,
  category: 'FPV',
};

describe('FundCardComponent', () => {
  let fixture: ComponentFixture<FundCardComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FundCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FundCardComponent);
    fixture.componentRef.setInput('fund', MOCK_FUND);
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  it('should render the fund name', () => {
    expect(element.textContent).toContain('FPV_BTG_PACTUAL_RECAUDADORA');
  });

  it('should render the category badge', () => {
    expect(element.textContent).toContain('FPV');
  });

  it('should render the minimum amount formatted', () => {
    expect(element.textContent).toContain('75.000');
  });

  it('should show subscribe button when not subscribed', () => {
    const button = element.querySelector('button')!;
    expect(button.textContent).toContain('Suscribirse');
    expect(button.disabled).toBe(false);
  });

  it('should show "Ya suscrito" and disable button when subscribed', () => {
    fixture.componentRef.setInput('subscribed', true);
    fixture.detectChanges();

    const button = element.querySelector('button')!;
    expect(button.textContent).toContain('Ya suscrito');
    expect(button.disabled).toBe(true);
  });

  it('should disable button when disabled input is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    expect(element.querySelector('button')!.disabled).toBe(true);
  });

  it('should emit subscribe event on button click', () => {
    const spy = vi.fn();
    fixture.componentInstance.subscribe.subscribe(spy);

    element.querySelector('button')!.click();
    expect(spy).toHaveBeenCalledOnce();
  });
});
