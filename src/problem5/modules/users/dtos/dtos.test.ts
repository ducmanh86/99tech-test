import { createUserDto } from './create-user.dto';
import { updateUserDto } from './update-user.dto';
import { filterUserDto, paginationParamDto } from './filter-user.dto';

describe('DTO validations', () => {
  describe('createUserDto', () => {
    it('accepts valid body', async () => {
      await expect(
        createUserDto.parseAsync({ body: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' } }),
      ).resolves.toBeTruthy();
    });
    it('rejects invalid email', async () => {
      await expect(
        createUserDto.parseAsync({ body: { firstName: 'John', lastName: 'Doe', email: 'bad' } }),
      ).rejects.toBeTruthy();
    });
  });

  describe('updateUserDto', () => {
    it('accepts when at least one field provided', async () => {
      await expect(updateUserDto.parseAsync({ body: { firstName: 'Jane' } } as any)).resolves.toBeTruthy();
    });
    it('rejects when no fields provided', async () => {
      await expect(updateUserDto.parseAsync({ body: {} } as any)).rejects.toBeTruthy();
    });
  });

  describe('filterUserDto', () => {
    it('allows optional filters', async () => {
      await expect(filterUserDto.parseAsync({ body: { firstName: 'Al', email: 'abc' } as any })).rejects.toBeTruthy();
      await expect(filterUserDto.parseAsync({ body: { firstName: 'Ali' } as any })).resolves.toBeTruthy();
    });
  });

  describe('paginationParamDto', () => {
    it('transforms and validates query', async () => {
      const result = await paginationParamDto.parseAsync({
        query: { limit: '5', offset: '0', sortBy: 'email', sortOrder: 'asc' },
      });
      expect(result.query.limit).toBe(5);
      expect(result.query.offset).toBe(0);
    });
    it('rejects invalid limit', async () => {
      await expect(paginationParamDto.parseAsync({ query: { limit: '0' } as any })).rejects.toBeTruthy();
    });
  });
});
