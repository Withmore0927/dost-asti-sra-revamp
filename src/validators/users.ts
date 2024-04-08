import { body, query, param } from 'express-validator';

const createUser = [body()];

export default {
  createUser,
} as const;
