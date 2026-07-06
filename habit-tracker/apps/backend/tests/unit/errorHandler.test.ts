import { Request, Response } from 'express';
import errorHandler from '../../src/middleware/errorHandler';

describe('errorHandler middleware', () => {
  it('should respond with 500 and generic error message', () => {
    const err = new Error('Database exploded');
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Something went wrong. Please try again later.',
      },
    });
    expect(next).not.toHaveBeenCalled();
  });
});
