import { param, body, query } from 'express-validator';
import argon from 'argon2';
import _ from 'lodash';
import db from '../utils/db';

const login = [
  body('username')
    .notEmpty({ ignore_whitespace: false })
    .withMessage('Username must be required.')
    .bail()
    .custom(async (value, { req }) => {
      const result = await db.user.findUnique({
        select: {
          userId: true,
        },
        where: { username: value },
      });

      if (_.isEmpty(result)) {
        throw new Error('Username must be exist/valid.');
      }
    })
    .bail(),
  body('password')
    .notEmpty({ ignore_whitespace: false })
    .withMessage('Password must be required.')
    .bail()
    .custom(async (value, { req }) => {
      const result = await db.user.findUnique({
        select: {
          isActive: true,
          status: true,
          password: true,
        },
        where: { username: req.body.username },
      });

      if (_.isEmpty(result)) {
        throw new Error('Password must be exist/valid.');
      }

      const isValidPassword = await argon.verify(result.password, value);

      if (!isValidPassword) {
        throw new Error('Password must be exist/valid.');
      }
    })
    .bail(),
];

const forgotPassword: any[] = [];

const validateForgotPasswordLink: any[] = [];

const changePassword: any[] = [];

export default {
  login,
  forgotPassword,
  validateForgotPasswordLink,
  changePassword,
} as const;
