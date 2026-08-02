import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import { fromNodeHeaders } from 'better-auth/node';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { auth } from './auth.js';
import { seedDemoUser } from './seed.js';
import { AUTH_PORT, AUTH_ORIGIN } from './config.js';

const fastify = Fastify({ logger: true });

fastify.register(fastifyCors, {
  origin: true,
  credentials: true,
});

// Fastify's built-in JSON parser runs before a wildcard '*' parser can intercept
// application/json requests, so it must be overridden explicitly here too.
fastify.addContentTypeParser('application/json', { parseAs: 'buffer' }, (_req, body, done) => {
  done(null, body);
});
fastify.addContentTypeParser('*', { parseAs: 'buffer' }, (_req, body, done) => {
  done(null, body);
});

fastify.get('/login', async (_req, reply) => {
  const html = await readFile(join(import.meta.dirname, 'pages/login.html'), 'utf-8');
  reply.type('text/html').send(html);
});

fastify.get('/consent', async (_req, reply) => {
  const html = await readFile(join(import.meta.dirname, 'pages/consent.html'), 'utf-8');
  reply.type('text/html').send(html);
});

fastify.route({
  method: ['GET', 'POST'],
  url: '/*',
  handler: async (request, reply) => {
    const url = new URL(request.url, AUTH_ORIGIN);
    const headers = fromNodeHeaders(request.headers);
    const hasBody = !['GET', 'HEAD'].includes(request.method) && Buffer.isBuffer(request.body) && request.body.length > 0;

    const webRequest = new Request(url.toString(), {
      method: request.method,
      headers,
      body: hasBody ? (request.body as unknown as BodyInit) : undefined,
    });

    const response = await auth.handler(webRequest);

    reply.status(response.status);
    response.headers.forEach((value, key) => reply.header(key, value));

    const text = await response.text();
    reply.send(text.length > 0 ? text : undefined);
  },
});

await seedDemoUser();

fastify.listen({ port: AUTH_PORT, host: '0.0.0.0' }, () => {
  console.log(`Auth server listening at ${AUTH_ORIGIN}`);
});
