import type { FastifyReply, FastifyRequest } from 'fastify';
import { verifyAccessToken } from 'better-auth/oauth2';

export async function requireBearerAuth(req: FastifyRequest, res: FastifyReply): Promise<boolean> {
  if (process.env.REQUIRE_AUTH !== 'true') return false;

  const authHeader = req.headers['authorization'];
  const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : undefined;

  const challenge = () => {
    res
      .code(401)
      .header('WWW-Authenticate', `Bearer realm="mcp", resource_metadata="${process.env.MCP_ORIGIN}/.well-known/oauth-protected-resource"`)
      .send();
  };

  if (!token) {
    challenge();
    return true;
  }

  try {
    await verifyAccessToken(token, {
      verifyOptions: { audience: `${process.env.MCP_ORIGIN}/mcp`, issuer: process.env.AUTH_ORIGIN as string },
      scopes: ['mcp:tools'],
      jwksUrl: `${process.env.AUTH_ORIGIN}/jwks`,
    });
  } catch {
    challenge();
    return true;
  }

  return false;
}
