import { ulid } from 'ulid';
import _ from 'lodash';
import argon from 'argon2';
import ejs from 'ejs';

import { jwt, email, db } from '../utils';

import { usersRepository, tokenRepository } from '../repositories';
import { TokenType, UserStatus } from '../constant/enums';

const login = async (data: { username: string; password: string }) => {
  try {
    const { username } = data;

    const user = await usersRepository.viewUserByUsername({ username });

    const isUserInActive = user?.isActive as number;

    if (_.isEmpty(isUserInActive)) {
      return {
        isInactive: true,
      };
    }

    const userId = user?.userId as string;

    const tokenPayload = {
      _id: userId,
    };

    const accessToken = await jwt.generate(
      tokenPayload,
      process.env.JWT_ACCESS_TOKEN_SECRET_KEY as string,
      { expiresIn: '15m' },
    );

    const refreshToken = await jwt.generate(
      tokenPayload,
      process.env.JWT_REFRESH_TOKEN_SECRET_KEY as string,
      { expiresIn: '30d' },
    );

    const isTokenAlreadyExisting = await usersRepository.viewUserRefreshToken({
      userId: userId,
    });

    await db.$transaction(async (trx) => {
      if (_.isEmpty(isTokenAlreadyExisting)) {
        await tokenRepository.createToken(
          {
            tokenId: ulid(),
            userId,
            value: `${refreshToken}`,
            type: TokenType.REFRESH,
            createdBy: userId,
          },
          trx,
        );
      }

      if (!_.isEmpty(isTokenAlreadyExisting)) {
        const { tokens } = isTokenAlreadyExisting;

        const [token] = tokens;

        await tokenRepository.updateToken(
          {
            tokenId: token.tokenId,
            value: `${refreshToken}`,
            updatedBy: userId,
          },
          {
            tokenId: token.tokenId,
          },
          trx,
        );
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
    throw new Error(String(error));
  }
};

const logout = async (filter: { userId: string }) => {
  try {
    await db.$transaction(async (trx) => {
      await tokenRepository.deleteRefreshToken(
        {
          userId: filter.userId,
        },
        trx,
      );
    });

    return await Promise.resolve(true);
  } catch (error) {
    console.log(error);
    throw new Error(String(error));
  }
};

const generateNewRefreshToken = async (data: { refreshToken: string }) => {
  try {
    const decoded = await jwt.verify(
      data.refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET_KEY as string,
    );

    const isTokenExpired =
      decoded.error && decoded.value.message === 'jwt Expired';

    const isTokenInvalid =
      decoded.error && decoded.value.message !== 'jwt Expired';

    if (isTokenExpired) {
      return {
        error: true,
        message: 'Token expired.',
      };
    }

    if (isTokenInvalid) {
      return {
        error: true,
        message: 'Token invalid.',
      };
    }

    const { _id: userId } = decoded.value;

    const jwtPayload = {
      _id: userId,
    };

    const newAccessToken = await jwt.generate(
      jwtPayload,
      process.env.JWT_ACCESS_TOKEN_SECRET_KEY as string,
      {
        expiresIn: '15m',
      },
    );

    const newRefreshToken = await jwt.generate(
      jwtPayload,
      process.env.JWT_REFRESH_TOKEN_SECRET_KEY as string,
      {
        expiresIn: '30d',
      },
    );

    const newToken = {
      value: `${newRefreshToken}`,
      updatedBy: userId,
    };

    const user = await usersRepository.viewUserRefreshToken({ userId });

    const oldRefreshToken = user?.tokens[0];

    await db.$transaction(async (trx) => {
      await tokenRepository.updateToken(
        newToken,
        {
          tokenId: oldRefreshToken?.tokenId as string,
        },
        trx,
      );
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    console.log(error);
    throw new Error(String(error));
  }
};

export default { login, logout, generateNewRefreshToken } as const;
