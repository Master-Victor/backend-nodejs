import { z } from 'zod';

export const getMoviesSchema = z.object({
  query: z.object({
    page: z.string().optional().transform(val => val ? parseInt(val) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
    genre: z.string().optional(),
    director: z.string().optional(),
    sortBy: z.enum(['title', 'releaseDate', 'rating', 'duration']).optional().default('title'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
    search: z.string().optional()
  })
});

export const createMovieSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    genre: z.string().min(1),
    releaseDate: z.string().datetime(),
    duration: z.number().positive(),
    rating: z.number().min(0).max(10).optional(),
    directorId: z.string().min(1),
    actors: z.array(z.object({
      actorId: z.string().min(1),
      character: z.string().min(1)
    })).optional()
  })
});
