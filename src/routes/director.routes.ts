import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { createDirectorSchema } from '../validations/director.validation';
import {
  getAllDirectorsController,
  getDirectorByIdController,
  createDirectorController
} from '../controllers/director.controller';

const router = Router();

router.use(authenticateToken);

router.get('/', getAllDirectorsController);
router.get('/:id', getDirectorByIdController);
router.post('/', validateRequest(createDirectorSchema), createDirectorController);

export { router as directorRoutes };