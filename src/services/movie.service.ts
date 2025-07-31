import { prisma } from '../lib/prisma';

export const getMoviesWithFilters = async (params: any) => {
  const { page, limit, genre, director, sortBy, sortOrder, search } = params;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (genre) where.genre = { contains: genre, mode: 'insensitive' };
  if (director) where.director = { name: { contains: director, mode: 'insensitive' } };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }

  const orderBy: any = sortBy === 'director'
    ? { director: { name: sortOrder } }
    : { [sortBy]: sortOrder };

  const [movies, totalCount] = await Promise.all([
    prisma.movie.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        director: { select: { id: true, name: true, country: true } },
        actors: {
          include: {
            actor: { select: { id: true, name: true, country: true } }
          }
        }
      }
    }),
    prisma.movie.count({ where })
  ]);

  return {
    movies,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalItems: totalCount,
      itemsPerPage: limit,
      hasNextPage: page < Math.ceil(totalCount / limit),
      hasPreviousPage: page > 1
    }
  };
};

export const getMovieByIdService = async (id: string) => {
  return prisma.movie.findUnique({
    where: { id },
    include: {
      director: {
        select: { id: true, name: true, biography: true, birthDate: true, country: true }
      },
      actors: {
        include: {
          actor: {
            select: { id: true, name: true, biography: true, birthDate: true, country: true }
          }
        }
      }
    }
  });
};

export const createMovieService = async (data: any) => {
  const { title, description, genre, releaseDate, duration, rating, directorId, actors } = data;

  const director = await prisma.director.findUnique({ where: { id: directorId } });
  if (!director) throw new Error('INVALID_DIRECTOR');

  if (actors && actors.length > 0) {
    const actorIds = actors.map((a: any) => a.actorId);
    const existingActors = await prisma.actor.findMany({ where: { id: { in: actorIds } } });
    if (existingActors.length !== actorIds.length) throw new Error('INVALID_ACTORS');
  }

  return prisma.movie.create({
    data: {
      title,
      description,
      genre,
      releaseDate: new Date(releaseDate),
      duration,
      rating,
      directorId,
      actors: actors ? {
        create: actors.map((a: any) => ({
          actorId: a.actorId,
          character: a.character
        }))
      } : undefined
    },
    include: {
      director: { select: { id: true, name: true, country: true } },
      actors: {
        include: {
          actor: { select: { id: true, name: true, country: true } }
        }
      }
    }
  });
};

export const updateMovieService = async (id: string, data: any) => {
  const { title, description, genre, releaseDate, duration, rating, directorId, actors } = data;

  const movie = await prisma.movie.findUnique({ where: { id } });
  if (!movie) throw new Error('MOVIE_NOT_FOUND');

  if (directorId) {
    const director = await prisma.director.findUnique({ where: { id: directorId } });
    if (!director) throw new Error('INVALID_DIRECTOR');
  }

  if (actors && actors.length > 0) {
    const actorIds = actors.map((a: any) => a.actorId);
    const existingActors = await prisma.actor.findMany({ where: { id: { in: actorIds } } });
    if (existingActors.length !== actorIds.length) throw new Error('INVALID_ACTORS');
  }

  return prisma.movie.update({
    where: { id },
    data: {
      title,
      description,
      genre,
      releaseDate: new Date(releaseDate),
      duration,
      rating,
      directorId,
      actors: actors ? {
        deleteMany: {},
        create: actors.map((a: any) => ({
          actorId: a.actorId,
          character: a.character
        }))
      } : undefined
    },
    include: {
      director: { select: { id: true, name: true, country: true } },
      actors: {
        include: {
          actor: { select: { id: true, name: true, country: true } }
        }
      }
    }
  });
};

export const deleteMovieService = async (id: string) => {
  const movie = await prisma.movie.findUnique({ where: { id } });
  if (!movie) throw new Error('MOVIE_NOT_FOUND');

  return prisma.movie.delete({
    where: { id }
  });
};