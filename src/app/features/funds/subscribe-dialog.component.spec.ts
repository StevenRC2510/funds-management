import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import type { Fund } from '../../core/models';
import { SubscribeDialogComponent } from './subscribe-dialog.component';

const MOCK_FUND: Fund = {
  id: 1,
  name: 'FPV_BTG_PACTUAL_RECAUDADORA',
  minimumAmount: 75000,
  category: 'FPV',
};

function findButtonByText(element: HTMLElement, text: string): HTMLButtonElement {
  return Array.from(element.querySelectorAll('button'))
    .find((b) => b.textContent?.trim() === text)!;
}

describe('SubscribeDialogComponent', () => {
  let fixture: ComponentFixture<SubscribeDialogComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscribeDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubscribeDialogComponent);
    fixture.componentRef.setInput('fund', MOCK_FUND);
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  it('should render the fund name', () => {
    expect(element.textContent).toContain('FPV_BTG_PACTUAL_RECAUDADORA');
  });

  it('should render the minimum amount', () => {
    expect(element.textContent).toContain('75.000');
  });

  it('should have email selected by default', () => {
    expect(fixture.componentInstance['selectedMethod']()).toBe('email');
  });

  it('should emit confirmed with selected method on confirm', () => {
    const spy = vi.fn();
    fixture.componentInstance.confirmed.subscribe(spy);

    findButtonByText(element, 'SMS').click();
    fixture.detectChanges();

    findButtonByText(element, 'Confirmar').click();

    expect(spy).toHaveBeenCalledWith('sms');
  });

  it('should emit cancelled on cancel button click', () => {
    const spy = vi.fn();
    fixture.componentInstance.cancelled.subscribe(spy);

    findButtonByText(element, 'Cancelar').click();

    expect(spy).toHaveBeenCalledOnce();
  });

  it('should emit cancelled on backdrop click', () => {
    const spy = vi.fn();
    fixture.componentInstance.cancelled.subscribe(spy);

    (element.firstElementChild as HTMLElement).click();

    expect(spy).toHaveBeenCalledOnce();
  });
});
