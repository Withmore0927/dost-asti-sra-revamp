import { Router } from 'express';

const router = Router();

import authRoutes from './auth';
import usersRoutes from './users';

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);

export default router;
