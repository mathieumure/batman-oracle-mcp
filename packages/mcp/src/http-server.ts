import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import path from 'node:path';

export const fastify = Fastify({
  logger: true,
});

// Allow CORS for all
fastify.register(fastifyCors, {
  origin: '*',
});

// Serve UI (vite) bundles under /assets/
fastify.register(fastifyStatic, {
  root: path.join(import.meta.dirname, '../../mcp-ui/dist/assets'),
  prefix: '/assets/',
});

// Serve local img from data package under /img/
fastify.register(fastifyStatic, {
  root: path.join(import.meta.dirname, '../../data/img'),
  prefix: '/img/',
  decorateReply: false,
});
