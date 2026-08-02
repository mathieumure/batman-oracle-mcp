import type { Register } from '../types.js';
import {
  registerAppTool,
  registerAppResource,
  RESOURCE_MIME_TYPE,
  type McpUiAppResourceConfig,
} from '@modelcontextprotocol/ext-apps/server';
import { z } from 'zod';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { rewriteAssetOrigin } from '../public-origin.js';
import { PUBLIC_ORIGIN } from '../config.js';

const resourceURI = 'ui://batman/criminals';
const meta = {
  ui: {
    csp: {
      resourceDomains: [PUBLIC_ORIGIN, 'https://static.wikia.nocookie.net'],
    },
  },
} satisfies NonNullable<McpUiAppResourceConfig['_meta']>;

export const register: Register = (server) => {
  registerAppResource(
    server,
    'batman_criminals_ui',
    resourceURI,
    {
      mimeType: RESOURCE_MIME_TYPE,
      _meta: meta,
    },
    async () => {
      const html = await readFile(join(import.meta.dirname, '../../../mcp-ui/dist/src/criminals/index.html'), 'utf-8');
      return {
        contents: [
          {
            uri: resourceURI,
            mimeType: RESOURCE_MIME_TYPE,
            text: rewriteAssetOrigin(html),
            _meta: meta,
          },
        ],
      };
    },
  );
  registerAppTool(
    server,
    'get_criminals',
    {
      description: 'Get the list of all criminals from the GCPD database.',
      outputSchema: {
        criminals: z.array(
          z.object({
            name: z.string(),
            picture: z.url(),
          }),
        ),
      },
      _meta: {
        ui: {
          resourceUri: resourceURI,
        },
      },
    },
    async () => {
      const criminals = await fetch('http://localhost:8080/criminals')
        .then((it) => it.json())
        .then((all: Array<{ name: string; picture: string }>) => all.slice(0, 8).map((v) => ({ name: v.name, picture: v.picture })));
      return {
        content: [{ type: 'text', text: JSON.stringify(criminals) }],
        structuredContent: { criminals },
      };
    },
  );
};
