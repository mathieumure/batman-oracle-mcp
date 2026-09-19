import { httpServer } from './http-server.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { validateAuth } from './auth.js';

export const mcpServer = new McpServer({
    name: 'GCPD MCP',
    version: '1.0.0',
    description: 'GCPD Mcp Server listing criminals and crimes for any city',
});

httpServer.get('/.well-known/oauth-protected-resource', async () => {
  return {
    resource: `${process.env.MCP_ORIGIN}/mcp`,
    authorization_servers: [process.env.AUTH_ORIGIN],
    scopes_supported: ['mcp:tools'],
  };
});

httpServer.post('/mcp', async (req, res) => {

  const isAuthenticated = await validateAuth(req, res);
  if (!isAuthenticated) {
    return res
          .status(401)
          .header('WWW-Authenticate', `Bearer realm="mcp", resource_metadata="${process.env.MCP_ORIGIN}/.well-known/oauth-protected-resource"`)
          .send();
  }

  const transport = new StreamableHTTPServerTransport();
  await mcpServer.connect(transport);
  await transport.handleRequest(req.raw, res.raw, req.body);

  res.raw.on('close', () => {
    mcpServer.close();
    transport.close();
  });
})