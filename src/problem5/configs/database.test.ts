import { AppDataSource } from './database';

describe('AppDataSource config', () => {
  it('has expected options', () => {
    // does not initialize DB, just inspects configuration
    const options: any = (AppDataSource as any).options;
    expect(options.type).toBe('mongodb');
    expect(options.database).toBe('99tech_test');
    expect(options.entities).toBeDefined();
    expect(options.synchronize).toBe(true);
  });
});
