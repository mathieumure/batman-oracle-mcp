import { httpServer } from '../http-server.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
// <DEMO-3>
import { isAuthenticated } from '../auth.js';
// </DEMO-3>

// <DEMO>
export const mcpServer = new McpServer({
  name: 'batman-oracle',
  version: '0.0.0',
});

// <DEMO-3>
httpServer.get('/.well-known/oauth-protected-resource', async () => {
  return {
    resource: `${process.env.MCP_ORIGIN}/mcp`,
    authorization_servers: [process.env.AUTH_ORIGIN],
    scopes_supported: ['mcp:tools'],
  };
});
// </DEMO-3>

httpServer.post('/mcp', async (req, res) => {
  // <DEMO-3>
  if (!(await isAuthenticated(req, res))) {
    return res
      .status(401)
      .header('WWW-Authenticate', `Bearer realm="mcp", resource_metadata="${process.env.MCP_ORIGIN}/.well-known/oauth-protected-resource"`)
      .send();
  }
  // </DEMO-3>
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });

  await mcpServer.connect(transport);

  await transport.handleRequest(req.raw, res.raw, req.body);

  // Handle the request and close everything after
  res.raw.on('close', () => {
    transport.close();
    mcpServer.close();
  });
});

// </DEMO>
