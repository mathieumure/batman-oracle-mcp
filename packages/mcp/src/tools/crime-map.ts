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
import { GCPDClient } from '../api/gcpd.api.js';

const resourceURI = 'ui://batman/crime-map';
const meta = {
  ui: {
    csp: {
      resourceDomains: [
        process.env.MCP_ORIGIN,
        'https://static.wikia.nocookie.net',
        'https://i.ebayimg.com',
        'https://*.basemaps.cartocdn.com',
      ],
    },
  },
} satisfies NonNullable<McpUiAppResourceConfig['_meta']>;

const crimeLocationSchema = z.object({ lat: z.number(), lng: z.number() });
const crimeForensicsSchema = z.object({
  molecules: z.array(z.string()),
  fingerprints: z.array(z.string()),
});
const crimeSchema = z.object({
  id: z.string(),
  location: crimeLocationSchema,
  occurredAt: z.string(),
  suspect: z.string().nullable(),
  suspectPicture: z.string().nullable(),
  forensics: crimeForensicsSchema,
});

export const register: Register = (server) => {
  registerAppResource(
    server,
    'batman_crime_map_ui',
    resourceURI,
    {
      mimeType: RESOURCE_MIME_TYPE,
      _meta: meta,
    },
    async () => {
      const html = await readFile(join(import.meta.dirname, '../../../mcp-ui/dist/src/crime-map/index.html'), 'utf-8');
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
    'get_crime_map',
    {
      description: 'Show the crimes on a map centered on a given city. Optional GCPD filters: suspect, molecule, fingerprint.',
      inputSchema: {
        city: z.string().describe('City name to center the map on, e.g. "Clermont-Ferrand"'),
        suspect: z.array(z.string()).optional().describe('Filter by suspect name(s)'),
        molecule: z.array(z.string()).optional().describe('Filter by forensic molecule(s)'),
        fingerprint: z.array(z.string()).optional().describe('Filter by fingerprint id(s)'),
        connectChronologically: z
          .boolean()
          .optional()
          .describe('Connect all crime chronologically, only pass the information if the user explicitly request it'),
      },
      outputSchema: {
        crimesInfo: z
          .object({
            total: z.number().describe('The total crimes that occures tonight'),
            molecules: z.array(z.string()).describe('Exhaustive list of the different molecules founded on all the crimes scenes.'),
            fingerprints: z.array(z.string()).describe('Exhaustive list of the different fingerprints founded on all the crimes scenes.'),
          })
          .describe('The information of all the crimes that occures on the city tonight.'),
      },
      _meta: {
        ui: {
          resourceUri: resourceURI,
        },
      },
    },
    async ({ city, suspect, molecule, fingerprint, connectChronologically }) => {
      const { crimes, center } = await GCPDClient.getCrimes({ suspect, molecule, fingerprint, city });
      const payload = {
        crimesInfo: {
          total: crimes.length,
          molecules: Array.from(new Set(crimes.flatMap((it) => it.forensics.molecules))),
          fingerprints: Array.from(new Set(crimes.flatMap((it) => it.forensics.fingerprints))),
        },
      };

      return {
        content: [{ type: 'text', text: JSON.stringify(payload) }],
        structuredContent: payload,
        _meta: {
          crimes,
          center,
          city,
          connectChronologically,
        },
      };
    },
  );
};
