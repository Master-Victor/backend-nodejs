import { z } from 'zod';

export const createActorSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    biography: z.string().optional(),
    birthDate: z.string().datetime('Invalid date format').optional(),
    country: z.string().optional()
  })
});
