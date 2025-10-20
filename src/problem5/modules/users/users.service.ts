import { ObjectId } from 'mongodb';

import { User } from './entities/user.entity';
import { AppDataSource } from '../../configs/database';
import { NotFoundError } from '../../middlewares/error.middleware';

const userRepository = AppDataSource.getMongoRepository(User);

export const getAllUsers = () => {
  return userRepository.find();
};

export const createUser = (userData: Pick<User, 'firstName' | 'lastName' | 'email'>) => {
  const user = new User();
  Object.assign(user, userData);

  return userRepository.save(user);
};

export const updateUser = async (userId: ObjectId, userData: Pick<User, 'firstName' | 'lastName'>) => {
  const user = await userRepository.findOne({ where: { _id: userId } });
  if (!user) {
    throw new NotFoundError('User not found');
  }

  await userRepository.update(userId, userData);

  Object.assign(user, userData);
  return user;
};

// soft delete can be implemented by setting value to field deletedAt
export const deleteUser = async (userId: ObjectId) => {
  const user = await userRepository.findOne({ where: { _id: userId } });
  if (!user) {
    throw new NotFoundError('User not found');
  }

  // await userRepository.delete(userId); // hard delete
  await userRepository.update(userId, { deletedAt: new Date() });
};

// restore a soft deleted item by setting deletedAt to null
export const restoreUser = async (userId: ObjectId) => {
  const user = await userRepository.findOne({ where: { _id: userId, deletedAt: { $ne: null } }, withDeleted: true });
  if (!user) {
    throw new NotFoundError('User not valid for recovery');
  }

  // await userRepository.delete(userId); // hard delete
  await userRepository.update(userId, { deletedAt: null });
};
