import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp';

const server = new McpServer({
  name: 'batman-oracle',
  version: '0.0.0',
});

const transport = new StreamableHTTPServerTransport();

await server.connect(transport);
