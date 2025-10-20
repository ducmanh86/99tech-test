import { z } from 'zod';

export const updateUserDto = z
  .object({
    body: z.object({
      firstName: z
        .string()
        .trim()
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name must not exceed 50 characters')
        .optional(),
      lastName: z
        .string()
        .trim()
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name must not exceed 50 characters')
        .optional(),
    }),
  })
  .refine((data) => data.body?.firstName !== undefined || data.body?.lastName !== undefined, {
    message: 'At least one field firsName or lastName must be provided for updating',
    path: ['updateData'],
  });
