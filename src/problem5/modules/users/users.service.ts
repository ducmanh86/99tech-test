import { ObjectId } from 'mongodb';

import { UserEntity } from './entities/user.entity';
import { AppDataSource } from '../../configs/database';
import { NotFoundError } from '../../middlewares/error.middleware';

const userRepository = AppDataSource.getMongoRepository(UserEntity);

export const getAllUsers = () => {
  return userRepository.find();
};

export const createUser = (userData: Pick<UserEntity, 'firstName' | 'lastName' | 'email'>) => {
  const user = new UserEntity();
  Object.assign(user, userData);

  return userRepository.save(user);
};

export const getUser = async (userId: ObjectId) => {
  const user = await userRepository.findOne({ where: { _id: userId } });
  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};

export const updateUser = async (userId: ObjectId, userData: Pick<UserEntity, 'firstName' | 'lastName'>) => {
  const user = await userRepository.findOne({ where: { _id: userId } });
  if (!user) {
    throw new NotFoundError('User not found');
  }

  await userRepository.update(userId, {
    ...userData,
    lastModifiedAt: new Date(),
  });

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
  await userRepository.update(userId, {
    deletedAt: new Date(),
    lastModifiedAt: new Date(),
  });
};

// restore a soft deleted item by setting deletedAt to null
export const restoreUser = async (userId: ObjectId) => {
  const user = await userRepository.findOne({
    where: { _id: userId, deletedAt: { $ne: undefined } },
    withDeleted: true,
  });
  if (!user) {
    throw new NotFoundError('User not found or invalid for recovery');
  }

  delete user.deletedAt;
  user.lastModifiedAt = new Date();

  await userRepository.updateOne(
    { _id: userId },
    {
      $unset: { deletedAt: '' },
      $set: { lastModifiedAt: user.lastModifiedAt },
    },
  );

  return user;
};
