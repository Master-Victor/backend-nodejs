import { Request, Response } from 'express';
import * as tvShowService from '../services/tvShow.service';

export const getEpisode = async (req: Request, res: Response) => {
  try {
    const { tvShowId, seasonNumber, episodeNumber } = req.params as any;

    const { season, episode } = await tvShowService.getEpisodeDetail(tvShowId, parseInt(seasonNumber), parseInt(episodeNumber));
    if (!season) return res.status(404).json({ error: 'Season not found' });
    if (!episode) return res.status(404).json({ error: 'Episode not found' });

    const actors = episode.season.tvShow.actors.map((ta: any) => ({
      id: ta.actor.id,
      name: ta.actor.name,
      country: ta.actor.country,
      character: ta.character
    }));

    return res.json({
      ...episode,
      tvShow: { ...episode.season.tvShow, actors },
      season: {
        id: episode.season.id,
        seasonNumber: episode.season.seasonNumber,
        title: episode.season.title,
        releaseDate: episode.season.releaseDate
      }
    });
  } catch (err) {
    console.error('Get episode error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const shows = await tvShowService.getAllTvShows();
    const result = shows.map((show: any) => ({
      ...show,
      actors: show.actors.map((a: any) => ({ ...a.actor, character: a.character })),
      seasons: show.seasons.map((s: any) => ({
        id: s.id,
        seasonNumber: s.seasonNumber,
        title: s.title,
        episodeCount: s._count.episodes
      }))
    }));
    res.json({ tvShows: result, totalCount: result.length });
  } catch (err) {
    console.error('Get TV shows error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const tvShow = await tvShowService.getTvShowById(req.params.id);
    if (!tvShow) return res.status(404).json({ error: 'TV Show not found' });

    res.json({
      ...tvShow,
      actors: tvShow.actors.map((a: any) => ({ ...a.actor, character: a.character }))
    });
  } catch (err) {
    console.error('Get TV show error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const newShow = await tvShowService.createTvShow(req.body);
    if (!newShow) return res.status(400).json({ error: 'Invalid actors' });

    const actors = newShow.actors.map((ta: any) => ({
      ...ta.actor,
      character: ta.character
    }));

    res.status(201).json({ message: 'TV Show created successfully', tvShow: { ...newShow, actors } });
  } catch (err) {
    console.error('Create TV show error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
