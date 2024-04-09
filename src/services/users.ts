import { ulid } from 'ulid';
import _ from 'lodash';
import argon from 'argon2';
import ejs from 'ejs';

import { jwt, email, db } from '../utils';

const signup = async (payload: unknown) => {
  try {
  } catch (error) {
    console.log(error);

    throw new Error(String(error));
  }
};

const forgotPassword = async (payload: { email: string }) => {
  try {
  } catch (error) {
    console.log(error);
    throw new Error(String(error));
  }
};

const validateForgotPasswordLink = async (payload: { token: string }) => {
  try {
  } catch (error) {
    console.log(error);
    throw new Error(String(error));
  }
};

const changePassword = async (payload: {
  newPassword: string;
  confirmPassword: string;
}) => {
  try {
  } catch (error) {
    console.log(error);
    throw new Error(String(error));
  }
};

export default {
  signup,
  forgotPassword,
  validateForgotPasswordLink,
  changePassword,
} as const;
