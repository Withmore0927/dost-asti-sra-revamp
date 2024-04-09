import { Request, Response, NextFunction } from 'express';

export default (
  err: any,
  request: Request,
  response: Response,
  next: NextFunction,
): Response => {
  console.log(err);

  return response
    .status(500)
    .json({ status: false, message: 'Internal server error.' });
};
