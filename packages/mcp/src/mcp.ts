import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { registerAppTool } from '@modelcontextprotocol/ext-apps/server';

export const server = new McpServer({
  name: 'batman-oracle',
  version: '0.0.0',
});

const toolsPath = path.join(import.meta.dirname, 'tools');
const tools = await fs.readdir(toolsPath);
for (const tool of tools) {
  console.log('importing tool', tool);
  const toolImport = await import(path.join(toolsPath, tool));
  toolImport.register(server);
}
