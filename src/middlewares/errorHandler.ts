import { Request, Response, NextFunction } from 'express';

export default (
  _err: any,
  _request: Request,
  response: Response,
  next: NextFunction,
): Response => {
  console.log(_err);

  return response
    .status(500)
    .json({ status: false, message: 'Internal server error.' });
};
