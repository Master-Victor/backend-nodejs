import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import {
  getAllActors,
  getActorById,
  createActor
} from '../controllers/actor.controller';
import { createActorSchema } from '../validations/actor.validation';

const router = Router();

router.use(authenticateToken);

router.get('/', getAllActors);
router.get('/:id', getActorById);
router.post('/', validateRequest(createActorSchema), createActor);

export { router as actorRoutes };
