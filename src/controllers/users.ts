import { request, response } from 'express';

const signup = async (req = request, res = response) => {};

const forgotPassword = async (req = request, res = response) => {};

const validateForgotPasswordLink = async (req = request, res = response) => {};

const changePassword = async (req = request, res = response) => {};

export default {
  signup,
  forgotPassword,
  validateForgotPasswordLink,
  changePassword,
} as const;
