import { Request, Response } from 'express';
import {
  getMoviesWithFilters,
  getMovieByIdService,
  createMovieService
} from '../services/movie.service';

export const getAllMovies = async (req: Request, res: Response) => {
  try {
    const data = await getMoviesWithFilters(req.query);
    res.json({
      movies: data.movies.map((movie : any) => ({
        ...movie,
        actors: movie.actors.map((ma : any) => ({
          id: ma.actor.id,
          name: ma.actor.name,
          country: ma.actor.country,
          character: ma.character
        }))
      })),
      pagination: data.pagination
    });
  } catch (error) {
    console.error('Get movies error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMovieById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const movie = await getMovieByIdService(id);

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    const movieResponse = {
      ...movie,
      actors: movie.actors.map((ma : any) => ({
        id: ma.actor.id,
        name: ma.actor.name,
        biography: ma.actor.biography,
        birthDate: ma.actor.birthDate,
        country: ma.actor.country,
        character: ma.character
      }))
    };

    res.json(movieResponse);
  } catch (error) {
    console.error('Get movie error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createMovie = async (req: Request, res: Response) => {
  try {
    const movie = await createMovieService(req.body);

    const movieResponse = {
      ...movie,
      actors: movie.actors.map((ma : any) => ({
        id: ma.actor.id,
        name: ma.actor.name,
        country: ma.actor.country,
        character: ma.character
      }))
    };

    res.status(201).json(movieResponse);
  } catch (error: any) {
    console.error('Create movie error:', error);
    if (error.message === 'INVALID_DIRECTOR') {
      return res.status(400).json({ error: 'Invalid director' });
    }
    if (error.message === 'INVALID_ACTORS') {
      return res.status(400).json({ error: 'Invalid actors' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
