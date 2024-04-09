/* eslint-disable @typescript-eslint/default-param-last */
import { request, response, NextFunction } from 'express';

import _ from 'lodash';
import { jwt } from '../utils';

import { usersRepository } from '../repositories';

export default async (req = request, res = response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;

    if (_.isEmpty(token)) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorize',
      });
    }

    const accessToken = token?.replace('Bearer ', '');

    const decoded = await jwt.verify(
      accessToken as unknown as string,
      process.env.JWT_ACCESS_TOKEN_SECRET_KEY as string,
    );

    const isTokenExpired =
      decoded.error && decoded.value.message === 'jwt expired';

    const isTokenInvalidJWT =
      decoded.error && decoded.value.message !== 'jwt expired';

    if (isTokenExpired) {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
      });
    }

    if (isTokenInvalidJWT) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorize.',
      });
    }

    const { _id: userId } = decoded.value;

    const databaseToken = await usersRepository.viewUserRefreshToken({
      userId,
    });

    if (_.isEmpty(databaseToken)) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorize',
      });
    }

    const user = await usersRepository.viewUser({ userId });

    const isInactive = user?.isActive as number;

    if (_.isEmpty(isInactive)) {
      return res.status(403).json({
        success: false,
        message:
          'Your account is disabled. Please Contact Admin for assistance.',
      });
    }

    res.locals.user = {
      userId,
    };

    return next();
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
