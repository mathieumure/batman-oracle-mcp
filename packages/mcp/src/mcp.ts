import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import fs from 'node:fs/promises';
import path from 'node:path';

const toolsPath = path.join(import.meta.dirname, 'tools');
const toolModules = await Promise.all(
  (await fs.readdir(toolsPath)).map((tool) => import(path.join(toolsPath, tool))),
);

export const createServer = () => {
  const server = new McpServer({
    name: 'batman-oracle',
    version: '0.0.0',
  });

  for (const toolModule of toolModules) {
    toolModule.register(server);
  }

  return server;
};
