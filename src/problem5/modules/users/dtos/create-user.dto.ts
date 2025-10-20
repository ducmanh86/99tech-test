import { z } from 'zod';

export const createUserDto = z.object({
  body: z.object({
    firstName: z
      .string()
      .trim()
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name must not exceed 50 characters'),
    lastName: z
      .string()
      .trim()
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name must not exceed 50 characters'),
    email: z
      .email('Invalid email format')
      .trim()
      .min(5, 'Email must be at least 5 characters')
      .max(255, 'Email must not exceed 255 characters'),
  }),
});
