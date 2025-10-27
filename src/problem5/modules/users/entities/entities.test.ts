import { Base } from '../../base.entity';
import { UserEntity } from './user.entity';

describe('Entities', () => {
  it('Base can be instantiated (class is constructible)', () => {
    const b = new Base();
    expect(b).toBeInstanceOf(Base);
  });

  it('UserEntity extends Base and holds fields', () => {
    const u = new UserEntity();
    u.firstName = 'John';
    u.lastName = 'Doe';
    u.email = 'john@example.com';
    expect(u.firstName).toBe('John');
    expect(u.lastName).toBe('Doe');
    expect(u.email).toBe('john@example.com');
    expect(u).toBeInstanceOf(UserEntity);
  });
});
