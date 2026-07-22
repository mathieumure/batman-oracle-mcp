import { villains } from '@batman/data/villains';
import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';

const fastify = Fastify({
  logger: true,
});

fastify.register(fastifyCors, {
  origin: '*',
});

fastify.get('/villains', () => {
  return villains;
});

fastify.listen({ port: 8080 });
