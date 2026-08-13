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

function isValidAuth(token: string | undefined): boolean {
  if (!token || !token.startsWith('Bearer ')) {
    return false;
  }
  try {
    const payload = JSON.parse(atob(token.replaceAll('Bearer ', '').split('.')[1]));
    return payload.iss === (process.env.AUTH_ORIGIN as string) && payload.aud === `${process.env.MCP_ORIGIN}/mcp`;
  } catch {
    return false;
  }
}

fastify.get('/crime-scene', (request, reply) => {
  if (!isValidAuth(request.headers.authorization)) {
    reply.code(401).send('Unauthorized');
    return;
  }
  return { ...crimeScene, residues: [], exhibits: [] };
});

fastify.get('/crime-scene/forensics', () => {
  return crimeScene;
});

fastify.listen({ port: 8080 });
