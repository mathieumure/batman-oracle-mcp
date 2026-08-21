import { mcpServer } from '../mcp-server.js';
import { GCPDClient } from '../gcpd.api.js';
import { z } from 'zod';
import { resolveDistFiles } from '../utils.js';

// <DEMO>
const csp = {
  resourceDomains: [
    process.env.MCP_ORIGIN,
    'https://static.wikia.nocookie.net',
    'https://i.ebayimg.com',
    'https://*.basemaps.cartocdn.com',
  ],
};

mcpServer.registerTool(
  'crime_map',
  {
    _meta: {
      ui: {
        resourceUri: 'ui://crime_map',
      },
    },
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
// </DEMO>
