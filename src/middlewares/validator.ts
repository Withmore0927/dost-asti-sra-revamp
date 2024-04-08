import { Request, Response, NextFunction } from 'express';
import { validationResult, matchedData } from 'express-validator';

export default (request: Request, response: Response, next: NextFunction) => {
  const errors = validationResult(request);
  if (errors.isEmpty()) {
    request.body = matchedData(request, {
      locations: ['body'],
    });

    return next();
  }

  return response.status(422).json({ status: false, data: errors });
};
