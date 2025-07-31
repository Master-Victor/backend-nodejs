import { prisma } from '../lib/prisma';

export const getAllActorsService = async () => {
  const actors = await prisma.actor.findMany({
    include: {
      movieActors: {
        include: {
          movie: {
            select: {
              id: true,
              title: true,
              releaseDate: true
            }
          }
        }
      },
      tvShowActors: {
        include: {
          tvShow: {
            select: {
              id: true,
              title: true,
              startDate: true
            }
          }
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  });

  return actors;
};

export const getActorByIdService = async (id: string) => {
  return prisma.actor.findUnique({
    where: { id },
    include: {
      movieActors: {
        include: {
          movie: {
            select: {
              id: true,
              title: true,
              genre: true,
              releaseDate: true,
              director: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      },
      tvShowActors: {
        include: {
          tvShow: {
            select: {
              id: true,
              title: true,
              genre: true,
              startDate: true,
              status: true
            }
          }
        }
      }
    }
  });
};

export const createActorService = async (data: {
  name: string;
  biography?: string;
  birthDate?: string;
  country?: string;
}) => {
  return prisma.actor.create({
    data: {
      name: data.name,
      biography: data.biography,
      birthDate: data.birthDate ? new Date(data.birthDate) : null,
      country: data.country
    }
  });
};

export const updateActorService = async (id: string, data: {
  name?: string;
  biography?: string;
  birthDate?: string;
  country?: string;
}) => {
  return prisma.actor.update({
    where: { id },
    data: {
      name: data.name,
      biography: data.biography,
      birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
      country: data.country
    }
  });
};

export const deleteActorService = async (id: string) => {
  return prisma.actor.delete({
    where: { id }
  });
};
