import { isDev } from './utils';

describe('isDev', () => {
  const original = process.env.NODE_ENV;
  afterEach(() => {
    process.env.NODE_ENV = original;
  });
  it('returns true when NODE_ENV is development', () => {
    process.env.NODE_ENV = 'development';
    expect(isDev()).toBe(true);
  });
  it('is case-insensitive', () => {
    process.env.NODE_ENV = 'DeVeLoPmEnT';
    expect(isDev()).toBe(true);
  });
  it('returns false when NODE_ENV is production', () => {
    process.env.NODE_ENV = 'production';
    expect(isDev()).toBe(false);
  });
  it('defaults to development when undefined', () => {
    delete (process.env as any).NODE_ENV;
    expect(isDev()).toBe(true);
  });
});
