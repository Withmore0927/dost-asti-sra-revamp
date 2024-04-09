import { param, body, query } from 'express-validator';
import argon from 'argon2';
import _ from 'lodash';

import db from '../utils/db';

import { Suffix, Gender } from '../constant/enums';

const signup = [
  body('firstName')
    .notEmpty({ ignore_whitespace: false })
    .isString()
    .withMessage('First Name must be required')
    .bail()
    .isLength({ max: 50 })
    .withMessage('First Name must not exceed 50 characters length.')
    .bail()
    .trim()
    .escape(),

  body('middleName')
    .optional()
    .isString()
    .withMessage('Middle Name must be a string.')
    .bail()
    .isLength({ max: 50 })
    .withMessage('Middle Name must not exceed 50 characters length.')
    .trim()
    .escape(),

  body('lastName')
    .notEmpty({ ignore_whitespace: false })
    .withMessage('Last Name must be required.')
    .bail()
    .isString()
    .withMessage('Last Name must be a string.')
    .bail()
    .isLength({ max: 50 })
    .withMessage('Last Name must not exceed 50 characters length.')
    .trim()
    .escape(),

  body('suffix')
    .notEmpty({ ignore_whitespace: false })
    .withMessage('Suffix must be required.')
    .bail()
    .isIn([...Object.values(Suffix)])
    .withMessage(`Suffix must be in either: ${Object.values(Suffix)}.`)
    .bail(),

  body('gender')
    .notEmpty({ ignore_whitespace: false })
    .withMessage('Gender must be required.')
    .bail()
    .isIn([...Object.values(Gender)])
    .withMessage(`Gender must be in either: ${Object.values(Gender)}`)
    .bail(),

  body('email')
    .notEmpty({ ignore_whitespace: false })
    .withMessage('Email address must be required.')
    .bail()
    .isEmail()
    .withMessage('Email must be a valid email format.')
    .bail()
    .isLength({ max: 254 })
    .withMessage('Email must not exceed 254 characters length.')
    .bail()
    .custom(async (value, { req }) => {
      const result = await db.person.findFirst({
        include: {
          personContactDetails: {
            select: {
              value: true,
            },
            where: {
              value: value,
              contactDetails: {
                name: 'email',
              },
            },
          },
        },
      });

      if (_.isEmpty(result)) {
        throw new Error('Email already taken.');
      }
    })
    .bail()
    .normalizeEmail(),

  body('mobileNo')
    .notEmpty({ ignore_whitespace: false })
    .withMessage('Mobile No. must be required.')
    .bail()
    .isMobilePhone('any', { strictMode: true })
    .withMessage('Mobile Number must be supplied with country code')
    .bail(),

  body('organization')
    .notEmpty({ ignore_whitespace: false })
    .withMessage('Organization must be required.')
    .bail()
    .isObject()
    .withMessage('Organization must be valid data type.')
    .bail(),

  body('organization.organizationId')
    .notEmpty({ ignore_whitespace: false })
    .withMessage('Organization Id must be required.')
    .bail()
    .custom(async (value, { req }) => {
      const ulidChecker = /^[0-9A-Z]{26}$/;

      if (!ulidChecker.test(value)) {
        throw new Error('Organization Id must be valid ulid format.');
      }
    })
    .custom(async (value, { req }) => {
      const result = await db.organization.findUnique({
        select: { organizationId: true },
        where: {
          organizationId: value,
        },
      });

      if (!_.isEmpty(result)) {
        throw new Error('Organization Id must be existing.');
      }
    }),

  body('role')
    .notEmpty({ ignore_whitespace: false })
    .bail()
    .isObject()
    .withMessage('Role must be valid data type.')
    .bail(),

  body('role.roleId')
    .notEmpty({ ignore_whitespace: false })
    .withMessage('Role Id must be required.')
    .custom(async (value, { req }) => {
      const ulidChecker = /^[0-9A-Z]{26}$/;

      if (!ulidChecker.test(value)) {
        throw new Error('Role Id must be valid ulid format.');
      }
    })
    .bail()
    .custom(async (value, { req }) => {
      const result = await db.role.findFirst({
        select: { roleId: true },
        where: {
          AND: [
            {
              roleId: value,
            },
            {
              name: { not: 'admin' },
            },
          ],
        },
      });

      if (_.isEmpty(result)) {
        throw new Error('Role Id must be existing.');
      }
    })
    .bail(),

  body('agency')
    .notEmpty({ ignore_whitespace: false })
    .withMessage('Agency must be required.')
    .trim()
    .isString()
    .withMessage('Agency must be a string.')
    .bail()
    .isLength({ max: 50 })
    .withMessage('Agency must not exceed 50 characters length.')
    .bail()
    .escape(),

  body('username')
    .notEmpty({ ignore_whitespace: false })
    .withMessage('Username must be required.')
    .bail()
    .trim()
    .custom(async (value, { req }) => {
      const result = await db.user.findUnique({
        select: { userId: true },
        where: {
          username: value,
        },
      });

      if (!_.isEmpty(result)) {
        throw new Error('Username already taken.');
      }
    })

    .bail()
    .trim()
    .escape(),

  body('password')
    .notEmpty({ ignore_whitespace: false })
    .withMessage('Password must be required.')
    .bail()
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^])[A-Za-z\d@$!%*#?&^]{8,}$/)
    .withMessage(
      'Password must be Minimum eight characters, at least one letter, one number and one allowed special character: @$!%*#?&^',
    )
    .bail(),

  body('passwordConfirmation')
    .notEmpty({ ignore_whitespace: false })
    .withMessage('Password Confirmation must be required.')
    .bail()
    .custom(async (value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password Confirmation not match with password');
      }
    }),
];

export default {
  signup,
} as const;
