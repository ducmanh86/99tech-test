import { UserResponse } from './user.response';
import { ObjectId } from 'mongodb';

describe('UserResponse', () => {
  it('maps fields from entity', () => {
    const entity: any = {
      _id: new ObjectId('6568a4f4f4f4f4f4f4f4f4f4'),
      email: 'a@b.com',
      firstName: 'A',
      lastName: 'B',
      createdAt: new Date('2020-01-01'),
      lastModifiedAt: new Date('2020-01-02'),
    };
    const res = new UserResponse(entity);
    expect(res.id).toBe(entity._id.toString());
    expect(res.email).toBe('a@b.com');
    expect(res.firstName).toBe('A');
    expect(res.lastName).toBe('B');
    expect(res.createdAt).toEqual(entity.createdAt);
    expect(res.lastModifiedAt).toEqual(entity.lastModifiedAt);
  });

  it('maps list', () => {
    const list = [
      { _id: new ObjectId('6568a4f4f4f4f4f4f4f4f4f4'), email: 'x@y.com' } as any,
      { _id: new ObjectId('6568a4f4f4f4f4f4f4f4f4f5'), email: 'y@z.com' } as any,
    ];
    const res = UserResponse.fromUserList(list);
    expect(res).toHaveLength(2);
    expect(res[0].email).toBe('x@y.com');
  });
});
