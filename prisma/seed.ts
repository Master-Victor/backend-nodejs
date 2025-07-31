import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Usuario
  const hashedPassword = await bcrypt.hash('homero123', 10);
  await prisma.user.create({
    data: {
      email: 'homero@springfield.com',
      password: hashedPassword,
      name: 'Homero Simpson'
    }
  });

  // Director
  const matt = await prisma.director.create({
    data: {
      name: 'Matt Groening',
      biography: 'Creador de Los Simpson',
      birthDate: new Date('1954-02-15'),
      country: 'Estados Unidos'
    }
  });

  // Actores principales
  const homero = await prisma.actor.create({
    data: { name: 'Homero Simpson', biography: 'Padre de familia', country: 'Estados Unidos' }
  });
  const marge = await prisma.actor.create({
    data: { name: 'Marge Simpson', biography: 'Madre de familia', country: 'Estados Unidos' }
  });
  const bart = await prisma.actor.create({
    data: { name: 'Bart Simpson', biography: 'Niño travieso', country: 'Estados Unidos' }
  });
  const lisa = await prisma.actor.create({
    data: { name: 'Lisa Simpson', biography: 'Niña inteligente', country: 'Estados Unidos' }
  });
  const maggie = await prisma.actor.create({
    data: { name: 'Maggie Simpson', biography: 'Bebé silenciosa', country: 'Estados Unidos' }
  });

  // Actores secundarios
  const moe = await prisma.actor.create({
    data: { name: 'Moe Szyslak', biography: 'Cantinero amargado', country: 'Estados Unidos' }
  });
  const flanders = await prisma.actor.create({
    data: { name: 'Ned Flanders', biography: 'Vecino religioso', country: 'Estados Unidos' }
  });
  const krusty = await prisma.actor.create({
    data: { name: 'Krusty el Payaso', biography: 'Famoso payaso de TV', country: 'Estados Unidos' }
  });
  const burns = await prisma.actor.create({
    data: { name: 'Sr. Burns', biography: 'Dueño de la planta nuclear', country: 'Estados Unidos' }
  });

  // Serie: Los Simpson
  const simpsonsShow = await prisma.tvShow.create({
    data: {
      title: 'Los Simpson',
      genre: 'Comedia animada',
      startDate: new Date('1989-12-17'),
      status: 'ongoing',
      description: 'Serie animada sobre una familia muy particular en Springfield.',
      actors: {
        create: [
          { actorId: homero.id, character: 'Homero' },
          { actorId: marge.id, character: 'Marge' },
          { actorId: bart.id, character: 'Bart' },
          { actorId: lisa.id, character: 'Lisa' },
          { actorId: maggie.id, character: 'Maggie' },
          { actorId: moe.id, character: 'Moe' },
          { actorId: flanders.id, character: 'Flanders' },
          { actorId: krusty.id, character: 'Krusty' },
          { actorId: burns.id, character: 'Sr. Burns' }
        ]
      }
    }
  });

  // Temporada 1
  const season1 = await prisma.season.create({
    data: {
      tvShowId: simpsonsShow.id,
      seasonNumber: 1,
      title: 'Primera Temporada',
      description: 'Primera entrega de la familia Simpson',
      releaseDate: new Date('1989-12-17')
    }
  });

  // Episodios
  await prisma.episode.createMany({
    data: [
      {
        seasonId: season1.id,
        episodeNumber: 1,
        title: 'Simpsons asado en Navidad',
        description: 'Homero trabaja como Santa para comprar regalos',
        duration: 23,
        airDate: new Date('1989-12-17'),
        directorId: matt.id
      },
      {
        seasonId: season1.id,
        episodeNumber: 2,
        title: 'Bart el genio',
        description: 'Bart se cambia de escuela tras hacer trampa en un test de IQ',
        duration: 23,
        airDate: new Date('1990-01-14'),
        directorId: matt.id
      }
    ]
  });

  // Película: Los Simpson: La película
  await prisma.movie.create({
    data: {
      title: 'Los Simpson: La película',
      genre: 'Comedia',
      description: 'Homero contamina el lago de Springfield y desata el caos.',
      releaseDate: new Date('2007-07-27'),
      duration: 87,
      rating: 7.3,
      directorId: matt.id,
      actors: {
        create: [
          { actorId: homero.id, character: 'Homero' },
          { actorId: bart.id, character: 'Bart' },
          { actorId: lisa.id, character: 'Lisa' },
          { actorId: marge.id, character: 'Marge' },
          { actorId: burns.id, character: 'Sr. Burns' }
        ]
      }
    }
  });

  console.log('✅ ¡Base de datos cargada con Los Simpson!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
