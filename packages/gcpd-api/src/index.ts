import { criminals } from '@batman/data/criminals';
import { crimes } from '@batman/data/crimes';
import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import { filterCrimes, parseCrimeQuery } from './filter-crimes.js';

const fallbackPicture = 'http://localhost:3000/img/default-crime.jpg';

const fastify = Fastify({
  logger: true,
});

fastify.register(fastifyCors, {
  origin: '*',
});

fastify.get('/criminals', (request) => {
  const query = request.query as Record<string, unknown>;
  if (!query || !query.affiliation) {
    return criminals;
  }

  return criminals.filter((criminal) => criminal.details?.affiliation.includes(query.affiliation as string));
});

fastify.get('/crimes', (request) => {
  const filters = parseCrimeQuery(request.query as Record<string, unknown>);
  return filterCrimes(
    crimes.map((crime) => ({
      ...crime,
      suspectPicture: criminals.find((criminal) => criminal.name === crime.suspect)?.picture ?? fallbackPicture,
    })),
    filters,
  );
});

fastify.listen({ port: 8080 });
