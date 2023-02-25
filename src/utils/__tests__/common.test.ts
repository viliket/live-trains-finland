import { isDefined } from '../common';

describe('isDefined', () => {
  it('should be true for values that are not null or undefined', () => {
    expect(isDefined(false)).toBe(true);
    expect(isDefined(0)).toBe(true);
    expect(isDefined('')).toBe(true);
    expect(isDefined(NaN)).toBe(true);
    expect(isDefined('1')).toBe(true);
    expect(isDefined({})).toBe(true);
  });

  it('should be false for null and undefined values', () => {
    expect(isDefined(null)).toBe(false);
    expect(isDefined(undefined)).toBe(false);
  });
});
