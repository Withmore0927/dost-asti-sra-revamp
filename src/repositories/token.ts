import { db } from '../utils';
import { Prisma, TokenType } from '@prisma/client';

import { PrismaTransactionalClient, Token } from '../types';

const createToken = async (token: Token, trx: PrismaTransactionalClient) => {
  try {
    return await trx.token.create({
      data: {
        tokenId: token.tokenId,
        userId: token.userId,
        value: token.value,
        type: token.type,
        createdBy: token.createdBy,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error(String(error));
  }
};

const updateToken = async (
  token:
    | Token
    | {
        value: string;
        updatedBy: string;
      },
  filter: { tokenId: string },
  trx: PrismaTransactionalClient,
) => {
  try {
    return await trx.token.update({
      where: {
        tokenId: filter.tokenId,
      },

      data: {
        value: token.value,
        updatedBy: token.updatedBy,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error(String(error));
  }
};

const deleteRefreshToken = async (
  filter: { userId: string },
  trx: PrismaTransactionalClient,
) => {
  try {
    return await trx.token.deleteMany({
      where: {
        type: TokenType.REFRESH,
        user: {
          userId: filter.userId,
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error(String(error));
  }
};

export default {
  updateToken,
  deleteRefreshToken,
  createToken,
} as const;
