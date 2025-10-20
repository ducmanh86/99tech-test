import { z } from 'zod';

export const filterUserDto = z.object({
  body: z.object({
    firstName: z.string().trim().max(50, 'First name must not exceed 50 characters').optional(),
    lastName: z.string().trim().max(50, 'Last name must not exceed 50 characters').optional(),
    email: z.email('Invalid email format').trim().max(255, 'Email must not exceed 255 characters').optional(),
  }),
});

export const paginationParamDto = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? Number(val) : undefined))
    .refine((val) => val === undefined || (Number.isInteger(val) && val > 0 && val <= 100), {
      message: 'limit must be an integer between 1 and 100',
    }),
  offset: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? Number(val) : undefined))
    .refine((val) => val === undefined || (Number.isInteger(val) && val >= 0), {
      message: 'offset must be a non-negative integer',
    }),
  sortBy: z.enum(['firstName', 'lastName', 'email']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});
