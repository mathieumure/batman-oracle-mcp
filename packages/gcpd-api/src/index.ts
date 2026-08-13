import { criminals } from '@batman/data/criminals';
import { crimes } from '@batman/data/crimes';
import { crimeScene } from '@batman/data/crime-scene';
import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import Fastify from 'fastify';
import { filterCrimes, parseCrimeQuery } from './filter-crimes.js';
import { geocodeCity, translateCrimesToCenter } from './map.utils';
import { crimeSceneForensicsRouteSchema, crimeSceneRouteSchema, criminalsRouteSchema, crimesRouteSchema } from './openapi-schemas.js';

const fallbackPicture = 'http://localhost:3000/img/default-crime.jpg';

const fastify = Fastify({
  logger: true,
});

async function bootstrap() {
  await fastify.register(fastifyCors, {
    origin: '*',
  });

  await fastify.register(fastifySwagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'GCPD API',
        description: 'Mock Gotham City Police Department API for Batman Oracle MCP demo',
        version: '0.0.0',
      },
      servers: [{ url: 'http://localhost:8080', description: 'Local dev' }],
      tags: [
        { name: 'criminals', description: 'Batman rogues gallery' },
        { name: 'crimes', description: 'Crime map data' },
        { name: 'crime-scene', description: 'Crime scene forensics' },
      ],
      components: {
        securitySchemes: {
          bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        },
      },
    },
  });

  await fastify.register(fastifySwaggerUi, {
    routePrefix: '/swagger',
  });

  fastify.get('/criminals', { schema: criminalsRouteSchema }, (request) => {
    const query = request.query as Record<string, unknown>;
    if (!query || !query.affiliation) {
      return criminals;
    }

    return criminals.filter((criminal) => criminal.details?.affiliation.includes(query.affiliation as string));
  });

  fastify.get('/crimes', { schema: crimesRouteSchema }, async (request) => {
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

  fastify.get('/crime-scene', { schema: crimeSceneRouteSchema }, (request, reply) => {
    if (!isValidAuth(request.headers.authorization)) {
      reply.code(401).send('Unauthorized');
      return;
    }
    return { ...crimeScene, residues: [], exhibits: [] };
  });

  fastify.get('/crime-scene/forensics', { schema: crimeSceneForensicsRouteSchema }, () => {
    return crimeScene;
  });

  await fastify.listen({ port: 8080 });
}

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

bootstrap();
