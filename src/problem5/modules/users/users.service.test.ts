/**
 * Tests for users.service.ts by mocking the TypeORM Mongo repository
 */
import { ObjectId } from 'mongodb';

// Create a mutable mock repo we can tweak per test
const mockRepo = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  updateOne: jest.fn(),
  delete: jest.fn(),
};

jest.mock('../../configs/database', () => ({
  AppDataSource: {
    getMongoRepository: () => mockRepo,
  },
}));

import { getAllUsers, getUser, updateUser, deleteUser, restoreUser, createUser } from './users.service';
import { NotFoundError } from '../../middlewares/error.middleware';

beforeEach(() => {
  jest.resetAllMocks();
});

describe('users.service.getAllUsers', () => {
  it('applies filters, sorting, and pagination', async () => {
    mockRepo.find.mockResolvedValueOnce([]);

    await getAllUsers({ firstName: 'Ali', lastName: 'S', email: 'mail' }, {
      sortBy: 'email',
      sortOrder: 'desc',
      limit: '5',
      offset: '10',
    } as any);

    expect(mockRepo.find).toHaveBeenCalledTimes(1);
    const arg = mockRepo.find.mock.calls[0][0];

    // Where clause should include regex filters
    expect(arg.where.firstName.$regex).toBeInstanceOf(RegExp);
    expect(arg.where.lastName.$regex).toBeInstanceOf(RegExp);
    expect(arg.where.email.$regex).toBeInstanceOf(RegExp);

    // Pagination and order
    expect(arg.take).toBe(5);
    expect(arg.skip).toBe(10);
    expect(arg.order).toEqual({ email: 'DESC' });
  });
});

describe('users.service CRUD helpers', () => {
  it('createUser delegates to save', async () => {
    const data: any = { firstName: 'A', lastName: 'B', email: 'a@b.com' };
    mockRepo.save.mockResolvedValueOnce({ _id: new ObjectId(), ...data });
    const res = await createUser(data);
    expect(mockRepo.save).toHaveBeenCalled();
    expect(res.email).toBe('a@b.com');
  });

  it('getUser throws NotFoundError if missing', async () => {
    mockRepo.findOne.mockResolvedValueOnce(null);
    await expect(getUser(new ObjectId('6568a4f4f4f4f4f4f4f4f4f4'))).rejects.toBeInstanceOf(NotFoundError);
  });

  it('updateUser updates fields and returns merged user', async () => {
    const id = new ObjectId('6568a4f4f4f4f4f4f4f4f4f4');
    const existing: any = { _id: id, firstName: 'Old', lastName: 'Name' };
    mockRepo.findOne.mockResolvedValueOnce(existing);
    mockRepo.update.mockResolvedValueOnce(undefined);

    const updated = await updateUser(id, { firstName: 'New', lastName: 'Name' });
    expect(mockRepo.update).toHaveBeenCalledWith(id, expect.objectContaining({ firstName: 'New' }));
    expect(updated.firstName).toBe('New');
  });

  it('deleteUser marks as soft-deleted', async () => {
    const id = new ObjectId('6568a4f4f4f4f4f4f4f4f4f4');
    const existing: any = { _id: id };
    mockRepo.findOne.mockResolvedValueOnce(existing);

    await deleteUser(id);

    expect(mockRepo.update).toHaveBeenCalledWith(id, expect.objectContaining({ deletedAt: expect.any(Date) }));
  });

  it('restoreUser unsets deletedAt and returns entity', async () => {
    const id = new ObjectId('6568a4f4f4f4f4f4f4f4f4f4');
    const existing: any = { _id: id, deletedAt: new Date() };
    mockRepo.findOne.mockResolvedValueOnce(existing);
    mockRepo.updateOne.mockResolvedValueOnce(undefined);

    const res = await restoreUser(id);
    expect(mockRepo.updateOne).toHaveBeenCalledWith(
      { _id: id },
      { $unset: { deletedAt: '' }, $set: { lastModifiedAt: expect.any(Date) } },
    );
    expect(res.deletedAt).toBeUndefined();
  });
});
