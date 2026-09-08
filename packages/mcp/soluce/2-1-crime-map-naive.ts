import { mcpServer } from './mcp-server.js';
import { GCPDClient } from './gcpd.api.js';
import { z } from 'zod';
import { resolveDistFiles } from './utils.js';

const csp = {
  resourceDomains: [
    process.env.MCP_ORIGIN,
    'https://static.wikia.nocookie.net',
    'https://i.ebayimg.com',
    'https://*.basemaps.cartocdn.com',
  ],
};

mcpServer.registerResource(
  'crime_map_ui',
  'ui://crime_map',
  {
    mimeType: 'text/html;profile=mcp-app',
    _meta: {
      ui: {
        csp,
      },
    },
  },
  async () => {
    const html = await resolveDistFiles('src/crime-map/index.html');
    return {
      contents: [
        {
          uri: 'ui://crime_map',
          mimeType: 'text/html;profile=mcp-app',
          text: html,
          _meta: {
            ui: {
              csp,
            },
          },
        },
      ],
    };
  },
);

mcpServer.registerTool(
  'Crime Map',
  {
    _meta: {
      ui: {
        resourceUri: 'ui://crime_map',
      },
    },
    description: 'Show the crimes on a map centered on a given city. Optional GCPD filters: suspect, molecule, fingerprint.',
    outputSchema: {
      center: z.object({ lat: z.number(), lng: z.number() }),
      crimes: z.array(
        z.object({
          id: z.string(),
          location: z.object({ lat: z.number(), lng: z.number() }),
          occurredAt: z.string(),
          suspect: z.string().nullable(),
          suspectPicture: z.string().nullable(),
          forensics: z.object({
            molecules: z.array(z.string()),
            fingerprints: z.array(z.string()),
          }),
        }),
      ),
    },
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
  },
  async ({ city, connectChronologically, fingerprint, molecule, suspect }) => {
    const result = await GCPDClient.getCrimes({ city, fingerprint, molecule, suspect });

    const payload = {
      center: result.center,
      crimes: result.crimes,
      connectChronologically: connectChronologically,
    };

    return {
      content: [{ type: 'text', text: JSON.stringify(payload) }],
      structuredContent: payload,
    };
  },
);
