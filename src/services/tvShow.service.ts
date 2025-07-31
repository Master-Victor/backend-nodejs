import { prisma } from '../lib/prisma';

export const getEpisodeDetail = async (tvShowId: string, seasonNumber: number, episodeNumber: number) => {
  const season = await prisma.season.findUnique({
    where: { tvShowId_seasonNumber: { tvShowId, seasonNumber } }
  });

  if (!season) return null;

  const episode = await prisma.episode.findUnique({
    where: { seasonId_episodeNumber: { seasonId: season.id, episodeNumber } },
    include: {
      director: true,
      season: {
        include: {
          tvShow: {
            include: {
              actors: {
                include: {
                  actor: true
                }
              }
            }
          }
        }
      }
    }
  });

  return { season, episode };
};

export const getAllTvShows = () => {
  return prisma.tvShow.findMany({
    include: {
      actors: { include: { actor: true } },
      seasons: {
        select: {
          id: true,
          seasonNumber: true,
          title: true,
          _count: { select: { episodes: true } }
        },
        orderBy: { seasonNumber: 'asc' }
      }
    },
    orderBy: { title: 'asc' }
  });
};

export const getTvShowById = (id: string) => {
  return prisma.tvShow.findUnique({
    where: { id },
    include: {
      actors: { include: { actor: true } },
      seasons: {
        include: {
          episodes: {
            include: { director: true },
            orderBy: { episodeNumber: 'asc' }
          }
        },
        orderBy: { seasonNumber: 'asc' }
      }
    }
  });
};

export const createTvShow = async (data: any) => {
  const { actors, ...rest } = data;

  if (actors && actors.length > 0) {
    const actorIds = actors.map((a: any) => a.actorId);
    const existing = await prisma.actor.findMany({ where: { id: { in: actorIds } } });
    if (existing.length !== actorIds.length) return null;
  }

  return prisma.tvShow.create({
    data: {
      ...rest,
      startDate: new Date(rest.startDate),
      endDate: rest.endDate ? new Date(rest.endDate) : null,
      actors: actors ? {
        create: actors.map((a: any) => ({
          actorId: a.actorId,
          character: a.character
        }))
      } : undefined
    },
    include: {
      actors: { include: { actor: true } }
    }
  });
};
