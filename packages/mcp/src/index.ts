import { createServer } from './mcp.js';
import Fastify, { type FastifyReply, type FastifyRequest } from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyCors from '@fastify/cors';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import { verifyAccessToken } from 'better-auth/oauth2';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { PUBLIC_ORIGIN, AUTH_ORIGIN, REQUIRE_AUTH } from './config.js';

const fastify = Fastify({
  logger: true,
});

fastify.register(fastifyCors, {
  origin: '*',
});

fastify.register(fastifyStatic, {
  root: path.join(import.meta.dirname, '../../mcp-ui/dist/assets'),
  prefix: '/assets/',
});

fastify.get('/.well-known/oauth-protected-resource', async () => {
  return {
    resource: `${PUBLIC_ORIGIN}/mcp`,
    authorization_servers: [AUTH_ORIGIN],
    scopes_supported: ['mcp:tools'],
  };
});

async function requireBearerAuth(req: FastifyRequest, res: FastifyReply): Promise<boolean> {
  if (!REQUIRE_AUTH) return true;

  const authHeader = req.headers['authorization'];
  const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : undefined;

  const challenge = () => {
    res
      .code(401)
      .header('WWW-Authenticate', `Bearer realm="mcp", resource_metadata="${PUBLIC_ORIGIN}/.well-known/oauth-protected-resource"`)
      .send();
  };

  if (!token) {
    challenge();
    return false;
  }

  try {
    await verifyAccessToken(token, {
      verifyOptions: { audience: `${PUBLIC_ORIGIN}/mcp`, issuer: AUTH_ORIGIN },
      scopes: ['mcp:tools'],
      jwksUrl: `${AUTH_ORIGIN}/jwks`,
    });
  } catch {
    challenge();
    return false;
  }

  return true;
}

const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

fastify.post('/mcp', async (req, res) => {
  if (!(await requireBearerAuth(req, res))) return;

  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  let transport: StreamableHTTPServerTransport;

  if (sessionId && transports[sessionId]) {
    transport = transports[sessionId];
  } else if (!sessionId && isInitializeRequest(req.body)) {
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (sid) => {
        transports[sid] = transport;
        console.log(`MCP Session initialized: ${sid}`);
      },
    });

    transport.onclose = () => {
      if (transport.sessionId) {
        console.log(`MCP Session closed: ${transport.sessionId}`);
        delete transports[transport.sessionId];
      }
    };

    await createServer().connect(transport);
  } else {
    return {
      error: { message: 'Bad Request: No valid session ID provided' },
    };
  }

  await transport.handleRequest(req.raw, res.raw, req.body);
});

const handleSessionRequest = async (req: FastifyRequest, res: FastifyReply) => {
  if (!(await requireBearerAuth(req, res))) return;

  const sessionId = req.headers['mcp-session-id'] as string | undefined;

  if (!sessionId || !transports[sessionId]) {
    res.code(400).send('Invalid or missing session ID');
    return;
  }

  const transport = transports[sessionId];

  await transport.handleRequest(req.raw, res.raw);
};

fastify.get('/mcp', handleSessionRequest);
fastify.delete('/mcp', handleSessionRequest);

fastify.listen({ port: 3000 });
