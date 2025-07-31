import { z } from 'zod';

export const getEpisodeSchema = z.object({
  params: z.object({
    tvShowId: z.string().min(1, 'TV Show ID is required'),
    seasonNumber: z.string().transform(val => parseInt(val)),
    episodeNumber: z.string().transform(val => parseInt(val))
  })
});

export const createTvShowSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    genre: z.string().min(1, 'Genre is required'),
    startDate: z.string().datetime('Invalid date format'),
    endDate: z.string().datetime('Invalid date format').optional(),
    status: z.enum(['ongoing', 'completed', 'cancelled']).optional().default('ongoing'),
    actors: z.array(z.object({
      actorId: z.string().min(1, 'Actor ID is required'),
      character: z.string().min(1, 'Character name is required')
    })).optional()
  })
});
