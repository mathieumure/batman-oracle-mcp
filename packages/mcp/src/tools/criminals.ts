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
import { GCPD_API, PUBLIC_ORIGIN } from '../config.js';
import type { BatmanCriminal } from '@batman/data/criminals.js';

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
      inputSchema: {
        filter: z
          .object({
            affiliation: z.string().optional().describe('Filter the list of criminals based on the affiliation'),
          })
          .optional()
          .describe('Optional filtering the list of criminals'),
      },
      outputSchema: {
        criminals: z.array(
          z.object({
            name: z.string(),
            picture: z.url().nullable(),
            details: z
              .object({
                realName: z.string().nullable(),
                aliases: z.array(z.string()),
                relatives: z.array(z.string()),
                citizenship: z.string().nullable(),
                gender: z.string().nullable(),
                height: z.string().nullable(),
                weight: z.string().nullable(),
                eyes: z.string().nullable(),
                hair: z.string().nullable(),
                affiliation: z.array(z.string()),
              })
              .nullable(),
          }),
        ),
      },
      _meta: {
        ui: {
          resourceUri: resourceURI,
        },
      },
    },
    async ({ filter }) => {
      const url = new URL(GCPD_API + '/criminals');
      if (filter?.affiliation) {
        url.searchParams.append('affiliation', filter.affiliation);
      }
      const rawCriminals = (await fetch(url).then((it) => it.json())) as BatmanCriminal[];
      const criminals = rawCriminals.map((it) => ({ ...it, picture: it.picture ? rewriteAssetOrigin(it.picture) : it.picture }));
      return {
        content: [{ type: 'text', text: JSON.stringify(criminals) }],
        structuredContent: { criminals },
      };
    },
  );
};
