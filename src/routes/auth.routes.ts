import { Router } from 'express';
import { validateRequest } from '../middleware/validation';
import { register, login, refresh, logout } from '../controllers/auth.controller';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema
} from '../validations/auth.validation';

const router = Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/refresh', validateRequest(refreshTokenSchema), refresh);
router.post('/logout', validateRequest(refreshTokenSchema), logout);

export { router as authRoutes };
