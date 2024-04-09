import { Router } from 'express';

const router = Router();

import {
  validatorMiddleware,
  tryCatchHandlerMiddleware,
} from '../../middlewares';

import { usersValidator } from '../../validators';

import { usersController } from '../../controllers';

router.post(
  '/signup',
  usersValidator.signup,
  validatorMiddleware,
  tryCatchHandlerMiddleware(usersController.signup),
);

export default router;
