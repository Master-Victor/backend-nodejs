import { Request, Response } from 'express';
import {
  getAllDirectorsService,
  getDirectorByIdService,
  createDirectorService
} from '../services/director.service';

export const getAllDirectorsController = async (_req: Request, res: Response) => {
  try {
    const directors = await getAllDirectorsService();
    res.json({ totalCount: directors.length, directors });
  } catch (error) {
    console.error('Error fetching directors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getDirectorByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const director = await getDirectorByIdService(id);
    res.json(director);
  } catch (error) {
    if ((error as Error).message === 'DIRECTOR_NOT_FOUND') {
      return res.status(404).json({ error: 'Director not found' });
    }
    console.error('Error fetching director:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createDirectorController = async (req: Request, res: Response) => {
  try {
    const director = await createDirectorService(req.body);
    res.status(201).json({ message: 'Director created', director });
  } catch (error) {
    console.error('Error creating director:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};