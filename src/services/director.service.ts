import { prisma } from '../lib/prisma';

export const getAllDirectorsService = async () => {
  return await prisma.director.findMany({
    orderBy: { name: 'asc' }
  });
};

export const getDirectorByIdService = async (id: string) => {
  const director = await prisma.director.findUnique({
    where: { id },
    include: {
      movies: {
        select: {
          id: true,
          title: true,
          releaseDate: true,
          genre: true
        }
      },
      episodes: {
        select: {
          id: true,
          title: true,
          airDate: true,
          duration: true
        }
      }
    }
  });
  if (!director) throw new Error('NOT_FOUND');
  return director;
};

export const createDirectorService = async (data: {
  name: string,
  biography?: string,
  birthDate?: string,
  country?: string
}) => {
  const director = await prisma.director.create({
    data: {
      name: data.name,
      biography: data.biography,
      birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
      country: data.country
    }
  });
  return director;
};
