import errorMiddleware, { BadRequestError, NotFoundError, ValidationError } from './error.middleware';

describe('error.middleware', () => {
  const makeRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };
  const makeReq = () => ({ log: { error: jest.fn() } }) as any;

  it('responds with status and message for HttpError (prod)', () => {
    const err = new NotFoundError('nope');
    const req = makeReq();
    const res = makeRes();
    const next = jest.fn();
    const original = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    errorMiddleware(err as any, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false, message: 'nope' }));
    process.env.NODE_ENV = original;
  });

  it('includes stack in development', () => {
    const err = new BadRequestError('bad');
    const req = makeReq();
    const res = makeRes();
    const next = jest.fn();
    const original = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    errorMiddleware(err as any, req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'BadRequestError', stack: expect.any(String) }),
    );
    process.env.NODE_ENV = original;
  });

  it('passes validation details', () => {
    const detail = [{ path: 'body.email', message: 'Invalid' }];
    const err = new ValidationError('Validation failed', detail);
    const req = makeReq();
    const res = makeRes();

    errorMiddleware(err as any, req, res, jest.fn());
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ detail }));
  });
});
