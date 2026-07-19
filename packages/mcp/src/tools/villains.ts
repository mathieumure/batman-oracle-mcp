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

const resourceURI = 'ui://batman/villains';
const meta = {
  ui: {
    csp: {
      resourceDomains: [],
    },
  },
} satisfies NonNullable<McpUiAppResourceConfig['_meta']>;

export const register: Register = (server) => {
  registerAppResource(
    server,
    'batman_villains_ui',
    resourceURI,
    {
      mimeType: RESOURCE_MIME_TYPE,
      _meta: meta,
    },
    async () => {
      const html = await readFile(join(import.meta.dirname, '../../../mcp-ui/dist/src/villains/index.html'), 'utf-8');
      return {
        contents: [
          {
            uri: resourceURI,
            mimeType: RESOURCE_MIME_TYPE,
            text: html,
            _meta: meta,
          },
        ],
      };
    },
  );
  registerAppTool(
    server,
    'get_villains',
    {
      description: 'Get the list of all villans already faced.',
      outputSchema: {
        villains: z.array(
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
      const villains = [
        {
          name: 'Joker',
          picture: 'https://static.wikia.nocookie.net/marvel_dc/images/4/41/Batman_Vol_2_23.1_The_Joker_Textless.jpg',
        },
        {
          name: 'Bane',
          picture: 'https://static.wikia.nocookie.net/marvel_dc/images/b/b0/Batman_Vol_3_18_Textless.jpg',
        },
      ];
      return {
        content: [{ type: 'text', text: JSON.stringify(villains) }],
        structuredContent: { villains },
      };
    },
  );
};
