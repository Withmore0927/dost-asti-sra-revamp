import { TokenType } from '../constant/enums';
import { db } from '../utils';

const viewUser = async (filter: { userId: string }) => {
  try {
    return await db.user.findUnique({
      select: {
        isActive: true,
        status: true,
        userId: true,
      },
      where: {
        userId: filter.userId,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error(String(error));
  }
};

const viewUserByUsername = async (filter: { username: string }) => {
  try {
    return await db.user.findFirst({
      select: {
        isActive: true,
        status: true,
        userId: true,
      },
      where: {
        username: filter.username,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error(String(error));
  }
};

const viewUserRefreshToken = async (filter: { userId: string }) => {
  try {
    return await db.user.findFirst({
      where: {
        userId: filter.userId,
        tokens: {
          some: {
            type: TokenType.REFRESH,
          },
        },
      },
      include: {
        tokens: true,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error(String(error));
  }
};

export default {
  viewUserByUsername,
  viewUserRefreshToken,
  viewUser,
} as const;
