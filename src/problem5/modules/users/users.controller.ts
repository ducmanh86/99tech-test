import { Router } from 'express';
import { ObjectId } from 'mongodb';

import { createUserDto } from './dtos/create-user.dto';
import { updateUserDto } from './dtos/update-user.dto';
import { validateRequest } from '../../middlewares/validate.middleware';
import { createUser, deleteUser, getAllUsers, getUser, restoreUser, updateUser } from './users.service';
import { UserResponse } from './responses/user.response';
import { ConflictError, NotFoundError, ValidationError } from '../../middlewares/error.middleware';

const router = Router();

// Get all users
router.get('/', async (req, res) => {
  const users = await getAllUsers();
  res.json({
    data: UserResponse.fromUserList(users),
    success: true,
    count: users.length,
  });
});

// Create user
router.post('/', validateRequest(createUserDto), async (req, res) => {
  try {
    const savedUser = await createUser(req.body);
    res.status(201).json({
      success: true,
      data: savedUser,
    });
  } catch (error) {
    // Check for duplicate key error (email must be unique)
    if (error.code === 11000) {
      throw new ConflictError('Email already exists');
    }

    throw error;
  }
});

// Get user info
router.get('/:userId', async (req, res) => {
  try {
    const userId = new ObjectId(req.params.userId);
    const user = await getUser(userId);

    res.status(200).json({
      success: true,
      data: new UserResponse(user),
    });
  } catch (error: any) {
    if (error.name === 'BSONError') {
      throw new ValidationError('Validation failed', [
        {
          path: ['param.userId'],
          message: 'Invalid user ID format, must be a 24 character hex string',
        },
      ]);
    }

    throw error;
  }
});

// Update user
router.patch('/:userId', validateRequest(updateUserDto), async (req, res) => {
  try {
    const userId = new ObjectId(req.params.userId);
    const updatedUser = await updateUser(userId, req.body);
    res.status(200).json({
      success: true,
      data: new UserResponse(updatedUser),
    });
  } catch (error: any) {
    if (error.name === 'BSONError') {
      throw new ValidationError('Validation failed', [
        {
          path: ['param.userId'],
          message: 'Invalid user ID format, must be a 24 character hex string',
        },
      ]);
    }

    throw error;
  }
});

// Delete user
router.delete('/:userId', async (req, res) => {
  try {
    const userId = new ObjectId(req.params.userId);
    await deleteUser(userId);
    res.status(200).json({
      success: true,
    });
  } catch (error: any) {
    if (error.name === 'BSONError') {
      throw new ValidationError('Validation failed', [
        {
          path: ['param.userId'],
          message: 'Invalid user ID format, must be a 24 character hex string',
        },
      ]);
    }

    throw error;
  }
});

// Restore an user
router.patch('/:userId/restore', async (req, res) => {
  try {
    const userId = new ObjectId(req.params.userId);
    const restoreUuser = await restoreUser(userId);

    res.status(200).json({
      success: true,
      data: new UserResponse(restoreUuser),
    });
  } catch (error: any) {
    if (error.name === 'BSONError') {
      throw new ValidationError('Validation failed', [
        {
          path: ['param.userId'],
          message: 'Invalid user ID format, must be a 24 character hex string',
        },
      ]);
    }

    throw error;
  }
});

export default router;
