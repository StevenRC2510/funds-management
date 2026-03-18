import { CopCurrencyPipe } from './cop-currency.pipe';

describe('CopCurrencyPipe', () => {
  const pipe = new CopCurrencyPipe();

  it('should format a number as COP currency', () => {
    const result = pipe.transform(500000);
    expect(result).toContain('500.000');
  });

  it('should format zero', () => {
    const result = pipe.transform(0);
    expect(result).toContain('0');
  });

  it('should return empty string for null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('should return empty string for undefined', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should format large amounts', () => {
    const result = pipe.transform(1000000);
    expect(result).toContain('1.000.000');
  });
});
