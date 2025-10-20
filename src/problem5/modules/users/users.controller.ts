import { Router } from 'express';
import { ObjectId } from 'mongodb';

import { createUserDto } from './dtos/create-user.dto';
import { updateUserDto } from './dtos/update-user.dto';
import { validateRequest } from '../../middlewares/validate.middleware';
import { createUser, deleteUser, getAllUsers, restoreUser, updateUser } from './users.service';

const router = Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json({
      data: users,
      success: true,
      count: users.length,
    });
  } catch (error) {
    req.log.error(error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
    });
  }
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
      return res.status(409).json({
        success: false,
        error: 'Email already exists',
      });
    }

    req.log.error(error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user',
      message: error.message,
    });
  }
});

// Update user
router.patch('/:userId', validateRequest(updateUserDto), async (req, res) => {
  try {
    const userId = new ObjectId(req.params.userId);
    const updatedUser = await updateUser(userId, req.body);
    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error: any) {
    if (error.name === 'BSONError') {
      return res.status(422).json({
        success: false,
        error: 'Validation failed',
        details: [
          {
            path: ['param.userId'],
            message: 'Invalid user ID format, must be a 24 character hex string',
          },
        ],
      });
    }

    req.log.error(error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user',
      message: error.message,
    });
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
      return res.status(422).json({
        success: false,
        error: 'Validation failed',
        details: [
          {
            path: ['param.userId'],
            message: 'Invalid user ID format, must be a 24 character hex string',
          },
        ],
      });
    }

    req.log.error(error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user',
      message: error.message,
    });
  }
});

// Restore an user
router.patch('/:userId/restore', async (req, res) => {
  try {
    const userId = new ObjectId(req.params.userId);
    await restoreUser(userId);
    res.status(200).json({
      success: true,
    });
  } catch (error: any) {
    if (error.name === 'BSONError') {
      return res.status(422).json({
        success: false,
        error: 'Validation failed',
        details: [
          {
            path: ['param.userId'],
            message: 'Invalid user ID format, must be a 24 character hex string',
          },
        ],
      });
    }

    req.log.error(error);
    res.status(500).json({
      success: false,
      error: 'Failed to restore user',
      message: error.message,
    });
  }
});

export default router;
