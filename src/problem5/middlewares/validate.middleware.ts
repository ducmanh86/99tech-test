import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';
import { BadRequestError } from './error.middleware';

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
      return res.status(422).json({
        success: false,
        error: 'Validation failed',
        details: error.issues.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      });
    }

    next(new BadRequestError('Invalid request'));
  }
};
