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
    .find((b) => b.textContent?.trim().includes(text))!;
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
    fixture.componentRef.setInput('balance', 500000);
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  it('should render the fund name', () => {
    expect(element.textContent).toContain('FPV_BTG_PACTUAL_RECAUDADORA');
  });

  it('should render the minimum amount', () => {
    expect(element.textContent).toContain('75.000');
  });

  it('should display the user balance', () => {
    expect(element.textContent).toContain('500.000');
    expect(element.textContent).toContain('Tu saldo disponible');
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

  it('should emit cancelled on Escape key', () => {
    const spy = vi.fn();
    fixture.componentInstance.cancelled.subscribe(spy);

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    fixture.nativeElement.dispatchEvent(event);

    expect(spy).toHaveBeenCalledOnce();
  });

  it('should show spinner and "Procesando..." when loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const confirmBtn = findButtonByText(element, 'Procesando...');
    expect(confirmBtn).toBeTruthy();
    expect(confirmBtn.disabled).toBe(true);
    expect(confirmBtn.querySelector('[role="status"]')).toBeTruthy();
  });

  it('should disable cancel button when loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const cancelBtn = findButtonByText(element, 'Cancelar');
    expect(cancelBtn.disabled).toBe(true);
  });

  it('should have dialog with proper ARIA attributes', () => {
    const dialog = element.querySelector('[role="dialog"]');
    expect(dialog?.getAttribute('aria-modal')).toBe('true');
    expect(dialog?.getAttribute('aria-labelledby')).toBe('subscribe-dialog-title');
  });
});
