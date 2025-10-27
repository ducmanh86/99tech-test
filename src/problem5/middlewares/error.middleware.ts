import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

import { isDev } from '../configs/utils';

export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public detail?: any,
  ) {
    super(message);
    this.name = 'HttpError';
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Resource not found') {
    super(404, message);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = 'Bad request') {
    super(400, message);
    this.name = 'BadRequestError';
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

export class ConflictError extends HttpError {
  constructor(message = 'Conflict') {
    super(409, message);
    this.name = 'ConflictError';
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

export class ValidationError extends HttpError {
  constructor(message = 'Validation', detail: any) {
    super(422, message, detail);
    this.name = 'ValidationError';
    this.detail = detail;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized') {
    super(401, message);
    this.name = 'UnauthorizedError';
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  detail?: any;
  error?: string;
  stack?: string;
}

const errorMiddleware: ErrorRequestHandler = (
  err: HttpError,
  req: Request,
  res: Response<ErrorResponse>,
  _next: NextFunction,
) => {
  const statusCode = 'statusCode' in err ? err.statusCode : 500;
  const errorResponse: ErrorResponse = {
    success: false,
    message: err.message || 'Internal server error',
    detail: err.detail,
  };

  // Add stack trace in development environment
  if (isDev()) {
    errorResponse.error = err.name;
    errorResponse.stack = err.stack;
  }

  // Log error details
  req.log.error(`${err.name}: ${err.message}`);
  if (isDev()) req.log.error(err.stack);

  res.status(statusCode).json(errorResponse);
};

export default errorMiddleware;
