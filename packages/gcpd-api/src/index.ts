import { criminals } from '@batman/data/criminals';
import { crimes } from '@batman/data/crimes';
import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import { filterCrimes, parseCrimeQuery } from './filter-crimes.js';

const fastify = Fastify({
  logger: true,
});

fastify.register(fastifyCors, {
  origin: '*',
});

fastify.get('/criminals', () => {
  return criminals;
});

fastify.get('/crimes', (request) => {
  const filters = parseCrimeQuery(request.query as Record<string, unknown>);
  return filterCrimes(crimes, filters);
});

fastify.listen({ port: 8080 });
