import { criminals } from '@batman/data/criminals';
import { crimes } from '@batman/data/crimes';
import { crimeScene } from '@batman/data/crime-scene';
import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import { filterCrimes, parseCrimeQuery } from './filter-crimes.js';
import { geocodeCity, translateCrimesToCenter } from './map.utils';

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

fastify.get('/crimes', async (request) => {
  const filters = parseCrimeQuery(request.query as Record<string, unknown>);
  const datasetCrimes = filterCrimes(
    crimes.map((crime) => ({
      ...crime,
      suspectPicture: criminals.find((criminal) => criminal.name === crime.suspect)?.picture ?? fallbackPicture,
    })),
    filters,
  );

  const center = await geocodeCity(filters.city);

  if (!center) {
    throw new Error(`Unable to find city ${filters.city}`);
  }

  return {
    crimes: translateCrimesToCenter(datasetCrimes, center),
    center,
  };
});

fastify.get('/crime-scene', () => crimeScene);

fastify.listen({ port: 8080 });
