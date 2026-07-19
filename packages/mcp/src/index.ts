import { createServer } from './mcp.js';
import Fastify, { type FastifyReply, type FastifyRequest } from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyCors from '@fastify/cors';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import { randomUUID } from 'node:crypto';
import path from 'node:path';

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

const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

fastify.post('/mcp', async (req, res) => {
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
