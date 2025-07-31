import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { getAllMovies, getMovieById, createMovie } from '../controllers/movie.controller';
import { getMoviesSchema, createMovieSchema } from '../validations/movie.validation';

const router = Router();
// Apply authentication middleware to all movie routes
router.use(authenticateToken);

router.get('/', validateRequest(getMoviesSchema), getAllMovies);
router.get('/:id', getMovieById);
router.post('/', validateRequest(createMovieSchema), createMovie);

export { router as movieRoutes };
