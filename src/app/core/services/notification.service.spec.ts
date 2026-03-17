import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    vi.useFakeTimers();
    service = new NotificationService();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should start with no toasts', () => {
    expect(service.toasts()).toEqual([]);
  });

  it('should add a success toast', () => {
    service.showSuccess('Operación exitosa');

    const toasts = service.toasts();
    expect(toasts).toHaveLength(1);
    expect(toasts[0].type).toBe('success');
    expect(toasts[0].message).toBe('Operación exitosa');
  });

  it('should add an error toast', () => {
    service.showError('Algo salió mal');

    const toasts = service.toasts();
    expect(toasts).toHaveLength(1);
    expect(toasts[0].type).toBe('error');
    expect(toasts[0].message).toBe('Algo salió mal');
  });

  it('should assign unique ids to each toast', () => {
    service.showSuccess('Primero');
    service.showError('Segundo');

    const toasts = service.toasts();
    expect(toasts).toHaveLength(2);
    expect(toasts[0].id).not.toBe(toasts[1].id);
  });

  it('should dismiss a toast by id', () => {
    service.showSuccess('Toast 1');
    service.showError('Toast 2');

    const firstId = service.toasts()[0].id;
    service.dismiss(firstId);

    const remaining = service.toasts();
    expect(remaining).toHaveLength(1);
    expect(remaining[0].message).toBe('Toast 2');
  });

  it('should auto-dismiss after 5 seconds', () => {
    service.showSuccess('Auto dismiss');
    expect(service.toasts()).toHaveLength(1);

    vi.advanceTimersByTime(5000);
    expect(service.toasts()).toHaveLength(0);
  });

  it('should handle multiple toasts with independent auto-dismiss', () => {
    service.showSuccess('First');
    vi.advanceTimersByTime(3000);
    service.showError('Second');

    expect(service.toasts()).toHaveLength(2);

    vi.advanceTimersByTime(2000);
    expect(service.toasts()).toHaveLength(1);
    expect(service.toasts()[0].message).toBe('Second');

    vi.advanceTimersByTime(3000);
    expect(service.toasts()).toHaveLength(0);
  });
});
