import { request, response } from 'express';
import _ from 'lodash';

import { authService } from '../services';

const login = async (req = request, res = response) => {
  const { body } = req;

  const result = await authService.login(body);

  if (result.isInactive) {
    return res.status(403).json({
      success: false,
      message: 'Your account is disabled. Please Contact Admin for assistance.',
    });
  }

  const { refreshToken, accessToken } = result;

  res.cookie('token', refreshToken as string, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 2592000 * 1000,
  });

  return res.status(201).json({
    success: true,
    message: 'Login successfully.',
    data: {
      accessToken,
    },
  });
};

const logout = async (req = request, res = response) => {
  const { user } = res.locals;

  const data = { ...user };

  await authService.logout(data);

  res.cookie('token', 'Logout successfully.', { maxAge: 0 });

  return res
    .status(200)
    .json({ success: true, message: 'Logout successfully.' });
};

const generateNewRefreshToken = async (req = request, res = response) => {
  const { token } = req.cookies;

  if (_.isEmpty(token)) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorize.',
    });
  }

  const data = {
    refreshToken: token,
  };

  const result = await authService.generateNewRefreshToken(data);

  if (result.error) {
    return res.status(401).json({
      success: false,
      message: 'Token invalid.',
    });
  }

  res.cookie('token', result.refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 2592000 * 1000,
  });

  return res.status(201).json({
    success: true,
    message: 'Refresh Token successfully generated.',
    data: {
      accessToken: result.accessToken,
    },
  });
};

export default { login, logout, generateNewRefreshToken };
