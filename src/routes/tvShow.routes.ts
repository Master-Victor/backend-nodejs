import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import * as tvShowController from '../controllers/tvShow.controller';
import { createTvShowSchema, getEpisodeSchema } from '../validations/tvShow.validation';

const router = Router();
router.use(authenticateToken);

router.get('/', tvShowController.getAll);
router.get('/:id', tvShowController.getById);
router.post('/', validateRequest(createTvShowSchema), tvShowController.create);
router.get('/:tvShowId/seasons/:seasonNumber/episodes/:episodeNumber', validateRequest(getEpisodeSchema), tvShowController.getEpisode);

export { router as tvShowRoutes };
