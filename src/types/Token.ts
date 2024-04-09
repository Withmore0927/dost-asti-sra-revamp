import { TokenType } from '../constant/enums';

export type Token = {
  tokenId: string;
  userId: string;
  type: TokenType;
  value: string;
  createdAt?: Date | string;
  createdBy: string;
  updatedAt?: Date | string | null;
  updatedBy?: string | null;
};
