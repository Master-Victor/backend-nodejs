import { Request, Response } from 'express';
import {
  getAllActorsService,
  getActorByIdService,
  createActorService
} from '../services/actor.service';

export const getAllActors = async (_req: Request, res: Response) => {
  try {
    const actors = await getAllActorsService();

    const actorsResponse = actors.map((actor : any) => ({
      id: actor.id,
      name: actor.name,
      biography: actor.biography,
      birthDate: actor.birthDate,
      country: actor.country,
      createdAt: actor.createdAt,
      updatedAt: actor.updatedAt,
      movies: actor.movieActors.map((ma : any) => ({
        id: ma.movie.id,
        title: ma.movie.title,
        releaseDate: ma.movie.releaseDate,
        character: ma.character
      })),
      tvShows: actor.tvShowActors.map((ta : any) => ({
        id: ta.tvShow.id,
        title: ta.tvShow.title,
        startDate: ta.tvShow.startDate,
        character: ta.character
      }))
    }));

    res.json({
      actors: actorsResponse,
      totalCount: actors.length
    });
  } catch (error) {
    console.error('Get actors error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while fetching actors'
    });
  }
};

export const getActorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const actor = await getActorByIdService(id);

    if (!actor) {
      return res.status(404).json({
        error: 'Actor not found',
        message: 'The requested actor does not exist'
      });
    }

    const actorResponse = {
      id: actor.id,
      name: actor.name,
      biography: actor.biography,
      birthDate: actor.birthDate,
      country: actor.country,
      createdAt: actor.createdAt,
      updatedAt: actor.updatedAt,
      movies: actor.movieActors.map((ma : any) => ({
        id: ma.movie.id,
        title: ma.movie.title,
        genre: ma.movie.genre,
        releaseDate: ma.movie.releaseDate,
        character: ma.character,
        director: ma.movie.director
      })),
      tvShows: actor.tvShowActors.map((ta : any) => ({
        id: ta.tvShow.id,
        title: ta.tvShow.title,
        genre: ta.tvShow.genre,
        startDate: ta.tvShow.startDate,
        status: ta.tvShow.status,
        character: ta.character
      }))
    };

    res.json(actorResponse);
  } catch (error) {
    console.error('Get actor error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while fetching the actor'
    });
  }
};

export const createActor = async (req: Request, res: Response) => {
  try {
    const actor = await createActorService(req.body);
    res.status(201).json({
      message: 'Actor created successfully',
      actor
    });
  } catch (error) {
    console.error('Create actor error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while creating the actor'
    });
  }
};
