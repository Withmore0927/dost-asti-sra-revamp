import { Router } from 'express';

const router = Router();

import {
  validatorMiddleware,
  tryCatchHandlerMiddleware,
  authMiddleware,
} from '../../middlewares';

import { authValidator } from '../../validators';

import { authController } from '../../controllers';

router.post(
  '/login',
  authValidator.login,
  validatorMiddleware,
  tryCatchHandlerMiddleware(authController.login),
);

router.delete(
  '/logout',
  authMiddleware,
  tryCatchHandlerMiddleware(authController.logout),
);

router.get(
  '/refresh-tokens',
  tryCatchHandlerMiddleware(authController.generateNewRefreshToken),
);

export default router;
