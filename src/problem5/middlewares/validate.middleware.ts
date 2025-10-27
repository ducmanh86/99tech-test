import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';
import { BadRequestError, ValidationError } from './error.middleware';

export const validateRequest = (dto: ZodObject) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await dto.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      next(
        new ValidationError(
          'Validation failed',
          error.issues.map((e) => ({
            path: e.path.join('.'),
            message: e.message,
          })),
        ),
      );
    } else {
      next(new BadRequestError('Invalid request'));
    }
  }
};
