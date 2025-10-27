import { z } from 'zod';
import { validateRequest } from './validate.middleware';
import { ValidationError } from './error.middleware';

describe('validate.middleware', () => {
  const makeRes = () => ({}) as any;

  it('calls next() on valid request', async () => {
    const dto = z.object({
      body: z.object({ name: z.string() }),
      query: z.object({}).optional(),
      params: z.object({}).optional(),
    });
    const req: any = { body: { name: 'Alice' }, query: {}, params: {} };
    const next = jest.fn();

    await validateRequest(dto)(req, makeRes(), next);

    expect(next).toHaveBeenCalledWith();
  });

  it('passes ValidationError to next() on invalid request', async () => {
    const dto = z.object({
      body: z.object({ name: z.string().min(3) }),
      query: z.object({}).optional(),
      params: z.object({}).optional(),
    });
    const req: any = { body: { name: 'Al' }, query: {}, params: {} };
    const next = jest.fn();

    await validateRequest(dto)(req, makeRes(), next);

    expect(next).toHaveBeenCalled();
    const arg = (next as jest.Mock).mock.calls[0][0];
    expect(arg).toBeInstanceOf(ValidationError);
    expect(arg.detail[0]).toEqual(expect.objectContaining({ path: 'body.name' }));
  });
});
