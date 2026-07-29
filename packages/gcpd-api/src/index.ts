import { criminals } from '@batman/data/criminals';
import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';

const fastify = Fastify({
  logger: true,
});

fastify.register(fastifyCors, {
  origin: '*',
});

fastify.get('/criminals', () => {
  return criminals;
});

fastify.listen({ port: 8080 });
