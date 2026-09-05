import { httpServer } from './http-server.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

export const mcpServer = new McpServer({
  name: 'GCPD MCP',
  version: '1.0.0',
  description: 'GCPD Mcp Server listing criminals and crimes for any city'
});

httpServer.post('/mcp', async (req, res) => {

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });

  await mcpServer.connect(transport);
  await transport.handleRequest(req.raw, res.raw, req.body);

  res.raw.on('close', () => {
    mcpServer.close();
    transport.close();
  });
})
